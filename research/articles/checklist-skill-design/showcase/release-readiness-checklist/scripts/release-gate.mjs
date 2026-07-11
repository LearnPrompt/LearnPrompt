import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createTempRepo } from "./create-temp-repo.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const validatorScript = path.join(scriptDir, "validate-report.mjs");

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: "pipe",
    ...options
  });
}

function combinedOutput(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("").trim();
}

function sanitize(text) {
  return text
    .replaceAll(process.env.HOME || "", "$HOME")
    .replace(/\/private\/tmp\/[^\s"'<>]+/g, "$TMPDIR/release-readiness-<redacted>")
    .replace(/\/var\/folders\/[^\s"'<>]+/g, "$TMPDIR/release-readiness-<redacted>")
    .replace(/\(\d+(?:\.\d+)?ms\)/g, "(<duration>ms)")
    .replace(/duration_ms \d+(?:\.\d+)?/g, "duration_ms <duration>");
}

const scenario = process.argv[2];
if (!scenario) {
  console.error("Usage: release-gate.mjs <scenario>");
  process.exit(2);
}

const repoDir = createTempRepo(scenario);
const collectArgs = [
  ".agents/skills/release-readiness-checklist/scripts/collect-evidence.mjs",
  "--expected-version",
  "1.4.0",
  "--output-json",
  "reports/release-readiness.json",
  "--output-md",
  "reports/release-readiness.md"
];

const collectResult = run(process.execPath, collectArgs, { cwd: repoDir });
const testsResult = run("npm", ["test"], { cwd: repoDir });
const reportPath = path.join(repoDir, "reports", "release-readiness.json");

if (scenario === "na-without-evidence") {
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  report.rows[1].result = "not_applicable";
  report.rows[1].evidence = "N/A";
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

const validateResult = run(process.execPath, [validatorScript, reportPath], { cwd: repoDir });
const reportJson = readFileSync(reportPath, "utf8");
const reportMarkdown = readFileSync(path.join(repoDir, "reports", "release-readiness.md"), "utf8");
const targetExit = scenario === "na-without-evidence" ? validateResult.status : collectResult.status;

const summary = [
  `scenario=${scenario}`,
  `collect_exit=${collectResult.status}`,
  `validate_exit=${validateResult.status}`,
  `tests_exit=${testsResult.status}`,
  "",
  "[collect output]",
  sanitize(combinedOutput(collectResult)),
  "",
  "[validator output]",
  sanitize(combinedOutput(validateResult)),
  "",
  "[tests output]",
  sanitize(combinedOutput(testsResult)),
  "",
  "[report excerpt]",
  sanitize(reportJson),
  "",
  "[markdown excerpt]",
  sanitize(reportMarkdown)
]
  .join("\n")
  .trimEnd();

writeFileSync(path.join(resultsDir, `${scenario}.txt`), `${summary}\n`);
if (scenario === "ready") {
  writeFileSync(path.join(resultsDir, "ready-report.json"), `${reportJson.trimEnd()}\n`);
  writeFileSync(path.join(resultsDir, "ready-report.md"), `${reportMarkdown.trimEnd()}\n`);
  writeFileSync(path.join(resultsDir, "ready-tests.txt"), `${sanitize(combinedOutput(testsResult))}\n`);
}

process.stdout.write(`${summary}\n`);
process.exit(targetExit ?? 1);
