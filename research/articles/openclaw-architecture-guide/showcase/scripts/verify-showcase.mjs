#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { evaluateWriteBoundary, snapshotTree } from "./write-boundary-lib.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = path.join(root, "fixture/synthetic-topology.json");
const reportPath = path.join(root, "reports/route-audit.json");
const markdownPath = path.join(root, "reports/route-audit.md");
const resultsDir = path.join(root, "results");
fs.mkdirSync(resultsDir, { recursive: true });

const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const beforeFixtureHash = hash(fixturePath);

function run(args) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

const built = run(["scripts/build-route-audit.mjs"]);
if (built.status !== 0) {
  console.error(built.stderr || built.stdout);
  process.exit(1);
}
const valid = run(["scripts/validate-route-audit.mjs"]);
if (valid.status !== 0) {
  console.error(valid.stderr || valid.stdout);
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const cases = [
  ["channel-bypass", 101, (doc) => { doc.observed_trace[0] = "channel.inbound->node.camera.capture"; }],
  ["node-owns-state", 102, (doc) => { doc.node_owns = ["sessions"]; }],
  ["scope-escalation", 103, (doc) => { doc.operator_scopes = ["operator.read"]; }],
  ["unsafe-exposure", 104, (doc) => { doc.remote_exposure = { bind: "lan", auth_present: false, secure_transport: true }; }],
  ["legacy-bridge", 105, (doc) => { doc.transport = "legacy-tcp-bridge"; doc.legacy_bridge_current = true; }]
];

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-route-gates-"));
const lines = ["valid: expected 0, actual 0"];
try {
  for (const [name, expected, mutate] of cases) {
    const doc = structuredClone(base);
    mutate(doc);
    const candidate = path.join(temp, `${name}.json`);
    fs.writeFileSync(candidate, `${JSON.stringify(doc, null, 2)}\n`);
    const checked = run(["scripts/validate-route-audit.mjs", candidate, markdownPath]);
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

const boundaryTemp = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-route-boundary-"));
try {
  for (const directory of ["fixture", "contracts", "reports"]) {
    fs.mkdirSync(path.join(boundaryTemp, directory), { recursive: true });
  }
  fs.copyFileSync(fixturePath, path.join(boundaryTemp, "fixture/synthetic-topology.json"));
  fs.copyFileSync(path.join(root, "contracts/route-contract.json"), path.join(boundaryTemp, "contracts/route-contract.json"));
  const boundaryBefore = snapshotTree(boundaryTemp);
  fs.copyFileSync(reportPath, path.join(boundaryTemp, "reports/route-audit.json"));
  fs.copyFileSync(markdownPath, path.join(boundaryTemp, "reports/route-audit.md"));
  const allowedBoundary = evaluateWriteBoundary(
    boundaryBefore,
    snapshotTree(boundaryTemp),
    ["reports/route-audit.json", "reports/route-audit.md"]
  );
  if (allowedBoundary.code !== 0 || allowedBoundary.changed_paths.length !== 2) {
    console.error("allowed report boundary did not accept exactly two report paths");
    process.exit(1);
  }
  fs.writeFileSync(path.join(boundaryTemp, "reports/unexpected.txt"), "must be rejected\n");
  const rejectedBoundary = evaluateWriteBoundary(
    boundaryBefore,
    snapshotTree(boundaryTemp),
    ["reports/route-audit.json", "reports/route-audit.md"]
  );
  lines.push(`unexpected-report-path: expected 106, actual ${rejectedBoundary.code}`);
  if (rejectedBoundary.code !== 106 || !rejectedBoundary.unexpected_paths.includes("reports/unexpected.txt")) {
    console.error("unexpected report path was not rejected");
    process.exit(1);
  }
} finally {
  fs.rmSync(boundaryTemp, { recursive: true, force: true });
}

const privacy = run(["scripts/privacy-scan.mjs"]);
if (privacy.status !== 0) {
  console.error(privacy.stderr || privacy.stdout);
  process.exit(1);
}
if (hash(fixturePath) !== beforeFixtureHash) {
  console.error("fixture hash changed during verification");
  process.exit(1);
}

const output = [
  "PASS gateway-node-channel-route-gate deterministic verifier",
  ...lines,
  "privacy: expected 0, actual 0",
  "fixture hash unchanged: yes",
  "allowed report paths: reports/route-audit.json, reports/route-audit.md"
].join("\n") + "\n";
fs.writeFileSync(path.join(resultsDir, "deterministic-verifier.txt"), output);
fs.writeFileSync(path.join(resultsDir, "showcase-result.txt"), output);
process.stdout.write(output);
