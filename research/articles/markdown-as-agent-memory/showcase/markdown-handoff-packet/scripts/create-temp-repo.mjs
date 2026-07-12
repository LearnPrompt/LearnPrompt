import { cpSync, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.resolve(scriptDir, "../fixture/packets");

function runGit(tempRepo, args) {
  const result = spawnSync("git", args, {
    cwd: tempRepo,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error([result.stdout, result.stderr].filter(Boolean).join(""));
  }
}

export function createTempRepo(scenario = "normal") {
  const sourceDir = path.join(fixtureRoot, scenario);
  const tempRepo = mkdtempSync(path.join(os.tmpdir(), `markdown-handoff-${scenario}-`));
  cpSync(sourceDir, tempRepo, { recursive: true });

  runGit(tempRepo, ["init"]);
  runGit(tempRepo, ["config", "user.name", "LearnPrompt Fixture"]);
  runGit(tempRepo, ["config", "user.email", "fixture@example.com"]);
  runGit(tempRepo, ["add", "."]);
  runGit(tempRepo, ["commit", "-m", "Baseline frozen packet"]);

  return tempRepo;
}
