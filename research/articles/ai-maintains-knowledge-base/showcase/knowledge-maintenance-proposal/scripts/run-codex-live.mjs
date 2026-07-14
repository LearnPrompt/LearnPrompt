#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const results = path.join(root, "results");
const reports = path.join(root, "reports");
mkdirSync(results, { recursive: true });
mkdirSync(reports, { recursive: true });
for (const name of ["maintenance-plan.json", "maintenance-plan.md"]) {
  rmSync(path.join(reports, name), { force: true });
}

const model = process.env.CODEX_NESTED_MODEL ?? "gpt-5.5";
const prompt = readFileSync(path.join(root, "prompts/live-run-prompt.md"), "utf8");

function walk(directory, base = directory, acc = []) {
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) walk(file, base, acc);
    else acc.push(path.relative(base, file).split(path.sep).join("/"));
  }
  return acc.sort();
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function protectedSnapshot() {
  const files = walk(root).filter(
    (relative) => !relative.startsWith("reports/") && !relative.startsWith("results/"),
  );
  return Object.fromEntries(files.map((relative) => [relative, sha256(path.join(root, relative))]));
}

function sanitize(text) {
  return (text || "")
    .replaceAll(root, "<showcase>")
    .replace(/\/Users\/[^/\s]+\/[\S]*/g, "<user-path>")
    .replace(/\/private\/tmp\/[\S]*/g, "<tmp-path>")
    .replace(/\/var\/folders\/[\S]*/g, "<tmp-path>")
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "<runtime-id>")
    .replace(/\bsk-[A-Za-z0-9_-]+\b/g, "<credential>");
}

const before = protectedSnapshot();
const rawDir = mkdtempSync(path.join(tmpdir(), "knowledge-maintenance-live-"));
const rawLastMessage = path.join(rawDir, "last-message.txt");
const codex = spawnSync(
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
    root,
    "-o",
    rawLastMessage,
  ],
  { cwd: root, input: prompt, encoding: "utf8", maxBuffer: 12 * 1024 * 1024, timeout: 240000 },
);

const after = protectedSnapshot();
const protectedFilesUnchanged = JSON.stringify(before) === JSON.stringify(after);
const reportsWritten = {
  json: existsSync(path.join(reports, "maintenance-plan.json")),
  markdown: existsSync(path.join(reports, "maintenance-plan.md")),
};

let validationExitCode = null;
if (reportsWritten.json) {
  const validation = spawnSync(
    process.execPath,
    ["scripts/validate-plan.mjs", "reports/maintenance-plan.json"],
    { cwd: root, encoding: "utf8" },
  );
  validationExitCode = validation.status;
  writeFileSync(path.join(results, "live-validation.txt"), `${validation.stdout}${validation.stderr}`);
}

const completed =
  codex.status === 0 &&
  protectedFilesUnchanged &&
  reportsWritten.json &&
  reportsWritten.markdown &&
  validationExitCode === 0;

if (completed) {
  copyFileSync(path.join(reports, "maintenance-plan.json"), path.join(results, "live-maintenance-plan.json"));
  copyFileSync(path.join(reports, "maintenance-plan.md"), path.join(results, "live-maintenance-plan.md"));
}

if (existsSync(rawLastMessage)) {
  const lastMessage = sanitize(readFileSync(rawLastMessage, "utf8"));
  writeFileSync(path.join(results, "live-last-message-sanitized.txt"), `${lastMessage.trim()}\n`);
}

const summary = {
  attempted_at: "2026-07-12",
  model,
  command: "codex exec - -m gpt-5.5 -s workspace-write --json --ephemeral --ignore-user-config --ignore-rules -C <showcase> -o <outside-worktree>",
  status: completed ? "completed" : "blocked",
  exec_exit_code: codex.status,
  reports_written: reportsWritten,
  validation_exit_code: validationExitCode,
  protected_files_unchanged: protectedFilesUnchanged,
  changed_paths: [
    ...(reportsWritten.json ? ["reports/maintenance-plan.json"] : []),
    ...(reportsWritten.markdown ? ["reports/maintenance-plan.md"] : []),
  ],
  raw_capture: "stored outside the worktree; only sanitized summary and final artifacts are committed",
  stderr_excerpt: completed ? "" : sanitize((codex.stderr || "").slice(-800)),
};
writeFileSync(path.join(results, "live-controller-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);

console.log(JSON.stringify(summary, null, 2));
process.exit(completed ? 0 : 90);
