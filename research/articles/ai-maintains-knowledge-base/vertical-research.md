# Vertical research

核验日期：2026-07-12

## Central question

How can AI help maintain a Markdown knowledge base without silently rewriting it?

## Mechanism

The useful unit is not "AI updates notes"; it is a maintenance proposal:

1. Detect observable signals from Search, properties, backlinks, links, and frozen manifests.
2. Attach evidence paths so a human can inspect the claim.
3. Produce a diff-like proposed change, not an applied edit.
4. Require explicit human approval before any later apply workflow.

This separation matters because "duplicate", "stale", "orphan", and "conflict" are editorial decisions. A similarity score, old date, or zero link count can raise a question, but it does not by itself decide whether notes should be merged, rewritten, linked, archived, or left alone.

## Failure modes

- Evidence-free cleanup: AI says "merge these" without paths to both notes and the rule that made them candidates.
- Stale-by-age: AI flags a note stale only because `last_verified` is old, without a current source contradiction.
- Orphan-by-ui: AI trusts a visible backlink panel while excluded files hide mentions.
- Source invention: a missing-source note receives a plausible but fabricated URL.
- Conflict collapse: AI chooses one source as truth and overwrites the other.
- Silent auto-apply: the assistant edits notes during the same run that is supposed to generate a proposal.

## Boundary conditions

- Search and backlinks are signals, not complete proofs. Excluded files affect Search and unlinked mentions.
- Properties should hold small atomic values such as `canonical_key`, `status`, `source_path`, and `last_verified`, not full editorial arguments.
- Link graph evidence should be frozen for the run when using orphan gates.
- Current-source contradiction should be explicit and dated.
- Human approval remains mandatory because editorial intent, audience, and source authority are outside the mechanical signal.

## Showcase design

The frozen synthetic fixture uses deterministic signals:

- Merge candidates share the same `canonical_key` and complementary text.
- Stale flag requires contradiction with `current-sources.json`.
- Orphan review requires zero in-degree and zero out-degree in `link-graph.json`.
- Conflict review preserves both source paths.
- Source-needed refuses invented URLs.
- No-op demonstrates restraint.

The deterministic validator verifies the proposal structure, action counts, exact evidence, allowed changed paths, source inventory, source hashes, and privacy scan. The model's own success message is not accepted as proof.

