#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const scriptPrefix =
  "research/articles/markdown-as-agent-memory/showcase/markdown-handoff-packet/scripts";

const scenarios = [
  {
    name: "normal",
    expectedExit: 0,
    resultFile: "release-gate-normal.txt",
  },
  {
    name: "missing-evidence",
    expectedExit: 41,
    resultFile: "release-gate-missing-evidence.txt",
  },
  {
    name: "contradictory",
    expectedExit: 42,
    resultFile: "release-gate-contradictory.txt",
  },
  {
    name: "sensitive",
    expectedExit: 43,
    resultFile: "release-gate-sensitive.txt",
  },
  {
    name: "binary-only",
    expectedExit: 44,
    resultFile: "release-gate-binary-only.txt",
  },
];

function runNode(scriptPath, args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: path.resolve(showcaseRoot, "../../../../.."),
    encoding: "utf8",
  });
}

function runScenario(scenario) {
  const result = runNode(path.join(scriptDir, "release-gate.mjs"), [scenario.name]);
  if (result.status !== 0) {
    throw new Error([result.stdout, result.stderr].filter(Boolean).join(""));
  }

  const summary = readFileSync(path.join(resultsDir, scenario.resultFile), "utf8").trim();
  const exitLine = `exit_code: ${scenario.expectedExit}`;
  if (!summary.includes(exitLine)) {
    throw new Error(`${scenario.name} expected ${exitLine}\n${summary}`);
  }
  if (!summary.includes("source_packet_unchanged: yes")) {
    throw new Error(`${scenario.name} did not preserve the packet\n${summary}`);
  }
  return summary;
}

const replaySections = [];
for (const scenario of scenarios) {
  replaySections.push(`scenario_command: node ${scriptPrefix}/release-gate.mjs ${scenario.name}`);
  replaySections.push(`scenario_name: ${scenario.name}`);
  replaySections.push(`expected_exit_code: ${scenario.expectedExit}`);
  replaySections.push(runScenario(scenario));
  replaySections.push("");
}

const privacyResult = runNode(path.join(scriptDir, "privacy-scan.mjs"), []);
const privacyOutput = [privacyResult.stdout, privacyResult.stderr].filter(Boolean).join("").trim();
if (privacyResult.status !== 0) {
  throw new Error(`privacy scan failed\n${privacyOutput}`);
}
writeFileSync(path.join(resultsDir, "privacy-scan.txt"), `${privacyOutput}\n`);

replaySections.push(`privacy_command: node ${scriptPrefix}/privacy-scan.mjs`);
replaySections.push(`privacy_exit_code: ${privacyResult.status}`);
replaySections.push(`privacy_output: ${privacyOutput}`);

const replayText = replaySections.join("\n");
writeFileSync(path.join(resultsDir, "replay-result.txt"), `${replayText}\n`);
process.stdout.write(`${replayText}\n`);
