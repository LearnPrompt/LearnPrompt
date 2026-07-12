import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const articleRoot = path.resolve(scriptDir, "../../..");

const RULES = [
  {
    label: "runtime identifier",
    pattern:
      /\b(?:session|thread|turn|item|request|run)[ _-]?id\b["']?\s*[:=]\s*["']?[A-Za-z0-9][A-Za-z0-9_-]{7,}/i
  },
  {
    label: "absolute local path",
    pattern:
      /(?:^|[\s="'(:`])(?:file:\/\/)?(?:\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/|\/private\/tmp\/|\/tmp\/|\/var\/folders\/[^/\s]+\/[^/\s]+\/T\/)/im
  },
  {
    label: "credential-shaped secret",
    pattern:
      /(?:\bsk-ant-[A-Za-z0-9_-]{16,}|\bsk-[A-Za-z0-9_-]{16,}|\bgh[pousr]_[A-Za-z0-9]{20,}|\bBearer\s+(?!REDACTED\b|YOUR_|<|\$|\{|\[)[A-Za-z0-9._~+/-]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/i
  }
];

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function readTextCandidate(file) {
  const content = readFileSync(file);
  if (content.includes(0)) return null;
  return content.toString("utf8");
}

const failures = [];
for (const file of walk(articleRoot)) {
  const text = readTextCandidate(file);
  if (text === null) continue;
  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      failures.push(`${rule.label}: ${path.relative(articleRoot, file)}`);
    }
  }
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(
  `privacy_scan: PASS\ntarget: research/articles/thinking-distillation-boundary\nfiles_checked: ${walk(articleRoot).length}\n`,
);
