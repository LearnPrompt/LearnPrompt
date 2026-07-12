#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const scripts = path.join(root, "scripts");
const contracts = path.join(root, "contracts");
const results = path.join(root, "results");
mkdirSync(results, { recursive: true });

function run(args) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

const cases = [
  ["valid plan", ["scripts/validate-plan.mjs", "contracts/valid-plan.json"], 0],
  ["missing provenance/evidence", ["scripts/validate-plan.mjs", "contracts/missing-evidence-plan.json"], 71],
  ["destructive mutation or auto-apply", ["scripts/validate-plan.mjs", "contracts/auto-apply-plan.json"], 72],
  ["unsupported merge", ["scripts/validate-plan.mjs", "contracts/unsupported-merge-plan.json"], 73],
  ["stale flag without contradiction", ["scripts/validate-plan.mjs", "contracts/stale-without-contradiction-plan.json"], 74],
  ["orphan without zero-degree graph", ["scripts/validate-plan.mjs", "contracts/orphan-without-zero-degree-plan.json"], 75],
  ["privacy scan", ["scripts/privacy-scan.mjs"], 0]
];

const lines = [];
let failed = false;
for (const [label, args, expected] of cases) {
  const result = run(args);
  const actual = result.status ?? 1;
  const output = `${result.stdout}${result.stderr}`.trim();
  lines.push(`${label}: expected ${expected}, actual ${actual}`);
  if (output) {
    for (const line of output.split("\n")) lines.push(`  ${line}`);
  }
  if (actual !== expected) failed = true;
}

writeFileSync(path.join(results, "deterministic-verifier.txt"), `${lines.join("\n")}\n`);
writeFileSync(path.join(results, "showcase-result.txt"), `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
if (failed) process.exit(1);
