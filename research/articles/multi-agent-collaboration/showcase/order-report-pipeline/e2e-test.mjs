#!/usr/bin/env node
// e2e-test.mjs —— 端到端测试：合并两个 worker 的产物后，整条管线是否产出预期结果。
//
// 它把 parser 和 renderer 串起来跑一遍真实 fixture，
// 再和冻结的 golden 输出逐字节比较。这是「合并之后」的验收，
// 不是「合并之前」的门禁——两者分工不同：门禁挡冲突，e2e 证结果。
//
// 退出码：0 PASS；1 FAIL。

import { readFileSync } from "node:fs";
import path from "node:path";
import { parseOrders } from "./src/parse-orders.mjs";
import { renderSummary } from "./src/render-summary.mjs";

const root = path.dirname(new URL(import.meta.url).pathname);
const csv = readFileSync(path.join(root, "fixtures/orders.csv"), "utf8");
const expected = readFileSync(path.join(root, "fixtures/expected-summary.md"), "utf8");

const actual = renderSummary(parseOrders(csv));

console.log("端到端测试：CSV → parser → renderer → Markdown");
console.log("----");
if (actual.trim() === expected.trim()) {
  console.log("PASS  管线输出与冻结 golden 一致");
  process.exit(0);
} else {
  console.log("FAIL  管线输出与 golden 不一致");
  console.log("--- expected ---");
  console.log(expected);
  console.log("--- actual ---");
  console.log(actual);
  process.exit(1);
}
