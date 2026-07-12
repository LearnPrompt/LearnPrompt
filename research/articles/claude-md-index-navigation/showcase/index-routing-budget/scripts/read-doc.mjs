#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const vaultRoot = path.join(showcaseRoot, "fixture", "synthetic-vault");

function normalizeRoute(inputPath) {
  const normalized = inputPath.replaceAll("\\", "/").replace(/^\/+/, "");
  if (normalized.includes("..")) {
    throw new Error(`refusing path traversal: ${inputPath}`);
  }
  return normalized;
}

export function readDoc(inputPath, tracePath) {
  const route = normalizeRoute(inputPath);
  const absolute = path.join(vaultRoot, route);
  const relative = path.relative(vaultRoot, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`refusing path outside vault: ${inputPath}`);
  }
  const text = fs.readFileSync(absolute, "utf8");
  if (tracePath) {
    fs.mkdirSync(path.dirname(tracePath), { recursive: true });
    fs.appendFileSync(tracePath, `${route}\n`);
  }
  return text;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , route, tracePath] = process.argv;
  if (!route) {
    console.error("usage: node scripts/read-doc.mjs <vault-relative-path> [trace-file]");
    process.exit(2);
  }
  process.stdout.write(readDoc(route, tracePath));
}
