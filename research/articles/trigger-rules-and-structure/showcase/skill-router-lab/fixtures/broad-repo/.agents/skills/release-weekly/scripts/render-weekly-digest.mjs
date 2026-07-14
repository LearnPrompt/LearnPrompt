#!/usr/bin/env node

import fs from "node:fs";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: render-weekly-digest.mjs <release-notes.json>");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const entries = Array.isArray(payload.entries) ? payload.entries : [];

if (entries.length < 2) {
  console.error("Need at least two entries to render a weekly digest.");
  process.exit(2);
}

console.log("SKILL_USED: release-weekly");
console.log("# 本周发布摘要");
console.log("");
for (const entry of entries) {
  console.log(`- ${entry.version}: ${entry.summary}`);
}
