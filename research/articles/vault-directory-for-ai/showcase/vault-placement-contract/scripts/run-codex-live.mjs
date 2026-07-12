import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const reportsDir = join(root, "reports");
const resultsDir = join(root, "results");
const promptPath = join(root, "prompt.md");
const schemaPath = join(root, "response-schema.json");
const lastMessagePath = join(resultsDir, "codex-last-message-sanitized.json");
const summaryPath = join(resultsDir, "live-attempt-summary.json");
const excerptPath = join(resultsDir, "live-attempt-excerpt.md");
const outputArchivePath = join(resultsDir, "live-attempt-output.txt");
const manifestPath = join(root, "fixture", "inbox-manifest.json");
const planJsonPath = join(reportsDir, "placement-plan.json");
const planMdPath = join(reportsDir, "placement-plan.md");

function sanitize(text) {
  return text
    .replaceAll(root, "<workspace>")
    .replace(/\/private\/tmp\/[^\s"]+/g, "<tmpdir>")
    .replace(/\/private\/var\/folders\/[^\s"]+/g, "<tmpdir>")
    .replace(/\/Users\/[^/\s"]+/g, "<user-home>")
    .replace(/\b(session|thread|request|item)_[A-Za-z0-9-]+\b/g, "<runtime-id>")
    .replace(/\bsk-[A-Za-z0-9]+\b/g, "<api-key>")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer <redacted>");
}

function listFiles(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      listFiles(fullPath, base, acc);
    } else {
      acc.push(relative(base, fullPath));
    }
  }
  return acc.sort();
}

function sha256(path) {
  const hash = createHash("sha256");
  hash.update(readFileSync(path));
  return hash.digest("hex");
}

mkdirSync(reportsDir, { recursive: true });
mkdirSync(resultsDir, { recursive: true });

if (existsSync(planJsonPath)) {
  rmSync(planJsonPath);
}
if (existsSync(planMdPath)) {
  rmSync(planMdPath);
}

const beforeManifestHash = sha256(manifestPath);
const beforeInventory = listFiles(join(root, "fixture", "synthetic-vault"));
const rawDir = mkdtempSync(join(tmpdir(), "vault-placement-contract-"));
const rawStdoutPath = join(rawDir, "codex-live.jsonl");
const rawLastMessagePath = join(rawDir, "codex-last-message.json");
const prompt = readFileSync(promptPath, "utf8");
const nestedModel = process.env.CODEX_NESTED_MODEL || "gpt-5.5";

const args = [
  "exec",
  "-",
  "-C",
  root,
  "-m",
  nestedModel,
  "-s",
  "workspace-write",
  "--json",
  "--ephemeral",
  "--ignore-user-config",
  "--ignore-rules",
  "--output-schema",
  schemaPath,
  "-o",
  rawLastMessagePath,
];

const run = spawnSync("codex", args, {
  input: prompt,
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});

writeFileSync(rawStdoutPath, run.stdout || "", "utf8");

const afterManifestHash = sha256(manifestPath);
const afterInventory = listFiles(join(root, "fixture", "synthetic-vault"));
const reportsWritten = {
  json: existsSync(planJsonPath),
  markdown: existsSync(planMdPath),
};

let validationExitCode = null;
if (reportsWritten.json) {
  const validation = spawnSync(
    "node",
    [join(root, "scripts", "validate-placement-plan.mjs"), "--plan", planJsonPath],
    {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    },
  );
  validationExitCode = validation.status;
}

const changedPaths = [];
if (reportsWritten.json) {
  changedPaths.push("reports/placement-plan.json");
}
if (reportsWritten.markdown) {
  changedPaths.push("reports/placement-plan.md");
}

let status = "failed";
if (run.status === 0 && reportsWritten.json && reportsWritten.markdown && validationExitCode === 0) {
  status = "completed";
} else if (!reportsWritten.json && !reportsWritten.markdown) {
  status = "blocked";
}

let lastMessage = "";
if (existsSync(rawLastMessagePath)) {
  lastMessage = sanitize(readFileSync(rawLastMessagePath, "utf8"));
  writeFileSync(lastMessagePath, lastMessage, "utf8");
}

const summary = {
  attempted_at: "2026-07-12",
  command: [
    "codex exec -",
    `-C ${relative(root, root) || "."}`,
    `-m ${nestedModel}`,
    "-s workspace-write",
    "--json --ephemeral --ignore-user-config --ignore-rules",
    "--output-schema response-schema.json",
    "-o <outside-worktree-last-message>",
  ].join(" "),
  status,
  exec_exit_code: run.status,
  reports_written: reportsWritten,
  validation_exit_code: validationExitCode,
  fixture_manifest_changed: beforeManifestHash !== afterManifestHash,
  fixture_inventory_changed:
    JSON.stringify(beforeInventory) !== JSON.stringify(afterInventory),
  changed_paths: changedPaths,
  raw_capture: "stored outside the worktree in a tmpdir and redacted from committed artifacts",
  stderr_excerpt:
    status === "completed" ? "" : sanitize((run.stderr || "").slice(0, 800)),
};

writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

const excerptLines = [
  "# Live attempt excerpt",
  "",
  `- status: ${summary.status}`,
  `- exec exit code: ${summary.exec_exit_code}`,
  `- reports written: json=${reportsWritten.json} markdown=${reportsWritten.markdown}`,
  `- validation exit code: ${validationExitCode ?? "not-run"}`,
  `- manifest changed: ${summary.fixture_manifest_changed}`,
  `- synthetic vault inventory changed: ${summary.fixture_inventory_changed}`,
  `- changed paths: ${changedPaths.length > 0 ? changedPaths.join(", ") : "(none)"}`,
  "",
  "## Last message",
  "",
  "```json",
  lastMessage || "{}",
  "```",
];
if (summary.stderr_excerpt) {
  excerptLines.push("", "## STDERR excerpt", "", "```text", summary.stderr_excerpt, "```");
}
writeFileSync(excerptPath, `${excerptLines.join("\n")}\n`, "utf8");

const outputLines = [
  "vault placement contract live attempt",
  "===================================",
  `status: ${summary.status}`,
  `exec_exit_code: ${summary.exec_exit_code}`,
  `reports_written: json=${reportsWritten.json} markdown=${reportsWritten.markdown}`,
  `validation_exit_code: ${validationExitCode ?? "not-run"}`,
  `fixture_manifest_changed: ${summary.fixture_manifest_changed}`,
  `fixture_inventory_changed: ${summary.fixture_inventory_changed}`,
  `changed_paths: ${changedPaths.length > 0 ? changedPaths.join(", ") : "(none)"}`,
  "",
  "stderr_excerpt:",
  summary.stderr_excerpt || "(none)",
];
writeFileSync(outputArchivePath, `${outputLines.join("\n")}\n`, "utf8");

console.log(JSON.stringify(summary, null, 2));
