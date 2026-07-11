#!/usr/bin/env node
// merge-gate.mjs —— 协调器的合并门禁（确定性，不调用任何模型）。
//
// 它回答一个问题：这一组任务能不能安全地并行合并？
// 判据只有三条，全部为机械检查：
//   1) write set 两两不重叠（没有两个任务改同一个文件）。
//   2) 没有任务把冻结的 contract 列进 write set（contract 单边不可改）。
//   3) 每个任务声明的 contract_checksum 与磁盘上的 contract 实际校验和一致。
// 此外还有一个规划闸门：
//   4) 任一任务 interface_frozen=false 或依赖未满足 → 判定 sequential，不能假装并行。
//
// 用法：node merge-gate.mjs <task-card.json> [<task-card.json> ...]
// 退出码：
//   0  APPROVE PARALLEL —— 可以并行合并
//   3  REJECT CONFLICT  —— write set 重叠或触碰冻结 contract（负例一）
//   4  SEQUENTIAL       —— 接口未冻结/依赖未满足，必须串行（负例二）
//   2  用法错误

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const cardPaths = process.argv.slice(2);
if (cardPaths.length < 2) {
  console.error("用法: node merge-gate.mjs <task-card.json> <task-card.json> [...]");
  process.exit(2);
}

const root = path.dirname(new URL(import.meta.url).pathname);
const cards = cardPaths.map((p) => JSON.parse(readFileSync(p, "utf8")));

function actualChecksum(relPath) {
  const bytes = readFileSync(path.join(root, relPath));
  return createHash("sha256").update(bytes).digest("hex");
}

console.log("协调器合并门禁：order-report-pipeline");
console.log(`参与任务：${cards.map((c) => c.id).join(", ")}`);
console.log("----");

const problems = [];
let verdict = "APPROVE PARALLEL";
let exitCode = 0;

// 规划闸门：任一任务未冻结或依赖未满足 → sequential。
const completed = new Set(); // 本次门禁不假设任何任务已完成
for (const card of cards) {
  if (card.interface_frozen !== true) {
    problems.push(`SEQUENTIAL  ${card.id}: 接口未冻结（interface_frozen=false），不能并行`);
    verdict = "SEQUENTIAL";
    exitCode = 4;
  }
  for (const dep of card.depends_on ?? []) {
    if (!completed.has(dep)) {
      problems.push(`SEQUENTIAL  ${card.id}: 依赖 ${dep} 未满足，必须先串行完成`);
      verdict = "SEQUENTIAL";
      exitCode = 4;
    }
  }
}

// 冲突闸门（优先级高于规划）：触碰冻结 contract 或 write set 重叠 → reject。
const contractPaths = new Set(cards.map((c) => c.contract_path));
for (const card of cards) {
  for (const file of card.write_set) {
    if (contractPaths.has(file)) {
      problems.push(`REJECT  ${card.id}: write set 含冻结 contract ${file}，禁止单边修改`);
      verdict = "REJECT CONFLICT";
      exitCode = 3;
    }
  }
}

const owners = {};
for (const card of cards) {
  for (const file of card.write_set) {
    if (owners[file]) {
      problems.push(`REJECT  写入冲突：${owners[file]} 与 ${card.id} 都要改 ${file}`);
      verdict = "REJECT CONFLICT";
      exitCode = 3;
    } else {
      owners[file] = card.id;
    }
  }
}

// contract 校验和：声明值必须与磁盘一致。
for (const card of cards) {
  const actual = actualChecksum(card.contract_path);
  if (actual !== card.contract_checksum) {
    problems.push(
      `REJECT  ${card.id}: contract 校验和不符（声明 ${card.contract_checksum.slice(0, 12)}…，实际 ${actual.slice(0, 12)}…）`,
    );
    verdict = "REJECT CONFLICT";
    exitCode = 3;
  }
}

if (problems.length === 0) {
  console.log("write set 两两不重叠");
  console.log("无任务触碰冻结 contract");
  console.log("contract 校验和与磁盘一致");
  console.log("所有接口已冻结，依赖已满足");
} else {
  for (const p of problems) console.log(p);
}

console.log("----");
console.log(`判定：${verdict}`);
process.exit(exitCode);
