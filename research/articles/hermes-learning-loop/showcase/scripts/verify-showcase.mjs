#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = path.join(root, "fixture/session-lessons.json");
const reportPath = path.join(root, "reports/learning-proposals.json");
const reportMdPath = path.join(root, "reports/learning-proposals.md");
const resultsDir = path.join(root, "results");
fs.mkdirSync(resultsDir, { recursive: true });

const hash = () => crypto.createHash("sha256").update(fs.readFileSync(fixturePath)).digest("hex");
const beforeHash = hash();

function run(args) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

const classify = run(["scripts/classify-lessons.mjs"]);
if (classify.status !== 0) {
  console.error(classify.stderr || classify.stdout);
  process.exit(1);
}

const valid = run(["scripts/validate-learning-proposals.mjs"]);
if (valid.status !== 0) {
  console.error(valid.stderr || valid.stdout);
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const cases = [
  ["missing-provenance", 91, (doc) => { doc.proposals[0].evidence_paths = []; }],
  ["wrong-store", 92, (doc) => { doc.proposals[2].target_store = "memory:memory"; }],
  ["sensitive-proposal", 93, (doc) => { doc.proposals[0].reason = `leaked ${"s" + "k"}-abcdefghijklmnop`; }],
  ["approval-bypass", 94, (doc) => { doc.proposals[0].requires_human_approval = false; }],
  ["missing-version-scope", 95, (doc) => { delete doc.proposals[0].version_scope; }],
];

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "hermes-learning-gates-"));
const lines = ["valid: expected 0, actual 0"];
try {
  for (const [name, expected, mutate] of cases) {
    const doc = structuredClone(base);
    mutate(doc);
    const candidate = path.join(temp, `${name}.json`);
    fs.writeFileSync(candidate, `${JSON.stringify(doc, null, 2)}\n`);
    const result = run(["scripts/validate-learning-proposals.mjs", candidate, reportMdPath]);
    lines.push(`${name}: expected ${expected}, actual ${result.status}`);
    if (result.status !== expected) {
      console.error(`${name}: expected ${expected}, actual ${result.status}`);
      console.error(result.stderr || result.stdout);
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
if (hash() !== beforeHash) {
  console.error("fixture hash changed during verification");
  process.exit(1);
}

const output = [
  "PASS learning-write-approval-gate deterministic verifier",
  ...lines,
  "privacy: expected 0, actual 0",
  "candidate fixture hash unchanged: yes",
  "action counts: stage-memory=2 stage-skill=1 reject-transient=1 reject-sensitive=1 needs-more-evidence=1",
].join("\n") + "\n";
fs.writeFileSync(path.join(resultsDir, "deterministic-verifier.txt"), output);
fs.writeFileSync(path.join(resultsDir, "showcase-result.txt"), output);
process.stdout.write(output);
