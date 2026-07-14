#!/usr/bin/env node
// AI 新闻雷达 —— 冻结后的最小可运行切片。
// 只做一件事：读本地 feed.json，按关注标签打分、去重、取 Top N，输出 Markdown 摘要。
// 明确不做：抓取、多平台接入、Web UI、登录、定时。这些都在 backlog。

import { readFileSync } from "node:fs";

// 关注的标签即“用户价值”的可执行定义：我只想盯住这几类，别的先不看。
const WATCH = new Set(["anthropic", "openai", "coding-agent", "model-release"]);

function die(message) {
  // 失败态必须显式：写到 stderr 并以非零码退出，方便接进验收脚本。
  console.error(`radar: ${message}`);
  process.exit(1);
}

function parseTopArg(argv) {
  const index = argv.indexOf("--top");
  if (index === -1) return 3;
  const n = Number(argv[index + 1]);
  if (!Number.isInteger(n) || n <= 0) die("--top 需要正整数");
  return n;
}

const feedPath = process.argv[2];
if (!feedPath) die("用法：node radar.mjs <feed.json> [--top N]");

let raw;
try {
  raw = readFileSync(feedPath, "utf8");
} catch {
  die(`读不到输入文件：${feedPath}`);
}

let items;
try {
  items = JSON.parse(raw);
} catch {
  die("feed.json 不是合法 JSON");
}
if (!Array.isArray(items)) die("feed.json 顶层必须是数组");

const top = parseTopArg(process.argv);

// 输入契约：每条必须有 title / source / tags。缺字段直接判为坏数据。
const seen = new Set();
const scored = [];
for (const [i, it] of items.entries()) {
  if (!it || typeof it.title !== "string" || typeof it.source !== "string" || !Array.isArray(it.tags)) {
    die(`第 ${i} 条数据字段不完整（需要 title/source/tags）`);
  }
  const key = it.title.trim().toLowerCase();
  if (seen.has(key)) continue; // 去重：同标题只保留第一次出现
  seen.add(key);
  const score = it.tags.filter((t) => WATCH.has(t)).length;
  if (score > 0) scored.push({ ...it, score });
}

scored.sort((a, b) => b.score - a.score || b.published.localeCompare(a.published));
const picked = scored.slice(0, top);

if (picked.length === 0) die("没有命中任何关注标签，摘要为空");

// 输出：一份可直接粘贴的 Markdown 摘要。
const lines = [`# AI 新闻雷达 · Top ${picked.length}`, ""];
for (const it of picked) {
  lines.push(`- **${it.title}** — ${it.source}（命中 ${it.score} 个关注标签）`);
  lines.push(`  ${it.url}`);
}
process.stdout.write(lines.join("\n") + "\n");
