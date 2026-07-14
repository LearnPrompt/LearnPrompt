#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  buildValidRoutes,
  hashFiles,
  listTextFiles,
  renderRoutesMarkdown,
  sameJson
} from "./route-contract.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const vaultRoot = path.join(showcaseRoot, "fixture", "synthetic-vault");
const reportsDir = path.join(showcaseRoot, "reports");
const resultsDir = path.join(showcaseRoot, "results");
const casesDir = path.join(showcaseRoot, "cases");

fs.mkdirSync(reportsDir, { recursive: true });
fs.mkdirSync(resultsDir, { recursive: true });
fs.mkdirSync(casesDir, { recursive: true });

const files = listTextFiles(vaultRoot);
const before = hashFiles(vaultRoot, files);
if (files.length !== 26) {
  console.error(`FAIL inventory: expected 26 files, got ${files.length}`);
  process.exit(1);
}

const tracePath = path.join(reportsDir, "read-trace.log");
const valid = buildValidRoutes(showcaseRoot, tracePath);
fs.writeFileSync(path.join(reportsDir, "routes.json"), `${JSON.stringify(valid, null, 2)}\n`);
fs.writeFileSync(path.join(reportsDir, "routes.md"), renderRoutesMarkdown(valid));

const validRun = spawnSync(process.execPath, [
  path.join(__dirname, "validate-routes.mjs"),
  path.join(reportsDir, "routes.json"),
  tracePath
], { encoding: "utf8" });

const scenarios = [
  {
    name: "missing-route",
    expected: 61,
    mutate(report) {
      return { ...report, routes: report.routes.slice(0, 3) };
    },
    trace: "valid"
  },
  {
    name: "ambiguous-duplicate-route",
    expected: 62,
    mutate(report) {
      const copy = structuredClone(report);
      copy.routes[1].task_id = copy.routes[0].task_id;
      return copy;
    },
    trace: "valid"
  },
  {
    name: "read-budget-recursive-scan",
    expected: 63,
    mutate(report) {
      return report;
    },
    trace: "recursive"
  },
  {
    name: "stale-or-nonexistent-target",
    expected: 64,
    mutate(report) {
      const copy = structuredClone(report);
      copy.routes[2].target = "publishing/missing-runbook.md";
      copy.routes[2].citation = "publishing/missing-runbook.md";
      return copy;
    },
    trace: "valid"
  },
  {
    name: "private-sensitive-target",
    expected: 65,
    mutate(report) {
      const copy = structuredClone(report);
      copy.routes[3].target = "systems/private-credential.md";
      copy.routes[3].citation = "systems/private-credential.md";
      copy.routes[3].sensitive = true;
      return copy;
    },
    trace: "valid"
  }
];

const validTraceText = fs.readFileSync(tracePath, "utf8");
const allTraceText = files.join("\n") + "\n";
const summary = [];
summary.push(`valid route exit ${validRun.status}`);

for (const scenario of scenarios) {
  const routePath = path.join(casesDir, `${scenario.name}.json`);
  const scenarioTrace = path.join(casesDir, `${scenario.name}.trace.log`);
  fs.writeFileSync(routePath, `${JSON.stringify(scenario.mutate(valid), null, 2)}\n`);
  fs.writeFileSync(scenarioTrace, scenario.trace === "recursive" ? allTraceText : validTraceText);
  const run = spawnSync(process.execPath, [
    path.join(__dirname, "validate-routes.mjs"),
    routePath,
    scenarioTrace
  ], { encoding: "utf8" });
  summary.push(`${scenario.name} exit ${run.status}`);
  if (run.status !== scenario.expected) {
    console.error(`FAIL ${scenario.name}: expected ${scenario.expected}, got ${run.status}`);
    console.error(run.stdout);
    console.error(run.stderr);
    process.exit(1);
  }
}

const after = hashFiles(vaultRoot, files);
if (!sameJson(before, after)) {
  console.error("FAIL source fixture changed during verification");
  process.exit(1);
}
if (validRun.status !== 0) {
  console.error(`FAIL valid route expected 0, got ${validRun.status}`);
  console.error(validRun.stdout);
  console.error(validRun.stderr);
  process.exit(1);
}

const output = [
  "PASS index-routing-budget deterministic verifier",
  "inventory: 26 inspectable text files",
  "valid routed trace: 10 reads",
  "naive inventory: 26 files",
  ...summary,
  "source unchanged: yes"
].join("\n") + "\n";

fs.writeFileSync(path.join(resultsDir, "deterministic-verifier.txt"), output);
fs.writeFileSync(path.join(resultsDir, "showcase-result.txt"), output);
process.stdout.write(output);
