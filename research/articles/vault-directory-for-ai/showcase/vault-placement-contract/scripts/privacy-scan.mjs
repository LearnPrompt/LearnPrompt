import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ignoredDirs = new Set(["scripts"]);
const blockedPatterns = [
  { label: "user-home-path", regex: /\/Users\/[^/\s]+/g },
  { label: "tmp-worktree-path", regex: /\/private\/tmp\/[^\s]+/g },
  { label: "var-folders-path", regex: /\/private\/var\/folders\/[^\s]+/g },
  { label: "bearer-token", regex: /Bearer\s+[A-Za-z0-9._-]+/g },
  { label: "api-key", regex: /\bsk-[A-Za-z0-9]+\b/g },
  { label: "runtime-id", regex: /\b(session|thread|request|item)_[A-Za-z0-9-]+\b/g },
  { label: "authorization-header", regex: /Authorization:\s*[^\n]+/g },
];

const ignore = new Set([".gitkeep"]);
const findings = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (ignore.has(name)) {
      continue;
    }
    const fullPath = join(dir, name);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (ignoredDirs.has(relative(root, fullPath))) {
        continue;
      }
      walk(fullPath);
      continue;
    }
    const text = readFileSync(fullPath, "utf8");
    for (const pattern of blockedPatterns) {
      if (pattern.regex.test(text)) {
        findings.push(`${relative(root, fullPath)} -> ${pattern.label}`);
      }
      pattern.regex.lastIndex = 0;
    }
  }
}

walk(root);

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log("PASS privacy scan: no credential, runtime id, or local absolute path leakage found.");
