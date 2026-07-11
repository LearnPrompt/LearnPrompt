#!/usr/bin/env node
// Deterministic acceptance gate for the "补齐 README 本地运行说明" task.
// It does NOT ask a model whether the work looks done. It checks facts:
//   1) code/config files unchanged vs the immutable baseline tag
//   2) README actually gained a local-run section vs that baseline
//   3) the project's own check command still passes
// Run from inside the practice repo after any change:
//   node verify-first-loop.mjs
import { execSync } from "node:child_process";

const FROZEN = ["wordcount.js", "test.js", "package.json"];
let failed = 0;
const line = (ok, name, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: ${detail}`);
  if (!ok) failed++;
};

// The reproduction steps create this tag before applying any candidate change.
// A tag keeps the comparison valid even if the candidate is committed later.
try { execSync("git rev-parse --verify baseline", { stdio: "pipe" }); }
catch {
  console.error("FAIL baseline-tag: missing git tag 'baseline'; follow README reproduction steps");
  process.exit(1);
}

// 1) frozen files must be byte-identical to the tagged baseline (no code edits)
const changed = execSync(`git diff --name-only baseline -- ${FROZEN.join(" ")}`, { encoding: "utf8" })
  .split("\n").map(s => s.trim()).filter(Boolean);
line(changed.length === 0, "no-code-edit",
  changed.length ? `frozen files differ from baseline: ${changed.join(", ")}` : "code/config match baseline");

// 2) README must gain a runnable local-start section that baseline did not have
const readme = execSync("cat README.md", { encoding: "utf8" });
const baselineReadme = execSync("git show baseline:README.md", { encoding: "utf8" });
const hasRunSection = /本地运行|本地启动|npm test/.test(readme) && /```/.test(readme);
const baselineHasRunSection = /本地运行|本地启动|npm test/.test(baselineReadme) && /```/.test(baselineReadme);
const gainedRunSection = hasRunSection && !baselineHasRunSection && readme !== baselineReadme;
line(gainedRunSection, "readme-run-section",
  gainedRunSection ? "local-run instructions added vs baseline" : "no new runnable section vs baseline");

// 3) project check command must pass
let testOk = true, testMsg = "npm test exit 0";
try { execSync("npm test", { stdio: "pipe" }); }
catch { testOk = false; testMsg = "npm test failed"; }
line(testOk, "check-passes", testMsg);

console.log(failed === 0
  ? "SUMMARY: 3/3 acceptance checks passed"
  : `SUMMARY: ${3 - failed}/3 passed — task NOT accepted, return to PLAN/EDIT`);
process.exit(failed === 0 ? 0 : 1);
