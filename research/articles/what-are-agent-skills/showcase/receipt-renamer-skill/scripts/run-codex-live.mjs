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

const codexModel = process.env.CODEX_NESTED_MODEL || "gpt-5";
const rawDir = mkdtempSync(path.join(os.tmpdir(), "receipt-renamer-live-"));
const tempRepo = createTempRepo();
const prompt = readFileSync(path.join(contractsDir, "prompt.md"), "utf8");
const schemaPath = path.join(contractsDir, "final-report.schema.json");
const stdoutRawPath = path.join(rawDir, "stdout.jsonl");
const stderrRawPath = path.join(rawDir, "stderr.txt");
const lastMessageRawPath = path.join(rawDir, "last-message.json");

function sanitize(text) {
  return text
    .replaceAll(tempRepo, "$TMPDIR/receipt-renamer-skill-<redacted>")
    .replaceAll(process.env.HOME || "", "$HOME")
    .replace(/\b[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\b/g, "<redacted-uuid>")
    .replace(
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi,
      "<redacted-runtime-id>"
    )
    .replace(/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/g, "<redacted-shell>");
}

const codexVersionResult = spawnSync("codex", ["--version"], {
  encoding: "utf8"
});
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
    "--cd",
    tempRepo,
    "--output-schema",
    schemaPath,
    "-o",
    lastMessageRawPath,
    prompt
  ],
  {
    encoding: "utf8",
    maxBuffer: 5 * 1024 * 1024
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
        .slice(-2)
        .join(" | ");

writeFileSync(stdoutRawPath, execResult.stdout || "");
writeFileSync(stderrRawPath, execResult.stderr || "");

const changedFilesResult = spawnSync("git", ["status", "--short"], {
  cwd: tempRepo,
  encoding: "utf8"
});

const testResult = spawnSync("npm", ["test"], {
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
  changed_files: sanitize(changedFilesResult.stdout || "").trim().split("\n").filter(Boolean),
  tests_command: "npm test",
  tests_exit_code: testResult.status,
  reports_written: {
    json: existsSync(path.join(tempRepo, "reports/normal-batch-plan.json")),
    markdown: existsSync(path.join(tempRepo, "reports/normal-batch-plan.md"))
  },
  redaction_note:
    "Absolute temp paths, runtime identifiers, and raw shell traces were redacted before commit."
};

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
writeFileSync(
  path.join(resultsDir, "live-tests.txt"),
  `${sanitize([testResult.stdout, testResult.stderr].filter(Boolean).join("")).trim()}\n`
);

if (existsSync(lastMessageRawPath)) {
  writeFileSync(
    path.join(resultsDir, "codex-last-message.json"),
    `${sanitize(readFileSync(lastMessageRawPath, "utf8")).trim()}\n`
  );
}

if (existsSync(path.join(tempRepo, "reports/normal-batch-plan.json"))) {
  writeFileSync(
    path.join(resultsDir, "live-normal-plan.json"),
    readFileSync(path.join(tempRepo, "reports/normal-batch-plan.json"), "utf8")
  );
}

if (existsSync(path.join(tempRepo, "reports/normal-batch-plan.md"))) {
  writeFileSync(
    path.join(resultsDir, "live-normal-plan.md"),
    readFileSync(path.join(tempRepo, "reports/normal-batch-plan.md"), "utf8")
  );
}

process.stdout.write(`${JSON.stringify(liveSummary, null, 2)}\n`);
