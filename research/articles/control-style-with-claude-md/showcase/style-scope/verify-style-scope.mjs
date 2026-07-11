import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const scenario = process.argv[2];
const validScenarios = new Set(["before", "after"]);

if (!validScenarios.has(scenario)) {
  console.error("Usage: node verify-style-scope.mjs <before|after>");
  process.exit(2);
}

const root = path.join("fixture", scenario);

function read(relativePath) {
  const file = path.join(root, relativePath);
  if (!existsSync(file)) {
    throw new Error(`Missing fixture file: ${file}`);
  }
  return readFileSync(file, "utf8");
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.log(`FAIL ${message}`);
  failures += 1;
}

let failures = 0;

console.log(`SCENARIO ${scenario}`);

const claudeMd = read("CLAUDE.md");
if (
  /UI and API details belong in `?\.claude\/rules\/`?/.test(claudeMd) &&
  claudeMd.includes("verify-style-scope.mjs")
) {
  pass("root CLAUDE.md keeps only repo-wide instructions");
} else {
  fail("root CLAUDE.md is missing repo-wide instructions about scoped rules or verification");
}

const uiRule = read(".claude/rules/ui-style.md");
if (/paths:\s*\n\s*- "src\/ui\/\*\*\/\*\.tsx"/.test(uiRule)) {
  pass("UI rule is path-scoped to src/ui/**/*.tsx");
} else {
  fail("UI rule is missing the expected src/ui/**/*.tsx scope");
}

const apiRule = read(".claude/rules/api-contract.md");
if (/paths:\s*\n\s*- "src\/api\/\*\*\/\*\.ts"/.test(apiRule)) {
  pass("API rule is path-scoped to src/api/**/*.ts");
} else {
  fail("API rule is missing the expected src/api/**/*.ts scope");
}

const uiFilePath = "src/ui/Button.tsx";
const uiFile = read(uiFilePath);
const hexMatch = uiFile.match(/#[0-9a-fA-F]{6}\b/);
if (hexMatch) {
  fail(`${uiFilePath} uses hard-coded color ${hexMatch[0]}`);
} else if (uiFile.includes("tokens.brandPrimary") && uiFile.includes("cx(")) {
  pass(`${uiFilePath} uses theme tokens and cx()`);
} else {
  fail(`${uiFilePath} is missing theme token or cx() usage`);
}

const apiFilePath = "src/api/handlers/profile.ts";
console.log(
  `SKIP ui-token rule for ${apiFilePath} because path does not match src/ui/**/*.tsx`,
);

const apiFile = read(apiFilePath);
if (/return jsonOk\(/.test(apiFile) && /return jsonError\(/.test(apiFile)) {
  pass(`${apiFilePath} returns jsonOk/jsonError helpers`);
} else {
  fail(`${apiFilePath} is missing jsonOk/jsonError helpers`);
}

if (failures > 0) {
  console.log("RESULT FAIL");
  process.exit(1);
}

console.log("RESULT PASS");
