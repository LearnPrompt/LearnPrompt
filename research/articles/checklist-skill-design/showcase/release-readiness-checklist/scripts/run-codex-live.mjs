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

const rawDir = mkdtempSync(path.join(os.tmpdir(), "release-readiness-live-"));
const tempRepo = createTempRepo("ready");
const prompt = readFileSync(path.join(contractsDir, "prompt.md"), "utf8");
const schemaPath = path.join(contractsDir, "final-report.schema.json");
const lastMessageRawPath = path.join(rawDir, "last-message.json");

function sanitize(text) {
  return text
    .replaceAll(tempRepo, "$TMPDIR/release-readiness-<redacted>")
    .replaceAll(process.env.HOME || "", "$HOME")
    .replace(/\b[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\b/g, "<redacted-uuid>")
    .replace(
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi,
      "<redacted-runtime-id>"
    )
    .replace(/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/g, "<redacted-shell>")
    .replace(/\/private\/tmp\/[^\s"'<>]+/g, "$TMPDIR/release-readiness-<redacted>")
    .replace(/\/var\/folders\/[^\s"'<>]+/g, "$TMPDIR/release-readiness-<redacted>");
}

const versionResult = spawnSync("codex", ["--version"], {
  encoding: "utf8"
});
const codexVersion = sanitize([versionResult.stdout, versionResult.stderr].filter(Boolean).join("").trim());

const model = process.env.CODEX_NESTED_MODEL || "gpt-5";
const execResult = spawnSync(
  "codex",
  [
    "exec",
    "-m",
    model,
    "-s",
    "workspace-write",
    "--skip-git-repo-check",
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

const stderrSummary = sanitize((execResult.stderr || "").trim());
const stdoutSummary = sanitize((execResult.stdout || "").trim());
const liveSummary = {
  status: execResult.status === 0 ? "completed" : "blocked",
  codex_cli_version: codexVersion,
  model,
  prompt_file: "contracts/prompt.md",
  schema_file: "contracts/final-report.schema.json",
  exec_exit_code: execResult.status,
  blocker_reason:
    execResult.status === 0
      ? undefined
      : stderrSummary.split("\n").filter(Boolean).slice(-2).join(" | ") || "no stderr captured",
  changed_files: sanitize(changedFilesResult.stdout || "")
    .trim()
    .split("\n")
    .filter(Boolean),
  tests_command: "npm test",
  tests_exit_code: testsResult.status,
  reports_written: {
    json: existsSync(path.join(tempRepo, "reports", "release-readiness.json")),
    markdown: existsSync(path.join(tempRepo, "reports", "release-readiness.md"))
  },
  redaction_note:
    "Absolute temp paths, runtime identifiers, and raw shell traces were redacted before commit."
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

if (existsSync(path.join(tempRepo, "reports", "release-readiness.json"))) {
  writeFileSync(
    path.join(resultsDir, "live-release-readiness.json"),
    readFileSync(path.join(tempRepo, "reports", "release-readiness.json"), "utf8")
  );
}

if (existsSync(path.join(tempRepo, "reports", "release-readiness.md"))) {
  writeFileSync(
    path.join(resultsDir, "live-release-readiness.md"),
    readFileSync(path.join(tempRepo, "reports", "release-readiness.md"), "utf8")
  );
}

process.stdout.write(`${JSON.stringify(liveSummary, null, 2)}\n`);
