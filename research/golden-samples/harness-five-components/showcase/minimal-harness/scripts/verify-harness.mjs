import { access, readFile } from "node:fs/promises";

const checks = [
  {
    name: "instructions",
    file: "AGENTS.md",
    validate: (text) => text.includes("先阅读") && text.includes("运行"),
  },
  {
    name: "capabilities",
    file: "capabilities.json",
    validate: (text) => {
      const value = JSON.parse(text);
      return Array.isArray(value.commands) && value.network === false;
    },
  },
  {
    name: "constraints",
    file: "constraints.json",
    validate: (text) => {
      const value = JSON.parse(text);
      return value.require_verification === true && value.denied_actions.includes("push");
    },
  },
  {
    name: "memory",
    file: "memory.md",
    validate: (text) => text.includes("用户偏好") && text.includes("完成条件"),
  },
  {
    name: "orchestration",
    file: "orchestration.json",
    validate: (text) => {
      const value = JSON.parse(text);
      return value.steps.at(-2) === "verify" && Boolean(value.evaluator) && Boolean(value.stop_when);
    },
  },
];

for (const check of checks) {
  await access(check.file);
  const text = await readFile(check.file, "utf8");
  if (!check.validate(text)) {
    throw new Error(`FAIL ${check.name}: ${check.file} is incomplete`);
  }
  console.log(`PASS ${check.name}: ${check.file}`);
}

console.log(`PASS summary: ${checks.length}/${checks.length} harness components verified`);
