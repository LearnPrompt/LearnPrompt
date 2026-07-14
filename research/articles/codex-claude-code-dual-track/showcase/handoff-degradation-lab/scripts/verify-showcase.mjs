import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(labRoot, "results");
const gateScript = path.join(scriptDir, "integrator-gate.mjs");
const privacyScanScript = path.join(scriptDir, "privacy-scan.mjs");

const scriptPrefix =
  "research/articles/codex-claude-code-dual-track/showcase/handoff-degradation-lab/scripts";

const commands = {
  replay: `node ${scriptPrefix}/verify-showcase.mjs`,
  degraded: `node ${scriptPrefix}/integrator-gate.mjs degraded_single_lane`,
  invalidDual: `node ${scriptPrefix}/integrator-gate.mjs invalid_dual_track`,
  badWriteSet: `node ${scriptPrefix}/integrator-gate.mjs bad_write_set`,
  contractDrift: `node ${scriptPrefix}/integrator-gate.mjs contract_drift`,
  privacy: `node ${scriptPrefix}/privacy-scan.mjs`
};

const trackedFiles = [
  "gate-rerun-test-output.txt",
  "gate-degraded.txt",
  "gate-invalid-dual-track.txt",
  "gate-bad-write-set.txt",
  "gate-contract-drift.txt",
  "privacy-scan.txt"
];

function normalizeOutput(output) {
  return `${output.trim()}\n`;
}

function readExisting(relativePath) {
  const fullPath = path.join(resultsDir, relativePath);
  if (!existsSync(fullPath)) {
    return null;
  }
  return readFileSync(fullPath, "utf8");
}

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

const previousContents = new Map(
  trackedFiles.map((relativePath) => [relativePath, readExisting(relativePath)])
);

const degradedResult = runNode(gateScript, ["degraded_single_lane"]);
const degradedOutput = combinedOutput(degradedResult);
if (degradedResult.status !== 0) {
  fail(`degraded gate exit mismatch: expected 0, received ${degradedResult.status}`);
}

const gateTestOutput = readFileSync(path.join(resultsDir, "gate-rerun-test-output.txt"), "utf8");
if (!gateTestOutput.includes("tests 2")) {
  fail("degraded gate did not rerun the fresh worktree tests");
}
if (!gateTestOutput.includes("pass 2")) {
  fail("degraded gate did not preserve two passing tests");
}

const invalidDualResult = runNode(gateScript, ["invalid_dual_track"]);
const invalidDualOutput = combinedOutput(invalidDualResult);
if (invalidDualResult.status !== 30) {
  fail(`invalid dual-track exit mismatch: expected 30, received ${invalidDualResult.status}`);
}

const badWriteSetResult = runNode(gateScript, ["bad_write_set"]);
const badWriteSetOutput = combinedOutput(badWriteSetResult);
if (badWriteSetResult.status !== 31) {
  fail(`bad write-set exit mismatch: expected 31, received ${badWriteSetResult.status}`);
}
if (!badWriteSetOutput.includes("README.md")) {
  fail("bad write-set case did not name README.md");
}

const contractDriftResult = runNode(gateScript, ["contract_drift"]);
const contractDriftOutput = combinedOutput(contractDriftResult);
if (contractDriftResult.status !== 32) {
  fail(`contract drift exit mismatch: expected 32, received ${contractDriftResult.status}`);
}

const privacyResult = runNode(privacyScanScript, []);
const privacyOutput = combinedOutput(privacyResult);
if (privacyResult.status !== 0) {
  fail(`privacy scan exit mismatch: expected 0, received ${privacyResult.status}`);
}

const nextContents = new Map([
  ["gate-rerun-test-output.txt", gateTestOutput],
  ["gate-degraded.txt", normalizeOutput(degradedOutput)],
  ["gate-invalid-dual-track.txt", normalizeOutput(invalidDualOutput)],
  ["gate-bad-write-set.txt", normalizeOutput(badWriteSetOutput)],
  ["gate-contract-drift.txt", normalizeOutput(contractDriftOutput)],
  ["privacy-scan.txt", normalizeOutput(privacyOutput)]
]);

let trackedResultsUnchanged = true;
for (const [relativePath, content] of nextContents) {
  if (previousContents.get(relativePath) !== content) {
    trackedResultsUnchanged = false;
  }
  writeFileSync(path.join(resultsDir, relativePath), content);
}

const replayResult = [
  "handoff-degradation-lab offline replay",
  `command: ${commands.replay}`,
  "mode: offline deterministic replay only; no model call",
  "",
  `degraded_command: ${commands.degraded}`,
  `degraded_exit_code: ${degradedResult.status}`,
  `degraded_output: ${degradedOutput}`,
  "degraded_fresh_worktree_tests: tests=2 pass=2 fail=0",
  "",
  `invalid_dual_track_command: ${commands.invalidDual}`,
  `invalid_dual_track_exit_code: ${invalidDualResult.status}`,
  `invalid_dual_track_output: ${invalidDualOutput}`,
  "",
  `bad_write_set_command: ${commands.badWriteSet}`,
  `bad_write_set_exit_code: ${badWriteSetResult.status}`,
  `bad_write_set_output: ${badWriteSetOutput}`,
  "",
  `contract_drift_command: ${commands.contractDrift}`,
  `contract_drift_exit_code: ${contractDriftResult.status}`,
  `contract_drift_output: ${contractDriftOutput}`,
  "",
  `privacy_command: ${commands.privacy}`,
  `privacy_exit_code: ${privacyResult.status}`,
  `privacy_output: ${privacyOutput}`,
  "",
  `tracked_results_unchanged_vs_previous_run: ${trackedResultsUnchanged ? "yes" : "no"}`
].join("\n");

writeFileSync(path.join(resultsDir, "replay-result.txt"), `${replayResult}\n`);
process.stdout.write(`${replayResult}\n`);
