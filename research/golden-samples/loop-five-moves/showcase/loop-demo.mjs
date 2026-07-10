import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

export async function runOnce(root, worker) {
  const tasksDir = path.join(root, "tasks");
  const stateFile = path.join(root, "state.json");
  const taskFiles = (await readdir(tasksDir)).filter((name) => name.endsWith(".json")).sort();
  const state = await readJson(stateFile).catch(() => ({ completed: [], runs: 0 }));
  const tasks = await Promise.all(taskFiles.map((name) => readJson(path.join(tasksDir, name))));
  const task = tasks.find((candidate) => !state.completed.includes(candidate.id));
  console.log(`1 DISCOVER ${task ? task.id : "idle"}`);

  if (!task) {
    console.log("5 SCHEDULE idle");
    return { status: "idle", next: null };
  }

  const runDir = path.join(root, "runs", task.id);
  await writeJson(path.join(runDir, "handoff.json"), {
    task,
    acceptance: task.acceptance,
  });
  console.log(`2 HANDOFF ${task.id}`);

  const outcome = await worker(task, runDir);
  const verified = outcome.text === task.acceptance.expected_text;
  await writeJson(path.join(runDir, "verification.json"), {
    verified,
    expected: task.acceptance.expected_text,
    actual: outcome.text,
  });
  console.log(`3 VERIFY ${verified ? "pass" : "fail"}`);

  const nextState = {
    completed: verified ? [...state.completed, task.id] : state.completed,
    runs: state.runs + 1,
    last_task: task.id,
    last_result: verified ? "passed" : "failed",
  };
  await writeJson(stateFile, nextState);
  console.log(`4 PERSIST ${task.id}:${nextState.last_result}`);

  const remaining = tasks.filter((candidate) => !nextState.completed.includes(candidate.id));
  const next = verified && remaining.length > 0 ? "continue" : verified ? "idle" : "retry";
  console.log(`5 SCHEDULE ${next}`);
  return { status: nextState.last_result, next, task: task.id };
}
