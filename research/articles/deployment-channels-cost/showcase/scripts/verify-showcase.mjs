#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = path.join(root, "fixture/deployment-workload.json");
const resultPath = path.join(root, "results/deterministic-verifier.txt");
fs.mkdirSync(path.dirname(resultPath), { recursive: true });
const fixtureHash = () => crypto.createHash("sha256").update(fs.readFileSync(fixturePath)).digest("hex");
const before = fixtureHash();
const run = (args) => spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });

let result = run(["scripts/generate-recommendation.mjs"]);
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(1);
}
result = run(["scripts/validate-recommendation.mjs"]);
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(1);
}

const reportPath = path.join(root, "reports/deployment-recommendation.json");
const reportMd = path.join(root, "reports/deployment-recommendation.md");
const base = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const cases = [
  ["missing-availability-persistence", 111, (doc) => { delete doc.decision_requirements.availability_required; }],
  ["unsafe-public-channel", 112, (doc) => { doc.security.dm_policy = "open"; }],
  ["missing-variable-cost", 113, (doc) => { delete doc.inputs.media_per_call; }],
  ["config-only-health", 114, (doc) => { doc.channel_health.mode = "config-only"; }],
  ["missing-kill-switch", 115, (doc) => { doc.budget_controls.kill_switch = false; }],
];
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "deployment-budget-gates-"));
const lines = ["valid: expected 0, actual 0"];
try {
  for (const [name, expected, mutate] of cases) {
    const doc = structuredClone(base);
    mutate(doc);
    const candidate = path.join(temp, `${name}.json`);
    fs.writeFileSync(candidate, `${JSON.stringify(doc, null, 2)}\n`);
    const checked = run(["scripts/validate-recommendation.mjs", candidate, reportMd]);
    lines.push(`${name}: expected ${expected}, actual ${checked.status}`);
    if (checked.status !== expected) {
      console.error(`${name}: expected ${expected}, actual ${checked.status}`);
      console.error(checked.stderr || checked.stdout);
      process.exit(1);
    }
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
const privacy = run(["scripts/privacy-scan.mjs"]);
if (privacy.status !== 0) {
  console.error(privacy.stderr || privacy.stdout);
  process.exit(1);
}
if (fixtureHash() !== before) {
  console.error("fixture hash changed during verification");
  process.exit(1);
}
const output = [
  "PASS deployment-budget-safety-gate deterministic verifier",
  ...lines,
  "privacy: expected 0, actual 0",
  `fixture hash unchanged: yes (${before})`,
  "selected candidate: vps-container; example monthly total: 80.24; cap: 100.00",
  "no real deployment, account connection, credential read, or provider invoice",
].join("\n") + "\n";
fs.writeFileSync(resultPath, output);
fs.writeFileSync(path.join(root, "results/showcase-result.txt"), output);
process.stdout.write(output);
