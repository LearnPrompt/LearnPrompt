#!/usr/bin/env node

import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createTempRepo } from "./create-temp-repo.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const contractsDir = path.join(showcaseRoot, "contracts");

const codexModel = process.env.CODEX_NESTED_MODEL || "gpt-5.5";
const rawDir = mkdtempSync(path.join(os.tmpdir(), "docs-migration-live-"));
const tempRepo = createTempRepo();
const prompt = readFileSync(path.join(contractsDir, "prompt.md"), "utf8");
const schemaPath = path.join(contractsDir, "final-report.schema.json");
const lastMessageRawPath = path.join(rawDir, "last-message.json");

function sanitize(text) {
  return text
    .replaceAll(tempRepo, "$TMPDIR/docs-migration-pipeline-<redacted>")
    .replaceAll(process.env.HOME || "", "$HOME")
    .replace(/\b[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\b/g, "<redacted-uuid>")
    .replace(
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi,
      "<redacted-runtime-id>"
    )
    .replace(
      /("(?:id|thread_id)"\s*:\s*")[^"]+(")/g,
      "$1<redacted-runtime-id>$2"
    )
    .replace(/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/g, "<redacted-shell>");
}

const codexVersionResult = spawnSync("codex", ["--version"], { encoding: "utf8" });
const codexVersion = sanitize(
  [codexVersionResult.stdout, codexVersionResult.stderr].filter(Boolean).join("").trim()
);

const execResult = spawnSync(
  "codex",
  [
    "exec",
    "-m",
    codexModel,
    "--json",
    "--sandbox",
    "workspace-write",
    "--cd",
    tempRepo,
    "--output-schema",
    schemaPath,
    "--output-last-message",
    lastMessageRawPath,
    prompt
  ],
  {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024
  }
);

const sanitizedStdout = sanitize(execResult.stdout || "").trim();
const sanitizedStderr = sanitize(execResult.stderr || "").trim();
const blockerReason =
  execResult.status === 0
    ? ""
    : sanitizedStderr
        .split("\n")
        .filter(Boolean)
        .slice(-3)
        .join(" | ");

const changedFilesResult = spawnSync("git", ["status", "--short"], {
  cwd: tempRepo,
  encoding: "utf8"
});
const legacyDiffResult = spawnSync("git", ["diff", "--name-only", "--", "legacy"], {
  cwd: tempRepo,
  encoding: "utf8"
});

const liveSummary = {
  status: execResult.status === 0 ? "completed" : "blocked",
  codex_cli_version: codexVersion,
  model: codexModel,
  prompt_file: "contracts/prompt.md",
  schema_file: "contracts/final-report.schema.json",
  exec_exit_code: execResult.status,
  blocker_reason: blockerReason || undefined,
  changed_files: sanitize(changedFilesResult.stdout || "")
    .trim()
    .split("\n")
    .filter(Boolean),
  source_unchanged: sanitize(legacyDiffResult.stdout || "").trim() === "",
  reports_written: {
    run_summary: existsSync(path.join(tempRepo, "reports/run-summary.json")),
    verify_summary: existsSync(path.join(tempRepo, "reports/receipt-verify.json")),
    manifest: existsSync(path.join(tempRepo, "migration-candidate/manifest.json"))
  },
  redaction_note:
    "Absolute temp paths, runtime identifiers, and raw shell traces were redacted before commit."
};

if (existsSync(path.join(tempRepo, "reports/run-summary.json"))) {
  const runSummary = JSON.parse(readFileSync(path.join(tempRepo, "reports/run-summary.json"), "utf8"));
  liveSummary.candidate_hash = runSummary.candidate_sha;
  writeFileSync(
    path.join(resultsDir, "live-run-report.json"),
    `${JSON.stringify(runSummary, null, 2)}\n`
  );
}

if (existsSync(path.join(tempRepo, "migration-candidate/manifest.json"))) {
  writeFileSync(
    path.join(resultsDir, "live-manifest.json"),
    readFileSync(path.join(tempRepo, "migration-candidate/manifest.json"), "utf8")
  );
}

writeFileSync(
  path.join(resultsDir, "live-run-summary.json"),
  `${JSON.stringify(liveSummary, null, 2)}\n`
);
writeFileSync(
  path.join(resultsDir, "codex-stdout-sanitized.jsonl"),
  `${sanitizedStdout}\n`
);
writeFileSync(
  path.join(resultsDir, "codex-stderr-summary.txt"),
  `${sanitizedStderr}\n`
);

if (existsSync(lastMessageRawPath)) {
  writeFileSync(
    path.join(resultsDir, "codex-last-message.json"),
    `${sanitize(readFileSync(lastMessageRawPath, "utf8")).trim()}\n`
  );
}

process.stdout.write(`${JSON.stringify(liveSummary, null, 2)}\n`);
