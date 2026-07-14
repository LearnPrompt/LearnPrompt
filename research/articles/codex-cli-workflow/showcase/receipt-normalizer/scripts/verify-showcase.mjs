import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const receiptRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(receiptRoot, "results");
const releaseGateScript = path.join(scriptDir, "release-gate.mjs");
const privacyScanScript = path.join(scriptDir, "privacy-scan.mjs");

const scriptPrefix =
  "research/articles/codex-cli-workflow/showcase/receipt-normalizer/scripts";

const commands = {
  replay: `node ${scriptPrefix}/verify-showcase.mjs`,
  good: `node ${scriptPrefix}/release-gate.mjs good`,
  bad: `node ${scriptPrefix}/release-gate.mjs bad`,
  privacy: `node ${scriptPrefix}/privacy-scan.mjs`
};

const trackedFiles = [
  "gate-rerun-test-output.txt",
  "release-gate-good.txt",
  "release-gate-bad.txt",
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

const goodResult = runNode(releaseGateScript, ["good"]);
const goodOutput = combinedOutput(goodResult);
if (goodResult.status !== 0) {
  fail(`good gate exit mismatch: expected 0, received ${goodResult.status}`);
}

const gateTestOutput = readFileSync(path.join(resultsDir, "gate-rerun-test-output.txt"), "utf8");
if (!gateTestOutput.includes("ℹ tests 4")) {
  fail("good gate did not rerun a fresh repo with 4 tests");
}
if (!gateTestOutput.includes("ℹ pass 4")) {
  fail("good gate did not preserve 4 passing tests");
}
if (!gateTestOutput.includes("ℹ fail 0")) {
  fail("good gate did not preserve zero failing tests");
}

const badResult = runNode(releaseGateScript, ["bad"]);
const badOutput = combinedOutput(badResult);
if (badResult.status !== 3) {
  fail(`bad gate exit mismatch: expected 3, received ${badResult.status}`);
}
if (!badOutput.includes("README.md")) {
  fail("bad gate did not reject README.md as an out-of-scope path");
}

const privacyResult = runNode(privacyScanScript, []);
const privacyOutput = combinedOutput(privacyResult);
if (privacyResult.status !== 0) {
  fail(`privacy scan exit mismatch: expected 0, received ${privacyResult.status}`);
}

const nextContents = new Map([
  ["gate-rerun-test-output.txt", gateTestOutput],
  ["release-gate-good.txt", normalizeOutput(goodOutput)],
  ["release-gate-bad.txt", normalizeOutput(badOutput)],
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
  "receipt-normalizer offline replay",
  `command: ${commands.replay}`,
  "mode: offline deterministic replay only; no model call",
  "",
  `good_command: ${commands.good}`,
  `good_exit_code: ${goodResult.status}`,
  `good_output: ${goodOutput}`,
  "good_fresh_repo_tests: tests=4 pass=4 fail=0",
  "",
  `bad_command: ${commands.bad}`,
  `bad_exit_code: ${badResult.status}`,
  `bad_output: ${badOutput}`,
  "bad_reason: README.md out of scope",
  "",
  `privacy_command: ${commands.privacy}`,
  `privacy_exit_code: ${privacyResult.status}`,
  `privacy_output: ${privacyOutput}`,
  "",
  `tracked_results_unchanged_vs_previous_run: ${trackedResultsUnchanged ? "yes" : "no"}`
].join("\n");

writeFileSync(path.join(resultsDir, "replay-result.txt"), `${replayResult}\n`);
process.stdout.write(`${replayResult}\n`);
