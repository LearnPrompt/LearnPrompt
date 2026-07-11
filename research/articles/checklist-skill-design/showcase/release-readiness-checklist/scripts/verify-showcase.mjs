import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const releaseGateScript = path.join(scriptDir, "release-gate.mjs");
const privacyScanScript = path.join(scriptDir, "privacy-scan.mjs");

function runNode(scriptPath, args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    encoding: "utf8",
    stdio: "pipe"
  });
}

function combinedOutput(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("").trim();
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}

const expectations = [
  ["ready", 0],
  ["missing-changelog", 21],
  ["version-mismatch", 22],
  ["unverifiable-install", 23],
  ["na-without-evidence", 24]
];

const scenarioSummaries = [];
for (const [scenario, expectedExit] of expectations) {
  const result = runNode(releaseGateScript, [scenario]);
  if (result.status !== expectedExit) {
    fail(`${scenario} exit mismatch: expected ${expectedExit}, received ${result.status}`);
  }
  const output = combinedOutput(result);
  scenarioSummaries.push(`${scenario}: exit=${result.status}`);

  if (scenario === "ready" && !output.includes("\"release_ready\": true")) {
    fail("ready scenario did not produce release_ready=true");
  }
  if (scenario === "missing-changelog" && !output.includes("CHANGELOG.md is missing")) {
    fail("missing-changelog scenario did not preserve missing changelog evidence");
  }
  if (scenario === "version-mismatch" && !output.includes("package.json=1.4.1")) {
    fail("version-mismatch scenario did not preserve the version drift evidence");
  }
  if (scenario === "unverifiable-install" && !output.includes("depends on registry publish")) {
    fail("unverifiable-install scenario did not reject the registry-dependent smoke command");
  }
  if (scenario === "na-without-evidence" && !output.includes("not_applicable without inspected evidence")) {
    fail("na-without-evidence scenario did not reject a reason-free N/A row");
  }
}

const privacyResult = runNode(privacyScanScript, []);
if (privacyResult.status !== 0) {
  fail(`privacy scan exit mismatch: expected 0, received ${privacyResult.status}`);
}

const readyReport = JSON.parse(readFileSync(path.join(resultsDir, "ready-report.json"), "utf8"));
for (const row of readyReport.rows) {
  const keys = Object.keys(row).sort().join(",");
  if (
    keys !==
    ["evidence", "id", "not_applicable_policy", "pass_rule", "question", "result", "severity"]
      .sort()
      .join(",")
  ) {
    fail(`ready report row ${row.id} does not preserve the required field set`);
  }
}

const replaySummary = [
  "release-readiness-checklist offline replay",
  "command: node research/articles/checklist-skill-design/showcase/release-readiness-checklist/scripts/verify-showcase.mjs",
  "mode: offline deterministic replay only; no model call",
  "",
  ...scenarioSummaries,
  `privacy: exit=${privacyResult.status}`,
  `privacy_output: ${combinedOutput(privacyResult)}`,
  "row_contract: all ready rows preserve id/question/evidence/pass_rule/severity/not_applicable_policy/result"
].join("\n");

writeFileSync(path.join(resultsDir, "verify-showcase.txt"), `${replaySummary}\n`);
process.stdout.write(`${replaySummary}\n`);
