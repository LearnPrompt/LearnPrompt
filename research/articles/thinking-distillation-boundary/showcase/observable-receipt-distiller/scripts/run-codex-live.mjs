import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createTempRepo } from "./create-temp-repo.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const contractsDir = path.join(showcaseRoot, "contracts");

const rawDir = mkdtempSync(path.join(os.tmpdir(), "observable-receipt-live-"));
const tempRepo = createTempRepo();
const prompt = readFileSync(path.join(contractsDir, "prompt.md"), "utf8");
const schemaPath = path.join(contractsDir, "final-report.schema.json");
const lastMessageRawPath = path.join(rawDir, "last-message.json");

function sanitize(text) {
  return text
    .replaceAll(tempRepo, "$TMPDIR/observable-receipt-distiller-<redacted>")
    .replaceAll(process.env.HOME || "", "$HOME")
    .replace(/\b[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\b/g, "<redacted-uuid>")
    .replace(
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi,
      "<redacted-runtime-id>"
    )
    .replace(/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/g, "<redacted-shell>")
    .replace(/\/private\/tmp\/[^\s"'<>]+/g, "$TMPDIR/observable-receipt-distiller-<redacted>")
    .replace(/\/var\/folders\/[^\s"'<>]+/g, "$TMPDIR/observable-receipt-distiller-<redacted>");
}

function readJsonIfExists(file) {
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8"));
}

mkdirSync(path.join(tempRepo, "reports"), { recursive: true });

const versionResult = spawnSync("codex", ["--version"], {
  encoding: "utf8"
});
const codexVersion = sanitize([versionResult.stdout, versionResult.stderr].filter(Boolean).join("").trim());

const model = process.env.CODEX_NESTED_MODEL || "gpt-5.5";
const execResult = spawnSync(
  "codex",
  [
    "exec",
    "-m",
    model,
    "-s",
    "danger-full-access",
    "--skip-git-repo-check",
    "--ephemeral",
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
    maxBuffer: 8 * 1024 * 1024
  }
);

const testsResult = spawnSync("npm", ["test"], {
  cwd: tempRepo,
  encoding: "utf8"
});

const changedFilesResult = spawnSync("git", ["status", "--short"], {
  cwd: tempRepo,
  encoding: "utf8"
});

const receiptDiffResult = spawnSync("git", ["diff", "--name-only", "--", "receipts"], {
  cwd: tempRepo,
  encoding: "utf8"
});

const liveDistill = readJsonIfExists(path.join(tempRepo, "reports/distillation-summary.json"));
const liveEvaluation = readJsonIfExists(path.join(tempRepo, "reports/evaluation-summary.json"));
const candidateWritten = existsSync(path.join(tempRepo, ".agents/skills/frontmatter-repair/SKILL.md"));
const completed = Boolean(
  execResult.status === 0 &&
    liveDistill?.exit_code === 0 &&
    liveEvaluation?.exit_code === 0 &&
    liveEvaluation?.passed === 4 &&
    testsResult.status === 0 &&
    candidateWritten
);

const stderrSummary = sanitize((execResult.stderr || "").trim());
const stdoutSummary = sanitize((execResult.stdout || "").trim());
const blockerReason =
  execResult.status === 0
    ? undefined
    : stderrSummary.split("\n").filter(Boolean).slice(-2).join(" | ") || "no stderr captured";

const liveSummary = {
  status: completed ? "completed" : "blocked",
  codex_cli_version: codexVersion,
  model,
  prompt_file: "contracts/prompt.md",
  schema_file: "contracts/final-report.schema.json",
  exec_exit_code: execResult.status,
  blocker_reason: blockerReason,
  source_receipts_unchanged: receiptDiffResult.stdout.trim() === "",
  changed_files: sanitize(changedFilesResult.stdout || "")
    .trim()
    .split("\n")
    .filter(Boolean),
  distill_exit_code: liveDistill?.exit_code ?? null,
  evaluation_exit_code: liveEvaluation?.exit_code ?? null,
  holdout_result: liveEvaluation ? `${liveEvaluation.passed}/4` : null,
  tests_command: "npm test",
  tests_exit_code: testsResult.status,
  tests_status: testsResult.status === 0 ? "passed" : "failed",
  candidate_written: candidateWritten,
  redaction_note:
    "Absolute temp paths, runtime identifiers, raw shell traces, and writable CODEX_HOME paths were redacted before commit."
};

writeFileSync(path.join(resultsDir, "live-run-summary.json"), `${JSON.stringify(liveSummary, null, 2)}\n`);
writeFileSync(path.join(resultsDir, "codex-stdout-sanitized.jsonl"), `${stdoutSummary}\n`);
writeFileSync(path.join(resultsDir, "codex-stderr-summary.txt"), `${stderrSummary}\n`);
writeFileSync(
  path.join(resultsDir, "live-tests.txt"),
  `${sanitize([testsResult.stdout, testsResult.stderr].filter(Boolean).join("")).trim()}\n`
);

if (existsSync(lastMessageRawPath)) {
  writeFileSync(
    path.join(resultsDir, "codex-last-message.json"),
    `${sanitize(readFileSync(lastMessageRawPath, "utf8")).trim()}\n`
  );
}

if (existsSync(path.join(tempRepo, ".agents/skills/frontmatter-repair"))) {
  const destination = path.join(resultsDir, "live-candidate");
  cpSync(path.join(tempRepo, ".agents/skills/frontmatter-repair"), destination, {
    recursive: true
  });
}

if (liveDistill) {
  writeFileSync(
    path.join(resultsDir, "live-distillation-summary.json"),
    `${JSON.stringify(liveDistill, null, 2)}\n`
  );
}

if (liveEvaluation) {
  writeFileSync(
    path.join(resultsDir, "live-evaluation-summary.json"),
    `${JSON.stringify(liveEvaluation, null, 2)}\n`
  );
}

process.stdout.write(`${JSON.stringify(liveSummary, null, 2)}\n`);
process.exit(completed ? 0 : 90);
