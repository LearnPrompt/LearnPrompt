import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const scriptPrefix =
  "research/articles/thinking-distillation-boundary/showcase/observable-receipt-distiller/scripts";

const commands = {
  normal: `node ${scriptPrefix}/release-gate.mjs normal`,
  evidencePoor: `node ${scriptPrefix}/release-gate.mjs evidence-poor`,
  sensitiveMarker: `node ${scriptPrefix}/release-gate.mjs sensitive-marker`,
  transcriptMarker: `node ${scriptPrefix}/release-gate.mjs transcript-marker`,
  holdoutFail: `node ${scriptPrefix}/release-gate.mjs holdout-fail`,
  privacy: `node ${scriptPrefix}/privacy-scan.mjs`
};

function runNode(scriptPath, args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: path.resolve(showcaseRoot, "../../../../.."),
    encoding: "utf8"
  });
}

function runAndCheck(label, args, expectedExitCode) {
  const result = runNode(path.join(scriptDir, "release-gate.mjs"), args);
  const output = [result.stdout, result.stderr].filter(Boolean).join("").trim();
  if (result.status !== 0) {
    throw new Error(`${label} runner failed\n${output}`);
  }
  const summary = readFileSync(path.join(resultsDir, `${label}.txt`), "utf8").trim();
  if (!summary.includes(`exit_code: ${expectedExitCode}`)) {
    throw new Error(`${label} expected exit_code ${expectedExitCode}\n${summary}`);
  }
  return summary;
}

const normalSummary = runAndCheck("normal", ["normal"], 0);
const evidencePoorSummary = runAndCheck("evidence-poor", ["evidence-poor"], 51);
const sensitiveMarkerSummary = runAndCheck("sensitive-marker", ["sensitive-marker"], 52);
const transcriptMarkerSummary = runAndCheck("transcript-marker", ["transcript-marker"], 53);
const holdoutFailSummary = runAndCheck("holdout-fail", ["holdout-fail"], 54);

const privacyResult = runNode(path.join(scriptDir, "privacy-scan.mjs"), []);
const privacyOutput = [privacyResult.stdout, privacyResult.stderr].filter(Boolean).join("").trim();
if (privacyResult.status !== 0) {
  throw new Error(`privacy scan failed\n${privacyOutput}`);
}
writeFileSync(path.join(resultsDir, "privacy-scan.txt"), `${privacyOutput}\n`);

const replay = [
  "observable-receipt-distiller offline replay",
  `normal_command: ${commands.normal}`,
  "normal_exit_code: 0",
  normalSummary,
  "",
  `evidence_poor_command: ${commands.evidencePoor}`,
  "evidence_poor_exit_code: 51",
  evidencePoorSummary,
  "",
  `sensitive_marker_command: ${commands.sensitiveMarker}`,
  "sensitive_marker_exit_code: 52",
  sensitiveMarkerSummary,
  "",
  `transcript_marker_command: ${commands.transcriptMarker}`,
  "transcript_marker_exit_code: 53",
  transcriptMarkerSummary,
  "",
  `holdout_fail_command: ${commands.holdoutFail}`,
  "holdout_fail_exit_code: 54",
  holdoutFailSummary,
  "",
  `privacy_command: ${commands.privacy}`,
  `privacy_exit_code: ${privacyResult.status}`,
  `privacy_output: ${privacyOutput}`
].join("\n");

writeFileSync(path.join(resultsDir, "replay-result.txt"), `${replay}\n`);
process.stdout.write(`${replay}\n`);
