#!/usr/bin/env node
// 确定性检查器：一份指令能否被解析成“可执行项目地图”。
// 它不问模型“你觉得写得好吗”，而是逐项检查五个维度是否落到可定位的资源上。
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: verify-instruction-map.mjs <instruction-file>");
  process.exit(2);
}
const text = readFileSync(file, "utf8");

const checks = [
  {
    key: "目标 goal",
    ok: /^##\s*目标/m.test(text),
    why: "缺少可判断的目标小节",
  },
  {
    key: "范围 scope",
    ok: /^##\s*范围/m.test(text) && /`[^`]+\.(mjs|js|ts|md|json)`/.test(text),
    why: "范围没有指向具体文件路径",
  },
  {
    key: "顺序 sequence",
    ok: /^##\s*顺序/m.test(text) && /^\s*1\.\s/m.test(text),
    why: "缺少可执行的步骤序列",
  },
  {
    key: "验收 acceptance",
    ok: /^##\s*验收/m.test(text) && /`[^`]*(node|npm|pytest|make)[^`]*`/.test(text),
    why: "验收没有可运行命令",
  },
  {
    key: "冲突优先级 priority",
    ok: /^##\s*冲突优先级/m.test(text) && /(以.*为准|优先|高于)/.test(text),
    why: "没有声明冲突时谁说了算",
  },
];

let passed = 0;
for (const c of checks) {
  console.log(`${c.ok ? "PASS" : "FAIL"} ${c.key}${c.ok ? "" : " — " + c.why}`);
  if (c.ok) passed += 1;
}
console.log(`summary: ${passed}/${checks.length} dimensions executable`);
process.exit(passed === checks.length ? 0 : 1);
