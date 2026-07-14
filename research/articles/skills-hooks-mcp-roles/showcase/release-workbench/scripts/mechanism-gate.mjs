#!/usr/bin/env node
// 机制选择闸门：把文章的决策树变成机械检查。
// 依据三个问题判断应选机制，并拒绝错误包装。
//   Q1 external_system_or_data? -> MCP
//   Q2 event_timing_guarantee?  -> Hook
//   Q3 repeatable_workflow?     -> Skill
// 设计红线：声明 mcp 但不访问任何外部系统/数据 -> 一律 REJECT
//   （把纯本地固定流程错误包装成 MCP 会被这条闸门挡下）。
//
// 用法: node mechanism-gate.mjs <spec.json>
// 退出码: 0 = ACCEPT, 3 = REJECT, 2 = 输入错误

import { readFileSync } from "node:fs";

const specPath = process.argv[2];
if (!specPath) {
  console.log("ERR 需要一个 spec 路径参数");
  process.exit(2);
}

let spec;
try {
  spec = JSON.parse(readFileSync(specPath, "utf8"));
} catch (e) {
  console.log(`ERR spec 无法解析: ${e.message}`);
  process.exit(2);
}

const needs = spec.needs ?? {};
const declared = spec.declared_mechanism;

function recommend(n) {
  if (n.external_system_or_data) return "mcp";
  if (n.event_timing_guarantee) return "hook";
  if (n.repeatable_workflow) return "skill";
  return "none";
}

const rec = recommend(needs);
const label = spec.task ?? "(未命名任务)";

// 设计红线优先。
if (declared === "mcp" && !needs.external_system_or_data) {
  console.log(`REJECT [${label}]`);
  console.log("  原因: 声明为 MCP，但该任务不访问任何外部系统或数据。");
  console.log("  正解: 这是纯本地固定流程，应固化为 Skill；上 MCP 只会平白增加进程、信任与凭据边界。");
  console.log(`  建议机制: ${rec}`);
  process.exit(3);
}

if (declared !== rec) {
  console.log(`REJECT [${label}]`);
  console.log(`  原因: 声明机制=${declared}，与需求推导出的机制=${rec} 不符。`);
  process.exit(3);
}

console.log(`ACCEPT [${label}]`);
console.log(`  声明机制=${declared} 与需求推导一致。`);
process.exit(0);
