import { cpSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, "..");
const fixtureDir = path.join(labRoot, "fixture");

const fixedDate = "2026-07-12T08:00:00Z";

function git(args, cwd, extraEnv = {}) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "LearnPrompt Fixture",
      GIT_AUTHOR_EMAIL: "fixture@example.invalid",
      GIT_COMMITTER_NAME: "LearnPrompt Fixture",
      GIT_COMMITTER_EMAIL: "fixture@example.invalid",
      GIT_AUTHOR_DATE: fixedDate,
      GIT_COMMITTER_DATE: fixedDate,
      ...extraEnv
    }
  }).trim();
}

const tempRoot = mkdtempSync(path.join(tmpdir(), "handoff-degradation-lab-"));
const repoDir = path.join(tempRoot, "incident-archive-lab");
const worktreeDir = path.join(tempRoot, "incident-archive-lab-codex");

cpSync(fixtureDir, repoDir, { recursive: true });
git(["init", "-b", "main"], repoDir);
git(["config", "user.name", "LearnPrompt Fixture"], repoDir);
git(["config", "user.email", "fixture@example.invalid"], repoDir);
git(["add", "."], repoDir);
git(["commit", "-m", "baseline fixture"], repoDir);

const baselineSha = git(["rev-parse", "HEAD"], repoDir);
git(["worktree", "add", "-b", "codex-lane", worktreeDir, "HEAD"], repoDir);

process.stdout.write(
  `${JSON.stringify(
    {
      repo_dir: repoDir,
      worktree_dir: worktreeDir,
      baseline_sha: baselineSha
    },
    null,
    2
  )}\n`
);
