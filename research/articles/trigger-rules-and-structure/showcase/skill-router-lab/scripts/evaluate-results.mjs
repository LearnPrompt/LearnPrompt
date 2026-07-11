#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(scriptDir, "..");
const expected = JSON.parse(
  fs.readFileSync(path.join(labRoot, "prompts", "expected-labels.json"), "utf8"),
);

function parseArgs(argv) {
  const args = {
    resultsDir: path.join(labRoot, "results"),
    allowIncomplete: false,
  };
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--results-dir") args.resultsDir = argv[++index];
    else if (token === "--result-file") args.resultFile = argv[++index];
    else if (token === "--allow-incomplete") args.allowIncomplete = true;
  }
  return args;
}

function loadCandidates(args) {
  if (args.resultFile) return [args.resultFile];
  return fs
    .readdirSync(args.resultsDir)
    .filter((name) => name.endsWith(".json") && name.startsWith("run-"))
    .map((name) => path.join(args.resultsDir, name));
}

function validate(result) {
  const required = [
    "suite",
    "variant",
    "mode",
    "case_id",
    "loaded",
    "contains_canary",
    "exit_code",
    "privacy_ok",
  ];
  for (const key of required) {
    if (!(key in result)) throw new Error(`missing ${key}`);
  }
  if (result.suite !== "skill-router-lab") throw new Error("wrong suite");
  if (!["broad", "bounded"].includes(result.variant)) throw new Error("bad variant");
  if (!["implicit", "explicit"].includes(result.mode)) throw new Error("bad mode");
  if (!/^request-[1-5]$/.test(result.case_id)) throw new Error("bad case_id");
  if (typeof result.loaded !== "boolean") throw new Error("loaded must be boolean");
  if (typeof result.contains_canary !== "boolean") {
    throw new Error("contains_canary must be boolean");
  }
  if (typeof result.exit_code !== "number") throw new Error("exit_code must be number");
  if (typeof result.privacy_ok !== "boolean") throw new Error("privacy_ok must be boolean");
}

function evaluateVariant(variant, observed) {
  const labels = expected.implicit[variant];
  const stats = { tp: 0, fp: 0, fn: 0, tn: 0 };
  for (const [requestId, shouldLoad] of Object.entries(labels)) {
    const row = observed.find(
      (result) => result.variant === variant && result.mode === "implicit" && result.case_id === requestId,
    );
    if (!row) return null;
    if (row.loaded && shouldLoad) stats.tp += 1;
    else if (row.loaded && !shouldLoad) stats.fp += 1;
    else if (!row.loaded && shouldLoad) stats.fn += 1;
    else stats.tn += 1;
  }
  const precision =
    stats.tp + stats.fp === 0 ? null : stats.tp / (stats.tp + stats.fp);
  const recall = stats.tp + stats.fn === 0 ? null : stats.tp / (stats.tp + stats.fn);
  return { ...stats, precision, recall };
}

const args = parseArgs(process.argv);
const files = loadCandidates(args);

if (files.length === 0) {
  if (args.allowIncomplete) {
    console.log(
      JSON.stringify(
        {
          status: "partial",
          reason: "no live run-*.json results yet",
          broad: null,
          bounded: null,
          explicit: null,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }
  console.error("No run-*.json results found.");
  process.exit(2);
}

const observed = files.map((file) => {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  validate(parsed);
  return parsed;
});

const broad = evaluateVariant("broad", observed);
const bounded = evaluateVariant("bounded", observed);
const explicit = observed.find(
  (result) => result.variant === "bounded" && result.mode === "explicit" && result.case_id === "request-5",
);

if ((!broad || !bounded || !explicit) && !args.allowIncomplete) {
  console.error("Implicit matrix or explicit control is incomplete.");
  process.exit(2);
}

console.log(
  JSON.stringify(
    {
      status: broad && bounded && explicit ? "complete" : "partial",
      broad,
      bounded,
      explicit: explicit
        ? {
            case_id: explicit.case_id,
            loaded: explicit.loaded,
            exit_code: explicit.exit_code,
          }
        : null,
    },
    null,
    2,
  ),
);
