#!/usr/bin/env node

// 把“项目开工清单”从散文变成一道确定性闸门。
// 读取一份扁平 YAML 项目卡，检查六个必填字段是否存在、是否非空、
// 是否满足结构要求（禁改目录必须显式列出、验收必须是可执行命令）。
// 缺任何一项就以非零状态退出，方便接入 CI 或 pre-flight 检查。

import { readFileSync } from "node:fs";

// 六个必填字段，对应文章正文“六格项目卡”一节。
const REQUIRED = [
  { key: "repo_and_branch", label: "仓库与当前分支" },
  { key: "run_and_check", label: "运行方式与最快检查" },
  { key: "boundaries", label: "允许与禁改目录", list: ["allow", "forbid"] },
  { key: "secrets", label: "密钥提供方式" },
  { key: "acceptance", label: "验收命令", command: true },
  { key: "rollback", label: "回滚方式" },
];

// 极小 YAML 子集解析：只支持 `key: value`、`key:` 后跟 `  sub: value`
// 或 `  - item`。项目卡是扁平结构，不需要通用 YAML 库。
function parseCard(text) {
  const root = {};
  let currentKey = null;
  let currentObj = null;
  let currentList = null;
  for (const rawLine of text.split("\n")) {
    const line = rawLine.replace(/\s+#.*$/, "");
    if (!line.trim()) continue;
    const top = line.match(/^([a-z_]+):\s*(.*)$/);
    if (top) {
      currentKey = top[1];
      const value = top[2].trim();
      if (value) {
        root[currentKey] = value;
        currentObj = null;
        currentList = null;
      } else {
        currentObj = {};
        currentList = null;
        root[currentKey] = currentObj;
      }
      continue;
    }
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentKey) {
      if (!Array.isArray(root[currentKey])) {
        root[currentKey] = [];
        currentList = root[currentKey];
        currentObj = null;
      }
      currentList.push(listItem[1].trim());
      continue;
    }
    const sub = line.match(/^\s+([a-z_]+):\s*(.*)$/);
    if (sub && currentObj) {
      const value = sub[2].trim();
      if (value.startsWith("[") && value.endsWith("]")) {
        currentObj[sub[1]] = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      } else {
        currentObj[sub[1]] = value;
      }
      continue;
    }
  }
  return root;
}

function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

const cardPath = process.argv[2];
if (!cardPath) {
  console.error("用法: node verify-checklist.mjs <project-card.yaml>");
  process.exit(2);
}

const card = parseCard(readFileSync(cardPath, "utf8"));
const problems = [];

for (const field of REQUIRED) {
  const value = card[field.key];
  const before = problems.length;
  if (isEmpty(value)) {
    problems.push(`缺失字段 ${field.key}（${field.label}）`);
    continue;
  }
  if (field.list) {
    for (const sub of field.list) {
      if (isEmpty(value?.[sub])) {
        problems.push(`字段 ${field.key} 缺少子项 ${sub}`);
      }
    }
  }
  if (field.command) {
    // 验收必须是能真正跑起来的命令，而不是“手动看一下”这类空话。
    const looksLikeCommand = /(npm|pnpm|yarn|node|make|bash|sh|python|pytest|cargo|go|deno)\b/.test(
      String(value),
    );
    if (!looksLikeCommand) {
      problems.push(`字段 ${field.key} 不是可执行命令：${value}`);
    }
  }
  if (problems.length === before) {
    const shown = field.command ? value : "已填写";
    console.log(`PASS ${field.key}: ${shown}`);
  }
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`FAIL ${problem}`);
  console.error(`FAIL summary: ${problems.length} 项未通过，项目卡不完整`);
  process.exit(1);
}

console.log(`PASS summary: ${REQUIRED.length}/${REQUIRED.length} 项开工清单字段齐全`);
