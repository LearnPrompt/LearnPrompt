#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const fixtureRoot = path.join(showcaseRoot, "fixture");
const resultsDir = path.join(showcaseRoot, "results");
const repoRoot = path.resolve(showcaseRoot, "../../../../..");
const runnerPrefix =
  "research/articles/api-integration-skill-design/showcase/release-feed-api/scripts";

mkdirSync(resultsDir, { recursive: true });

function normalizeTestOutput(text) {
  return text
    .replace(/\b\d+(?:\.\d+)?ms\b/g, "<duration>ms")
    .replace(/duration_ms \d+(?:\.\d+)?/g, "duration_ms <duration>")
    .trim();
}

function writeNormalized(filePath, value) {
  writeFileSync(filePath, `${value.trimEnd()}\n`);
}

function runNode(args, cwd = repoRoot) {
  return spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8"
  });
}

const testsResult = spawnSync("npm", ["test"], {
  cwd: fixtureRoot,
  encoding: "utf8"
});
writeNormalized(
  path.join(resultsDir, "fixture-tests.txt"),
  normalizeTestOutput([testsResult.stdout, testsResult.stderr].filter(Boolean).join(""))
);

const scenarios = [
  "two-page-success",
  "rate-limit-once",
  "missing-credential",
  "schema-drift",
  "retry-exhausted",
  "mutating-method"
];

const scenarioResults = [];
for (const scenario of scenarios) {
  const result = runNode([path.join(scriptDir, "release-gate.mjs"), scenario]);
  scenarioResults.push({
    scenario,
    exit_code: result.status,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim()
  });
}

const privacyResult = runNode([path.join(scriptDir, "privacy-scan.mjs")]);
writeNormalized(
  path.join(resultsDir, "privacy-scan.txt"),
  [privacyResult.stdout, privacyResult.stderr].filter(Boolean).join("").trim()
);

const replayLines = [
  "release-feed-api showcase replay",
  "",
  "fixture_tests_command:",
  "  npm test",
  "fixture_tests_exit:",
  `  ${testsResult.status}`,
  "fixture_tests_key_output:",
  ...normalizeTestOutput([testsResult.stdout, testsResult.stderr].filter(Boolean).join(""))
    .split("\n")
    .map((line) => (line ? `  ${line}` : "")),
  ""
];

for (const scenarioResult of scenarioResults) {
  replayLines.push(`${scenarioResult.scenario}_command:`);
  replayLines.push(`  node ${runnerPrefix}/release-gate.mjs ${scenarioResult.scenario}`);
  replayLines.push(`${scenarioResult.scenario}_exit:`);
  replayLines.push(`  ${scenarioResult.exit_code}`);
  replayLines.push(`${scenarioResult.scenario}_output:`);
  const merged = [scenarioResult.stdout, scenarioResult.stderr].filter(Boolean).join("\n").trim();
  for (const line of (merged || "(no output)").split("\n")) {
    replayLines.push(`  ${line}`);
  }
  replayLines.push("");
}

replayLines.push("privacy_command:");
replayLines.push(`  node ${runnerPrefix}/privacy-scan.mjs`);
replayLines.push("privacy_exit:");
replayLines.push(`  ${privacyResult.status}`);
replayLines.push("privacy_output:");
for (const line of [privacyResult.stdout, privacyResult.stderr].filter(Boolean).join("").trim().split("\n")) {
  replayLines.push(`  ${line}`);
}

writeNormalized(path.join(resultsDir, "replay-result.txt"), replayLines.join("\n"));
process.stdout.write(`${replayLines.join("\n")}\n`);

const hasBlockedLoopback = scenarioResults.some((entry) => entry.exit_code === 90);
if (testsResult.status !== 0 || privacyResult.status !== 0 || hasBlockedLoopback) {
  process.exit(hasBlockedLoopback ? 90 : 1);
}
