#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { evaluateWriteBoundary, snapshotTree } from "./write-boundary-lib.mjs";

const sourceRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceReports = path.join(sourceRoot, "reports");
const sourceResults = path.join(sourceRoot, "results");
const allowedReportPaths = ["reports/route-audit.json", "reports/route-audit.md"];
fs.mkdirSync(sourceReports, { recursive: true });
fs.mkdirSync(sourceResults, { recursive: true });

function sanitize(text) {
  return (text || "")
    .replaceAll(sourceRoot, "<showcase>")
    .replace(/\/Users\/[^/\s]+\/[\S]*/g, "<user-path>")
    .replace(/\/private\/tmp\/[\S]*/g, "<tmp-path>")
    .replace(/\/var\/folders\/[\S]*/g, "<tmp-path>")
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "<runtime-id>")
    .replace(/\bs[k]-[A-Za-z0-9_-]{16,}\b/g, "<credential>");
}

function createAttemptWorkspace(rawRoot, attempt) {
  const workspace = path.join(rawRoot, `attempt-${attempt}`, "workspace");
  for (const directory of ["fixture", "contracts", "reports"]) {
    fs.mkdirSync(path.join(workspace, directory), { recursive: true });
  }
  fs.copyFileSync(
    path.join(sourceRoot, "fixture/synthetic-topology.json"),
    path.join(workspace, "fixture/synthetic-topology.json")
  );
  fs.copyFileSync(
    path.join(sourceRoot, "contracts/route-contract.json"),
    path.join(workspace, "contracts/route-contract.json")
  );
  return workspace;
}

const prompt = fs.readFileSync(path.join(sourceRoot, "prompts/live-run-prompt.md"), "utf8");
const rawRoot = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-route-live-"));
const model = process.env.CODEX_NESTED_MODEL ?? "gpt-5.4";
const attempts = [];
let accepted = null;
let finalStatus = "blocked";

try {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const workspace = createAttemptWorkspace(rawRoot, attempt);
    const rawLast = path.join(rawRoot, `attempt-${attempt}-last-message.txt`);
    const before = snapshotTree(workspace);
    const execution = spawnSync("codex", [
      "exec", "-", "-m", model, "-s", "workspace-write", "--json", "--ephemeral",
      "--ignore-user-config", "--ignore-rules", "-C", workspace, "-o", rawLast
    ], { cwd: workspace, input: prompt, encoding: "utf8", maxBuffer: 12 * 1024 * 1024, timeout: 240000 });
    const after = snapshotTree(workspace);
    const boundary = evaluateWriteBoundary(before, after, allowedReportPaths);
    const jsonPath = path.join(workspace, "reports/route-audit.json");
    const mdPath = path.join(workspace, "reports/route-audit.md");
    const reportsWritten = { json: fs.existsSync(jsonPath), markdown: fs.existsSync(mdPath) };
    let validationExitCode = null;
    if (reportsWritten.json && reportsWritten.markdown && boundary.code === 0) {
      const validation = spawnSync(
        process.execPath,
        ["scripts/validate-route-audit.mjs", jsonPath, mdPath],
        { cwd: sourceRoot, encoding: "utf8" }
      );
      validationExitCode = validation.status;
      fs.writeFileSync(path.join(sourceResults, "live-validation.txt"), `${validation.stdout}${validation.stderr}`);
    }
    const exitCode = execution.status ?? 124;
    const completed = exitCode === 0 && boundary.code === 0 && reportsWritten.json &&
      reportsWritten.markdown && validationExitCode === 0;
    const failureText = `${execution.stdout || ""}\n${execution.stderr || ""}`;
    const attemptRecord = {
      attempt,
      model,
      exec_exit_code: exitCode,
      reports_written: reportsWritten,
      validation_exit_code: validationExitCode,
      boundary_exit_code: boundary.code,
      changed_paths: boundary.changed_paths,
      unexpected_paths: boundary.unexpected_paths,
      protected_files_unchanged: boundary.protected_files_unchanged,
      failure_kind: completed ? null : (/usage limit/i.test(failureText) ? "usage-limit-before-report" : "controller-or-model-failure")
    };
    attempts.push(attemptRecord);
    if (fs.existsSync(rawLast)) {
      fs.writeFileSync(
        path.join(sourceResults, `live-attempt-${attempt}-last-message-sanitized.txt`),
        `${sanitize(fs.readFileSync(rawLast, "utf8")).trim()}\n`
      );
    }
    if (boundary.code === 106) {
      finalStatus = "invalid";
      break;
    }
    if (completed) {
      accepted = { jsonPath, mdPath, attempt: attemptRecord };
      finalStatus = "completed";
      fs.copyFileSync(jsonPath, path.join(sourceResults, "live-route-audit.json"));
      fs.copyFileSync(mdPath, path.join(sourceResults, "live-route-audit.md"));
      fs.copyFileSync(jsonPath, path.join(sourceReports, "route-audit.json"));
      fs.copyFileSync(mdPath, path.join(sourceReports, "route-audit.md"));
      break;
    }
  }

  const last = accepted?.attempt ?? attempts.at(-1);
  const summary = {
    attempted_at: "2026-07-12",
    model,
    status: finalStatus,
    attempt_count: attempts.length,
    attempts,
    allowed_report_paths: allowedReportPaths,
    execution_workspace: "minimal synthetic copy outside the repository",
    exec_exit_code: last?.exec_exit_code ?? null,
    reports_written: last?.reports_written ?? { json: false, markdown: false },
    validation_exit_code: last?.validation_exit_code ?? null,
    boundary_exit_code: last?.boundary_exit_code ?? null,
    protected_files_unchanged: last?.protected_files_unchanged ?? false,
    changed_paths: last?.changed_paths ?? [],
    unexpected_paths: last?.unexpected_paths ?? [],
    raw_capture: "captured outside the repository and removed after sanitized per-attempt summaries"
  };
  fs.writeFileSync(path.join(sourceResults, "live-controller-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(finalStatus === "completed" ? 0 : finalStatus === "invalid" ? 106 : 90);
} finally {
  fs.rmSync(rawRoot, { recursive: true, force: true });
}
