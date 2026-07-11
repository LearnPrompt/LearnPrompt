#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RULES = [
  {
    label: "runtime identifier",
    pattern:
      /\b(?:session|thread|turn|item|request)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i,
  },
  {
    label: "user home path",
    pattern: /(?:^|[\s="'(:`])(?:file:\/\/)?(?:\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/)/im,
  },
  {
    label: "temporary path",
    pattern: /(?:^|[\s="'(:`])(?:\/private\/tmp\/|\/tmp\/|\/var\/folders\/[^/\s]+\/[^/\s]+\/T\/)/im,
  },
  {
    label: "credential-shaped value",
    pattern:
      /(?:\bsk-[A-Za-z0-9_-]{16,}|\bgh[pousr]_[A-Za-z0-9]{20,}|\bBearer\s+[A-Za-z0-9._~+\/-]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/i,
  },
];

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const next = path.join(directory, entry);
    if (statSync(next).isDirectory()) {
      files.push(...walk(next));
    } else {
      files.push(next);
    }
  }
  return files;
}

function readText(file) {
  const buffer = readFileSync(file);
  if (buffer.includes(0)) {
    return null;
  }
  return buffer.toString("utf8");
}

export function scanDirectory(directory) {
  const findings = [];
  for (const file of walk(directory)) {
    const text = readText(file);
    if (text === null) {
      continue;
    }
    for (const rule of RULES) {
      if (rule.pattern.test(text)) {
        findings.push({
          file: path.relative(directory, file),
          label: rule.label,
        });
      }
    }
  }
  return findings;
}

const scriptFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptFile) {
  const directory = process.argv[2];
  if (!directory) {
    throw new Error("Usage: privacy-scan.mjs <directory>");
  }

  const findings = scanDirectory(directory);
  if (findings.length > 0) {
    for (const finding of findings) {
      console.error(`FAIL ${finding.label}: ${finding.file}`);
    }
    process.exit(1);
  }

  console.log(
    "PASS privacy scan: no runtime IDs, absolute temp paths, user home paths, or credential-shaped values were committed.",
  );
}
