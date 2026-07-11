#!/usr/bin/env node

import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, "..");

function runNode(script, args = []) {
  return spawnSync("node", [script, ...args], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 4,
  });
}

const createResult = runNode(path.join(scriptDir, "create-temp-repos.mjs"));
if (createResult.status !== 0) {
  process.stderr.write(createResult.stderr);
  process.exit(createResult.status ?? 1);
}

const malformedCheck = runNode(path.join(scriptDir, "evaluate-results.mjs"), [
  "--result-file",
  path.join(labRoot, "results", "malformed-result.json"),
]);
if (malformedCheck.status === 0) {
  console.error("Malformed result should have failed validation.");
  process.exit(1);
}

const privacyCheck = runNode(path.join(scriptDir, "privacy-scan.mjs"), [
  path.resolve(labRoot, "..", "..", ".."),
]);
if (privacyCheck.status !== 0) {
  process.stderr.write(privacyCheck.stderr);
  process.exit(privacyCheck.status ?? 1);
}

const matrixCheck = runNode(path.join(scriptDir, "evaluate-results.mjs"), [
  "--results-dir",
  path.join(labRoot, "results"),
]);
if (matrixCheck.status !== 0) {
  process.stderr.write(matrixCheck.stderr);
  process.exit(matrixCheck.status ?? 1);
}

console.log(
  JSON.stringify(
    {
      fixtures_created: createResult.status === 0,
      malformed_result_rejected: malformedCheck.status !== 0,
      privacy_scan: privacyCheck.stdout.trim(),
      matrix_status: matrixCheck.stdout.trim(),
      showcase_status: "verified",
    },
    null,
    2,
  ),
);
