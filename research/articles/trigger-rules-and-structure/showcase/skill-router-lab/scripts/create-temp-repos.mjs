#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, "..");
const fixturesRoot = path.join(labRoot, "fixtures");

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--out-dir") args.outDir = argv[++index];
  }
  return args;
}

const args = parseArgs(process.argv);
const baseDir =
  args.outDir ?? fs.mkdtempSync(path.join(os.tmpdir(), "skill-router-lab-"));

for (const variant of ["broad-repo", "bounded-repo"]) {
  const source = path.join(fixturesRoot, variant);
  const target = path.join(baseDir, variant);
  fs.cpSync(source, target, { recursive: true });
}

console.log(JSON.stringify({
  created: true,
  root: baseDir,
  variants: ["broad-repo", "bounded-repo"]
}, null, 2));
