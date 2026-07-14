#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const planPath = path.resolve(process.argv[2] ?? path.join(root, "reports/maintenance-plan.json"));

function exit(code, message) {
  if (message) console.error(message);
  process.exit(code);
}

function readJson(relativeOrAbsolute) {
  return JSON.parse(readFileSync(path.isAbsolute(relativeOrAbsolute) ? relativeOrAbsolute : path.join(root, relativeOrAbsolute), "utf8"));
}

function walk(directory) {
  const files = [];
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) files.push(...walk(file));
    else files.push(file);
  }
  return files;
}

function noteMeta(notePath) {
  const text = readFileSync(path.join(root, notePath), "utf8");
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  const meta = {};
  if (frontmatter) {
    for (const line of frontmatter[1].split("\n")) {
      const [key, ...rest] = line.split(":");
      meta[key.trim()] = rest.join(":").trim();
    }
  }
  return { meta, text };
}

function degrees(graph, notePath) {
  let indegree = 0;
  let outdegree = 0;
  for (const edge of graph.edges) {
    if (edge.to === notePath) indegree += 1;
    if (edge.from === notePath) outdegree += 1;
  }
  return { indegree, outdegree };
}

function requireEvidence(proposal) {
  const required = [
    "action",
    "note_paths",
    "evidence_paths",
    "observed_fact",
    "proposed_change",
    "confidence",
    "requires_human_approval",
    "source_preservation_rule",
    "reason"
  ];
  for (const key of required) {
    if (proposal[key] === undefined || proposal[key] === "" || (Array.isArray(proposal[key]) && proposal[key].length === 0)) {
      exit(71, `FAIL 71 missing field or evidence: ${key}`);
    }
  }
  if (proposal.requires_human_approval !== true) exit(72, "FAIL 72 proposal is not gated on human approval");
  for (const evidencePath of proposal.evidence_paths) {
    if (!existsSync(path.join(root, evidencePath))) exit(71, `FAIL 71 missing evidence path: ${evidencePath}`);
  }
}

if (!existsSync(planPath)) exit(71, `FAIL 71 plan not found: ${planPath}`);

const manifest = readJson("maintenance-manifest.json");
const graph = readJson("link-graph.json");
const currentSources = readJson("current-sources.json");
const sourceInventory = readJson("contracts/source-inventory.json");
const plan = readJson(planPath);

function sha256(relativePath) {
  return createHash("sha256").update(readFileSync(path.join(root, relativePath))).digest("hex");
}

const sourceFiles = [
  "current-sources.json",
  "link-graph.json",
  "maintenance-manifest.json",
  ...readdirSync(path.join(root, "notes")).filter((name) => name.endsWith(".md")).map((name) => `notes/${name}`).sort()
];
const expectedSourceFiles = Object.keys(sourceInventory).sort();
if (JSON.stringify(sourceFiles.sort()) !== JSON.stringify(expectedSourceFiles)) {
  exit(72, "FAIL 72 source inventory changed");
}
for (const [relativePath, expectedHash] of Object.entries(sourceInventory)) {
  if (sha256(relativePath) !== expectedHash) exit(72, `FAIL 72 source hash changed: ${relativePath}`);
}

if (plan.fixture !== "knowledge-maintenance-proposal") exit(71, "FAIL 71 wrong fixture");
if (Array.isArray(plan.applied_changes) && plan.applied_changes.length > 0) exit(72, "FAIL 72 plan claims applied changes");
if (/auto(?:matically)?\s+(?:rewrote|edited|applied|deleted|moved)/i.test(JSON.stringify(plan))) {
  exit(72, "FAIL 72 plan contains auto-apply language");
}

const reportsDir = path.join(root, "reports");
const changedInsideReports = existsSync(reportsDir)
  ? walk(reportsDir).map((file) => path.relative(root, file).split(path.sep).join("/"))
  : [];
for (const changed of changedInsideReports) {
  if (!manifest.allowed_changed_paths.includes(changed)) {
    exit(72, `FAIL 72 disallowed report path: ${changed}`);
  }
}

const proposals = plan.proposals ?? [];
if (!Array.isArray(proposals)) exit(71, "FAIL 71 proposals must be an array");
for (const proposal of proposals) requireEvidence(proposal);

for (const proposal of proposals) {
  if (proposal.action === "merge-candidate") {
    const keys = proposal.note_paths.map((notePath) => noteMeta(notePath).meta.canonical_key);
    if (new Set(keys).size !== 1 || proposal.note_paths.length < 2) {
      exit(73, "FAIL 73 merge candidate lacks shared canonical key");
    }
    const manifestMatches = manifest.notes.filter((note) => proposal.note_paths.includes(note.path));
    if (!manifestMatches.every((note) => note.expected_outcome === "merge-candidate")) {
      exit(73, "FAIL 73 merge candidate is not supported by manifest");
    }
  }

  if (proposal.action === "stale-flag") {
    const hasContradiction = proposal.note_paths.some((notePath) =>
      Object.values(currentSources).some((source) => source.supersedes_note_path === notePath)
    );
    if (!hasContradiction) exit(74, "FAIL 74 stale flag lacks current-source contradiction");
  }

  if (proposal.action === "orphan-review") {
    const allZero = proposal.note_paths.every((notePath) => {
      const degree = degrees(graph, notePath);
      return degree.indegree === 0 && degree.outdegree === 0;
    });
    if (!allZero) exit(75, "FAIL 75 orphan claim lacks zero-degree graph evidence");
  }

  if (proposal.action === "conflict-review") {
    const evidence = new Set(proposal.evidence_paths);
    if (!evidence.has("notes/pricing-public.md") || !evidence.has("notes/pricing-sales.md")) {
      exit(71, "FAIL 71 conflict review does not preserve both source paths");
    }
  }

  if (proposal.action === "source-needed") {
    if (/https?:\/\//i.test(proposal.proposed_change) || /fabricated source|invented URL|made-up source/i.test(proposal.proposed_change)) {
      exit(71, "FAIL 71 source-needed proposal appears to invent provenance");
    }
  }
}

const actions = new Map();
for (const proposal of proposals) actions.set(proposal.action, (actions.get(proposal.action) ?? 0) + 1);
for (const [action, count] of Object.entries(manifest.required_actions)) {
  if ((actions.get(action) ?? 0) !== count) {
    exit(71, `FAIL 71 expected ${count} ${action} proposal(s), got ${actions.get(action) ?? 0}`);
  }
}

console.log("PASS valid maintenance plan");
console.log(`PASS proposals: ${proposals.length}`);
console.log("PASS actions: merge-candidate=1 stale-flag=1 source-needed=1 orphan-review=1 conflict-review=1 no-op=1");
console.log("PASS source inventory and hashes unchanged");
