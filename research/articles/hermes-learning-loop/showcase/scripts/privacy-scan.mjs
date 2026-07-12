#!/usr/bin/env node
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const targets = ["reports", "results"];
const patterns = [
  /(?:^|[\s="'(:`])(?:file:\/\/)?(?:\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/|\/private\/tmp\/|\/tmp\/|\/var\/folders\/[^/\s]+\/[^/\s]+\/T\/)/im,
  /\b(?:session|thread|turn|item|request)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  /\b(?:account[ _-]?id|chatgpt-account-id)\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  /(?:\bs[k]-[A-Za-z0-9_-]{16,}|\bgh[pousr]_[A-Za-z0-9]{20,}|\bxox[baprs]-[A-Za-z0-9-]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/i,
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).flatMap((name) => {
    const file = path.join(directory, name);
    return fs.statSync(file).isDirectory() ? walk(file) : [file];
  });
}

for (const directory of targets) {
  for (const file of walk(path.join(root, directory))) {
    const content = fs.readFileSync(file);
    if (content.includes(0)) continue;
    const text = content.toString("utf8");
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        console.error(`FAIL privacy scan: ${path.relative(root, file).split(path.sep).join("/")}`);
        process.exit(1);
      }
    }
  }
}

console.log("PASS privacy scan: reports/results contain no credential, runtime id, account id, or local absolute path leakage");
