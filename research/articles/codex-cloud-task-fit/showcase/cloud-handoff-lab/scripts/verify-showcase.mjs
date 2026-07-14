#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { evaluateCloudFit, readJson } from "./cloud-fit-gate.mjs";
import { scanDirectory } from "./privacy-scan.mjs";
import { runCleanRoomReplay } from "./replay-clean-room.mjs";

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label} mismatch\nexpected:\n${expected}\nactual:\n${actual}`);
  }
}

function assertPatchContains(expectedPatch, actualDiff) {
  const requiredLines = expectedPatch
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.startsWith("+") || line.startsWith("-"));

  for (const line of requiredLines) {
    if (!actualDiff.includes(line)) {
      throw new Error(`positive diff is missing required line: ${line}`);
    }
  }
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labDir = path.resolve(scriptDir, "..");
const contractsDir = path.join(labDir, "contracts");
const resultsDir = path.join(labDir, "results");
const fixtureDir = path.join(labDir, "fixture");
const patchFile = path.join(labDir, "patches", "good.patch");
const environmentFile = path.join(contractsDir, "environment-contract.json");

const environment = readJson(environmentFile);
const negativeCases = [
  ["negative-keychain-dependency.json", 21],
  ["negative-browser-login.json", 22],
  ["negative-missing-acceptance.json", 23],
  ["negative-unclear-direction.json", 24],
];

const negativeLines = [];
for (const [fileName, expectedExit] of negativeCases) {
  const task = readJson(path.join(contractsDir, fileName));
  const result = evaluateCloudFit(task, environment);
  if (result.exit_code !== expectedExit) {
    throw new Error(`${task.scenario_id} expected exit ${expectedExit} but got ${result.exit_code}`);
  }
  negativeLines.push(`${task.scenario_id}: gate=${result.exit_code}`);
}

const positiveTaskFile = path.join(contractsDir, "positive-timezone-rollup.json");
const positiveResult = runCleanRoomReplay({
  fixtureDir,
  taskFile: positiveTaskFile,
  environmentFile,
  patchFile,
});

if (positiveResult.gate.exit_code !== 0) {
  throw new Error(`positive scenario gate failed with ${positiveResult.gate.exit_code}`);
}
if (!positiveResult.clean_checkout_before_patch) {
  throw new Error("positive scenario did not start from a clean checkout");
}
if (positiveResult.apply_exit !== 0) {
  throw new Error(`patch apply failed with ${positiveResult.apply_exit}`);
}
if (positiveResult.test_exit !== 0) {
  throw new Error(`acceptance command failed with ${positiveResult.test_exit}`);
}

assertEqual(
  "changed files",
  positiveResult.changed_files.join(","),
  "src/rollupByReporterDay.js",
);

const expectedDiff = readFileSync(path.join(resultsDir, "positive-diff.txt"), "utf8").trim();
const expectedTestSummary = readFileSync(
  path.join(resultsDir, "positive-test-output.txt"),
  "utf8",
).trim();
assertPatchContains(expectedDiff, positiveResult.diff_text);
assertEqual("positive test summary", positiveResult.test_summary.text, expectedTestSummary);

const researchRoot = path.resolve(labDir, "..", "..");
const findings = scanDirectory(researchRoot);
if (findings.length > 0) {
  throw new Error(`privacy scan failed with ${findings.length} finding(s)`);
}

const runSummary = [
  `positive-clean-room: gate=${positiveResult.gate.exit_code} apply=${positiveResult.apply_exit} test=${positiveResult.test_exit} changed=${positiveResult.changed_files.join(",")}`,
  ...negativeLines,
  "privacy-scan: 0",
].join("\n");
const expectedRunSummary = readFileSync(path.join(resultsDir, "run-result.txt"), "utf8").trim();
assertEqual("run summary", runSummary, expectedRunSummary);

const expectedPrivacy = readFileSync(path.join(resultsDir, "privacy-scan.txt"), "utf8").trim();
assertEqual(
  "privacy scan output",
  "PASS privacy scan: no runtime IDs, absolute temp paths, user home paths, or credential-shaped values were committed.",
  expectedPrivacy,
);

console.log(runSummary);
console.log("showcase verification: PASS");
