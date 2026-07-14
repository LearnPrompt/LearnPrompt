#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    values[argv[index]?.replace(/^--/, "")] = argv[index + 1];
  }
  return values;
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function walk(directory, prefix = "") {
  const files = [];
  for (const name of readdirSync(directory)) {
    const absolute = path.join(directory, name);
    const relative = path.join(prefix, name);
    if (statSync(absolute).isDirectory()) files.push(...walk(absolute, relative));
    else files.push(relative);
  }
  return files.sort();
}

const args = parseArgs(process.argv.slice(2));
if (!args.task || !args.output) {
  console.error("usage: node workers/run-worker.mjs --task <task-card> --output <isolated-dir>");
  process.exit(2);
}

const workersDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(workersDir, "..");
const task = JSON.parse(readFileSync(path.resolve(args.task), "utf8"));

if (task.write_set.length !== 1) {
  console.error(`worker ${task.id}: expected exactly one owned file`);
  process.exit(3);
}

const ownedFile = task.write_set[0];
const contract = readFileSync(path.join(root, task.contract_path));
if (sha256(contract) !== task.contract_checksum) {
  console.error(`worker ${task.id}: frozen contract checksum mismatch`);
  process.exit(3);
}

const candidate = readFileSync(path.join(root, ownedFile), "utf8");
const outputRoot = path.resolve(args.output);
const outputFile = path.join(outputRoot, ownedFile);
mkdirSync(path.dirname(outputFile), { recursive: true });
writeFileSync(outputFile, candidate);

const moduleUrl = `${pathToFileURL(outputFile).href}?worker=${task.id}`;
const module = await import(moduleUrl);

if (task.id === "task-a-parser") {
  const csv = readFileSync(path.join(root, "fixtures/orders.csv"), "utf8");
  const summary = module.parseOrders(csv);
  if (summary.currency !== "USD" || summary.order_count !== 5 || summary.total_amount !== 330) {
    console.error(`worker ${task.id}: parser self-test failed`);
    process.exit(1);
  }
} else if (task.id === "task-b-renderer") {
  const markdown = module.renderSummary({
    currency: "USD",
    order_count: 2,
    total_amount: 12.5,
    by_status: { paid: 2 },
  });
  if (!markdown.includes("- 订单数：2") || !markdown.includes("| paid | 2 |")) {
    console.error(`worker ${task.id}: renderer self-test failed`);
    process.exit(1);
  }
} else {
  console.error(`worker ${task.id}: no self-test defined`);
  process.exit(2);
}

const files = walk(outputRoot);
if (files.length !== 1 || files[0] !== ownedFile) {
  console.error(`worker ${task.id}: unexpected output files: ${files.join(", ")}`);
  process.exit(3);
}

console.log(`worker=${task.id}`);
console.log("isolation=separate-node-process-and-temp-output");
console.log(`owned_file=${ownedFile}`);
console.log("unexpected_files=none");
console.log(`contract_sha256=${task.contract_checksum}`);
console.log(`output_sha256=${sha256(candidate)}`);
console.log("self_test=PASS");
