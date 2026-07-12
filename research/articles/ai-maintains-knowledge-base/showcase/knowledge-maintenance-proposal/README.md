# knowledge-maintenance-proposal Showcase

This is a fully synthetic knowledge base for testing maintenance proposals without editing the knowledge base.

## Contract

- Source fixture: `notes/*.md`, `maintenance-manifest.json`, `link-graph.json`, `current-sources.json`.
- Allowed live outputs: `reports/maintenance-plan.json`, `reports/maintenance-plan.md`.
- Required outcomes: `merge-candidate`, `stale-flag`, `source-needed`, `orphan-review`, `conflict-review`, `no-op`.
- The validator rejects missing evidence with `71`, auto-apply or destructive mutation with `72`, unsupported merge with `73`, stale without current-source contradiction with `74`, and orphan without zero-degree graph evidence with `75`.
- Privacy scan must exit `0`.

## Reproduce

```bash
node scripts/verify-showcase.mjs
node scripts/privacy-scan.mjs
CODEX_NESTED_MODEL=gpt-5.5 node scripts/run-codex-live.mjs
```

The writer nested command was blocked and remains recorded in `results/live-attempt-summary.txt`. Outer-controller attempt 1 produced reports but was mechanically rejected with `71` for a missing top-level fixture field. The final allowed retry completed: fresh `gpt-5.5` wrote only the two allowed reports, validator returned `0`, and protected files plus source inventory/hashes stayed unchanged. Accepted live artifacts are archived under `results/live-maintenance-plan.*`, with `results/live-controller-summary.json` and `results/live-validation.txt`.

## Writer-stage handoff and final status

Writer stage kept the article `showcase_status: partial`, omitted `quality_score`, and left `review.md` PENDING for an external reviewer. A separate read-only reviewer later issued PASS 97/100 with zero unresolved findings and a final visual PASS, so the article is now `verified`.
