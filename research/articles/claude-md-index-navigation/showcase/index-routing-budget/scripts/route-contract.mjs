import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { readDoc } from "./read-doc.mjs";

export const expectedTrace = [
  "CLAUDE.md",
  "index.md",
  "projects/index.md",
  "projects/release-checklist.md",
  "research/index.md",
  "research/citation-policy.md",
  "publishing/index.md",
  "publishing/newsletter-runbook.md",
  "systems/index.md",
  "systems/vault-audit-runbook.md"
];

export const expectedTargets = {
  "task-release-checklist": "projects/release-checklist.md",
  "task-citation-policy": "research/citation-policy.md",
  "task-newsletter-runbook": "publishing/newsletter-runbook.md",
  "task-vault-audit": "systems/vault-audit-runbook.md"
};

export function showcaseRootFrom(scriptUrl) {
  return path.resolve(path.dirname(new URL(scriptUrl).pathname), "..");
}

export function listTextFiles(root) {
  const out = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const p = path.join(dir, name);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) walk(p);
      else out.push(path.relative(root, p).replaceAll("\\", "/"));
    }
  }
  walk(root);
  return out;
}

export function hashFiles(root, files) {
  const hashes = {};
  for (const file of files) {
    const data = fs.readFileSync(path.join(root, file));
    hashes[file] = crypto.createHash("sha256").update(data).digest("hex");
  }
  return hashes;
}

export function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function parseIndexTable(markdown) {
  const rows = [];
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("|") || line.includes("---")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells[0] === "Route key" || cells[0] === "Area") continue;
    rows.push(cells);
  }
  return rows;
}

export function buildValidRoutes(showcaseRoot, tracePath) {
  fs.rmSync(tracePath, { force: true });
  const tasks = JSON.parse(fs.readFileSync(path.join(showcaseRoot, "fixture", "tasks.json"), "utf8"));
  readDoc("CLAUDE.md", tracePath);
  readDoc("index.md", tracePath);

  const routes = [];
  for (const task of tasks) {
    const areaIndexPath = `${task.area}/index.md`;
    const areaIndex = readDoc(areaIndexPath, tracePath);
    const row = parseIndexTable(areaIndex).find((cells) => cells[0] === task.route_key);
    if (!row) throw new Error(`missing route key ${task.route_key}`);
    const target = row[2];
    const targetBody = readDoc(target, tracePath);
    routes.push({
      task_id: task.id,
      route_key: task.route_key,
      area: task.area,
      area_index: areaIndexPath,
      target,
      owner: row[3],
      verified_date: row[4],
      fallback: row[5],
      citation: target,
      target_heading: targetBody.split("\n")[0].replace(/^# /, "")
    });
  }

  return {
    generated_at: "2026-07-12",
    model: "deterministic-replay",
    budget: {
      routed_reads: expectedTrace.length,
      naive_inventory_files: 26
    },
    routes
  };
}

export function renderRoutesMarkdown(routesJson) {
  const lines = [
    "# Routed results",
    "",
    `Budget: ${routesJson.budget.routed_reads}/${routesJson.budget.naive_inventory_files} fixture files read.`,
    ""
  ];
  for (const route of routesJson.routes) {
    lines.push(`- ${route.task_id}: ${route.route_key} -> ${route.target} (citation: ${route.citation})`);
  }
  lines.push("");
  return lines.join("\n");
}
