#!/usr/bin/env node

import { mkdtempSync, cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { evaluateCloudFit, readJson } from "./cloud-fit-gate.mjs";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function normalizeDiff(diffText) {
  return diffText
    .split("\n")
    .filter((line) => !line.startsWith("index "))
    .map((line) => {
      if (line === " ") return "@@LEARNPROMPT_BLANK_CONTEXT@@";
      return line.startsWith("@@") ? "@@" : line;
    })
    .join("\n")
    .trim();
}

function summarizeTap(stdoutText) {
  const tests = stdoutText.match(/# tests (\d+)/)?.[1] ?? "0";
  const pass = stdoutText.match(/# pass (\d+)/)?.[1] ?? "0";
  const fail = stdoutText.match(/# fail (\d+)/)?.[1] ?? "0";

  return {
    tests: Number(tests),
    pass: Number(pass),
    fail: Number(fail),
    text: `tests=${tests}\npass=${pass}\nfail=${fail}`,
  };
}

export function runCleanRoomReplay({
  fixtureDir,
  taskFile,
  environmentFile,
  patchFile,
}) {
  const task = readJson(taskFile);
  const environment = readJson(environmentFile);
  const gate = evaluateCloudFit(task, environment);

  if (gate.exit_code !== 0) {
    return { gate };
  }

  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "cloud-handoff-lab-"));
  const tempHome = path.join(tempRoot, "home");
  const tempRepo = path.join(tempRoot, "repo");
  const tempTmp = path.join(tempRoot, "tmp");
  cpSync(fixtureDir, tempRepo, { recursive: true });

  const gitEnv = {
    ...process.env,
    HOME: tempHome,
  };

  run("mkdir", ["-p", tempHome, tempTmp], { env: gitEnv });
  run("git", ["init", "-b", "main"], { cwd: tempRepo, env: gitEnv });
  run("git", ["config", "user.name", "LearnPrompt Showcase"], {
    cwd: tempRepo,
    env: gitEnv,
  });
  run("git", ["config", "user.email", "showcase@example.invalid"], {
    cwd: tempRepo,
    env: gitEnv,
  });
  run("git", ["add", "."], { cwd: tempRepo, env: gitEnv });
  run("git", ["commit", "-m", "baseline fixture"], {
    cwd: tempRepo,
    env: gitEnv,
    stdio: "ignore",
  });

  const cleanStatus = run("git", ["status", "--short"], {
    cwd: tempRepo,
    env: gitEnv,
  }).stdout.trim();

  const patchText = readFileSync(patchFile, "utf8").replace(
    /^@@LEARNPROMPT_BLANK_CONTEXT@@$/gm,
    " ",
  );
  const tempPatch = path.join(tempRoot, "good.patch");
  writeFileSync(tempPatch, patchText);
  const applyResult = run("git", ["apply", tempPatch], {
    cwd: tempRepo,
    env: gitEnv,
  });

  const changedFiles = run("git", ["diff", "--name-only"], {
    cwd: tempRepo,
    env: gitEnv,
  })
    .stdout.trim()
    .split("\n")
    .filter(Boolean);

  const testEnv = {
    HOME: tempHome,
    PATH: process.env.PATH ?? "",
    LANG: "C.UTF-8",
    LC_ALL: "C.UTF-8",
    TMPDIR: tempTmp,
    TZ: environment.agent_phase?.env_vars?.TZ ?? "UTC",
    TERM: "dumb",
  };

  const testResult = run(
    "/bin/sh",
    ["-lc", task.acceptance_command],
    { cwd: tempRepo, env: testEnv },
  );

  const diffText = normalizeDiff(
    run("git", ["diff", "--", "src/rollupByReporterDay.js"], {
      cwd: tempRepo,
      env: gitEnv,
    }).stdout,
  );

  const testSummary = summarizeTap(testResult.stdout);

  rmSync(tempRoot, { recursive: true, force: true });

  return {
    gate,
    clean_checkout_before_patch: cleanStatus === "",
    apply_exit: applyResult.status ?? 0,
    test_exit: testResult.status ?? 0,
    changed_files: changedFiles,
    diff_text: diffText,
    test_summary: testSummary,
  };
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value) {
      throw new Error(
        "Usage: replay-clean-room.mjs --fixture <dir> --task <task.json> --env <environment.json> --patch <patch>",
      );
    }
    values[key.slice(2)] = value;
  }
  return values;
}

const scriptFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptFile) {
  const args = parseArgs(process.argv.slice(2));
  const result = runCleanRoomReplay({
    fixtureDir: args.fixture,
    taskFile: args.task,
    environmentFile: args.env,
    patchFile: args.patch,
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.test_exit ?? result.gate?.exit_code ?? 0);
}
