import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

function fail(code, message) {
  console.error(message);
  process.exit(code);
}

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key.startsWith("--") || value === undefined || value.startsWith("--")) {
      fail(
        2,
        "Usage: node .agents/skills/receipt-renamer/scripts/plan-renames.mjs --batch <file> --policy <file> --report <file> --json <file>"
      );
    }
    args.set(key.slice(2), value);
    index += 1;
  }
  return args;
}

function slugifyMerchant(input) {
  return input
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function ensureIsoDate(value, sourceFile) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail(22, `ERROR invalid receipt_date for ${sourceFile}: ${value}`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    fail(22, `ERROR invalid calendar date for ${sourceFile}: ${value}`);
  }
}

function ensureCurrency(value, sourceFile) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(21, `ERROR missing currency for ${sourceFile}`);
  }
  return value.trim().toUpperCase();
}

function ensureAmount(value, sourceFile) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    fail(22, `ERROR invalid total_amount for ${sourceFile}: ${value}`);
  }
  return numeric.toFixed(2);
}

function renderReport(template, plan) {
  const items = plan.items
    .map(
      (item) =>
        `- \`${item.source_file}\` -> \`${item.target_file}\` (${item.receipt_date}, ${item.currency}${item.total_amount})`
    )
    .join("\n");

  return template
    .replace("{{BATCH_ID}}", plan.batch_id)
    .replace("{{POLICY_PATH}}", plan.policy_reference)
    .replace("{{COUNT}}", String(plan.items.length))
    .replace("{{ITEMS}}", items);
}

const args = parseArgs(process.argv.slice(2));
const batchPath = args.get("batch");
const policyPath = args.get("policy");
const reportPath = args.get("report");
const jsonPath = args.get("json");

if (!batchPath || !policyPath || !reportPath || !jsonPath) {
  fail(
    2,
    "Usage: node .agents/skills/receipt-renamer/scripts/plan-renames.mjs --batch <file> --policy <file> --report <file> --json <file>"
  );
}

const batchAbsolute = path.resolve(process.cwd(), batchPath);
const policyAbsolute = path.resolve(process.cwd(), policyPath);
const reportAbsolute = path.resolve(process.cwd(), reportPath);
const jsonAbsolute = path.resolve(process.cwd(), jsonPath);

const batchDirectory = path.dirname(batchAbsolute);
const batch = JSON.parse(readFileSync(batchAbsolute, "utf8"));
const templatePath = path.resolve(scriptDir, "../assets/report-template.md");
const template = readFileSync(templatePath, "utf8");
const policyText = readFileSync(policyAbsolute, "utf8");

if (!Array.isArray(batch.receipts) || batch.receipts.length === 0) {
  fail(22, "ERROR batch manifest must contain a non-empty receipts array");
}

const plannedTargets = new Map();
const items = batch.receipts.map((receipt) => {
  const sourceFile = receipt.source_file;
  if (typeof sourceFile !== "string" || sourceFile.trim() === "") {
    fail(22, "ERROR every receipt must define source_file");
  }

  const receiptDate = receipt.receipt_date;
  ensureIsoDate(receiptDate, sourceFile);
  const merchantSlug = slugifyMerchant(receipt.merchant ?? "");
  if (!merchantSlug) {
    fail(22, `ERROR invalid merchant for ${sourceFile}`);
  }

  const currency = ensureCurrency(receipt.currency, sourceFile);
  const totalAmount = ensureAmount(receipt.total_amount, sourceFile);
  const targetFile = `${receiptDate}_${merchantSlug}_${currency}${totalAmount}.pdf`;
  const sourceAbsolute = path.join(batchDirectory, sourceFile);
  if (!existsSync(sourceAbsolute)) {
    fail(22, `ERROR missing source file for ${sourceFile}`);
  }

  if (plannedTargets.has(targetFile)) {
    fail(
      23,
      `ERROR target filename conflict for ${targetFile}: ${plannedTargets.get(targetFile)} and ${sourceFile}`
    );
  }

  const existingTargetAbsolute = path.join(batchDirectory, targetFile);
  if (existsSync(existingTargetAbsolute) && targetFile !== sourceFile) {
    fail(23, `ERROR target filename conflict for ${targetFile}: existing file in batch directory`);
  }

  plannedTargets.set(targetFile, sourceFile);

  return {
    source_file: sourceFile,
    target_file: targetFile,
    receipt_date: receiptDate,
    merchant: receipt.merchant,
    currency,
    total_amount: totalAmount,
    reason: "Matches YYYY-MM-DD_merchant-slug_CURRENCYamount.pdf"
  };
});

const plan = {
  batch_id: batch.batch_id,
  dry_run: true,
  policy_reference: path.relative(process.cwd(), policyAbsolute),
  policy_digest: policyText
    .split("\n")
    .find((line) => line.includes("YYYY-MM-DD_merchant-slug_CURRENCYamount.pdf")),
  total_receipts: items.length,
  items
};

mkdirSync(path.dirname(reportAbsolute), { recursive: true });
mkdirSync(path.dirname(jsonAbsolute), { recursive: true });
writeFileSync(jsonAbsolute, `${JSON.stringify(plan, null, 2)}\n`);
writeFileSync(reportAbsolute, `${renderReport(template, plan)}\n`);

console.log(`PASS dry run plan created for ${batch.batch_id}`);
console.log(`plan_json: ${path.relative(process.cwd(), jsonAbsolute)}`);
console.log(`plan_report: ${path.relative(process.cwd(), reportAbsolute)}`);
console.log(`receipts: ${items.length}`);
