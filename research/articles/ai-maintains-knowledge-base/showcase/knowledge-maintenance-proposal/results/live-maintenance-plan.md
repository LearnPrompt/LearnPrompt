# Maintenance Plan

Fixture: `knowledge-maintenance-proposal`

Source preservation rule: Source notes and frozen manifests must remain byte-identical; AI may write only a maintenance proposal.

Applied changes: none.

## Proposals

### 1. merge-candidate

- Notes: `notes/alpha-project-brief.md`, `notes/alpha-accessibility-notes.md`
- Evidence: `maintenance-manifest.json`, `notes/alpha-project-brief.md`, `notes/alpha-accessibility-notes.md`
- Observed fact: Both Alpha notes share the frozen canonical key `alpha-launch-plan`. The project brief covers beta dependencies; the accessibility note adds keyboard navigation, contrast review, and reduced motion requirements.
- Proposed change: Ask a human reviewer to merge the complementary Alpha launch details or explicitly keep the split.
- Confidence: high
- Requires human approval: true
- Reason: Shared canonical key plus complementary content makes this an auditable merge candidate.

### 2. stale-flag

- Notes: `notes/payment-policy.md`
- Evidence: `notes/payment-policy.md`, `current-sources.json`
- Observed fact: The note says invoices are due in 30 days. `current-sources.json` says `sources/billing-policy-2026.md` now claims new-contract invoices are due in 14 days and supersedes `notes/payment-policy.md`.
- Proposed change: Flag the note as stale for human review.
- Confidence: high
- Requires human approval: true
- Reason: The current source directly contradicts the note.

### 3. source-needed

- Notes: `notes/vendor-summary.md`
- Evidence: `notes/vendor-summary.md`, `maintenance-manifest.json`
- Observed fact: The note has an empty `source_path` and states that no source file or URL is named.
- Proposed change: Ask a human reviewer to provide the missing source; do not invent a URL.
- Confidence: high
- Requires human approval: true
- Reason: The claim is useful but unaudited in the allowed inputs.

### 4. orphan-review

- Notes: `notes/lonely-idea.md`
- Evidence: `notes/lonely-idea.md`, `link-graph.json`
- Observed fact: `notes/lonely-idea.md` appears as a graph node with zero incoming and zero outgoing edges.
- Proposed change: Ask a human reviewer to decide whether it should remain disconnected, receive links, or be retired.
- Confidence: high
- Requires human approval: true
- Reason: The frozen graph proves the orphan condition.

### 5. conflict-review

- Notes: `notes/pricing-public.md`, `notes/pricing-sales.md`
- Evidence: `notes/pricing-public.md`, `notes/pricing-sales.md`, `current-sources.json`
- Observed fact: Both notes share `pricing-page`, but preserve competing source paths: `sources/pricing-public.md` for per-seat monthly public pricing and `sources/pricing-sales.md` for annual-only contracted-account pricing.
- Proposed change: Route the pair to human conflict review while preserving both source paths and scoped claims.
- Confidence: high
- Requires human approval: true
- Reason: The claims may differ by context and should not be collapsed automatically.

### 6. no-op

- Notes: `notes/team-rituals.md`
- Evidence: `notes/team-rituals.md`, `link-graph.json`
- Observed fact: The note is current, explicitly says no maintenance action is needed, links to `alpha-project-brief`, and is linked from `research-index`.
- Proposed change: Take no maintenance action.
- Confidence: high
- Requires human approval: true
- Reason: The note is connected and no allowed current source contradicts it.
