import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    values[argv[index]?.replace(/^--/, "")] = argv[index + 1];
  }
  return values;
}

function reject(message, resultFile) {
  const output = `REJECT ${message}\n`;
  if (resultFile) {
    mkdirSync(path.dirname(resultFile), { recursive: true });
    writeFileSync(resultFile, output);
  }
  console.error(output.trim());
  process.exit(2);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseDir = path.resolve(__dirname, "..");
const fixtureDir = path.join(showcaseDir, "fixture");
const args = parseArgs(process.argv.slice(2));
const handoffFile = args.handoff;
const resultFile = args.result;

if (!handoffFile) reject("missing --handoff", resultFile);

const handoff = JSON.parse(readFileSync(handoffFile, "utf8"));

if (!handoff.symptom) reject("missing symptom", resultFile);
if (!Array.isArray(handoff.evidence) || handoff.evidence.length === 0) {
  reject("missing evidence[]", resultFile);
}
if (!Array.isArray(handoff.allowed_files) || handoff.allowed_files.length === 0) {
  reject("missing allowed_files[]", resultFile);
}
if (
  !handoff.acceptance ||
  !Array.isArray(handoff.acceptance.commands) ||
  handoff.acceptance.commands.length === 0
) {
  reject("missing acceptance.commands[0]", resultFile);
}

const allowed = new Set(handoff.allowed_files);
if (!allowed.has("src/slugify.js")) {
  reject("allowed_files does not include src/slugify.js", resultFile);
}

const tempRoot = mkdtempSync(path.join(os.tmpdir(), "acp-showcase-"));
const workDir = path.join(tempRoot, "fixture");
cpSync(fixtureDir, workDir, { recursive: true });

const command = handoff.acceptance.commands[0];
const [runner, ...runnerArgs] = command.split(" ");

const baseline = spawnSync(runner, runnerArgs, {
  cwd: workDir,
  encoding: "utf8",
});

const targetFile = path.join(workDir, "src/slugify.js");
const original = readFileSync(targetFile, "utf8");
const buggySnippet = `.replace(/\\s+/g, "-")\n    .replace(/[^a-z0-9-]/g, "");`;

if (!original.includes(buggySnippet)) {
  rmSync(tempRoot, { recursive: true, force: true });
  reject("fixture signature mismatch", resultFile);
}

const patched = original.replace(
  buggySnippet,
  `.replace(/\\s+/g, "-")\n    .replace(/[^a-z0-9-]/g, "")\n    .replace(/-+/g, "-")\n    .replace(/^-|-$/g, "");`,
);

writeFileSync(targetFile, patched);

const verify = spawnSync(runner, runnerArgs, {
  cwd: workDir,
  encoding: "utf8",
});

const baselineKey = `${baseline.stdout}${baseline.stderr}`
  .trim()
  .split("\n")
  .find((line) => line.startsWith("FAIL "));
const verifySummary = `${verify.stdout}${verify.stderr}`
  .trim()
  .split("\n")
  .filter(Boolean);

const output = [
  "STAGE B fresh implementation",
  "isolation=fresh-process-and-temp-copy",
  `handoff=${path.basename(handoffFile)}`,
  `baseline_exit=${baseline.status ?? 1}`,
  baselineKey ?? "baseline_failure_line_missing",
  "edited=src/slugify.js",
  `verify_command=${command}`,
  `verify_exit=${verify.status ?? 1}`,
  ...verifySummary,
  `allowed_files_respected=${allowed.size === 1 ? "yes" : "no"}`,
  `result=${verify.status === 0 ? "PASS" : "FAIL"}`,
].join("\n");

if (resultFile) {
  mkdirSync(path.dirname(resultFile), { recursive: true });
  writeFileSync(resultFile, `${output}\n`);
}

rmSync(tempRoot, { recursive: true, force: true });
console.log(output);
process.exit(verify.status ?? 1);
