#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const reports = path.join(root, "reports");
const results = path.join(root, "results");
fs.mkdirSync(reports, { recursive: true });
fs.mkdirSync(results, { recursive: true });
for (const name of ["learning-proposals.json", "learning-proposals.md"]) {
  fs.rmSync(path.join(reports, name), { force: true });
}

function walk(directory, base = directory, acc = []) {
  for (const name of fs.readdirSync(directory)) {
    const file = path.join(directory, name);
    if (fs.statSync(file).isDirectory()) walk(file, base, acc);
    else acc.push(path.relative(base, file).split(path.sep).join("/"));
  }
  return acc.sort();
}
function sha(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}
function protectedSnapshot() {
  const files = walk(root).filter((file) => !file.startsWith("reports/") && !file.startsWith("results/"));
  return Object.fromEntries(files.map((file) => [file, sha(path.join(root, file))]));
}
function sanitize(text) {
  return (text || "")
    .replaceAll(root, "<showcase>")
    .replace(/\/Users\/[^/\s]+\/[\S]*/g, "<user-path>")
    .replace(/\/private\/tmp\/[\S]*/g, "<tmp-path>")
    .replace(/\/var\/folders\/[\S]*/g, "<tmp-path>")
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "<runtime-id>")
    .replace(/\bs[k]-[A-Za-z0-9_-]{16,}\b/g, "<credential>");
}

const before = protectedSnapshot();
const prompt = fs.readFileSync(path.join(root, "prompts/live-run-prompt.md"), "utf8");
const rawDir = fs.mkdtempSync(path.join(os.tmpdir(), "hermes-learning-live-"));
const rawLast = path.join(rawDir, "last-message.txt");
const model = process.env.CODEX_NESTED_MODEL ?? "gpt-5.5";
const execution = spawnSync("codex", [
  "exec", "-", "-m", model, "-s", "workspace-write", "--json", "--ephemeral",
  "--ignore-user-config", "--ignore-rules", "-C", root, "-o", rawLast,
], { cwd: root, input: prompt, encoding: "utf8", maxBuffer: 12 * 1024 * 1024, timeout: 240000 });

const after = protectedSnapshot();
const protectedFilesUnchanged = JSON.stringify(before) === JSON.stringify(after);
const jsonPath = path.join(reports, "learning-proposals.json");
const mdPath = path.join(reports, "learning-proposals.md");
const reportsWritten = { json: fs.existsSync(jsonPath), markdown: fs.existsSync(mdPath) };
let validationExitCode = null;
if (reportsWritten.json && reportsWritten.markdown) {
  const validation = spawnSync(process.execPath, ["scripts/validate-learning-proposals.mjs"], { cwd: root, encoding: "utf8" });
  validationExitCode = validation.status;
  fs.writeFileSync(path.join(results, "live-validation.txt"), `${validation.stdout}${validation.stderr}`);
}
const completed = execution.status === 0 && protectedFilesUnchanged && reportsWritten.json && reportsWritten.markdown && validationExitCode === 0;
if (completed) {
  fs.copyFileSync(jsonPath, path.join(results, "live-learning-proposals.json"));
  fs.copyFileSync(mdPath, path.join(results, "live-learning-proposals.md"));
}
if (fs.existsSync(rawLast)) {
  fs.writeFileSync(path.join(results, "live-last-message-sanitized.txt"), `${sanitize(fs.readFileSync(rawLast, "utf8")).trim()}\n`);
}
const summary = {
  attempted_at: "2026-07-12",
  model,
  status: completed ? "completed" : "blocked",
  exec_exit_code: execution.status,
  reports_written: reportsWritten,
  validation_exit_code: validationExitCode,
  protected_files_unchanged: protectedFilesUnchanged,
  changed_paths: [
    ...(reportsWritten.json ? ["reports/learning-proposals.json"] : []),
    ...(reportsWritten.markdown ? ["reports/learning-proposals.md"] : []),
  ],
  raw_capture: "stored outside the worktree; only sanitized summary and accepted artifacts are committed",
  stderr_excerpt: completed ? "" : sanitize((execution.stderr || "").slice(-800)),
};
fs.writeFileSync(path.join(results, "live-controller-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
fs.rmSync(rawDir, { recursive: true, force: true });
console.log(JSON.stringify(summary, null, 2));
process.exit(completed ? 0 : 90);
