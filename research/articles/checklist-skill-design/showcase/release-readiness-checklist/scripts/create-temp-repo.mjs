import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const fixtureDir = path.join(showcaseRoot, "fixture");

function applyScenario(repoDir, scenario) {
  if (scenario === "ready") {
    return;
  }

  if (scenario === "missing-changelog") {
    rmSync(path.join(repoDir, "CHANGELOG.md"), { force: true });
    return;
  }

  if (scenario === "version-mismatch") {
    const packageJsonPath = path.join(repoDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    packageJson.version = "1.4.1";
    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
    return;
  }

  if (scenario === "unverifiable-install") {
    const commandPath = path.join(repoDir, "release", "install-command.txt");
    writeFileSync(commandPath, "npx clip-clean@1.4.0 --help\n");
    const readmePath = path.join(repoDir, "README.md");
    const readme = readFileSync(readmePath, "utf8").replace("npm run release:smoke", "npx clip-clean@1.4.0 --help");
    writeFileSync(readmePath, readme);
    return;
  }

  if (scenario === "na-without-evidence") {
    return;
  }

  throw new Error(`Unknown scenario: ${scenario}`);
}

export function createTempRepo(scenario = "ready") {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "release-readiness-"));
  const repoDir = path.join(tempRoot, "clip-clean");
  cpSync(fixtureDir, repoDir, { recursive: true });
  applyScenario(repoDir, scenario);

  execFileSync("git", ["init"], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["config", "user.name", "Showcase Bot"], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["config", "user.email", "showcase@example.invalid"], {
    cwd: repoDir,
    stdio: "ignore"
  });
  execFileSync("git", ["add", "."], { cwd: repoDir, stdio: "ignore" });
  execFileSync("git", ["commit", "-m", `baseline ${scenario}`], { cwd: repoDir, stdio: "ignore" });

  return repoDir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const scenario = process.argv[2] || "ready";
  process.stdout.write(`${createTempRepo(scenario)}\n`);
}
