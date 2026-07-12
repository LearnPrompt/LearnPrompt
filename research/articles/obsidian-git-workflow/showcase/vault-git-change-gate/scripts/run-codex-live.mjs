#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  cleanupLab,
  commitCandidate,
  contract,
  ensureDirs,
  git,
  reportsDir,
  resultsDir,
  sanitize,
  setupTempRepo,
  treeHash,
  validateCandidate
} from "./change-gate-lib.mjs";

ensureDirs();
mkdirSync(reportsDir, { recursive: true });

const previousSummary = path.join(resultsDir, "live-controller-summary.json");
if (existsSync(previousSummary)) {
  const prior = JSON.parse(readFileSync(previousSummary, "utf8"));
  if (prior.status === "invalid") {
    copyFileSync(previousSummary, path.join(resultsDir, "live-controller-attempt-2-invalid.json"));
    const priorLast = path.join(resultsDir, "live-last-message-sanitized.txt");
    if (existsSync(priorLast)) {
      copyFileSync(priorLast, path.join(resultsDir, "live-last-message-attempt-2-invalid.txt"));
    }
  }
}

const model = process.env.CODEX_NESTED_MODEL ?? "gpt-5.5";
const env = setupTempRepo();
const prompt = readFileSync(path.join(fileURLToPath(new URL("..", import.meta.url)), "prompts", "live-run-prompt.md"), "utf8");
const outputLastMessage = path.join(env.lab, "codex-last-message.txt");

let codex;
let validation = null;
let status = "blocked";
let baselineMainUnchanged = false;
try {
  codex = spawnSync(
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
      env.candidate,
      "-o",
      outputLastMessage
    ],
    { cwd: env.candidate, input: prompt, encoding: "utf8", maxBuffer: 12 * 1024 * 1024, timeout: 240000 }
  );

  if (codex.status === 0) {
    const firstCommit = commitCandidate(env.candidate, "live candidate note update");
    const receipt = path.join(env.candidate, contract.required_receipt);
    if (existsSync(receipt)) {
      let text = readFileSync(receipt, "utf8");
      text = /candidate_commit:\s*[^\n]+/.test(text)
        ? text.replace(/candidate_commit:\s*[^\n]+/, `candidate_commit: ${firstCommit}`)
        : `${text.trimEnd()}\ncandidate_commit: ${firstCommit}\n`;
      text = /baseline_tree_hash:\s*[^\n]+/.test(text)
        ? text.replace(/baseline_tree_hash:\s*[^\n]+/, `baseline_tree_hash: ${env.baselineTree}`)
        : `${text.trimEnd()}\nbaseline_tree_hash: ${env.baselineTree}\n`;
      writeFileSync(receipt, text.endsWith("\n") ? text : `${text}\n`);
      commitCandidate(env.candidate, "record normalized candidate receipt metadata");
    }
    validation = validateCandidate(env.main, env.candidate, env.baselineTree);
    baselineMainUnchanged = treeHash(env.main) === env.baselineHash;
    status = validation.code === 0 && baselineMainUnchanged ? "completed" : "invalid";
  }

  const summary = {
    attempted_at: "2026-07-12",
    attempt: "final outer-controller retry after writer block and receipt-contract rejection",
    model,
    status,
    command: "codex exec - -m gpt-5.5 -s workspace-write --json --ephemeral --ignore-user-config --ignore-rules -C <temporary-candidate-worktree> -o <temporary-outside-worktree>",
    exec_exit_code: codex.status,
    validation,
    baseline_main_unchanged: baselineMainUnchanged,
    temporary_repo_only: true,
    stderr_excerpt: status === "completed" ? "" : sanitize((codex.stderr || "").slice(-1000)),
    stdout_excerpt: status === "completed" ? "" : sanitize((codex.stdout || "").slice(-1000))
  };
  writeFileSync(path.join(resultsDir, "live-controller-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  if (existsSync(outputLastMessage)) {
    writeFileSync(
      path.join(resultsDir, "live-last-message-sanitized.txt"),
      `${sanitize(readFileSync(outputLastMessage, "utf8")).trim()}\n`
    );
  }
  if (status === "completed") {
    const candidatePatch = git(env.candidate, ["diff", "--binary", `${contract.default_branch}...HEAD`]).stdout;
    writeFileSync(
      path.join(resultsDir, "live-candidate-patch.json"),
      `${JSON.stringify(
        {
          format: "git-diff-lines",
          note: "Each array item is one original git diff line; a blank context line is preserved as a single-space string.",
          sha256: createHash("sha256").update(candidatePatch).digest("hex"),
          lines: candidatePatch.replace(/\n$/, "").split("\n")
        },
        null,
        2
      )}\n`
    );
    writeFileSync(
      path.join(resultsDir, "live-candidate-receipt.md"),
      readFileSync(path.join(env.candidate, contract.required_receipt), "utf8")
    );
    writeFileSync(
      path.join(resultsDir, "live-success-summary.txt"),
      `Fresh gpt-5.5 retry completed in a temporary candidate worktree. Validation: ${validation.code}; main unchanged: ${baselineMainUnchanged}.\n`
    );
  } else {
    writeFileSync(
      path.join(resultsDir, "live-blocked-summary.md"),
      `# Live nested attempt\n\nStatus: ${status}\n\nExit code: ${codex.status}\n\nSanitized stderr:\n\n\`\`\`text\n${sanitize((codex.stderr || "").slice(-1200))}\n\`\`\`\n`
    );
  }
  console.log(JSON.stringify(summary, null, 2));
  process.exit(status === "completed" ? 0 : 90);
} finally {
  cleanupLab(env.lab);
}
