import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function fail(code, message) {
  process.stderr.write(`FAIL ${message}\n`);
  process.exit(code);
}

function parseChangedLines(diffText) {
  const changedLines = new Map();
  let currentFile = null;
  let nextRightLine = null;

  for (const line of diffText.split("\n")) {
    if (line.startsWith("+++ b/")) {
      currentFile = line.slice("+++ b/".length);
      if (!changedLines.has(currentFile)) {
        changedLines.set(currentFile, new Set());
      }
      continue;
    }

    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+)(?:,(\d+))?/);
      if (!match) {
        fail(10, `unable to parse hunk header: ${line}`);
      }
      nextRightLine = Number(match[1]);
      continue;
    }

    if (!currentFile || nextRightLine === null) {
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      changedLines.get(currentFile).add(nextRightLine);
      nextRightLine += 1;
      continue;
    }

    if (line.startsWith("-") && !line.startsWith("---")) {
      continue;
    }

    if (!line.startsWith("\\")) {
      nextRightLine += 1;
    }
  }

  return changedLines;
}

function hasFutureTimestampLanguage(text) {
  return /(future|未来)/i.test(text);
}

function hasNegativeElapsedLanguage(text) {
  return /(negative|负).{0,10}(elapsed|时间差|间隔|时长|elapsedMs)/i.test(text);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const showcaseRoot = path.resolve(__dirname, "..");
const findingPath =
  process.argv[2] ??
  path.join(showcaseRoot, "results", "real-finding.json");
const diffPath = path.join(showcaseRoot, "fixture", "staged.diff");

const findingDoc = JSON.parse(readFileSync(findingPath, "utf8"));
const diffText = readFileSync(diffPath, "utf8");
const changedLines = parseChangedLines(diffText);

if (!Array.isArray(findingDoc.findings) || findingDoc.findings.length !== 1) {
  fail(2, "expected exactly one finding");
}

const [finding] = findingDoc.findings;

if (!["P0", "P1", "P2"].includes(finding.severity)) {
  fail(4, `invalid severity: ${finding.severity}`);
}

const fileLines = changedLines.get(finding.file);
if (!fileLines) {
  fail(3, `finding file is outside the changed diff: ${finding.file}`);
}

if (!fileLines.has(finding.line)) {
  fail(
    3,
    `finding is not anchored to a changed right-side line: ${finding.file}:${finding.line}`,
  );
}

const combined = `${finding.title}\n${finding.summary}\n${finding.reproduction}`;

if (!hasFutureTimestampLanguage(combined)) {
  fail(5, "finding does not mention the future-timestamp scenario");
}

if (!hasNegativeElapsedLanguage(combined)) {
  fail(6, "finding does not mention negative elapsed time");
}

if (!/refund|退款/i.test(combined)) {
  fail(7, "finding does not mention refund impact");
}

if (typeof finding.reproduction !== "string" || finding.reproduction.length < 30) {
  fail(8, "finding reproduction is too short");
}

process.stdout.write(`PASS anchored finding: ${finding.file}:${finding.line}\n`);
process.stdout.write(`PASS severity: ${finding.severity}\n`);
process.stdout.write("PASS future timestamp scenario named\n");
process.stdout.write("PASS negative elapsed behavior named\n");
process.stdout.write("PASS reproduction present\n");
