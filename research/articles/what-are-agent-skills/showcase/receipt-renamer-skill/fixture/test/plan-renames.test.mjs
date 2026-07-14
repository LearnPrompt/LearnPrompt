import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const fixtureRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const plannerPath = path.join(
  fixtureRoot,
  ".agents/skills/receipt-renamer/scripts/plan-renames.mjs"
);
const policyPath = path.join(
  fixtureRoot,
  ".agents/skills/receipt-renamer/references/naming-policy.md"
);

function runPlanner(batchRelative, reportName, jsonName) {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "receipt-renamer-test-"));
  const reportPath = path.join(tempDir, reportName);
  const jsonPath = path.join(tempDir, jsonName);
  const result = spawnSync(
    process.execPath,
    [
      plannerPath,
      "--batch",
      batchRelative,
      "--policy",
      path.relative(fixtureRoot, policyPath),
      "--report",
      path.relative(fixtureRoot, reportPath),
      "--json",
      path.relative(fixtureRoot, jsonPath)
    ],
    {
      cwd: fixtureRoot,
      encoding: "utf8"
    }
  );

  return { tempDir, reportPath, jsonPath, ...result };
}

test("normal batch exits 0, writes both artifacts, and keeps source files unchanged", () => {
  const sourceDir = path.join(fixtureRoot, "incoming/normal-batch");
  const before = readdirSync(sourceDir).sort();
  const result = runPlanner(
    "incoming/normal-batch/receipts.json",
    "normal-plan.md",
    "normal-plan.json"
  );
  const after = readdirSync(sourceDir).sort();

  assert.equal(result.status, 0);
  assert.deepEqual(after, before);

  const plan = JSON.parse(readFileSync(result.jsonPath, "utf8"));
  assert.equal(plan.dry_run, true);
  assert.equal(plan.items.length, 3);
  assert.equal(plan.items[0].target_file, "2026-05-14_metro-card_USD7.25.pdf");
});

test("missing currency batch exits 21", () => {
  const result = runPlanner(
    "incoming/missing-currency-batch/receipts.json",
    "missing-plan.md",
    "missing-plan.json"
  );

  assert.equal(result.status, 21);
  assert.match(result.stderr, /missing currency/i);
});

test("existing target conflict exits 23", () => {
  const result = runPlanner(
    "incoming/conflict-batch/receipts.json",
    "conflict-plan.md",
    "conflict-plan.json"
  );

  assert.equal(result.status, 23);
  assert.match(result.stderr, /target filename conflict/i);
});

test("markdown report keeps dry-run acceptance lines", () => {
  const result = runPlanner(
    "incoming/normal-batch/receipts.json",
    "normal-acceptance.md",
    "normal-acceptance.json"
  );
  const report = readFileSync(result.reportPath, "utf8");

  assert.equal(result.status, 0);
  assert.match(report, /Dry run: `yes`/);
  assert.match(report, /No source receipt file was renamed\./);
  assert.match(report, /Missing `currency` must fail with exit `21`\./);
});
