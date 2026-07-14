#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createTempRepo } from "./create-temp-repo.mjs";
import { startMockReleaseApi } from "../fixture/.agents/skills/release-feed-api/scripts/mock-release-api.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(scriptDir, "..");
const resultsDir = path.join(showcaseRoot, "results");
const scenario = process.argv[2];
const fetchScript = ".agents/skills/release-feed-api/scripts/fetch-releases.mjs";

const RUNNER_EXIT = {
  blocked: 90,
  usage: 2
};

function combinedOutput(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("").trim();
}

function ensureExit(result, expected, label) {
  if (result.status !== expected) {
    throw new Error(`${label}: expected exit ${expected}, received ${result.status}\n${combinedOutput(result)}`);
  }
}

function writeNormalized(filePath, lines) {
  writeFileSync(filePath, `${lines.join("\n").trimEnd()}\n`);
}

function copyIfExists(cwd, relativePath, resultName) {
  const fullPath = path.join(cwd, relativePath);
  if (!existsSync(fullPath)) {
    return;
  }

  writeFileSync(path.join(resultsDir, resultName), `${readFileSync(fullPath, "utf8").trimEnd()}\n`);
}

function runFetch(cwd, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [fetchScript], {
      cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

async function withLoopbackScenario(kind, expectedExit, resultFile, extraSetup) {
  const tempRepo = createTempRepo();
  let server;
  try {
    server = await startMockReleaseApi({
      scenario: kind,
      credential: randomUUID()
    });
  } catch (error) {
    if (error?.code === "EPERM") {
      writeNormalized(path.join(resultsDir, resultFile), [
        `scenario: ${kind}`,
        "status: blocked",
        `blocker: ${error.code} ${error.syscall} ${error.address}`
      ]);
      return {
        runner_exit_code: RUNNER_EXIT.blocked,
        scenario: kind,
        status: "blocked",
        blocker: `${error.code} ${error.syscall} ${error.address}`
      };
    }
    throw error;
  }

  try {
    if (typeof extraSetup === "function") {
      extraSetup(tempRepo);
    }

    const result = await runFetch(tempRepo, {
      ...process.env,
      RELEASE_FEED_BASE_URL: server.baseUrl,
      RELEASE_FEED_TOKEN: server.credential
    });
    ensureExit(result, expectedExit, kind);
    if (expectedExit === 0) {
      copyIfExists(tempRepo, "reports/releases.json", `${kind}.releases.json`);
      copyIfExists(tempRepo, "reports/releases.md", `${kind}.releases.md`);
    }
    writeNormalized(path.join(resultsDir, resultFile), [
      `scenario: ${kind}`,
      `command: node ${fetchScript}`,
      `exit_code: ${result.status}`,
      combinedOutput(result)
    ]);
    return {
      runner_exit_code: 0,
      scenario: kind,
      status: "completed",
      fetch_exit_code: result.status
    };
  } finally {
    await server.close();
  }
}

async function runMissingCredential() {
  const tempRepo = createTempRepo();
  const result = await runFetch(tempRepo, {
    ...process.env,
    RELEASE_FEED_BASE_URL: "http://127.0.0.1:<loopback-port>"
  });
  ensureExit(result, 41, "missing-credential");
  writeNormalized(path.join(resultsDir, "missing-credential.txt"), [
    "scenario: missing-credential",
    `command: node ${fetchScript}`,
    "exit_code: 41",
    combinedOutput(result)
  ]);
  return {
    runner_exit_code: 0,
    scenario: "missing-credential",
    status: "completed",
    fetch_exit_code: 41
  };
}

async function runMutatingMethod() {
  const tempRepo = createTempRepo();
  const configPath = path.join(tempRepo, "release-feed.config.json");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  config.method = "POST";
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  const result = await runFetch(tempRepo, {
    ...process.env,
    RELEASE_FEED_BASE_URL: "http://127.0.0.1:<loopback-port>",
    RELEASE_FEED_TOKEN: "redacted-runtime-credential"
  });
  ensureExit(result, 44, "mutating-method");
  writeNormalized(path.join(resultsDir, "mutating-method.txt"), [
    "scenario: mutating-method",
    `command: node ${fetchScript}`,
    "exit_code: 44",
    combinedOutput(result)
  ]);
  return {
    runner_exit_code: 0,
    scenario: "mutating-method",
    status: "completed",
    fetch_exit_code: 44
  };
}

const handlers = {
  "two-page-success": () =>
    withLoopbackScenario("two-page-success", 0, "two-page-success.txt"),
  "rate-limit-once": () => withLoopbackScenario("rate-limit-once", 0, "rate-limit-once.txt"),
  "missing-credential": runMissingCredential,
  "schema-drift": () => withLoopbackScenario("schema-drift", 42, "schema-drift.txt"),
  "retry-exhausted": () => withLoopbackScenario("retry-exhausted", 43, "retry-exhausted.txt"),
  "mutating-method": runMutatingMethod
};

if (!(scenario in handlers)) {
  console.error(
    "Usage: node release-gate.mjs <two-page-success|rate-limit-once|missing-credential|schema-drift|retry-exhausted|mutating-method>"
  );
  process.exit(RUNNER_EXIT.usage);
}

const summary = await handlers[scenario]();
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(summary.runner_exit_code);
