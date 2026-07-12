#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ensureDirs, resultsDir, showcaseRoot, walk } from "./change-gate-lib.mjs";

ensureDirs();

const deny = [
  /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  /\bBearer\s+[A-Za-z0-9._-]{16,}/i,
  /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"]?[A-Za-z0-9_./+=-]{16,}/i,
  /\bsession[_-]?id\s*[:=]\s*['"]?[A-Za-z0-9._-]{12,}/i,
  /\/Users\/[^/\s]+/,
  /\/private\/tmp\/[^\s)]+/,
  /\/var\/folders\/[^\s)]+/
];

const failures = [];
for (const relative of walk(showcaseRoot)) {
  if (relative.startsWith("node_modules/")) continue;
  const text = readFileSync(path.join(showcaseRoot, relative), "utf8");
  if (deny.some((pattern) => pattern.test(text))) failures.push(relative);
}

const output = failures.length
  ? `FAIL privacy scan\n${failures.join("\n")}\n`
  : "PASS privacy scan: no secrets, account identifiers, user paths, or runtime temp paths in committed artifacts\n";

writeFileSync(path.join(resultsDir, "privacy-scan.txt"), output);
process.stdout.write(output);
process.exit(failures.length ? 1 : 0);
