#!/usr/bin/env node
// src/render-summary.mjs —— Worker B 独占的文件。
//
// 职责：把「符合冻结 contract」的汇总对象渲染成 Markdown。
// 它只依赖 contract 约定的字段，不关心 CSV 长什么样，也不修改 contract。
// Worker B 的 write set 只有这一个文件：src/render-summary.mjs。

export function renderSummary(summary) {
  const statusLines = Object.keys(summary.by_status)
    .sort()
    .map((status) => `| ${status} | ${summary.by_status[status]} |`)
    .join("\n");

  return [
    `# 订单汇总`,
    ``,
    `- 币种：${summary.currency}`,
    `- 订单数：${summary.order_count}`,
    `- 总金额：${summary.total_amount.toFixed(2)}`,
    ``,
    `| 状态 | 数量 |`,
    `| --- | --- |`,
    statusLines,
    ``,
  ].join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import("node:fs");
  const target = process.argv[2];
  const summary = JSON.parse(readFileSync(target, "utf8"));
  process.stdout.write(renderSummary(summary));
}
