import { cpSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const fixtureDir = path.join(rootDir, "fixture");

const tempRoot = mkdtempSync(path.join(tmpdir(), "receipt-normalizer-"));
const repoDir = path.join(tempRoot, "receipt-normalizer");

cpSync(fixtureDir, repoDir, { recursive: true });

execFileSync("git", ["init"], { cwd: repoDir, stdio: "ignore" });
execFileSync("git", ["config", "user.name", "Showcase Bot"], { cwd: repoDir, stdio: "ignore" });
execFileSync("git", ["config", "user.email", "showcase@example.invalid"], {
  cwd: repoDir,
  stdio: "ignore"
});
execFileSync("git", ["add", "."], { cwd: repoDir, stdio: "ignore" });
execFileSync("git", ["commit", "-m", "baseline fixture"], { cwd: repoDir, stdio: "ignore" });

process.stdout.write(`${repoDir}\n`);
