#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { listTextFiles } from "./route-contract.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const vaultRoot = path.join(showcaseRoot, "fixture", "synthetic-vault");
const reportsDir = path.join(showcaseRoot, "reports");
const resultsDir = path.join(showcaseRoot, "results");
const promptPath = path.join(showcaseRoot, "contracts", "live-prompt.md");
const model = process.env.CODEX_NESTED_MODEL || "gpt-5.5";

fs.mkdirSync(reportsDir, { recursive: true });
fs.mkdirSync(resultsDir, { recursive: true });
for (const name of ["routes.json", "routes.md", "read-trace.log"]) {
  fs.rmSync(path.join(reportsDir, name), { force: true });
}

function sha256(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function fixtureSnapshot() {
  return Object.fromEntries(
    listTextFiles(vaultRoot).map((relative) => [relative, sha256(path.join(vaultRoot, relative))]),
  );
}

function sanitize(text) {
  return (text || "")
    .replaceAll(showcaseRoot, "<showcase>")
    .replace(/\/Users\/[^/\s]+\/[\S]*/g, "<user-path>")
    .replace(/\/private\/tmp\/[\S]*/g, "<tmp-path>")
    .replace(/\/var\/folders\/[\S]*/g, "<tmp-path>")
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "<runtime-id>")
    .replace(/\bsk-[A-Za-z0-9_-]+\b/g, "<credential>");
}

const before = fixtureSnapshot();
const rawDir = fs.mkdtempSync(path.join(os.tmpdir(), "index-routing-live-"));
const rawLastMessage = path.join(rawDir, "last-message.txt");
const prompt = fs.readFileSync(promptPath, "utf8");
const run = spawnSync(
  "codex",
  [
    "exec",
    "-",
    "-m",
    model,
    "-s",
    "workspace-write",
    "--json",
    "--ephemeral",
    "--ignore-user-config",
    "--ignore-rules",
    "-C",
    showcaseRoot,
    "-o",
    rawLastMessage,
  ],
  { input: prompt, encoding: "utf8", maxBuffer: 12 * 1024 * 1024, timeout: 240000 },
);

const after = fixtureSnapshot();
const fixtureUnchanged = JSON.stringify(before) === JSON.stringify(after);
const reportPaths = ["routes.json", "routes.md", "read-trace.log"];
const reportsWritten = Object.fromEntries(
  reportPaths.map((name) => [name, fs.existsSync(path.join(reportsDir, name))]),
);

let validationExitCode = null;
if (reportsWritten["routes.json"] && reportsWritten["read-trace.log"]) {
  const validation = spawnSync(
    process.execPath,
    [path.join(__dirname, "validate-routes.mjs")],
    { cwd: showcaseRoot, encoding: "utf8" },
  );
  validationExitCode = validation.status;
}

const commands = [];
for (const line of (run.stdout || "").split("\n")) {
  if (!line.trim()) continue;
  try {
    const event = JSON.parse(line);
    const command = event?.item?.command;
    if (
      event?.type === "item.completed" &&
      event?.item?.type === "command_execution" &&
      typeof command === "string"
    ) {
      commands.push(sanitize(command));
    }
  } catch {
    // Raw JSONL stays outside the worktree; malformed diagnostic lines are ignored here.
  }
}
const forbiddenRead = commands.find(
  (command) =>
    /\b(?:cat|sed|grep|rg|find|ls|head|tail|awk|perl|python)\b/.test(command) &&
    !command.includes("scripts/read-doc.mjs"),
);

const completed =
  run.status === 0 &&
  fixtureUnchanged &&
  Object.values(reportsWritten).every(Boolean) &&
  validationExitCode === 0 &&
  !forbiddenRead;

if (completed) {
  fs.copyFileSync(path.join(reportsDir, "routes.json"), path.join(resultsDir, "live-routes.json"));
  fs.copyFileSync(path.join(reportsDir, "routes.md"), path.join(resultsDir, "live-routes.md"));
  fs.copyFileSync(path.join(reportsDir, "read-trace.log"), path.join(resultsDir, "live-read-trace.log"));
}

let lastMessage = "";
if (fs.existsSync(rawLastMessage)) {
  lastMessage = sanitize(fs.readFileSync(rawLastMessage, "utf8"));
  fs.writeFileSync(path.join(resultsDir, "live-last-message-sanitized.txt"), `${lastMessage.trim()}\n`);
}

const summary = {
  attempted_at: "2026-07-12",
  model,
  command: "codex exec - -m gpt-5.5 -s workspace-write --json --ephemeral --ignore-user-config --ignore-rules -C <showcase> -o <outside-worktree>",
  status: completed ? "completed" : "blocked",
  exec_exit_code: run.status,
  fixture_unchanged: fixtureUnchanged,
  reports_written: reportsWritten,
  validation_exit_code: validationExitCode,
  forbidden_direct_read: forbiddenRead || null,
  normalized_command_count: commands.length,
  raw_capture: "stored outside the worktree; only sanitized summary and final artifacts are committed",
  stderr_excerpt: completed ? "" : sanitize((run.stderr || "").slice(-800)),
};
fs.writeFileSync(path.join(resultsDir, "live-controller-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);

console.log(JSON.stringify(summary, null, 2));
process.exit(completed ? 0 : 90);
