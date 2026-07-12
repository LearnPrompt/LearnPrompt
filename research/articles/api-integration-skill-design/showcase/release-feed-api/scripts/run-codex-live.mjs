#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createTempRepo } from "./create-temp-repo.mjs";
import { startMockReleaseApi } from "../fixture/.agents/skills/release-feed-api/scripts/mock-release-api.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const contractsDir = path.join(showcaseRoot, "contracts");
mkdirSync(resultsDir, { recursive: true });

const rawDir = path.join(os.tmpdir(), `release-feed-live-${randomUUID()}`);
const tempRepo = createTempRepo();
const prompt = readFileSync(path.join(contractsDir, "prompt.md"), "utf8");
const schemaPath = path.join(contractsDir, "final-report.schema.json");
const lastMessageRawPath = path.join(rawDir, "last-message.json");
const model = "gpt-5.5";

mkdirSync(rawDir, { recursive: true });

function sanitize(text) {
  return text
    .replaceAll(tempRepo, "$TMPDIR/release-feed-api-<redacted>")
    .replaceAll(process.env.HOME || "", "$HOME")
    .replace(/\b[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\b/g, "<redacted-uuid>")
    .replace(/\bBearer\s+[A-Za-z0-9._~-]{8,}\b/g, "Bearer <redacted>")
    .replace(/RELEASE_FEED_TOKEN=[^\s"'<>]+/g, "RELEASE_FEED_TOKEN=<redacted>")
    .replace(/http:\/\/127\.0\.0\.1:\d+/g, "http://127.0.0.1:<loopback-port>")
    .replace(
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi,
      "<redacted-runtime-id>"
    )
    .replace(/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/g, "<redacted-shell>")
    .replace(/\/private\/tmp\/[^\s"'<>]+/g, "$TMPDIR/release-feed-api-<redacted>")
    .replace(/\/var\/folders\/[^\s"'<>]+/g, "$TMPDIR/release-feed-api-<redacted>");
}

function normalizeTestOutput(text) {
  return sanitize(text)
    .replace(/\b\d+(?:\.\d+)?ms\b/g, "<duration>ms")
    .replace(/duration_ms \d+(?:\.\d+)?/g, "duration_ms <duration>")
    .trim();
}

function writeNormalized(filePath, content) {
  writeFileSync(filePath, `${content.trimEnd()}\n`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, options);
    let stdout = "";
    let stderr = "";

    child.stdout?.setEncoding("utf8");
    child.stderr?.setEncoding("utf8");
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

const versionResult = spawnSync("codex", ["--version"], {
  encoding: "utf8"
});
const codexVersion = sanitize([versionResult.stdout, versionResult.stderr].filter(Boolean).join("").trim());

let server;
let blockerReason = "";
try {
  server = await startMockReleaseApi({
    scenario: "two-page-success",
    credential: randomUUID()
  });
} catch (error) {
  blockerReason = `${error.code || "ERROR"} ${error.syscall || "listen"} ${error.address || ""}`.trim();
}

let execResult = null;
let testsResult = null;

if (server) {
  execResult = await runCommand(
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
      "-C",
      tempRepo,
      "--output-schema",
      schemaPath,
      "-o",
      lastMessageRawPath,
      prompt
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        RELEASE_FEED_BASE_URL: server.baseUrl,
        RELEASE_FEED_TOKEN: server.credential
      },
      stdio: ["ignore", "pipe", "pipe"]
    }
  );

  if (execResult.status === 0) {
    testsResult = spawnSync("npm", ["test"], {
      cwd: tempRepo,
      encoding: "utf8"
    });
  }

  await server.close();
}

const changedFilesResult = spawnSync("git", ["status", "--short"], {
  cwd: tempRepo,
  encoding: "utf8"
});

const reportJsonWritten = existsSync(path.join(tempRepo, "reports/releases.json"));
const reportMarkdownWritten = existsSync(path.join(tempRepo, "reports/releases.md"));
const completed = Boolean(
  server &&
    execResult?.status === 0 &&
    testsResult?.status === 0 &&
    reportJsonWritten &&
    reportMarkdownWritten
);

const summary = {
  status: completed ? "completed" : "blocked",
  codex_cli_version: codexVersion,
  model,
  prompt_file: "contracts/prompt.md",
  schema_file: "contracts/final-report.schema.json",
  exec_exit_code: execResult?.status ?? 90,
  blocker_reason:
    blockerReason ||
    (execResult && execResult.status !== 0
      ? sanitize((execResult.stderr || "").trim()).split("\n").filter(Boolean).slice(-2).join(" | ")
      : undefined),
  changed_files: sanitize(changedFilesResult.stdout || "")
    .trim()
    .split("\n")
    .filter(Boolean),
  tests_command: "npm test",
  tests_exit_code: testsResult?.status,
  tests_status: testsResult ? (testsResult.status === 0 ? "passed" : "failed") : "not-run",
  reports_written: {
    json: reportJsonWritten,
    markdown: reportMarkdownWritten
  },
  redaction_note:
    "Absolute temp paths, loopback ports, runtime identifiers, shell paths, and bearer material were redacted before commit."
};

writeNormalized(path.join(resultsDir, "live-run-summary.json"), JSON.stringify(summary, null, 2));
writeNormalized(
  path.join(resultsDir, "codex-stderr-summary.txt"),
  sanitize(execResult?.stderr || blockerReason || "")
);
writeNormalized(
  path.join(resultsDir, "codex-stdout-sanitized.jsonl"),
  sanitize(execResult?.stdout || "")
);

if (testsResult) {
  writeNormalized(
    path.join(resultsDir, "live-tests.txt"),
    normalizeTestOutput([testsResult.stdout, testsResult.stderr].filter(Boolean).join(""))
  );
}

if (existsSync(lastMessageRawPath)) {
  writeNormalized(
    path.join(resultsDir, "codex-last-message.json"),
    sanitize(readFileSync(lastMessageRawPath, "utf8"))
  );
}

if (existsSync(path.join(tempRepo, "reports/releases.json"))) {
  writeNormalized(
    path.join(resultsDir, "live-releases.json"),
    readFileSync(path.join(tempRepo, "reports/releases.json"), "utf8")
  );
}

if (existsSync(path.join(tempRepo, "reports/releases.md"))) {
  writeNormalized(
    path.join(resultsDir, "live-releases.md"),
    readFileSync(path.join(tempRepo, "reports/releases.md"), "utf8")
  );
}

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(completed ? 0 : 90);
