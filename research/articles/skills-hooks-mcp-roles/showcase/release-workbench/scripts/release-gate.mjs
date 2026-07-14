#!/usr/bin/env node
// release-workbench 总验证器。
// 一次性证明四件事，并把每一步的命令、关键输出和退出码打印出来：
//   [A] 重复流程 -> Skill 契约 PASS
//   [B] 危险时点 -> Hook 对 git push 返回 deny；对安全命令 npm test 不作决定（静默）
//   [C] 外部 issue -> MCP 子进程可取到 LP-42 数据
//   [D] 反例 -> 把纯本地固定流程错误包装成 MCP，被机制闸门 REJECT
// 只有全部符合预期，本脚本才以退出码 0 结束。

import { spawnSync, execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const node = process.execPath;

const results = [];
function record(ok, label, detail) {
  results.push({ ok, label });
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (detail) for (const line of detail.split("\n")) console.log(`     ${line}`);
}

function rel(p) {
  return path.relative(root, p);
}

// [A] Skill 契约
{
  const script = path.join(here, "check-skill-contract.mjs");
  const r = spawnSync(node, [script], { encoding: "utf8" });
  const ok = r.status === 0 && /PASS skill: 发布摘要满足输出契约/.test(r.stdout);
  record(ok, `[A] Skill 契约检查 (exit ${r.status})`,
    `命令: node ${rel(script)}\n${r.stdout.trim()}`);
}

// [B] Hook：git push -> deny
{
  const hook = path.join(root, "hooks", "pre-tool-use.mjs");
  const event = path.join(root, "fixtures", "hook-events", "git-push.json");
  const r = spawnSync(node, [hook], { input: readFileSync(event), encoding: "utf8" });
  let decision = "";
  try {
    decision = JSON.parse(r.stdout).hookSpecificOutput?.permissionDecision ?? "";
  } catch { /* ignore */ }
  const ok = r.status === 0 && decision === "deny";
  record(ok, `[B1] Hook 对 git push 返回 deny (exit ${r.status})`,
    `命令: node ${rel(hook)} < ${rel(event)}\n输出: ${r.stdout.trim()}`);
}

// [B] Hook：npm test -> 静默、无决定
{
  const hook = path.join(root, "hooks", "pre-tool-use.mjs");
  const event = path.join(root, "fixtures", "hook-events", "npm-test.json");
  const r = spawnSync(node, [hook], { input: readFileSync(event), encoding: "utf8" });
  const ok = r.status === 0 && r.stdout.trim() === "";
  record(ok, `[B2] Hook 对 npm test 不作决定/静默放行 (exit ${r.status})`,
    `命令: node ${rel(hook)} < ${rel(event)}\n输出: <空> (交回正常权限流程；静默 != 预先批准)`);
}

// [C] MCP：子进程取回 LP-42
{
  const harness = path.join(root, "mcp", "client-harness.mjs");
  const r = spawnSync(node, [harness], { encoding: "utf8" });
  const ok = r.status === 0 && /取回 LP-42/.test(r.stdout);
  record(ok, `[C] MCP 子进程取回外部 issue LP-42 (exit ${r.status})`,
    `命令: node ${rel(harness)}\n${r.stdout.trim()}`);
}

// [D] 反例：本地固定流程包装成 MCP -> REJECT
{
  const gate = path.join(here, "mechanism-gate.mjs");
  const good = path.join(root, "fixtures", "mechanism-specs", "release-brief-as-skill.json");
  const bad = path.join(root, "fixtures", "mechanism-specs", "local-flow-as-mcp.json");

  const rGood = spawnSync(node, [gate, good], { encoding: "utf8" });
  const okGood = rGood.status === 0 && /ACCEPT/.test(rGood.stdout);
  record(okGood, `[D1] 机制闸门放行 Skill 声明 (exit ${rGood.status})`,
    `命令: node ${rel(gate)} ${rel(good)}\n${rGood.stdout.trim()}`);

  const rBad = spawnSync(node, [gate, bad], { encoding: "utf8" });
  const okBad = rBad.status === 3 && /REJECT/.test(rBad.stdout);
  record(okBad, `[D2] 机制闸门拒绝“本地固定流程包装成 MCP” (exit ${rBad.status})`,
    `命令: node ${rel(gate)} ${rel(bad)}\n${rBad.stdout.trim()}`);
}

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(`SUMMARY ${results.length - failed.length}/${results.length} 项符合预期`);
if (failed.length) {
  console.log(`FAIL 未通过: ${failed.map((f) => f.label).join("; ")}`);
  process.exit(1);
}
console.log("PASS release-workbench: 重复流程->Skill、危险时点->Hook、外部数据->MCP、错误包装->被拒 全部符合预期");
