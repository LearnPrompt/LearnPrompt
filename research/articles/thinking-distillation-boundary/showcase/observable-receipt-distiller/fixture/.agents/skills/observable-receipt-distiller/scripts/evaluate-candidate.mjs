import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const EXIT = {
  OK: 0,
  HOLDOUT_FAIL: 54
};

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value) {
      throw new Error(
        "Usage: node evaluate-candidate.mjs --candidate <path> --holdout <path> --summary <path>"
      );
    }
    args[key.slice(2)] = value;
  }
  return args;
}

function extractFrontmatter(text) {
  if (!text.startsWith("---\n")) {
    throw new Error("file has no YAML frontmatter");
  }
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) {
    throw new Error("frontmatter is not closed");
  }
  return {
    raw: text.slice(4, end),
    body: text.slice(end + 5)
  };
}

function parseFrontmatter(raw) {
  const title = raw.match(/^title:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, "") ?? "";
  const description =
    raw.match(/^description:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, "") ?? "";
  const sidebarOrder = raw.match(/^  order:\s*(.+)$/m)?.[1] ?? "";
  return {
    title,
    description,
    sidebarOrder
  };
}

const args = parseArgs(process.argv.slice(2));
const candidateDir = path.resolve(args.candidate);
const holdoutDir = path.resolve(args.holdout);
const expected = JSON.parse(readFileSync(path.join(holdoutDir, "expected.json"), "utf8"));

const workDir = mkdtempSync(path.join(os.tmpdir(), "frontmatter-repair-holdout-"));
cpSync(holdoutDir, workDir, { recursive: true });

const results = [];
for (const expectedCase of expected.cases) {
  const original = readFileSync(path.join(workDir, expectedCase.file), "utf8");
  const result = spawnSync(
    process.execPath,
    [path.join(candidateDir, "scripts/repair-frontmatter.mjs"), "--file", expectedCase.file],
    {
      cwd: workDir,
      encoding: "utf8"
    }
  );

  const updated = readFileSync(path.join(workDir, expectedCase.file), "utf8");
  const frontmatter = parseFrontmatter(extractFrontmatter(updated).raw);
  const bodyUnchanged = extractFrontmatter(original).body === extractFrontmatter(updated).body;
  const noopSatisfied = expectedCase.expect_noop ? updated === original : updated !== original;
  const passed =
    result.status === 0 &&
    frontmatter.title === expectedCase.title &&
    frontmatter.description === expectedCase.description &&
    Number(frontmatter.sidebarOrder) === expectedCase.sidebar_order &&
    bodyUnchanged &&
    noopSatisfied;

  results.push({
    file: expectedCase.file,
    passed,
    actual: {
      title: frontmatter.title,
      description: frontmatter.description,
      sidebar_order: Number(frontmatter.sidebarOrder),
      body_unchanged: bodyUnchanged,
      noop_satisfied: noopSatisfied
    },
    expected: expectedCase
  });
}

const passed = results.filter((entry) => entry.passed).length;
const summary = {
  exit_code: passed === expected.cases.length ? EXIT.OK : EXIT.HOLDOUT_FAIL,
  passed,
  failed: expected.cases.length - passed,
  total: expected.cases.length,
  cases: results
};

mkdirSync(path.dirname(path.resolve(args.summary)), { recursive: true });
writeFileSync(path.resolve(args.summary), `${JSON.stringify(summary, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(summary.exit_code);
