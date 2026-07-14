import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const showcaseRoot = path.resolve(__dirname, "..");
const fixtureBase = path.join(showcaseRoot, "fixture", "base");
const stagedDiff = path.join(showcaseRoot, "fixture", "staged.diff");

export function createReviewRepo() {
  const repoDir = mkdtempSync(
    path.join(tmpdir(), "auto-review-boundaries-fixture-"),
  );

  cpSync(fixtureBase, repoDir, { recursive: true });

  execFileSync("git", ["init"], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["config", "user.name", "LearnPrompt Fixture"], {
    cwd: repoDir,
    stdio: "ignore",
  });
  execFileSync("git", ["config", "user.email", "fixture@example.invalid"], {
    cwd: repoDir,
    stdio: "ignore",
  });
  execFileSync("git", ["add", "."], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["commit", "-m", "baseline"], {
    cwd: repoDir,
    stdio: "ignore",
  });
  execFileSync("git", ["apply", "--index", "--unidiff-zero", stagedDiff], {
    cwd: repoDir,
    stdio: "ignore",
  });

  return repoDir;
}

if (process.argv[1] === __filename) {
  process.stdout.write(createReviewRepo());
}
