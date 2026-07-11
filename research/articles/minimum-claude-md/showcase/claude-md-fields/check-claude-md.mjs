#!/usr/bin/env node
// check-claude-md.mjs
//
// 这是一个「字段完整度」静态检查器，不是模型遵循度实验。
// 它只回答一个问题：一份 CLAUDE.md 是否写清了五类「让下一轮少踩坑」的必要信息，
// 而且写得足够具体（有真实命令、有真实路径），而不是空泛口号。
// 它无法证明 Claude 会不会真的遵守——那需要一次真实运行，见 README 的第二个实验。
//
// 用法：node check-claude-md.mjs <path-to-CLAUDE.md>
// 退出码：五类全部通过为 0；任一缺失或过于空泛为 1。

import { readFileSync } from "node:fs";

const target = process.argv[2];
if (!target) {
  console.error("用法: node check-claude-md.mjs <path-to-CLAUDE.md>");
  process.exit(2);
}

const text = readFileSync(target, "utf8");
const lines = text.split("\n");

// 具体命令的信号：出现真实可执行的命令 token，而不是「运行测试」这类空话。
const COMMAND_TOKEN =
  /(?:npm |pnpm |yarn |npx |make\b|cargo |go (?:run|build|test)|pytest\b|python |node |ruff\b|eslint\b|vitest\b|jest\b|go test)/;
// 真实路径的信号：出现看得见的目录/文件路径。
const PATH_TOKEN = /(?:`[^`]*\/[^`]*`|\b[\w.-]+\/[\w./*-]+)/;

// 从 fenced code block 里抽出正文，命令类判断主要看代码块。
const codeBlocks = [...text.matchAll(/```[\s\S]*?```/g)].map((m) => m[0]);
const codeText = codeBlocks.join("\n");

function hasSection(pattern) {
  return lines.some((line) => /^#{1,6}\s/.test(line) && pattern.test(line));
}

const checks = [
  {
    key: "真实命令",
    hint: "写出项目真实命令（如 `npm run build`），不要只写「运行测试」",
    pass:
      (hasSection(/(command|命令|构建|测试|build|test|script)/i) ||
        COMMAND_TOKEN.test(text)) &&
      COMMAND_TOKEN.test(codeText || text),
  },
  {
    key: "允许修改范围",
    hint: "说明允许改哪里、先报计划（如「只改计划中列出的文件」）",
    pass:
      /(只改|仅改|允许修改|先说明.*文件|state the files|only edit|small,? reviewable diffs|最小改动|计划)/i.test(
        text,
      ),
  },
  {
    key: "禁区",
    hint: "点名不能碰的路径（如 `.env`、`secrets/`、部署配置）",
    pass:
      /(do not edit|不要(?:修改|编辑|碰|删除)|never (?:commit|touch|edit|print)|禁止|禁区)/i.test(
        text,
      ) && PATH_TOKEN.test(text),
  },
  {
    key: "最快验收",
    hint: "指定改完后跑哪个最快的检查命令来验收",
    pass:
      /(验证|验收|verify|check|跑(?:一下)?(?:构建|测试|检查)|run the (?:fastest|relevant))/i.test(
        text,
      ) && COMMAND_TOKEN.test(codeText || text),
  },
  {
    key: "输出收尾",
    hint: "要求结尾汇报改了哪些文件、跑了哪些命令、还剩什么风险",
    pass:
      /(summariz|总结|汇报|列出(?:改动|修改)|changed files|report (?:the )?(?:files|changes)|结尾.*(?:文件|命令)|remaining risk|未解决)/i.test(
        text,
      ),
  },
];

let failures = 0;
console.log(`检查文件: ${target}`);
console.log(`总行数: ${lines.length}`);
console.log("----");
for (const check of checks) {
  const mark = check.pass ? "PASS" : "FAIL";
  if (!check.pass) failures += 1;
  console.log(`${mark}  ${check.key}`);
  if (!check.pass) console.log(`      建议: ${check.hint}`);
}
console.log("----");
if (failures === 0) {
  console.log(`结果: 5/5 类必要信息齐全`);
  process.exit(0);
} else {
  console.log(`结果: 缺 ${failures} 类必要信息（这只是字段完整度，不代表模型一定遵守）`);
  process.exit(1);
}
