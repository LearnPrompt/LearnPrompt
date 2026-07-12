import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const contract = JSON.parse(fs.readFileSync(path.join(root, "contracts/proposal-contract.json"), "utf8"));
const fixtureText = fs.readFileSync(path.join(root, "fixture/session-lessons.json"), "utf8");
const proposalsPath = path.resolve(process.argv[2] ?? path.join(root, "reports/learning-proposals.json"));
const proposalsText = fs.readFileSync(proposalsPath, "utf8");
const proposalsDoc = fs.readFileSync(path.resolve(process.argv[3] ?? path.join(root, "reports/learning-proposals.md")), "utf8");
const fixture = JSON.parse(fixtureText);
const report = JSON.parse(proposalsText);
const expectedByCategory = {
  user_preference: ["stage-memory", "memory:user"],
  project_environment_fact: ["stage-memory", "memory:memory"],
  reusable_procedure: ["stage-skill", "skill"],
  one_time_failure: ["reject-transient", "none"],
  credential_like: ["reject-sensitive", "none"],
  "under-evidenced_tool_behavior": ["needs-more-evidence", "none"],
};

const expectedFixtureHash = "6a8071ce3686bd30b21f19c5b8c755c4de356ada6eab2475620e338e086db1a6";
const actualFixtureHash = crypto.createHash("sha256").update(fixtureText).digest("hex");

function exit(code, message) {
  console.error(`FAIL ${code}: ${message}`);
  process.exit(code);
}

if (actualFixtureHash !== expectedFixtureHash) {
  exit(91, `candidate hashes changed: ${actualFixtureHash}`);
}
if (report.fixture_id !== fixture.fixture_id || report.proposals?.length !== fixture.candidates.length) {
  exit(91, "fixture id or proposal coverage does not match the frozen candidates");
}
if (report.auto_applied === true || (report.applied_changes?.length ?? 0) > 0) {
  exit(94, "report claims learning changes were applied");
}

for (const relativePath of ["reports/learning-proposals.json", "reports/learning-proposals.md"]) {
  if (!contract.allowed_report_paths.includes(relativePath)) {
    exit(91, `unexpected report path ${relativePath}`);
  }
}

const allText = `${proposalsText}\n${proposalsDoc}`;
for (const pattern of contract.privacy.forbid_regex) {
  if (new RegExp(pattern, "i").test(allText)) {
    exit(93, `privacy pattern leaked: ${pattern}`);
  }
}

const counts = Object.fromEntries(contract.allowed_actions.map((action) => [action, 0]));
const fixtureById = new Map(fixture.candidates.map((candidate) => [candidate.id, candidate]));

for (const proposal of report.proposals ?? []) {
  if (!contract.allowed_actions.includes(proposal.action) || !proposal.version_scope) {
    exit(95, `unknown action or missing version scope for ${proposal.candidate_id}`);
  }
  counts[proposal.action] += 1;
  if (!proposal.provenance || !proposal.evidence_paths?.length) {
    exit(91, `missing provenance/evidence for ${proposal.candidate_id}`);
  }
  const candidate = fixtureById.get(proposal.candidate_id);
  if (!candidate) {
    exit(91, `proposal references unknown candidate ${proposal.candidate_id}`);
  }
  const [expectedAction, expectedStore] = expectedByCategory[candidate.category] ?? [];
  if (proposal.action !== expectedAction || proposal.target_store !== expectedStore) {
    exit(92, `candidate ${proposal.candidate_id} routed to ${proposal.action}/${proposal.target_store}`);
  }
  if (proposal.action === "stage-memory" && !String(proposal.target_store).startsWith("memory:")) {
    exit(92, `memory candidate sent to ${proposal.target_store}`);
  }
  if (proposal.action === "stage-skill" && proposal.target_store !== "skill") {
    exit(92, `skill candidate sent to ${proposal.target_store}`);
  }
  if (proposal.action.startsWith("stage-") && proposal.requires_human_approval !== true) {
    exit(94, `staged proposal does not require approval: ${proposal.candidate_id}`);
  }
  if (!proposal.action.startsWith("stage-") && proposal.requires_human_approval === true) {
    exit(94, `rejected proposal incorrectly staged: ${proposal.candidate_id}`);
  }
  if (proposal.auto_applied === true || proposal.applied === true) {
    exit(94, `proposal claims it was applied: ${proposal.candidate_id}`);
  }
  if (proposal.action !== "reject-sensitive" && /SECRET|TOKEN|PRIVATE KEY|s[k]-|g[h]p_/i.test(proposal.reason)) {
    exit(93, `sensitive text appeared outside sensitive rejection: ${proposal.candidate_id}`);
  }
}

for (const [action, expected] of Object.entries(contract.expected_action_counts)) {
  if (counts[action] !== expected) {
    exit(95, `expected ${expected} ${action}, got ${counts[action]}`);
  }
}

console.log("PASS valid 0: proposals match contract");
console.log(`PASS privacy 0: ${contract.privacy.forbid_regex.length} patterns absent`);
console.log(`PASS fixture hash: ${actualFixtureHash}`);
