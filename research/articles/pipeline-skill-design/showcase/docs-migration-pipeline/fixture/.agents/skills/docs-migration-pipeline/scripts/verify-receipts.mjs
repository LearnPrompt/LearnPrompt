#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptFile), "../../../..");
const stages = [
  "inventory",
  "normalize",
  "transform",
  "validate",
  "package-candidate"
];

function shaFiles(relativeFiles) {
  const hash = createHash("sha256");
  for (const file of [...relativeFiles].sort()) {
    const fullPath = path.join(repoRoot, file);
    hash.update(file);
    hash.update("\n");
    hash.update(readFileSync(fullPath));
    hash.update("\n");
  }
  return hash.digest("hex");
}

const summaries = [];
for (const stage of stages) {
  const receiptPath = path.join(repoRoot, "receipts", `${stage}.json`);
  if (!existsSync(receiptPath)) {
    console.error(`Missing receipt: ${stage}`);
    process.exit(1);
  }
  const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
  const requiredFields = [
    "stage",
    "input_sha",
    "output_sha",
    "command",
    "exit_code",
    "status",
    "started_seq",
    "finished_seq",
    "input_files",
    "output_files"
  ];
  for (const field of requiredFields) {
    if (!(field in receipt)) {
      console.error(`Receipt ${stage} missing ${field}`);
      process.exit(1);
    }
  }
  if ("started_at" in receipt || "finished_at" in receipt) {
    console.error(`Receipt ${stage} contains wall-clock fields`);
    process.exit(1);
  }
  if (receipt.stage !== stage || receipt.status !== "success" || receipt.exit_code !== 0) {
    console.error(`Receipt ${stage} has invalid stage/status/exit_code`);
    process.exit(1);
  }
  if (
    !Array.isArray(receipt.output_files) ||
    receipt.output_files.length === 0 ||
    receipt.output_files.some((file) => !existsSync(path.join(repoRoot, file)))
  ) {
    console.error(`Receipt ${stage} has missing outputs`);
    process.exit(1);
  }
  const outputSha = shaFiles(receipt.output_files);
  if (outputSha !== receipt.output_sha) {
    console.error(`Receipt ${stage} output_sha mismatch`);
    process.exit(1);
  }
  summaries.push({
    stage,
    input_sha: receipt.input_sha,
    output_sha: receipt.output_sha,
    output_files: receipt.output_files
  });
}

const packageReceipt = JSON.parse(
  readFileSync(path.join(repoRoot, "receipts/package-candidate.json"), "utf8")
);

const summary = {
  status: "ok",
  stages: summaries,
  candidate_hash: packageReceipt.output_sha,
  source_unchanged: true
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
