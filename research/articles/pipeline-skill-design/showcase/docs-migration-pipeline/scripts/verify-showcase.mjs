#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const repoRoot = path.resolve(showcaseRoot, "../../../../..");

const scriptPrefix =
  "research/articles/pipeline-skill-design/showcase/docs-migration-pipeline/scripts";

const commands = {
  fresh: `node ${scriptPrefix}/release-gate.mjs fresh-success`,
  crashResume: `node ${scriptPrefix}/release-gate.mjs crash-resume`,
  stale: `node ${scriptPrefix}/release-gate.mjs stale-resume`,
  receipt: `node ${scriptPrefix}/release-gate.mjs receipt-issue`,
  rerun: `node ${scriptPrefix}/release-gate.mjs rerun-stability`,
  privacy: `node ${scriptPrefix}/privacy-scan.mjs`
};

function runNode(scriptPath, args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8"
  });
}

function runGate(label, args, fileName) {
  const result = runNode(path.join(scriptDir, "release-gate.mjs"), args);
  const output = [result.stdout, result.stderr].filter(Boolean).join("").trim();
  if (result.status !== 0) {
    console.error(output);
    console.error(`FAIL ${label}: gate returned non-zero`);
    process.exit(1);
  }
  const summary = readFileSync(path.join(resultsDir, fileName), "utf8").trim();
  return { output, summary };
}

const fresh = runGate("fresh-success", ["fresh-success"], "fresh-success.txt");
const crashResume = runGate("crash-resume", ["crash-resume"], "resume.txt");
const stale = runGate("stale-resume", ["stale-resume"], "stale-resume.txt");
const receiptIssue = runGate("receipt-issue", ["receipt-issue"], "receipt-issue.txt");
const rerun = runGate("rerun-stability", ["rerun-stability"], "rerun-stability.txt");

const resumeSummary = JSON.parse(readFileSync(path.join(resultsDir, "resume-summary.json"), "utf8"));
const crashSummary = JSON.parse(readFileSync(path.join(resultsDir, "crash-summary.json"), "utf8"));
const rerunSummary = readFileSync(path.join(resultsDir, "rerun-stability.txt"), "utf8");

if (
  resumeSummary.reused_stages?.join(",") !== "inventory,normalize,transform"
) {
  console.error(JSON.stringify(resumeSummary, null, 2));
  console.error("FAIL resume: reused stages do not prove checkpoint reuse");
  process.exit(1);
}

if (crashSummary.checkpoint_stage !== "transform") {
  console.error(JSON.stringify(crashSummary, null, 2));
  console.error("FAIL crash: transform checkpoint not preserved");
  process.exit(1);
}

if (!/exit_code: 32/.test(stale.summary)) {
  console.error(stale.summary);
  console.error("FAIL stale-resume: expected exit_code 32");
  process.exit(1);
}

if (!/exit_code: 33/.test(receiptIssue.summary)) {
  console.error(receiptIssue.summary);
  console.error("FAIL receipt-issue: expected exit_code 33");
  process.exit(1);
}

if (!/stable: true/.test(rerunSummary)) {
  console.error(rerunSummary);
  console.error("FAIL rerun-stability: candidate hash drifted");
  process.exit(1);
}

const privacyResult = runNode(path.join(scriptDir, "privacy-scan.mjs"), []);
const privacyOutput = [privacyResult.stdout, privacyResult.stderr].filter(Boolean).join("").trim();
if (privacyResult.status !== 0) {
  console.error(privacyOutput);
  console.error("FAIL privacy: scanner returned non-zero");
  process.exit(1);
}
writeFileSync(path.join(resultsDir, "privacy-scan.txt"), `${privacyOutput}\n`);

const replay = [
  "docs-migration-pipeline offline replay",
  `fresh_success_command: ${commands.fresh}`,
  "fresh_success_exit_code: 0",
  fresh.summary,
  "",
  `crash_resume_command: ${commands.crashResume}`,
  "crash_after_transform_exit_code: 30",
  readFileSync(path.join(resultsDir, "crash-after-transform.txt"), "utf8").trim(),
  "resume_exit_code: 0",
  crashResume.summary,
  "",
  `stale_resume_command: ${commands.stale}`,
  "stale_resume_exit_code: 32",
  stale.summary,
  "",
  `receipt_issue_command: ${commands.receipt}`,
  "receipt_issue_exit_code: 33",
  receiptIssue.summary,
  "",
  `rerun_stability_command: ${commands.rerun}`,
  "rerun_stability_exit_code: 0",
  rerun.summary,
  "",
  `privacy_command: ${commands.privacy}`,
  `privacy_exit_code: ${privacyResult.status}`,
  `privacy_output: ${privacyOutput}`
].join("\n");

writeFileSync(path.join(resultsDir, "replay-result.txt"), `${replay}\n`);
process.stdout.write(`${replay}\n`);
