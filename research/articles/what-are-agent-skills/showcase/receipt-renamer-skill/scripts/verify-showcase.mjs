import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");

const scriptPrefix =
  "research/articles/what-are-agent-skills/showcase/receipt-renamer-skill/scripts";

const commands = {
  normal: `node ${scriptPrefix}/release-gate.mjs normal`,
  missing: `node ${scriptPrefix}/release-gate.mjs missing-currency`,
  conflict: `node ${scriptPrefix}/release-gate.mjs conflict`,
  privacy: `node ${scriptPrefix}/privacy-scan.mjs`
};

function runNode(scriptPath, args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: path.resolve(showcaseRoot, "../../../../.."),
    encoding: "utf8"
  });
}

function runAndCheck(label, args, expectedExit) {
  const result = runNode(path.join(scriptDir, "release-gate.mjs"), args);
  const output = [result.stdout, result.stderr].filter(Boolean).join("").trim();
  if (result.status !== 0) {
    console.error(output);
    console.error(`FAIL ${label}: release gate script failed`);
    process.exit(1);
  }
  const summary = readFileSync(path.join(resultsDir, expectedExit.resultFile), "utf8").trim();
  const exitLine = `exit_code: ${expectedExit.code}`;
  if (!summary.includes(exitLine)) {
    console.error(summary);
    console.error(`FAIL ${label}: expected ${exitLine}`);
    process.exit(1);
  }
  return summary;
}

const normalSummary = runAndCheck("normal", ["normal"], {
  code: 0,
  resultFile: "release-gate-normal.txt"
});
const missingSummary = runAndCheck("missing-currency", ["missing-currency"], {
  code: 21,
  resultFile: "release-gate-missing-currency.txt"
});
const conflictSummary = runAndCheck("conflict", ["conflict"], {
  code: 23,
  resultFile: "release-gate-conflict.txt"
});

const privacyResult = runNode(path.join(scriptDir, "privacy-scan.mjs"), []);
const privacyOutput = [privacyResult.stdout, privacyResult.stderr].filter(Boolean).join("").trim();
if (privacyResult.status !== 0) {
  console.error(privacyOutput);
  console.error("FAIL privacy: scanner returned non-zero");
  process.exit(1);
}
writeFileSync(path.join(resultsDir, "privacy-scan.txt"), `${privacyOutput}\n`);

const replay = [
  "receipt-renamer-skill offline replay",
  `normal_command: ${commands.normal}`,
  "normal_exit_code: 0",
  normalSummary,
  "",
  `missing_currency_command: ${commands.missing}`,
  "missing_currency_exit_code: 21",
  missingSummary,
  "",
  `conflict_command: ${commands.conflict}`,
  "conflict_exit_code: 23",
  conflictSummary,
  "",
  `privacy_command: ${commands.privacy}`,
  `privacy_exit_code: ${privacyResult.status}`,
  `privacy_output: ${privacyOutput}`
].join("\n");

writeFileSync(path.join(resultsDir, "replay-result.txt"), `${replay}\n`);
process.stdout.write(`${replay}\n`);
