import { readFileSync } from "node:fs";
import path from "node:path";

const requiredFields = [
  "id",
  "question",
  "evidence",
  "pass_rule",
  "severity",
  "not_applicable_policy",
  "result"
];

function fail(message) {
  console.error(message);
  process.exit(24);
}

const reportPath = process.argv[2];
if (!reportPath) {
  console.error("Usage: validate-report.mjs <report-json>");
  process.exit(2);
}

const report = JSON.parse(readFileSync(path.resolve(reportPath), "utf8"));
if (!Array.isArray(report.rows) || report.rows.length === 0) {
  fail("rows must be a non-empty array");
}

for (const row of report.rows) {
  for (const field of requiredFields) {
    if (!(field in row)) {
      fail(`missing field ${field} in row ${row.id || "<unknown>"}`);
    }
  }

  if (!["blocker", "major", "minor"].includes(row.severity)) {
    fail(`invalid severity in row ${row.id}`);
  }

  if (!["pass", "fail", "not_applicable"].includes(row.result)) {
    fail(`invalid result in row ${row.id}`);
  }

  if (row.result === "not_applicable") {
    const evidence = String(row.evidence || "").trim();
    const policy = String(row.not_applicable_policy || "").trim();
    if (evidence.length < 20 || /^n\/a$/i.test(evidence)) {
      fail(`row ${row.id} uses not_applicable without inspected evidence`);
    }
    if (policy.length < 20) {
      fail(`row ${row.id} uses not_applicable without a concrete policy`);
    }
  }
}

console.log("PASS report contract");
