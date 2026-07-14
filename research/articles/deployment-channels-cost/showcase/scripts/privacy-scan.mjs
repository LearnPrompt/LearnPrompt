#!/usr/bin/env node
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const patterns = [
  /(?:^|[\s="'(:`])(?:file:\/\/)?(?:\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/|\/private\/tmp\/|\/var\/folders\/[^/\s]+\/[^/\s]+\/T\/)/im,
  /\b(?:session|thread|turn|item|request)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  /\baccount[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  /(?:\bs[k]-[A-Za-z0-9_-]{16,}|\bgh[pousr]_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/i,
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).flatMap((name) => {
    const file = path.join(directory, name);
    return fs.statSync(file).isDirectory() ? walk(file) : [file];
  });
}
for (const area of ["reports", "results"]) {
  for (const file of walk(path.join(root, area))) {
    const bytes = fs.readFileSync(file);
    if (bytes.includes(0)) continue;
    const text = bytes.toString("utf8");
    if (patterns.some((pattern) => pattern.test(text))) {
      console.error(`FAIL privacy scan: ${path.relative(root, file).split(path.sep).join("/")}`);
      process.exit(1);
    }
  }
}
console.log("PASS privacy 0: no credential, runtime id, account id, or local absolute path in reports/results");
