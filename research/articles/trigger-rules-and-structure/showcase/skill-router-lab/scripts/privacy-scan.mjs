#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const slash = "/";
const usersPrefix = `${slash}Users${slash}`;
const privateTmpPrefix = `${slash}private${slash}tmp${slash}`;
const tmpPrefix = `${slash}tmp${slash}`;

const rules = [
  new RegExp(`${usersPrefix}[^/\\s]+`, "i"),
  new RegExp(`${privateTmpPrefix}[^\\s"]+`, "i"),
  new RegExp(`${tmpPrefix}[^\\s"]+`, "i"),
  /\b(?:session|thread|turn|request|item)[ _-]?id\b[:=]\s*["']?[A-Za-z0-9_-]{8,}/i,
  /\bsk-[A-Za-z0-9_-]{16,}\b/i,
];

function walk(dir) {
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) entries.push(...walk(full));
    else entries.push(full);
  }
  return entries;
}

for (const file of walk(root)) {
  const buffer = fs.readFileSync(file);
  if (buffer.includes(0)) continue;
  const text = buffer.toString("utf8");
  for (const pattern of rules) {
    if (pattern.test(text)) {
      console.error(`FAIL privacy scan: ${path.relative(root, file)}`);
      process.exit(1);
    }
  }
}

console.log("PASS privacy scan");
