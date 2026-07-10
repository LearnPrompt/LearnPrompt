import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { runOnce } from "../loop-demo.mjs";
import { mockWorker } from "../mock-worker.mjs";

test("a loop discovers, hands off, verifies, persists, and schedules", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "learnprompt-loop-test-"));
  await mkdir(path.join(root, "tasks"));
  await writeFile(
    path.join(root, "tasks", "001.json"),
    `${JSON.stringify({
      id: "uppercase-title",
      input: "learn prompt",
      acceptance: { expected_text: "LEARN PROMPT" },
    })}\n`,
  );

  const first = await runOnce(root, mockWorker);
  assert.deepEqual(first, { status: "passed", next: "idle", task: "uppercase-title" });

  const state = JSON.parse(await readFile(path.join(root, "state.json"), "utf8"));
  assert.deepEqual(state.completed, ["uppercase-title"]);

  const verification = JSON.parse(
    await readFile(path.join(root, "runs", "uppercase-title", "verification.json"), "utf8"),
  );
  assert.equal(verification.verified, true);

  const second = await runOnce(root, mockWorker);
  assert.deepEqual(second, { status: "idle", next: null });
});
