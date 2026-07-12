import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = path.join(root, "fixture/session-lessons.json");
const reportsDir = path.join(root, "reports");
fs.mkdirSync(reportsDir, { recursive: true });

const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

function actionFor(candidate) {
  if (candidate.category === "credential_like") return "reject-sensitive";
  if (candidate.category === "one_time_failure") return "reject-transient";
  if (candidate.stability === "insufficient") return "needs-more-evidence";
  if (candidate.category === "reusable_procedure") return "stage-skill";
  return "stage-memory";
}

function targetStore(candidate, action) {
  if (action === "stage-skill") return "skill";
  if (action === "stage-memory") return candidate.proposed_store;
  return "none";
}

const proposals = fixture.candidates.map((candidate) => {
  const action = actionFor(candidate);
  return {
    candidate_id: candidate.id,
    action,
    target_store: targetStore(candidate, action),
    requires_human_approval: action.startsWith("stage-"),
    evidence_paths: candidate.evidence_paths,
    reason:
      action === "stage-memory"
        ? "Stable fact or preference that should be available at the next session start."
        : action === "stage-skill"
          ? "Reusable multi-step workflow belongs in an on-demand procedure, not always-on memory."
          : action === "reject-transient"
            ? "One-off failure is not durable enough to become memory or procedure."
            : action === "reject-sensitive"
              ? "Credential-shaped material must never enter memory or skill proposals."
              : "Single observation needs repeatable evidence before learning.",
    version_scope: candidate.version_scope,
    provenance: {
      fixture: "fixture/session-lessons.json",
      source_type: "synthetic"
    }
  };
});

const output = {
  fixture_id: fixture.fixture_id,
  generated_at: "2026-07-12",
  model_attempt: {
    requested_model: "gpt-5.5",
    status: "deterministic-baseline",
    reason: "This baseline is generated mechanically; fresh-model evidence is recorded separately under results/live-* files."
  },
  proposals
};

fs.writeFileSync(path.join(reportsDir, "learning-proposals.json"), JSON.stringify(output, null, 2) + "\n");

const rows = proposals.map((proposal) => `| ${proposal.candidate_id} | ${proposal.action} | ${proposal.target_store} | ${proposal.requires_human_approval} | ${proposal.reason} |`);
fs.writeFileSync(
  path.join(reportsDir, "learning-proposals.md"),
  [
    "# Learning Proposals",
    "",
    "| Candidate | Action | Target store | Human approval | Reason |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    ""
  ].join("\n")
);
