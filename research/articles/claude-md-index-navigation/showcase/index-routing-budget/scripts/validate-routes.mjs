#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  expectedTargets,
  expectedTrace,
  listTextFiles,
  sameJson
} from "./route-contract.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const vaultRoot = path.join(showcaseRoot, "fixture", "synthetic-vault");

function fail(code, message) {
  console.error(message);
  process.exit(code);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(61, `missing or invalid route report: ${error.message}`);
  }
}

const [, , routesPath = path.join(showcaseRoot, "reports", "routes.json"), tracePath = path.join(showcaseRoot, "reports", "read-trace.log")] = process.argv;
const report = readJson(routesPath);
const files = listTextFiles(vaultRoot);

if (files.length !== 26) {
  fail(61, `fixture inventory expected 26 files, got ${files.length}`);
}

if (!Array.isArray(report.routes) || report.routes.length !== 4) {
  fail(61, "route report must contain exactly four routes");
}

const seenTasks = new Set();
const seenRouteKeys = new Set();
for (const route of report.routes) {
  if (!route.task_id || !route.route_key || !route.area_index || !route.target || !route.citation) {
    fail(61, `missing required route fields for ${route.task_id || "unknown-task"}`);
  }
  if (seenTasks.has(route.task_id)) {
    fail(62, `duplicate task route: ${route.task_id}`);
  }
  seenTasks.add(route.task_id);
  const scopedKey = `${route.area}:${route.route_key}`;
  if (seenRouteKeys.has(scopedKey)) {
    fail(62, `ambiguous duplicate route key: ${scopedKey}`);
  }
  seenRouteKeys.add(scopedKey);
  if (route.private === true || route.sensitive === true || /private|secret|credential/i.test(route.target)) {
    fail(65, `private or sensitive target exposed: ${route.target}`);
  }
  if (!files.includes(route.target)) {
    fail(64, `target does not exist: ${route.target}`);
  }
  if (route.verified_date !== "2026-07-12") {
    fail(64, `stale route date for ${route.task_id}: ${route.verified_date}`);
  }
  if (expectedTargets[route.task_id] !== route.target) {
    fail(64, `wrong canonical target for ${route.task_id}: ${route.target}`);
  }
  if (route.citation !== route.target) {
    fail(64, `citation must equal canonical target for ${route.task_id}`);
  }
}

const trace = fs.existsSync(tracePath)
  ? fs.readFileSync(tracePath, "utf8").trim().split(/\n/).filter(Boolean)
  : [];
if (!sameJson(trace, expectedTrace)) {
  fail(63, `read trace violated budget/order: ${JSON.stringify(trace)}`);
}
if (trace.length !== 10 || report.budget?.routed_reads !== 10 || report.budget?.naive_inventory_files !== 26) {
  fail(63, "budget must be exactly 10 routed reads compared with deterministic 26-file inventory");
}

console.log("PASS route report: 4 tasks, 10/26 read budget, exact trace and citations verified");
