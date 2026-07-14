import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidateDir = path.join(repoRoot, ".agents/skills/frontmatter-repair");
const evaluationSummaryPath = path.join(repoRoot, "reports/evaluation-summary.test.json");

test("generated candidate exists and passes 4/4 holdout", () => {
  assert.equal(existsSync(path.join(candidateDir, "SKILL.md")), true, "candidate SKILL.md missing");
  assert.equal(
    existsSync(path.join(candidateDir, "references/frontmatter-contract.md")),
    true,
    "candidate contract missing"
  );
  assert.equal(
    existsSync(path.join(candidateDir, "scripts/repair-frontmatter.mjs")),
    true,
    "candidate repair helper missing"
  );

  const result = spawnSync(
    process.execPath,
    [
      ".agents/skills/observable-receipt-distiller/scripts/evaluate-candidate.mjs",
      "--candidate",
      ".agents/skills/frontmatter-repair",
      "--holdout",
      "holdout",
      "--summary",
      "reports/evaluation-summary.test.json"
    ],
    {
      cwd: repoRoot,
      encoding: "utf8"
    }
  );

  assert.equal(result.status, 0, [result.stdout, result.stderr].filter(Boolean).join("\n"));

  const summary = JSON.parse(readFileSync(evaluationSummaryPath, "utf8"));
  assert.equal(summary.passed, 4);
  assert.equal(summary.failed, 0);

  const receiptDiff = spawnSync("git", ["diff", "--name-only", "--", "receipts"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(receiptDiff.stdout.trim(), "", "training receipts were modified");
});
