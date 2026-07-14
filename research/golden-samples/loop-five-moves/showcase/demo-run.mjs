import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runOnce } from "./loop-demo.mjs";
import { mockWorker } from "./mock-worker.mjs";

const root = await mkdtemp(path.join(os.tmpdir(), "learnprompt-loop-"));
await mkdir(path.join(root, "tasks"));
await writeFile(
  path.join(root, "tasks", "001.json"),
  `${JSON.stringify({
    id: "uppercase-title",
    input: "learn prompt",
    acceptance: { expected_text: "LEARN PROMPT" },
  }, null, 2)}\n`,
);

await runOnce(root, mockWorker);
console.log(`Artifacts: ${root}`);
