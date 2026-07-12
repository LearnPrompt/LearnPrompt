import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function fail(code, message) {
  console.error(message);
  process.exit(code);
}

function parseArgs(argv) {
  const args = {
    manifest: "../fixture/inbox-manifest.json",
    policy: "../fixture/vault-policy.json",
    plan: "../reports/placement-plan.json",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!value) {
      fail(64, `missing value for ${key}`);
    }
    if (key === "--manifest") {
      args.manifest = value;
    } else if (key === "--policy") {
      args.policy = value;
    } else if (key === "--plan") {
      args.plan = value;
    } else {
      fail(64, `unknown argument: ${key}`);
    }
    i += 1;
  }

  return args;
}

function loadJson(path) {
  return JSON.parse(readFileSync(resolve(import.meta.dirname, path), "utf8"));
}

function expectedDestination(item, policy) {
  const template = policy.placement_templates[item.artifact_kind];
  if (!template) {
    return null;
  }

  return template
    .replaceAll("{scope_folder}", item.scope_folder)
    .replaceAll("{filename_slug}", item.filename_slug)
    .replaceAll("{extension}", item.extension);
}

function knownRoots(policy) {
  return new Set(Object.values(policy.roles).map((role) => role.root));
}

const EXIT = {
  ORPHAN: 51,
  ROLE: 52,
  ROOT: 53,
  SENSITIVE: 54,
  DUPLICATE: 55,
};

const { manifest, policy, plan } = parseArgs(process.argv);
const manifestJson = loadJson(manifest);
const policyJson = loadJson(policy);
const planJson = loadJson(plan);

if (!Array.isArray(planJson.rows)) {
  fail(EXIT.ORPHAN, "plan rows must be an array");
}

const items = manifestJson.items;
const itemsById = new Map(items.map((item) => [item.id, item]));
const seenIds = new Set();
const canonicalDestinations = new Set();
const roots = knownRoots(policyJson);

let placedItems = 0;
let rejectedItems = 0;

for (const row of planJson.rows) {
  const itemId = row?.source_item?.id;
  if (!itemId || !itemsById.has(itemId) || seenIds.has(itemId)) {
    fail(EXIT.ORPHAN, "plan contains missing, unknown, or duplicate source items");
  }
  seenIds.add(itemId);

  const item = itemsById.get(itemId);

  if (item.artifact_kind === "sensitive-marker") {
    const expected = policyJson.sensitivity_rules[item.sensitivity];
    if (
      row.action !== expected.action ||
      row.destination !== expected.destination ||
      row.role !== expected.role ||
      row.canonical !== expected.canonical ||
      row.sensitivity_decision !== expected.sensitivity_decision
    ) {
      fail(EXIT.SENSITIVE, "sensitive marker item must be rejected");
    }
    rejectedItems += 1;
    continue;
  }

  if (row.action !== "place" || typeof row.destination !== "string") {
    fail(EXIT.ROLE, "non-sensitive items must be placed with a string destination");
  }

  const [root] = row.destination.split("/");
  if (!roots.has(root) || root === policyJson.intake_root) {
    fail(EXIT.ROOT, "destination uses an unstable or unknown root");
  }

  const expectedRole = policyJson.kind_to_role[item.artifact_kind];
  const expectedPath = expectedDestination(item, policyJson);
  if (canonicalDestinations.has(row.destination)) {
    fail(EXIT.DUPLICATE, "canonical destination must be unique");
  }
  if (
    row.role !== expectedRole ||
    row.destination !== expectedPath ||
    row.canonical !== true
  ) {
    fail(EXIT.ROLE, "destination does not match the canonical role contract");
  }
  canonicalDestinations.add(row.destination);

  if (typeof row.sensitivity_decision !== "string" || row.sensitivity_decision.length === 0) {
    fail(EXIT.ROLE, "sensitivity decision must be a non-empty string");
  }

  placedItems += 1;
}

if (seenIds.size !== items.length) {
  fail(EXIT.ORPHAN, "not every manifest item was accounted for");
}

if (
  planJson.summary?.accounted_items !== items.length ||
  planJson.summary?.placed_items !== placedItems ||
  planJson.summary?.rejected_items !== rejectedItems ||
  planJson.summary?.canonical_destinations !== canonicalDestinations.size
) {
  fail(EXIT.ORPHAN, "summary counts do not match the rows");
}

console.log(
  JSON.stringify(
    {
      exit_code: 0,
      accounted_items: items.length,
      placed_items: placedItems,
      rejected_items: rejectedItems,
      canonical_destinations: canonicalDestinations.size,
    },
    null,
    2,
  ),
);
