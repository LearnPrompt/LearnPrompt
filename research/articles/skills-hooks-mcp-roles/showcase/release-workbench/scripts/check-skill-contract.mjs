#!/usr/bin/env node
// 机械契约检查：证明“重复工作流 -> Skill”。
// 1) SKILL.md 是否真的固化了可复用的多步流程（有 name/description、固定步骤、输出契约）。
// 2) 一份生成的发布摘要是否满足输出契约。
// 只做机械字段检查，不询问模型“看起来是否完整”。

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

function fail(msg) {
  console.log(`FAIL ${msg}`);
  process.exitCode = 1;
}

// --- 1. 校验 SKILL.md 固化了流程 ---
const skillPath = path.join(root, "skills", "release-brief", "SKILL.md");
const skill = readFileSync(skillPath, "utf8");

const fmMatch = skill.match(/^---\n([\s\S]*?)\n---/);
const frontmatter = fmMatch ? fmMatch[1] : "";
if (!/^name:\s*release-brief\s*$/m.test(frontmatter) || !/^description:\s*.+$/m.test(frontmatter)) {
  fail("SKILL.md 缺少 name/description frontmatter");
}

const requiredSteps = ["读 issue", "读 diff", "归类改动", "评估风险", "写验证步骤"];
const missingSteps = requiredSteps.filter((s) => !skill.includes(s));
if (missingSteps.length) fail(`SKILL.md 固定步骤缺失: ${missingSteps.join("、")}`);

const requiredContractFields = ["issue", "summary", "change_type", "risk", "verification"];
const missingContract = requiredContractFields.filter((f) => !skill.includes(`\`${f}\``));
if (missingContract.length) fail(`SKILL.md 输出契约字段缺失: ${missingContract.join("、")}`);

// --- 2. 校验一份生成的发布摘要满足契约 ---
const briefPath = path.join(root, "fixtures", "release-brief-output.json");
let brief;
try {
  brief = JSON.parse(readFileSync(briefPath, "utf8"));
} catch (e) {
  fail(`发布摘要 JSON 无法解析: ${e.message}`);
  brief = {};
}

for (const field of requiredContractFields) {
  if (!(field in brief)) fail(`发布摘要缺少字段: ${field}`);
}
if (brief.change_type && !["fix", "feature", "refactor"].includes(brief.change_type)) {
  fail(`change_type 非法: ${brief.change_type}`);
}
if (!Array.isArray(brief.verification) || brief.verification.length < 1) {
  fail("verification 必须是至少一条命令的数组");
}
if (brief.issue && brief.issue !== "LP-42") {
  fail(`发布摘要 issue 与 fixture 不一致: ${brief.issue}`);
}

if (!process.exitCode) {
  console.log("PASS skill: SKILL.md 固化了 5 步可复用流程");
  console.log("PASS skill: 发布摘要满足输出契约 (issue/summary/change_type/risk/verification)");
  console.log(`PASS skill: change_type=${brief.change_type}, verification=${brief.verification.length} 条`);
}
