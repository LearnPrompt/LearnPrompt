import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, "..");
const fixtureDir = path.join(labRoot, "fixture");
const contractsDir = path.join(labRoot, "contracts");
const resultsDir = path.join(labRoot, "results");

function fail(message, code) {
  console.error(`FAIL ${message}`);
  process.exit(code);
}

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function normalizeOutput(output) {
  return output
    .replace(/\(\d+(?:\.\d+)?ms\)/g, "(<duration-ms>)")
    .replace(/duration_ms \d+(?:\.\d+)?/g, "duration_ms <duration-ms>")
    .trim()
    .concat("\n");
}

function run(command, args, cwd) {
  return spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "pipe"
  });
}

function git(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "LearnPrompt Fixture",
      GIT_AUTHOR_EMAIL: "fixture@example.invalid",
      GIT_COMMITTER_NAME: "LearnPrompt Fixture",
      GIT_COMMITTER_EMAIL: "fixture@example.invalid",
      GIT_AUTHOR_DATE: "2026-07-12T08:00:00Z",
      GIT_COMMITTER_DATE: "2026-07-12T08:00:00Z"
    }
  }).trim();
}

function createFreshRepo() {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "handoff-degradation-gate-"));
  const repoDir = path.join(tempRoot, "incident-archive-lab");
  const worktreeDir = path.join(tempRoot, "incident-archive-lab-codex");

  cpSync(fixtureDir, repoDir, { recursive: true });
  git(["init", "-b", "main"], repoDir);
  git(["config", "user.name", "LearnPrompt Fixture"], repoDir);
  git(["config", "user.email", "fixture@example.invalid"], repoDir);
  git(["add", "."], repoDir);
  git(["commit", "-m", "baseline fixture"], repoDir);
  const baselineSha = git(["rev-parse", "HEAD"], repoDir);
  git(["worktree", "add", "-b", "codex-lane", worktreeDir, "HEAD"], repoDir);

  return { baselineSha, repoDir, worktreeDir };
}

function changedFilesFromPatch(patchText) {
  return Array.from(
    new Set(
      patchText
        .split("\n")
        .filter((line) => line.startsWith("+++ b/"))
        .map((line) => line.replace("+++ b/", "").trim())
    )
  );
}

const scenario = process.argv[2];
const validScenarios = [
  "degraded_single_lane",
  "invalid_dual_track",
  "bad_write_set",
  "contract_drift"
];

if (!scenario || !validScenarios.includes(scenario)) {
  fail(
    "usage: node integrator-gate.mjs <degraded_single_lane|invalid_dual_track|bad_write_set|contract_drift>",
    64
  );
}

const contractPath = path.join(contractsDir, "frozen-handoff-contract.json");
const contractText = readFileSync(contractPath, "utf8");
const contract = JSON.parse(contractText);
const currentContractSha = sha256(contractText);
const expectedContractSha = readFileSync(path.join(resultsDir, "contract-sha.txt"), "utf8").trim();
const healthSummaryPath = path.join(resultsDir, "claude-health-summary.json");
const diagnosisReceiptPath = path.join(resultsDir, "claude-diagnosis-receipt.json");
const codexReceiptPath =
  scenario === "contract_drift"
    ? path.join(resultsDir, "codex-completion-receipt-drift.json")
    : path.join(resultsDir, "codex-completion-receipt.json");
const patchPath =
  scenario === "bad_write_set"
    ? path.join(resultsDir, "bad-write-set.patch")
    : path.join(resultsDir, "codex-good.patch");

if (currentContractSha !== expectedContractSha) {
  fail("results contract-sha.txt does not match frozen contract on disk", 32);
}

if (!existsSync(healthSummaryPath)) {
  fail("missing claude health summary", 20);
}

if (!existsSync(codexReceiptPath)) {
  fail("missing codex completion receipt", 21);
}

const healthSummary = JSON.parse(readFileSync(healthSummaryPath, "utf8"));
if (!healthSummary.probes.every((probe) => probe.model_result === "absent")) {
  fail("health summary no longer represents a no-model-result degradation", 20);
}

if (scenario === "invalid_dual_track" && !existsSync(diagnosisReceiptPath)) {
  fail("claimed dual_track_complete without claude diagnosis receipt", 30);
}

const receipt = JSON.parse(readFileSync(codexReceiptPath, "utf8"));
const patchText = readFileSync(patchPath, "utf8");
const changedFiles = changedFilesFromPatch(patchText);

const { baselineSha, worktreeDir } = createFreshRepo();
if (baselineSha !== contract.baseline_sha) {
  fail(`baseline SHA mismatch: expected ${contract.baseline_sha}, got ${baselineSha}`, 22);
}

if (receipt.baseline_sha !== contract.baseline_sha) {
  fail("codex receipt baseline_sha does not match frozen contract", 22);
}

if (receipt.contract_sha !== expectedContractSha) {
  fail("codex receipt contract_sha does not match frozen contract", 32);
}

for (const changedFile of changedFiles) {
  if (!contract.allowed_paths.includes(changedFile)) {
    fail(`out-of-scope changed file: ${changedFile}`, 31);
  }
}

if (
  JSON.stringify(changedFiles) !== JSON.stringify(contract.expected_changed_files) ||
  JSON.stringify(receipt.changed_files) !== JSON.stringify(contract.expected_changed_files)
) {
  fail("changed files drifted from the frozen contract", 31);
}

const applyResult = run("git", ["apply", "--unidiff-zero", patchPath], worktreeDir);
if (applyResult.status !== 0) {
  fail(`git apply failed: ${applyResult.stderr.trim()}`, 23);
}

const diffResult = run("git", ["diff", "--name-only"], worktreeDir);
const diffFiles = diffResult.stdout.trim().split("\n").filter(Boolean);
if (JSON.stringify(diffFiles) !== JSON.stringify(contract.expected_changed_files)) {
  fail(`worktree changed files mismatch: ${diffFiles.join(", ")}`, 31);
}

const testResult = run("npm", ["test"], worktreeDir);
writeFileSync(path.join(resultsDir, "gate-rerun-test-output.txt"), normalizeOutput(testResult.stdout + testResult.stderr));
if (testResult.status !== 0) {
  fail(`npm test failed in worktree (exit ${testResult.status})`, 24);
}

console.log("PASS degraded_single_lane");
console.log(`claimed_state: ${scenario === "invalid_dual_track" ? "dual_track_complete" : "degraded_single_lane"}`);
console.log(`baseline_sha: ${baselineSha}`);
console.log(`contract_sha: ${expectedContractSha}`);
console.log(`changed_files: ${changedFiles.join(", ")}`);
console.log(`tests: ${contract.verify_command} exit=${testResult.status}`);
