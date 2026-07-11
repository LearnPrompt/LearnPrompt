import { test } from "node:test";
import assert from "node:assert/strict";
import { splitEvenly } from "./split-bill.mjs";

test("整除时人人相等", () => {
  assert.deepEqual(splitEvenly(10000, 4), [2500, 2500, 2500, 2500]);
});

test("最快检查：任何拆分结果之和必须严格等于总额（守恒）", () => {
  for (const [total, people] of [[10000, 3], [10001, 7], [1, 3], [99, 4]]) {
    const parts = splitEvenly(total, people);
    const sum = parts.reduce((a, b) => a + b, 0);
    assert.equal(sum, total, `sum(${parts}) 应为 ${total}，实际 ${sum}`);
    assert.equal(parts.length, people, "数组长度应等于人数");
  }
});

test("相邻两人差额不超过 1 分", () => {
  const parts = splitEvenly(10001, 7);
  assert.ok(Math.max(...parts) - Math.min(...parts) <= 1, "分配应尽量均匀");
});
