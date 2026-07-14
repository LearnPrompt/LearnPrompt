import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createTempRepo } from "./create-temp-repo.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");

const RECEIPT_SCRIPT = ".agents/skills/observable-receipt-distiller/scripts/distill-candidate.mjs";
const EVAL_SCRIPT = ".agents/skills/observable-receipt-distiller/scripts/evaluate-candidate.mjs";

const scenario = process.argv[2];
const expectedExitCode = {
  normal: 0,
  "evidence-poor": 51,
  "sensitive-marker": 52,
  "transcript-marker": 53,
  "holdout-fail": 54
}[scenario];

if (!scenario || expectedExitCode === undefined) {
  throw new Error(
    "Usage: node scripts/release-gate.mjs <normal|evidence-poor|sensitive-marker|transcript-marker|holdout-fail>"
  );
}

function runNode(args, cwd) {
  return spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8"
  });
}

function runGit(args, cwd) {
  return spawnSync("git", args, {
    cwd,
    encoding: "utf8"
  });
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function copyCandidate(repoPath) {
  const source = path.join(repoPath, ".agents/skills/frontmatter-repair");
  const destination = path.join(resultsDir, "frozen-candidate");
  rmSync(destination, { recursive: true, force: true });
  if (existsSync(source)) {
    cpSync(source, destination, { recursive: true });
  }
}

function summarize(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("").trim();
}

const tempRepo = createTempRepo();
mkdirSync(path.join(tempRepo, "reports"), { recursive: true });

const receiptPath = {
  normal: "receipts/training",
  "evidence-poor": "receipts/negative/evidence-poor.json",
  "sensitive-marker": "receipts/negative/sensitive-marker.json",
  "transcript-marker": "receipts/negative/private-transcript-marker.json",
  "holdout-fail": "receipts/training"
}[scenario];

const distillArgs = [
  RECEIPT_SCRIPT,
  "--receipts",
  receiptPath,
  "--candidate",
  ".agents/skills/frontmatter-repair",
  "--summary",
  "reports/distillation-summary.json"
];

const distillResult = runNode(distillArgs, tempRepo);
const distillSummaryPath = path.join(tempRepo, "reports/distillation-summary.json");
const distillSummary = existsSync(distillSummaryPath) ? readJson(distillSummaryPath) : null;

let evaluationExitCode = null;
let evaluationSummary = null;
let testsExitCode = null;

if (distillResult.status === 0 && (scenario === "normal" || scenario === "holdout-fail")) {
  if (scenario === "holdout-fail") {
    cpSync(
      path.join(
        tempRepo,
        ".agents/skills/observable-receipt-distiller/assets/broken-repair-frontmatter.mjs"
      ),
      path.join(tempRepo, ".agents/skills/frontmatter-repair/scripts/repair-frontmatter.mjs")
    );
  }

  const evalResult = runNode(
    [
      EVAL_SCRIPT,
      "--candidate",
      ".agents/skills/frontmatter-repair",
      "--holdout",
      "holdout",
      "--summary",
      "reports/evaluation-summary.json"
    ],
    tempRepo
  );
  evaluationExitCode = evalResult.status;
  const evaluationSummaryPath = path.join(tempRepo, "reports/evaluation-summary.json");
  evaluationSummary = existsSync(evaluationSummaryPath) ? readJson(evaluationSummaryPath) : null;

  if (scenario === "normal") {
    const testsResult = spawnSync("npm", ["test"], {
      cwd: tempRepo,
      encoding: "utf8"
    });
    testsExitCode = testsResult.status;
  }
}

const scenarioExitCode =
  scenario === "normal" || scenario === "holdout-fail"
    ? evaluationExitCode
    : distillResult.status;

if (scenarioExitCode !== expectedExitCode) {
  throw new Error(
    `Scenario ${scenario} produced ${scenarioExitCode}; expected ${expectedExitCode}\n${summarize(
      distillResult
    )}`
  );
}

if (scenario === "normal") {
  copyCandidate(tempRepo);
}

const receiptDiff = runGit(["diff", "--name-only", "--", "receipts"], tempRepo);
const changedFiles = runGit(["status", "--short"], tempRepo)
  .stdout.trim()
  .split("\n")
  .filter(Boolean);

const summary = {
  scenario,
  exit_code: scenarioExitCode,
  distill_exit_code: distillResult.status,
  evaluation_exit_code: evaluationExitCode,
  tests_exit_code: testsExitCode,
  source_receipts_unchanged: receiptDiff.stdout.trim() === "",
  holdout_result: evaluationSummary?.passed ? `${evaluationSummary.passed}/4` : null,
  candidate_written: existsSync(path.join(tempRepo, ".agents/skills/frontmatter-repair/SKILL.md")),
  changed_files: changedFiles,
  distill_summary_path: distillSummary ? "reports/distillation-summary.json" : null,
  evaluation_summary_path: evaluationSummary ? "reports/evaluation-summary.json" : null
};

writeFileSync(
  path.join(resultsDir, `${scenario}.json`),
  `${JSON.stringify(summary, null, 2)}\n`
);

const printable = [
  `scenario: ${scenario}`,
  `exit_code: ${scenarioExitCode}`,
  `distill_exit_code: ${distillResult.status}`,
  `evaluation_exit_code: ${evaluationExitCode ?? "not-run"}`,
  `tests_exit_code: ${testsExitCode ?? "not-run"}`,
  `source_receipts_unchanged: ${summary.source_receipts_unchanged}`,
  `holdout_result: ${summary.holdout_result ?? "not-run"}`,
  `candidate_written: ${summary.candidate_written}`,
  "changed_files:",
  ...changedFiles.map((entry) => `  ${entry}`),
  "",
  "distill_stdout:",
  summarize(distillResult) || "(none)"
];

if (evaluationSummary) {
  printable.push("", "evaluation_summary:", JSON.stringify(evaluationSummary));
}

writeFileSync(path.join(resultsDir, `${scenario}.txt`), `${printable.join("\n")}\n`);
process.stdout.write(`${printable.join("\n")}\n`);
