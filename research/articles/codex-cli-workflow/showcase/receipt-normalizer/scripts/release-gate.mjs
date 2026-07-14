import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const receiptRoot = path.resolve(scriptDir, "..");
const fixtureDir = path.join(receiptRoot, "fixture");
const resultsDir = path.join(receiptRoot, "results");

function fail(message, code = 1) {
  console.error(`FAIL ${message}`);
  process.exit(code);
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: "pipe",
    ...options
  });
}

function normalizeTestOutput(output) {
  return output
    .replace(/\(\d+(?:\.\d+)?ms\)/g, "(<duration-ms>)")
    .replace(/duration_ms \d+(?:\.\d+)?/g, "duration_ms <duration-ms>")
    .trim()
    .concat("\n");
}

function createFreshRepo() {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "receipt-normalizer-gate-"));
  const repoDir = path.join(tempRoot, "receipt-normalizer");
  cpSync(fixtureDir, repoDir, { recursive: true });
  execFileSync("git", ["init"], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["config", "user.name", "Gate Bot"], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["config", "user.email", "gate@example.invalid"], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["add", "."], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["commit", "-m", "baseline fixture"], { cwd: repoDir, stdio: "ignore" });
  return repoDir;
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

const mode = process.argv[2];
if (!mode || !["good", "bad"].includes(mode)) {
  fail("usage: node release-gate.mjs <good|bad>", 64);
}

const patchPath = path.join(resultsDir, mode === "good" ? "good.patch" : "bad.patch");
const reportPath = path.join(resultsDir, "final-report.json");
const contractPath = path.join(fixtureDir, "task-contract.json");

const patchText = readFileSync(patchPath, "utf8");
const changedFiles = changedFilesFromPatch(patchText);
const contract = JSON.parse(readFileSync(contractPath, "utf8"));
const allowedPaths = contract.allowed_paths;

for (const changedFile of changedFiles) {
  if (!allowedPaths.includes(changedFile)) {
    fail(`forbidden path in patch: ${changedFile}`, 3);
  }
}

if (mode === "bad") {
  fail("bad patch should not pass file-scope validation", 3);
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));

if (report.status !== "success") {
  fail(`unexpected report status: ${report.status}`);
}

if (!report.repo_checked) {
  fail("report did not confirm repo check");
}

if (report.task_contract.goal !== contract.goal) {
  fail("report goal does not match frozen contract");
}

if (JSON.stringify(report.task_contract.allowed_paths) !== JSON.stringify(contract.allowed_paths)) {
  fail("report allowed_paths does not match frozen contract");
}

if (
  JSON.stringify(report.task_contract.forbidden_paths) !== JSON.stringify(contract.forbidden_paths)
) {
  fail("report forbidden_paths does not match frozen contract");
}

if (report.task_contract.verify_command !== "npm test") {
  fail("report verify_command must be npm test");
}

if (JSON.stringify(report.files_changed) !== JSON.stringify(contract.allowed_paths)) {
  fail("report files_changed does not match allowed single-file scope");
}

const repoDir = createFreshRepo();
const applyResult = run("git", ["apply", "--unidiff-zero", patchPath], { cwd: repoDir });
if (applyResult.status !== 0) {
  fail(`git apply failed: ${applyResult.stderr.trim()}`);
}

const diffNameOnly = run("git", ["diff", "--name-only"], { cwd: repoDir });
const appliedFiles = diffNameOnly.stdout.trim().split("\n").filter(Boolean);
if (JSON.stringify(appliedFiles) !== JSON.stringify(contract.allowed_paths)) {
  fail(`applied file scope mismatch: ${appliedFiles.join(", ")}`);
}

const testResult = run("npm", ["test"], { cwd: repoDir });
writeFileSync(
  path.join(resultsDir, "gate-rerun-test-output.txt"),
  normalizeTestOutput(testResult.stdout + testResult.stderr)
);
if (testResult.status !== 0) {
  fail(`npm test failed after applying good patch (exit ${testResult.status})`);
}

const diffStat = run("git", ["diff", "--stat"], { cwd: repoDir });
if (!diffStat.stdout.includes("src/normalizeReceipt.js")) {
  fail("diff summary does not mention src/normalizeReceipt.js");
}

console.log("PASS good patch: file scope, frozen contract, report fields, and npm test all matched");
