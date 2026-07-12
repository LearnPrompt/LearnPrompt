import { mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const manifestPath = join(root, "fixture", "inbox-manifest.json");
const vaultRoot = join(root, "fixture", "synthetic-vault");
const validatorPath = join(root, "scripts", "validate-placement-plan.mjs");
const validJsonPath = join(root, "cases", "valid-plan.json");
const validMdPath = join(root, "cases", "valid-plan.md");
const liveSummaryPath = join(root, "results", "live-attempt-summary.json");

function sha256(path) {
  const hash = createHash("sha256");
  hash.update(readFileSync(path));
  return hash.digest("hex");
}

function listFiles(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      listFiles(fullPath, base, acc);
    } else {
      acc.push(relative(base, fullPath));
    }
  }
  return acc.sort();
}

function runValidator(plan, label) {
  const tempDir = mkdtempSync(join(tmpdir(), "vault-placement-case-"));
  const tempPlanPath = join(tempDir, `${label}.json`);
  writeFileSync(tempPlanPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  return spawnSync("node", [validatorPath, "--plan", tempPlanPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

const beforeHash = sha256(manifestPath);
const beforeInventory = listFiles(vaultRoot);
const validPlan = JSON.parse(readFileSync(validJsonPath, "utf8"));
const validMarkdown = readFileSync(validMdPath, "utf8");
const results = [];

if (!/[^\x00-\x7F]/.test(JSON.stringify(validPlan))) {
  throw new Error("valid plan must contain Unicode paths");
}

const markdownRows = validMarkdown
  .split("\n")
  .filter((line) => line.startsWith("| `00_收件箱/"));
if (markdownRows.length !== 12) {
  throw new Error("valid-plan.md must contain 12 placement rows");
}

results.push({
  scenario: "valid plan",
  exit_code: runValidator(validPlan, "valid").status,
});

const orphanPlan = cloneJson(validPlan);
orphanPlan.rows.pop();
orphanPlan.summary.accounted_items = 11;
orphanPlan.summary.placed_items = 10;
orphanPlan.summary.rejected_items = 1;
orphanPlan.summary.canonical_destinations = 10;
results.push({
  scenario: "orphan item",
  exit_code: runValidator(orphanPlan, "orphan").status,
});

const mismatchPlan = cloneJson(validPlan);
mismatchPlan.rows[0].destination = "20_知识库/Apollo 发布会/2026-07-产品发布决策.md";
mismatchPlan.rows[0].role = "knowledge";
results.push({
  scenario: "folder-role mismatch",
  exit_code: runValidator(mismatchPlan, "role-mismatch").status,
});

const unknownRootPlan = cloneJson(validPlan);
unknownRootPlan.rows[1].destination = "40_杂项/Apollo 发布会/下周执行清单.md";
results.push({
  scenario: "unknown root",
  exit_code: runValidator(unknownRootPlan, "unknown-root").status,
});

const sensitivePlacedPlan = cloneJson(validPlan);
sensitivePlacedPlan.rows[11].action = "place";
sensitivePlacedPlan.rows[11].destination = "50_资源/reject/SENSITIVE-marker-credential.txt";
sensitivePlacedPlan.rows[11].role = "resource";
sensitivePlacedPlan.rows[11].canonical = true;
results.push({
  scenario: "sensitive item placed",
  exit_code: runValidator(sensitivePlacedPlan, "sensitive-placed").status,
});

const duplicatePlan = cloneJson(validPlan);
duplicatePlan.rows[10].destination = duplicatePlan.rows[2].destination;
results.push({
  scenario: "duplicate canonical destination",
  exit_code: runValidator(duplicatePlan, "duplicate").status,
});

const afterHash = sha256(manifestPath);
const afterInventory = listFiles(vaultRoot);

const verification = {
  valid_exit_code: results[0].exit_code,
  orphan_exit_code: results[1].exit_code,
  folder_role_mismatch_exit_code: results[2].exit_code,
  unknown_root_exit_code: results[3].exit_code,
  sensitive_placed_exit_code: results[4].exit_code,
  duplicate_destination_exit_code: results[5].exit_code,
  unicode_paths_present: true,
  manifest_unchanged: beforeHash === afterHash,
  fixture_inventory_unchanged:
    JSON.stringify(beforeInventory) === JSON.stringify(afterInventory),
};

if (statSync(liveSummaryPath, { throwIfNoEntry: false })) {
  const liveSummary = JSON.parse(readFileSync(liveSummaryPath, "utf8"));
  verification.live_attempt_status = liveSummary.status;
  verification.live_attempt_manifest_changed = liveSummary.fixture_manifest_changed;
  verification.live_attempt_inventory_changed = liveSummary.fixture_inventory_changed;
}

console.log(JSON.stringify(verification, null, 2));

if (
  verification.valid_exit_code !== 0 ||
  verification.orphan_exit_code !== 51 ||
  verification.folder_role_mismatch_exit_code !== 52 ||
  verification.unknown_root_exit_code !== 53 ||
  verification.sensitive_placed_exit_code !== 54 ||
  verification.duplicate_destination_exit_code !== 55 ||
  !verification.manifest_unchanged ||
  !verification.fixture_inventory_unchanged
) {
  process.exit(1);
}
