import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function mockWorker(task, runDir) {
  const text = task.input.trim().toUpperCase();
  await writeFile(path.join(runDir, "outcome.txt"), `${text}\n`);
  return { text };
}
