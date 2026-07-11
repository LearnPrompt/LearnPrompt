#!/usr/bin/env node
// src/parse-orders.mjs —— Worker A 独占的文件。
//
// 职责：把订单 CSV 解析成「符合冻结 contract」的汇总对象。
// 它只读 contract 的字段定义，绝不修改 contract 本身。
// Worker A 的 write set 只有这一个文件：src/parse-orders.mjs。

import { readFileSync } from "node:fs";

export function parseOrders(csvText) {
  const lines = csvText.trim().split("\n");
  const header = lines[0].split(",");
  const idx = {
    status: header.indexOf("status"),
    amount: header.indexOf("amount"),
    currency: header.indexOf("currency"),
  };

  let total = 0;
  let currency = "";
  const byStatus = {};
  const rows = lines.slice(1);

  for (const line of rows) {
    const cells = line.split(",");
    const status = cells[idx.status];
    const amount = Number(cells[idx.amount]);
    currency = cells[idx.currency];
    total += amount;
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }

  return {
    currency,
    order_count: rows.length,
    total_amount: Number(total.toFixed(2)),
    by_status: byStatus,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const target = process.argv[2];
  const summary = parseOrders(readFileSync(target, "utf8"));
  process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
}
