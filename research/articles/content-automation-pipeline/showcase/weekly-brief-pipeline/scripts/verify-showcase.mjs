#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RESULTS_DIR = path.join(ROOT, "results");
const RUN_PIPELINE = path.join(__dirname, "run-pipeline.mjs");
const RAW_CAPTURE_PREFIX = path.join(os.tmpdir(), "weekly-brief-pipeline-raw-");
const MAX_SUMMARY_LINES = 80;
const MAX_SUMMARY_CHARS = 6000;

const SCENARIOS = [
  ["success", 0],
  ["missing-source-field", 21],
  ["verify-failed", 23],
  ["no-approval", 31],
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function redactIdentifiers(value) {
  return value
    .replace(
      /\b(session[_-]?id|request[_-]?id|sessionId|requestId)(\s*[:=]\s*)([^\s]+)/gi,
      (_, label, separator) => `${label}${separator}[redacted]`,
    )
    .replace(/\b(req|request|sess|session)_[A-Za-z0-9._:-]{6,}\b/gi, "[redacted]")
    .replace(/\b(req|request|sess|session)-[A-Za-z0-9._:-]{6,}\b/gi, "[redacted]");
}

function redactTmpPaths(value, rawDir) {
  return value
    .replace(new RegExp(escapeRegExp(rawDir), "g"), "[os-tmpdir-raw-capture]")
    .replace(new RegExp(`${escapeRegExp(os.tmpdir())}[^\n\\s'"]*`, "g"), "[os-tmpdir-path]");
}

function clipSanitizedOutput(value) {
  let clipped = value.trimEnd();
  let truncated = false;
  const lines = clipped.split("\n");

  if (lines.length > MAX_SUMMARY_LINES) {
    clipped = lines.slice(0, MAX_SUMMARY_LINES).join("\n");
    truncated = true;
  }

  if (clipped.length > MAX_SUMMARY_CHARS) {
    clipped = clipped.slice(0, MAX_SUMMARY_CHARS).trimEnd();
    truncated = true;
  }

  if (!truncated) {
    return clipped;
  }

  return `${clipped}\n[truncated after redaction: max ${MAX_SUMMARY_LINES} lines / ${MAX_SUMMARY_CHARS} chars]`;
}

function freezeSummaryFromRaw({ rawStdout, rawStderr, rawDir }) {
  const combined = [rawStdout.trimEnd(), rawStderr.trimEnd()].filter(Boolean).join("\n");
  const redacted = redactIdentifiers(redactTmpPaths(combined, rawDir));
  return clipSanitizedOutput(redacted);
}

function runScenario(name) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [RUN_PIPELINE, "--scenario", name], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        code: code ?? 1,
        stdout,
        stderr,
      });
    });
  });
}

async function main() {
  await mkdir(RESULTS_DIR, { recursive: true });
  let rawDir;

  try {
    rawDir = await mkdtemp(RAW_CAPTURE_PREFIX);
    const lines = [
      "weekly-brief-pipeline deterministic replay",
      "",
    ];
    const frozenSummaries = [];

    for (const [scenario, expectedExit] of SCENARIOS) {
      const { code, stdout, stderr } = await runScenario(scenario);
      const rawStdoutPath = path.join(rawDir, `${scenario}.stdout.raw.txt`);
      const rawStderrPath = path.join(rawDir, `${scenario}.stderr.raw.txt`);

      await writeFile(rawStdoutPath, stdout, "utf8");
      await writeFile(rawStderrPath, stderr, "utf8");

      const rawStdout = await readFile(rawStdoutPath, "utf8");
      const rawStderr = await readFile(rawStderrPath, "utf8");
      const frozenSummary = freezeSummaryFromRaw({ rawStdout, rawStderr, rawDir });

      if (code !== expectedExit) {
        throw new Error(
          `Scenario ${scenario} exit mismatch: expected ${expectedExit}, received ${code}`,
        );
      }

      const statePath = path.join(RESULTS_DIR, scenario, "pipeline-state.json");
      const state = JSON.parse(await readFile(statePath, "utf8"));
      const lastStage = state.stages.at(-1);

      frozenSummaries.push({ scenario, frozenSummary });
      lines.push(
        `${scenario}: exit ${code}, ${state.status}, final_stage=${lastStage?.stage ?? "unknown"}`,
      );
    }

    for (const { scenario, frozenSummary } of frozenSummaries) {
      const summaryPath = path.join(RESULTS_DIR, scenario, "command-summary.txt");
      await writeFile(summaryPath, `${frozenSummary}\n`, "utf8");
    }

    lines.push("");
    lines.push(
      "Detailed sanitized stdout/stderr was read back from isolated os.tmpdir raw captures and archived in each scenario's command-summary.txt.",
    );
    await writeFile(path.join(RESULTS_DIR, "run-result.txt"), `${lines.join("\n")}\n`, "utf8");
  } finally {
    if (rawDir) {
      await rm(rawDir, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
