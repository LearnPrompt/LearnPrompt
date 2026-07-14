#!/usr/bin/env node
// 验收脚本：把“怎么算完成”写成确定性检查，而不是靠肉眼看。
// 它执行冻结任务卡里的验收动作，全绿才退出 0。

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const radar = fileURLToPath(new URL("./radar.mjs", import.meta.url));
const feed = fileURLToPath(new URL("./feed.json", import.meta.url));
const emptyFeed = fileURLToPath(new URL("./empty-feed.json", import.meta.url));
const missingFeed = fileURLToPath(new URL("./does-not-exist.json", import.meta.url));

let passed = 0;
let failed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
    passed += 1;
  } catch (e) {
    console.log(`FAIL ${name}: ${e.message}`);
    failed += 1;
  }
}

function run(args) {
  return execFileSync(process.execPath, [radar, ...args], {
    cwd: here,
    encoding: "utf8",
  });
}

// 1. 正常路径：Top 3 恰好三条，且带来源和链接。
check("Top 3 恰好输出三条并含来源", () => {
  const out = run([feed, "--top", "3"]);
  const bullets = out.split("\n").filter((l) => l.startsWith("- "));
  if (bullets.length !== 3) throw new Error(`期望 3 条，实际 ${bullets.length}`);
  if (!/命中 \d+ 个关注标签/.test(out)) throw new Error("缺少来源/评分信息");
});

// 2. 去重：重复标题的“Anthropic 发布 Claude 新模型”只出现一次。
check("重复标题被去重", () => {
  const out = run([feed, "--top", "10"]);
  const hits = (out.match(/Anthropic 发布 Claude 新模型/g) || []).length;
  if (hits !== 1) throw new Error(`重复标题出现 ${hits} 次`);
});

// 3. 失败态：输入文件缺失应非零退出并给出可读错误。
check("缺失输入文件时非零退出", () => {
  try {
    run([missingFeed]);
    throw new Error("应当失败却成功了");
  } catch (e) {
    if (!e.status) throw new Error("退出码不是非零");
    if (!/读不到输入文件/.test(e.stderr || "")) throw new Error("缺少可读错误信息");
  }
});

// 4. 失败态：命中为空时非零退出（使用只读静态 fixture）。
check("零命中时非零退出", () => {
  try {
    run([emptyFeed]);
    throw new Error("应当失败却成功了");
  } catch (e) {
    if (!e.status) throw new Error("退出码不是非零");
  }
});

console.log(`\nsummary: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
