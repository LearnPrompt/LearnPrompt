#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const patterns = [
  /\b(?:session|thread|turn|item|request)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  /\b(?:account[ _-]?id|chatgpt-account-id)\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  /(?:^|[\s="'(:`])(?:file:\/\/)?(?:\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/|\/private\/tmp\/|\/tmp\/|\/var\/folders\/[^/\s]+\/[^/\s]+\/T\/)/im,
  /(?:\bsk-[A-Za-z0-9_-]{16,}|\bgh[pousr]_[A-Za-z0-9]{20,}|\bBearer\s+(?!REDACTED\b|YOUR_|<|\$|\{|\[)[A-Za-z0-9._~+/-]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/i
];

function walk(directory) {
  const files = [];
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) files.push(...walk(file));
    else files.push(file);
  }
  return files;
}

for (const file of walk(root)) {
  const content = readFileSync(file);
  if (content.includes(0)) continue;
  const text = content.toString("utf8");
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      console.error(`FAIL privacy scan: ${path.relative(root, file).split(path.sep).join("/")}`);
      process.exit(1);
    }
  }
}

console.log("PASS privacy scan: no credential, runtime id, account id, or local absolute path leakage found.");

