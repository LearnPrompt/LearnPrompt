#!/usr/bin/env node
// 模糊反馈通道：只回一个布尔式结论，吞掉所有定位信息。
// 代表“全站构建只说失败了”这类粗颗粒信号。
import { spawnSync } from "node:child_process";
const r = spawnSync("node", ["--test", "repo/test/slugify.test.mjs"], { encoding: "utf8" });
if (r.status === 0) {
  console.log("PASS: 构建通过");
  process.exit(0);
}
console.log("FAIL: 构建未通过（无更多信息）");
process.exit(1);
