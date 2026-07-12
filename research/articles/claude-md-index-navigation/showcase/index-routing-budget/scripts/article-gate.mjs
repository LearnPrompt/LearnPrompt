#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const article = "starlight/src/content/docs/obsidian-ai/claude-md-index-navigation.mdx";
const research = "research/articles/claude-md-index-navigation";
const mdx = fs.readFileSync(article, "utf8");
const review = fs.readFileSync(path.join(research, "review.md"), "utf8");
const requiredArticle = [
  "showcase_status: verified",
  "quality_score: 100",
  "research_path: research/articles/claude-md-index-navigation",
  "showcase_path: research/articles/claude-md-index-navigation/showcase/index-routing-budget",
  "## 读完你能做什么",
  "## 来源与延伸阅读",
  "/images/articles/claude-md-index-navigation/index-routing-budget.svg",
];
const requiredReview = [
  "## 终审结论：PASS 100/100",
  "未关闭问题：blocker 0 / major 0 / minor 0",
  "## 最终视觉终审：PASS",
  "最终状态：PASS",
];
const missing = [
  ...requiredArticle.filter((needle) => !mdx.includes(needle)),
  ...requiredReview.filter((needle) => !review.includes(needle)),
];

if (mdx.includes("SourceCard")) missing.push("public MDX must not contain SourceCard");
for (const rel of [
  "brief.md",
  "horizontal-research.md",
  "vertical-research.md",
  "evidence-ledger.md",
  "asset-ledger.md",
  "control-verification.md",
  "release-gate-result.txt",
  "review.md",
]) {
  if (!fs.existsSync(path.join(research, rel))) missing.push(rel);
}

if (missing.length) {
  console.error(`FAIL article gate\n${missing.join("\n")}`);
  process.exit(1);
}

console.log("PASS article gate: verified metadata, source policy, image, research files, and independent review present");
