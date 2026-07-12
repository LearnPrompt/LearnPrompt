import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const fileIndex = process.argv.indexOf("--file");
if (fileIndex === -1 || !process.argv[fileIndex + 1]) {
  throw new Error("Usage: node scripts/repair-frontmatter.mjs --file <path>");
}

const filePath = path.resolve(process.argv[fileIndex + 1]);
const original = readFileSync(filePath, "utf8");
const updated = original.replace("  order: later", "  order: 7");
writeFileSync(filePath, updated);
process.stdout.write(
  `${JSON.stringify({ file: process.argv[fileIndex + 1], changed: true, reason: "intentional broken candidate for holdout-fail gate" })}\n`
);
