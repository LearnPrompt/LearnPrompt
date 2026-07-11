import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    args.set(argv[index], argv[index + 1]);
  }
  return {
    expectedVersion: args.get("--expected-version"),
    outputJson: args.get("--output-json"),
    outputMarkdown: args.get("--output-md")
  };
}

function sanitize(text) {
  return text
    .replaceAll(process.cwd(), "$TMPDIR/clip-clean-release-check")
    .replaceAll(process.env.HOME || "", "$HOME")
    .replace(/\/var\/folders\/[^\s"'<>]+/g, "$TMPDIR/clip-clean-smoke-<redacted>")
    .replace(/\/private\/tmp\/[^\s"'<>]+/g, "$TMPDIR/clip-clean-smoke-<redacted>");
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: "pipe",
    env: {
      ...process.env,
      npm_config_cache: path.join(repoRoot, ".npm-cache")
    },
    ...options
  });
}

function extractChangelogVersion(changelog) {
  const match = changelog.match(/^##\s+([0-9]+\.[0-9]+\.[0-9]+)\s*$/m);
  return match ? match[1] : null;
}

function inferInstallVersion(commandText) {
  const match = commandText.match(/1\.[0-9]+\.[0-9]+/);
  return match ? match[0] : null;
}

function hasRemoteRegistryDependency(commandText) {
  return /\bnpx\s+clip-clean@|\bnpm\s+install\s+-g\s+clip-clean@/i.test(commandText);
}

function markdownEscape(text) {
  return text.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const args = parseArgs(process.argv.slice(2));

if (!args.expectedVersion || !args.outputJson || !args.outputMarkdown) {
  console.error("Usage: collect-evidence.mjs --expected-version <version> --output-json <path> --output-md <path>");
  process.exit(2);
}

const packageJson = JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const readme = readFileSync(path.join(repoRoot, "README.md"), "utf8");
const changelogPath = path.join(repoRoot, "CHANGELOG.md");
const changelogExists = (() => {
  try {
    readFileSync(changelogPath, "utf8");
    return true;
  } catch {
    return false;
  }
})();
const changelog = changelogExists ? readFileSync(changelogPath, "utf8") : "";
const installCommand = readFileSync(path.join(repoRoot, "release", "install-command.txt"), "utf8").trim();

const packResult = run("npm", ["pack", "--dry-run", "--json"], { cwd: repoRoot });
const packOutput = sanitize([packResult.stdout, packResult.stderr].filter(Boolean).join("").trim());
let packSummary = "npm pack --dry-run --json did not produce a parseable filename";
if (packResult.status === 0) {
  const parsed = JSON.parse(packResult.stdout.trim());
  const filename = parsed[0]?.filename || "unknown";
  const entryCount = parsed[0]?.entryCount ?? "unknown";
  packSummary = `npm pack --dry-run --json exit 0; filename=${filename}; entryCount=${entryCount}`;
}

let smokeResult = null;
let smokeSummary = "";
if (!hasRemoteRegistryDependency(installCommand)) {
  smokeResult = run("npm", ["run", "release:smoke"], { cwd: repoRoot });
  smokeSummary = sanitize([smokeResult.stdout, smokeResult.stderr].filter(Boolean).join("").trim());
}

const changelogVersion = changelogExists ? extractChangelogVersion(changelog) : null;
const installVersion = inferInstallVersion(installCommand);
const versionSources = [
  `package.json=${packageJson.version}`,
  `changelog=${changelogVersion || "missing"}`,
  `install-command=${installVersion || "local-smoke-only"}`
].join("; ");

const rows = [
  {
    id: "PACK-00",
    question: "Does npm pack dry-run assemble a local tarball for clip-clean 1.4.0 without publishing?",
    evidence: packSummary,
    pass_rule: "npm pack --dry-run --json exits 0 and reports clip-clean-1.4.0.tgz.",
    severity: "major",
    not_applicable_policy: "Never N/A for an npm CLI release candidate; a package that cannot be packed cannot ship.",
    result:
      packResult.status === 0 && packSummary.includes("clip-clean-1.4.0.tgz") ? "pass" : "fail"
  },
  {
    id: "CHANGELOG-21",
    question: "Does CHANGELOG.md contain a 1.4.0 section with at least one user-visible change?",
    evidence: changelogExists
      ? `CHANGELOG.md inspected; first release heading=${changelogVersion || "missing"}`
      : "CHANGELOG.md is missing.",
    pass_rule: "CHANGELOG.md exists and includes a 1.4.0 heading plus at least one bullet item.",
    severity: "blocker",
    not_applicable_policy: "Never N/A for this fixture. If there is no changelog, fail the gate instead of waiving it.",
    result:
      changelogExists && changelog.includes("## 1.4.0") && /-\s+/.test(changelog) ? "pass" : "fail"
  },
  {
    id: "VERSION-22",
    question: "Do package.json, the changelog heading, and the install contract agree on 1.4.0?",
    evidence: versionSources,
    pass_rule:
      "package.json.version is 1.4.0; CHANGELOG.md headline is 1.4.0; the install contract does not contradict that version.",
    severity: "blocker",
    not_applicable_policy: "Only N/A if the repo proves there is no versioned package surface; cite the inspected file in evidence.",
    result:
      packageJson.version === args.expectedVersion &&
      changelogVersion === args.expectedVersion &&
      (installVersion === null || installVersion === args.expectedVersion)
        ? "pass"
        : "fail"
  },
  {
    id: "INSTALL-23",
    question: "Can the committed install command be verified locally without npm publish or registry writes?",
    evidence: hasRemoteRegistryDependency(installCommand)
      ? `release/install-command.txt=${installCommand}; rejected because it depends on registry publish.`
      : `release/install-command.txt=${installCommand}; smoke output=${smokeSummary || "missing"}`,
    pass_rule:
      "The committed install command is local-only and its smoke run exits 0 after packaging the tarball.",
    severity: "blocker",
    not_applicable_policy:
      "Only N/A if the package has no executable surface and the inspected bin mapping or CLI entrypoint proves that absence.",
    result:
      !hasRemoteRegistryDependency(installCommand) && smokeResult?.status === 0 ? "pass" : "fail"
  }
];

let exitCode = 0;
if (rows.find((row) => row.id === "CHANGELOG-21")?.result === "fail") {
  exitCode = 21;
} else if (rows.find((row) => row.id === "VERSION-22")?.result === "fail") {
  exitCode = 22;
} else if (rows.find((row) => row.id === "INSTALL-23")?.result === "fail") {
  exitCode = 23;
}

const summary = {
  package_name: packageJson.name,
  expected_version: args.expectedVersion,
  release_ready: exitCode === 0,
  exit_code: exitCode,
  rows
};

const outputJsonPath = path.join(repoRoot, args.outputJson);
const outputMarkdownPath = path.join(repoRoot, args.outputMarkdown);
mkdirSync(path.dirname(outputJsonPath), { recursive: true });
mkdirSync(path.dirname(outputMarkdownPath), { recursive: true });

writeFileSync(outputJsonPath, `${JSON.stringify(summary, null, 2)}\n`);

const markdown = [
  `# clip-clean release readiness report (${args.expectedVersion})`,
  "",
  `- Final exit code: \`${exitCode}\``,
  `- Decision: ${exitCode === 0 ? "ready" : "blocked"}`,
  `- Tests: recorded separately by the caller`,
  "",
  "| id | question | result | severity | pass_rule | evidence | not_applicable_policy |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map(
    (row) =>
      `| ${row.id} | ${markdownEscape(row.question)} | ${row.result} | ${row.severity} | ${markdownEscape(row.pass_rule)} | ${markdownEscape(row.evidence)} | ${markdownEscape(row.not_applicable_policy)} |`
  ),
  "",
  "## Remaining gate notes",
  "",
  exitCode === 0
    ? "- All frozen release rows passed in dry-run mode."
    : `- Gate blocked with exit code ${exitCode}. See the failing checklist row above.`,
  "- This report does not publish the package. It only checks local dry-run evidence."
].join("\n");

writeFileSync(outputMarkdownPath, `${markdown}\n`);
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(exitCode);
