#!/usr/bin/env node

import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createTempRepo } from "./create-temp-repo.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");

const scriptPrefix =
  "research/articles/pipeline-skill-design/showcase/docs-migration-pipeline/scripts";

const scenario = process.argv[2];
const pipelineScript =
  ".agents/skills/docs-migration-pipeline/scripts/run-pipeline.mjs";
const verifyScript =
  ".agents/skills/docs-migration-pipeline/scripts/verify-receipts.mjs";

function runNode(args, cwd) {
  return spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8"
  });
}

function combinedOutput(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("").trim();
}

function ensureExit(result, expected, label) {
  if (result.status !== expected) {
    console.error(combinedOutput(result));
    throw new Error(`${label}: expected exit ${expected}, received ${result.status}`);
  }
}

function writeResult(file, lines) {
  writeFileSync(path.join(resultsDir, file), `${lines.join("\n").trimEnd()}\n`);
}

function copyIfExists(cwd, relativeFile, resultFile) {
  const fullPath = path.join(cwd, relativeFile);
  if (existsSync(fullPath)) {
    const content = readFileSync(fullPath, "utf8");
    writeFileSync(path.join(resultsDir, resultFile), `${content.trimEnd()}\n`);
  }
}

function runFreshSuccess() {
  const tempRepo = createTempRepo();
  const result = runNode([pipelineScript], tempRepo);
  ensureExit(result, 0, "fresh-success");
  const verify = runNode([verifyScript], tempRepo);
  ensureExit(verify, 0, "fresh-success verify");
  copyIfExists(tempRepo, "reports/run-summary.json", "fresh-summary.json");
  copyIfExists(tempRepo, "migration-candidate/manifest.json", "fresh-manifest.json");
  copyIfExists(tempRepo, "reports/receipt-summary.md", "fresh-receipt-summary.md");
  copyIfExists(tempRepo, "reports/run-summary.json", "fresh-summary.json");
  writeResult("fresh-success.txt", [
    "scenario: fresh-success",
    `command: node ${pipelineScript}`,
    `verify_command: node ${verifyScript}`,
    "exit_code: 0",
    combinedOutput(result),
    combinedOutput(verify)
  ]);
}

function runCrashAndResume() {
  const tempRepo = createTempRepo();
  const crash = runNode([pipelineScript, "--scenario", "crash-after-transform"], tempRepo);
  ensureExit(crash, 30, "crash-after-transform");
  copyIfExists(tempRepo, "reports/run-summary.json", "crash-summary.json");
  writeResult("crash-after-transform.txt", [
    "scenario: crash-after-transform",
    `command: node ${pipelineScript} --scenario crash-after-transform`,
    "exit_code: 30",
    combinedOutput(crash)
  ]);

  const resume = runNode([pipelineScript, "--resume"], tempRepo);
  ensureExit(resume, 0, "resume");
  const verify = runNode([verifyScript], tempRepo);
  ensureExit(verify, 0, "resume verify");
  copyIfExists(tempRepo, "reports/run-summary.json", "resume-summary.json");
  writeFileSync(path.join(resultsDir, "resume-verify.json"), `${combinedOutput(verify)}\n`);
  copyIfExists(tempRepo, "migration-candidate/manifest.json", "resume-manifest.json");
  writeResult("resume.txt", [
    "scenario: resume",
    `command: node ${pipelineScript} --resume`,
    `verify_command: node ${verifyScript}`,
    "exit_code: 0",
    combinedOutput(resume),
    combinedOutput(verify)
  ]);
}

function runStaleResume() {
  const tempRepo = createTempRepo();
  const crash = runNode([pipelineScript, "--scenario", "crash-after-transform"], tempRepo);
  ensureExit(crash, 30, "stale-resume setup crash");
  appendFileSync(
    path.join(tempRepo, "legacy/02-api-auth.md"),
    "\nTampered after checkpoint.\n"
  );
  const resume = runNode([pipelineScript, "--resume"], tempRepo);
  ensureExit(resume, 32, "stale-resume");
  writeResult("stale-resume.txt", [
    "scenario: stale-resume",
    `setup_command: node ${pipelineScript} --scenario crash-after-transform`,
    "tamper: appended one line to legacy/02-api-auth.md",
    `command: node ${pipelineScript} --resume`,
    "exit_code: 32",
    combinedOutput(resume)
  ]);
}

function runReceiptIssue() {
  const tempRepo = createTempRepo();
  const crash = runNode([pipelineScript, "--scenario", "crash-after-transform"], tempRepo);
  ensureExit(crash, 30, "receipt-issue setup crash");
  rmSync(path.join(tempRepo, "receipts/transform.json"), { force: true });
  const resume = runNode([pipelineScript, "--resume"], tempRepo);
  ensureExit(resume, 33, "receipt-issue");
  writeResult("receipt-issue.txt", [
    "scenario: receipt-issue",
    `setup_command: node ${pipelineScript} --scenario crash-after-transform`,
    "tamper: deleted receipts/transform.json while transform outputs remained",
    `command: node ${pipelineScript} --resume`,
    "exit_code: 33",
    combinedOutput(resume)
  ]);
}

function runRerunStability() {
  const repoA = createTempRepo();
  const repoB = createTempRepo();
  const runA = runNode([pipelineScript], repoA);
  const runB = runNode([pipelineScript], repoB);
  ensureExit(runA, 0, "rerun-stability A");
  ensureExit(runB, 0, "rerun-stability B");
  const summaryA = JSON.parse(readFileSync(path.join(repoA, "reports/run-summary.json"), "utf8"));
  const summaryB = JSON.parse(readFileSync(path.join(repoB, "reports/run-summary.json"), "utf8"));
  if (summaryA.candidate_sha !== summaryB.candidate_sha) {
    throw new Error("rerun-stability: candidate_sha mismatch");
  }
  writeResult("rerun-stability.txt", [
    "scenario: rerun-stability",
    `command_a: node ${pipelineScript}`,
    `command_b: node ${pipelineScript}`,
    "exit_code: 0",
    `candidate_sha_a: ${summaryA.candidate_sha}`,
    `candidate_sha_b: ${summaryB.candidate_sha}`,
    "stable: true"
  ]);
}

const handlers = {
  "fresh-success": runFreshSuccess,
  "crash-resume": runCrashAndResume,
  "stale-resume": runStaleResume,
  "receipt-issue": runReceiptIssue,
  "rerun-stability": runRerunStability
};

if (!(scenario in handlers)) {
  console.error(
    "Usage: node release-gate.mjs <fresh-success|crash-resume|stale-resume|receipt-issue|rerun-stability>"
  );
  process.exit(2);
}

handlers[scenario]();
process.stdout.write(
  JSON.stringify(
    {
      status: "ok",
      scenario,
      command: `node ${scriptPrefix}/release-gate.mjs ${scenario}`
    },
    null,
    2
  ) + "\n"
);
