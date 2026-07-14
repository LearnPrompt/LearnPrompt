import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate } from "../src/format-date.mjs";

// 验收标准：把 Date 转成机器可解析的 YYYY-MM-DD，纯函数，不改动入参。
test("returns ISO calendar date YYYY-MM-DD", () => {
  assert.equal(formatDate(new Date("2026-07-11T09:30:00Z")), "2026-07-11");
});

test("pads single-digit month and day", () => {
  assert.equal(formatDate(new Date("2026-03-05T00:00:00Z")), "2026-03-05");
});

test("does not mutate the input date", () => {
  const d = new Date("2026-12-31T12:00:00Z");
  const before = d.getTime();
  formatDate(d);
  assert.equal(d.getTime(), before);
});
