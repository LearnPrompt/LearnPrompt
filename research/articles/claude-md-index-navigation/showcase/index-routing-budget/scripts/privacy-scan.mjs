#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articleRoot = path.resolve(__dirname, "..", "..", "..");
const resultsDir = path.join(articleRoot, "showcase", "index-routing-budget", "results");
const publicImageRoot = path.resolve(articleRoot, "..", "..", "..", "starlight", "public", "images", "articles", "claude-md-index-navigation");

const deny = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /Bearer\s+[A-Za-z0-9._-]{20,}/i,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |OPENSSH |EC |)PRIVATE KEY-----/,
  /\/Users\/[A-Za-z0-9._-]+\//,
  /\/private\/tmp\/learnprompt-[^\s)]+/,
  /session[_-]?id\s*[:=]\s*[A-Za-z0-9._-]{8,}/i,
  /thread[_-]?id\s*[:=]\s*[A-Za-z0-9._-]{8,}/i,
  /request[_-]?id\s*[:=]\s*[A-Za-z0-9._-]{8,}/i
];

function listFiles(root) {
  if (!fs.existsSync(root)) return [];
  const out = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) walk(p);
      else out.push(p);
    }
  }
  walk(root);
  return out;
}

const roots = [articleRoot, publicImageRoot];
const findings = [];
for (const file of roots.flatMap(listFiles)) {
  const rel = path.relative(path.resolve(articleRoot, "..", "..", ".."), file).replaceAll("\\", "/");
  const body = fs.readFileSync(file, "utf8");
  for (const pattern of deny) {
    if (pattern.test(body)) findings.push(`${rel}: ${pattern}`);
  }
}

fs.mkdirSync(resultsDir, { recursive: true });
if (findings.length) {
  fs.writeFileSync(path.join(resultsDir, "privacy-scan.txt"), `FAIL\n${findings.join("\n")}\n`);
  console.error(findings.join("\n"));
  process.exit(1);
}

fs.writeFileSync(path.join(resultsDir, "privacy-scan.txt"), "PASS privacy scan: no secrets, local absolute paths, or runtime identifiers found\n");
console.log("PASS privacy scan: no secrets, local absolute paths, or runtime identifiers found");
