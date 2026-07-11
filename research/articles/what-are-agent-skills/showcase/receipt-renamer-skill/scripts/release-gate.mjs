import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createTempRepo } from "./create-temp-repo.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");

const scenario = process.argv[2];

function normalizeTestOutput(output) {
  return output
    .replace(/\(\d+(?:\.\d+)?ms\)/g, "(<duration-ms>)")
    .replace(/duration_ms \d+(?:\.\d+)?/g, "duration_ms <duration-ms>")
    .trim()
    .concat("\n");
}

const scenarios = {
  normal: {
    batch: "incoming/normal-batch/receipts.json",
    report: "reports/normal-batch-plan.md",
    json: "reports/normal-batch-plan.json",
    expectedExit: 0,
    resultFile: "release-gate-normal.txt"
  },
  "missing-currency": {
    batch: "incoming/missing-currency-batch/receipts.json",
    report: "reports/missing-currency-plan.md",
    json: "reports/missing-currency-plan.json",
    expectedExit: 21,
    resultFile: "release-gate-missing-currency.txt"
  },
  conflict: {
    batch: "incoming/conflict-batch/receipts.json",
    report: "reports/conflict-plan.md",
    json: "reports/conflict-plan.json",
    expectedExit: 23,
    resultFile: "release-gate-conflict.txt"
  }
};

if (!scenario || !(scenario in scenarios)) {
  console.error("Usage: node release-gate.mjs <normal|missing-currency|conflict>");
  process.exit(2);
}

const config = scenarios[scenario];
const tempRepo = createTempRepo();
const plannerPath = path.join(
  tempRepo,
  ".agents/skills/receipt-renamer/scripts/plan-renames.mjs"
);
const policyPath = path.join(
  tempRepo,
  ".agents/skills/receipt-renamer/references/naming-policy.md"
);

const result = spawnSync(
  process.execPath,
  [
    plannerPath,
    "--batch",
    config.batch,
    "--policy",
    path.relative(tempRepo, policyPath),
    "--report",
    config.report,
    "--json",
    config.json
  ],
  {
    cwd: tempRepo,
    encoding: "utf8"
  }
);

const combined = [result.stdout, result.stderr].filter(Boolean).join("").trim();
if (result.status !== config.expectedExit) {
  console.error(combined);
  console.error(`FAIL ${scenario}: expected exit ${config.expectedExit}, received ${result.status}`);
  process.exit(1);
}

let testSummary = "";
if (scenario === "normal") {
  const testResult = spawnSync("npm", ["test"], {
    cwd: tempRepo,
    encoding: "utf8"
  });
  const testCombined = [testResult.stdout, testResult.stderr].filter(Boolean).join("").trim();
  writeFileSync(
    path.join(resultsDir, "gate-rerun-test-output.txt"),
    normalizeTestOutput(testCombined)
  );
  if (testResult.status !== 0) {
    console.error(testCombined);
    console.error("FAIL normal: npm test did not pass");
    process.exit(1);
  }

  const jsonOutput = path.join(tempRepo, config.json);
  const reportOutput = path.join(tempRepo, config.report);
  if (!existsSync(jsonOutput) || !existsSync(reportOutput)) {
    console.error("FAIL normal: planner did not write both output files");
    process.exit(1);
  }

  writeFileSync(
    path.join(resultsDir, "deterministic-normal-plan.json"),
    readFileSync(jsonOutput, "utf8")
  );
  writeFileSync(
    path.join(resultsDir, "deterministic-normal-report.md"),
    readFileSync(reportOutput, "utf8")
  );
  testSummary = "tests: npm test exit 0";
}

const summary = [
  `scenario: ${scenario}`,
  `command: node .agents/skills/receipt-renamer/scripts/plan-renames.mjs --batch ${config.batch} --policy .agents/skills/receipt-renamer/references/naming-policy.md --report ${config.report} --json ${config.json}`,
  `exit_code: ${result.status}`,
  combined || "<no output>",
  testSummary
]
  .filter(Boolean)
  .join("\n");

writeFileSync(path.join(resultsDir, config.resultFile), `${summary}\n`);
process.stdout.write(`${summary}\n`);
