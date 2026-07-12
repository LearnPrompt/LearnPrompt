import { cpSync, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const fixtureRoot = path.join(showcaseRoot, "fixture");

function runGit(args, cwd) {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "LearnPrompt Fixture",
      GIT_AUTHOR_EMAIL: "fixture@example.com",
      GIT_COMMITTER_NAME: "LearnPrompt Fixture",
      GIT_COMMITTER_EMAIL: "fixture@example.com"
    }
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `git ${args.join(" ")} failed`);
  }
}

export function createTempRepo() {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "release-feed-api-"));
  cpSync(fixtureRoot, tempRoot, { recursive: true });
  runGit(["init", "-q"], tempRoot);
  runGit(["add", "."], tempRoot);
  runGit(["commit", "-qm", "fixture baseline"], tempRoot);
  return tempRoot;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(`${JSON.stringify({ repo_path: createTempRepo() }, null, 2)}\n`);
}
