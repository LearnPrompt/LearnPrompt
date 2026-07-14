#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, "..");
const prompts = JSON.parse(
  fs.readFileSync(path.join(labRoot, "prompts", "requests.json"), "utf8"),
);

function parseArgs(argv) {
  const args = {
    mode: "implicit",
    variant: "broad",
    resultsDir: path.join(labRoot, "results"),
  };
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--variant") args.variant = argv[++index];
    else if (token === "--mode") args.mode = argv[++index];
    else if (token === "--results-dir") args.resultsDir = argv[++index];
  }
  return args;
}

function sanitize(text) {
  return text
    .replace(/\/(?:private\/)?tmp\/[^\s"'<>]+/g, "<temp>")
    .replace(/\/var\/folders\/[^\s"'<>]+/g, "<temp>")
    .replace(/\/Users\/[^\s"'<>]+/g, "<home>")
    .replace(/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/g, "<shell>")
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "REDACTED-ID")
    .replace(
      /\b(?:session|thread|turn|request|item|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/gi,
      "REDACTED-RUNTIME-ID",
    );
}

function isPrivacySafe(text) {
  return (
    !/\/(?:Users|private\/tmp|tmp|var\/folders)\//.test(text) &&
    !/\/(?:usr\/)?bin\/(?:zsh|bash|sh)\b/.test(text) &&
    !/\b(?:session|thread|turn|request|item|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i.test(
      text,
    )
  );
}

const args = parseArgs(process.argv);
const model = process.env.CODEX_ROUTER_MODEL || "gpt-5.5";
const requestList = prompts.filter((prompt) =>
  args.mode === "explicit"
    ? prompt.kind === "explicit-control"
    : prompt.kind === "implicit-fixed",
);

const tempBase = fs.mkdtempSync(path.join(os.tmpdir(), "skill-router-live-"));
const fixtureName = args.variant === "bounded" ? "bounded-repo" : "broad-repo";
const sourceRepo = path.join(labRoot, "fixtures", fixtureName);
const workRepo = path.join(tempBase, fixtureName);
fs.cpSync(sourceRepo, workRepo, { recursive: true });

const rawDir = fs.mkdtempSync(path.join(os.tmpdir(), "skill-router-raw-"));
const results = [];

for (const prompt of requestList) {
  const promptText =
    args.mode === "explicit"
      ? `$release-weekly\n\n${prompt.text}`
      : prompt.text;

  const rawFile = path.join(rawDir, `${args.variant}-${args.mode}-${prompt.id}.txt`);
  const lastMessageFile = path.join(
    rawDir,
    `${args.variant}-${args.mode}-${prompt.id}-last-message.txt`,
  );
  const child = spawnSync(
    "codex",
    [
      "exec",
      "--ephemeral",
      "-m",
      model,
      "--skip-git-repo-check",
      "-s",
      "workspace-write",
      "-C",
      workRepo,
      "-o",
      lastMessageFile,
      promptText,
    ],
    {
      encoding: "utf8",
      env: process.env,
      maxBuffer: 1024 * 1024 * 8,
    },
  );

  const merged = `${child.stdout ?? ""}\n${child.stderr ?? ""}`;
  fs.writeFileSync(rawFile, merged);

  const sanitized = sanitize(merged);
  const finalOutput = fs.existsSync(lastMessageFile)
    ? fs.readFileSync(lastMessageFile, "utf8")
    : "";
  const sanitizedFinalOutput = sanitize(finalOutput);
  const containsCanary = sanitizedFinalOutput.includes("SKILL_USED: release-weekly");
  results.push({
    suite: "skill-router-lab",
    variant: args.variant,
    mode: args.mode,
    case_id: prompt.id,
    loaded: containsCanary,
    contains_canary: containsCanary,
    exit_code: child.status ?? 1,
    privacy_ok: isPrivacySafe(sanitizedFinalOutput),
    model,
    final_output_excerpt: sanitizedFinalOutput.slice(0, 800),
    notes:
      child.status === 0
        ? "completed"
        : "command failed; inspect the raw log outside the worktree",
  });
}

fs.mkdirSync(args.resultsDir, { recursive: true });
for (const result of results) {
  const filename = `run-${result.variant}-${result.mode}-${result.case_id}.json`;
  fs.writeFileSync(
    path.join(args.resultsDir, filename),
    JSON.stringify(result, null, 2),
  );
}

console.log(
  JSON.stringify(
    {
      created_results: results.length,
      results_dir: args.resultsDir,
      raw_logs_outside_worktree: true,
    },
    null,
    2,
  ),
);
