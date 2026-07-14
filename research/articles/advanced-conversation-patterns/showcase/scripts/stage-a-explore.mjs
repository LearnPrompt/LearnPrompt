import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseDir = path.resolve(__dirname, "..");
const fixtureDir = path.join(showcaseDir, "fixture");
const handoffDir = path.join(showcaseDir, "handoff");
const resultsDir = path.join(showcaseDir, "results");

mkdirSync(handoffDir, { recursive: true });
mkdirSync(resultsDir, { recursive: true });

const packageJson = JSON.parse(
  readFileSync(path.join(fixtureDir, "package.json"), "utf8"),
);
const source = readFileSync(path.join(fixtureDir, "src/slugify.js"), "utf8");
const tests = readFileSync(path.join(fixtureDir, "tests/run-tests.mjs"), "utf8");

const baseline = spawnSync("node", ["tests/run-tests.mjs"], {
  cwd: fixtureDir,
  encoding: "utf8",
});

const baselineLines = `${baseline.stdout}${baseline.stderr}`
  .trim()
  .split("\n")
  .filter(Boolean);

const handoff = {
  task: "Fix the slugify bug with the smallest possible change.",
  symptom:
    'The fixture currently returns "rock--roll" for the input "Rock & Roll".',
  evidence: [
    "Baseline command: node tests/run-tests.mjs",
    baselineLines.find((line) => line.startsWith("FAIL ")) ??
      "FAIL evidence missing",
    "Two other tests already pass, so the bug is localized rather than systemic.",
  ],
  allowed_files: ["src/slugify.js"],
  acceptance: {
    commands: ["node tests/run-tests.mjs"],
    expected_exit_code: 0,
  },
  risks: [
    "Do not broaden the change into transliteration or locale-specific slug rules.",
    "Do not edit tests unless the symptom and acceptance evidence require it.",
  ],
  repo_facts: [
    `packageManager: none`,
    `testScript: ${packageJson.scripts.test}`,
    `sourceLines: ${source.split("\n").length}`,
    `testLines: ${tests.split("\n").length}`,
  ],
};

writeFileSync(
  path.join(handoffDir, "handoff-good.json"),
  `${JSON.stringify(handoff, null, 2)}\n`,
);

const summary = [
  "STAGE A read-only exploration",
  "mode=inspect-and-freeze",
  "command=node tests/run-tests.mjs",
  `exit=${baseline.status ?? 1}`,
  ...baselineLines,
  "",
  "frozen fields=symptom,evidence,allowed_files,acceptance,risks",
].join("\n");

writeFileSync(path.join(resultsDir, "stage-a-summary.txt"), `${summary}\n`);
console.log(summary);
