#!/usr/bin/env node

import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createTempRepo } from "./create-temp-repo.mjs";
import {
  assertNormalReports,
  evaluatePacket,
  packetUnchanged,
  snapshotPacket,
} from "./packet-contract.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const contractsDir = path.join(showcaseRoot, "contracts");

const rawDir = mkdtempSync(path.join(os.tmpdir(), "markdown-handoff-live-"));
const tempRepo = createTempRepo("normal");
const beforeSnapshot = snapshotPacket(tempRepo);
const expected = evaluatePacket(tempRepo);
const prompt = readFileSync(path.join(contractsDir, "prompt.md"), "utf8");
const schemaPath = path.join(contractsDir, "final-report.schema.json");
const lastMessageRawPath = path.join(rawDir, "last-message.json");
const model = "gpt-5.5";

function sanitize(text) {
  return text
    .replaceAll(tempRepo, "$TMPDIR/markdown-handoff-packet-<redacted>")
    .replaceAll(rawDir, "$TMPDIR/markdown-handoff-live-<redacted>")
    .replaceAll(process.env.HOME || "", "$HOME")
    .replace(/\b[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\b/g, "<redacted-uuid>")
    .replace(
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*:\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi,
      "<redacted-runtime-id>",
    )
    .replace(/\bBearer\s+(?!REDACTED\b|<)[A-Za-z0-9._~+/-]{16,}\b/g, "Bearer <redacted>")
    .replace(/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/g, "<redacted-shell>")
    .replace(/\/private\/tmp\/[^\s"'<>]+/g, "$TMPDIR/markdown-handoff-packet-<redacted>")
    .replace(/\/var\/folders\/[^\s"'<>]+/g, "$TMPDIR/markdown-handoff-packet-<redacted>");
}

const codexVersionResult = spawnSync("codex", ["--version"], {
  encoding: "utf8",
});
const codexVersion = sanitize(
  [codexVersionResult.stdout, codexVersionResult.stderr].filter(Boolean).join("").trim(),
);

const execResult = spawnSync(
  "codex",
  [
    "exec",
    "-m",
    model,
    "-s",
    "workspace-write",
    "--json",
    "-C",
    tempRepo,
    "--output-schema",
    schemaPath,
    "-o",
    lastMessageRawPath,
    prompt,
  ],
  {
    encoding: "utf8",
    maxBuffer: 5 * 1024 * 1024,
  },
);

const afterSnapshot = snapshotPacket(tempRepo);
const packetStillFrozen = packetUnchanged(beforeSnapshot, afterSnapshot);

let reportMatch = false;
let assertionSummary = "not-run";
if (execResult.status === 0 && expected.exitCode === 0) {
  try {
    assertNormalReports(tempRepo, expected.report);
    reportMatch = true;
    assertionSummary = "pass";
  } catch (error) {
    assertionSummary = error.message;
  }
}

const changedFilesResult = spawnSync("git", ["status", "--short"], {
  cwd: tempRepo,
  encoding: "utf8",
});
const changedFiles = sanitize(changedFilesResult.stdout || "")
  .trim()
  .split("\n")
  .filter(Boolean);

const reportsJsonPath = path.join(tempRepo, "reports/handoff.json");
const reportsMarkdownPath = path.join(tempRepo, "reports/handoff.md");
const completed =
  execResult.status === 0 &&
  packetStillFrozen &&
  reportMatch &&
  existsSync(reportsJsonPath) &&
  existsSync(reportsMarkdownPath);

const blockerReason =
  execResult.status === 0
    ? undefined
    : sanitize((execResult.stderr || "").trim())
        .split("\n")
        .filter(Boolean)
        .slice(-2)
        .join(" | ");

const summary = {
  status: completed ? "completed" : "blocked",
  codex_cli_version: codexVersion,
  model,
  prompt_file: "contracts/prompt.md",
  schema_file: "contracts/final-report.schema.json",
  exec_exit_code: execResult.status,
  blocker_reason: blockerReason,
  packet_unchanged: packetStillFrozen,
  reports_written: {
    json: existsSync(reportsJsonPath),
    markdown: existsSync(reportsMarkdownPath),
  },
  report_match: reportMatch,
  assertions: assertionSummary,
  changed_files: changedFiles,
  redaction_note:
    "Absolute temp paths, runtime identifiers, raw shell paths, and credential-shaped substrings were redacted before commit.",
};

writeFileSync(
  path.join(resultsDir, "live-run-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  path.join(resultsDir, "codex-stdout-sanitized.jsonl"),
  `${sanitize(execResult.stdout || "").trim()}\n`,
);
writeFileSync(
  path.join(resultsDir, "codex-stderr-summary.txt"),
  `${sanitize(execResult.stderr || "").trim()}\n`,
);
writeFileSync(
  path.join(resultsDir, "live-tests.txt"),
  `packet_unchanged: ${packetStillFrozen}\nreport_match: ${reportMatch}\nassertions: ${assertionSummary}\n`,
);

if (existsSync(lastMessageRawPath)) {
  writeFileSync(
    path.join(resultsDir, "codex-last-message.json"),
    `${sanitize(readFileSync(lastMessageRawPath, "utf8")).trim()}\n`,
  );
}

if (existsSync(reportsJsonPath)) {
  writeFileSync(
    path.join(resultsDir, "live-handoff.json"),
    `${readFileSync(reportsJsonPath, "utf8").trim()}\n`,
  );
}

if (existsSync(reportsMarkdownPath)) {
  writeFileSync(
    path.join(resultsDir, "live-handoff.md"),
    `${readFileSync(reportsMarkdownPath, "utf8").trim()}\n`,
  );
}

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(completed ? 0 : 90);
