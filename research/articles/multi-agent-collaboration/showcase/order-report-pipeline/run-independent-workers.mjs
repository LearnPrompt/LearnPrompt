#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const tempRoot = mkdtempSync(path.join(os.tmpdir(), "order-report-workers-"));

function runWorker(taskName, outputName) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(root, "workers/run-worker.mjs"),
        "--task",
        path.join(root, `tasks/${taskName}.json`),
        "--output",
        path.join(tempRoot, outputName),
      ],
      { encoding: "utf8" },
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout: stdout.trim(), outputName });
      else reject(new Error(`${taskName} exit=${code}: ${stderr.trim()}`));
    });
  });
}

try {
  const [workerA, workerB] = await Promise.all([
    runWorker("task-a-parser", "worker-a"),
    runWorker("task-b-renderer", "worker-b"),
  ]);

  console.log("INDEPENDENT WORKER RUN");
  console.log("parallel_processes=2");
  console.log("---- worker-a ----");
  console.log(workerA.stdout);
  console.log("---- worker-b ----");
  console.log(workerB.stdout);

  const gate = spawnSync(
    process.execPath,
    [
      path.join(root, "merge-gate.mjs"),
      path.join(root, "tasks/task-a-parser.json"),
      path.join(root, "tasks/task-b-renderer.json"),
    ],
    { encoding: "utf8" },
  );
  if (gate.status !== 0) throw new Error(`merge gate exit=${gate.status}`);

  const parserPath = path.join(tempRoot, "worker-a/src/parse-orders.mjs");
  const rendererPath = path.join(tempRoot, "worker-b/src/render-summary.mjs");
  const parser = await import(`${pathToFileURL(parserPath).href}?integration=1`);
  const renderer = await import(`${pathToFileURL(rendererPath).href}?integration=1`);
  const csv = readFileSync(path.join(root, "fixtures/orders.csv"), "utf8");
  const expected = readFileSync(path.join(root, "fixtures/expected-summary.md"), "utf8");
  const actual = renderer.renderSummary(parser.parseOrders(csv));
  if (actual.trim() !== expected.trim()) {
    throw new Error("integration output from worker artifacts differs from frozen golden");
  }

  console.log("---- coordinator ----");
  console.log("write_sets_disjoint=yes");
  console.log("contract_unchanged=yes");
  console.log("integration_inputs=worker-a-output+worker-b-output");
  console.log("integration_from_worker_outputs=PASS");
  console.log("RESULT PASS");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
