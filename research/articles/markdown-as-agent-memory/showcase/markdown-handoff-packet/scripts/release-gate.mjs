#!/usr/bin/env node

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createTempRepo } from "./create-temp-repo.mjs";
import {
  assertNormalReports,
  evaluatePacket,
  packetUnchanged,
  snapshotPacket,
  writeReports,
} from "./packet-contract.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
mkdirSync(resultsDir, { recursive: true });

const scenario = process.argv[2];
const outputFiles = {
  normal: "release-gate-normal.txt",
  "missing-evidence": "release-gate-missing-evidence.txt",
  contradictory: "release-gate-contradictory.txt",
  sensitive: "release-gate-sensitive.txt",
  "binary-only": "release-gate-binary-only.txt",
};

if (!scenario || !outputFiles[scenario]) {
  console.error(
    "Usage: node research/articles/markdown-as-agent-memory/showcase/markdown-handoff-packet/scripts/release-gate.mjs <normal|missing-evidence|contradictory|sensitive|binary-only>",
  );
  process.exit(1);
}

const tempRepo = createTempRepo(scenario);
const beforeSnapshot = snapshotPacket(tempRepo);
const evaluation = evaluatePacket(tempRepo);

let sourcePacketUnchanged = true;
let reportsWritten = "none";
let assertionsSummary = "not-run";

if (evaluation.exitCode === 0) {
  writeReports(tempRepo, evaluation.report);
  const afterSnapshot = snapshotPacket(tempRepo);
  sourcePacketUnchanged = packetUnchanged(beforeSnapshot, afterSnapshot);
  if (!sourcePacketUnchanged) {
    throw new Error("source packet changed during report generation");
  }

  const assertions = assertNormalReports(tempRepo, evaluation.report);
  assertionsSummary = "pass";
  reportsWritten = assertions.reportFiles.join(", ");

  copyFileSync(
    path.join(tempRepo, "reports/handoff.json"),
    path.join(resultsDir, "deterministic-handoff.json"),
  );
  copyFileSync(
    path.join(tempRepo, "reports/handoff.md"),
    path.join(resultsDir, "deterministic-handoff.md"),
  );
} else {
  const afterSnapshot = snapshotPacket(tempRepo);
  sourcePacketUnchanged = packetUnchanged(beforeSnapshot, afterSnapshot);
}

const summary = [
  `scenario: ${scenario}`,
  `exit_code: ${evaluation.exitCode}`,
  `reason: ${evaluation.reason}`,
  `source_packet_unchanged: ${sourcePacketUnchanged ? "yes" : "no"}`,
  `reports_written: ${reportsWritten}`,
  `assertions: ${assertionsSummary}`,
];

if (evaluation.exitCode === 0) {
  const report = JSON.parse(readFileSync(path.join(tempRepo, "reports/handoff.json"), "utf8"));
  summary.push(`current_status: ${report.current_status.answer}`);
  summary.push(`accepted_decision: ${report.accepted_decision.answer}`);
  summary.push(`next_command: ${report.next_command.answer}`);
  summary.push(`known_limitation: ${report.known_limitation.answer}`);
  summary.push(`cited_paths: ${report.all_cited_paths.join(", ")}`);
}

writeFileSync(path.join(resultsDir, outputFiles[scenario]), `${summary.join("\n")}\n`);
process.stdout.write(`${summary.join("\n")}\n`);
