---
name: docs-migration-pipeline
description: Migrate three legacy Markdown docs into Starlight-compatible migration candidates inside an isolated temp repo. Use when you need stage receipts, crash recovery, resume validation, or deterministic candidate packaging without touching real user docs.
---

# docs-migration-pipeline

This skill orchestrates a five-stage migration candidate pipeline:

1. `inventory`
2. `normalize`
3. `transform`
4. `validate`
5. `package-candidate`

Required reading before execution:

- `references/stage-contract.md`

Deterministic commands:

- Run the pipeline:
  - `node .agents/skills/docs-migration-pipeline/scripts/run-pipeline.mjs`
- Simulate a crash after `transform`:
  - `node .agents/skills/docs-migration-pipeline/scripts/run-pipeline.mjs --scenario crash-after-transform`
- Resume after a checkpoint:
  - `node .agents/skills/docs-migration-pipeline/scripts/run-pipeline.mjs --resume`
- Verify receipt integrity:
  - `node .agents/skills/docs-migration-pipeline/scripts/verify-receipts.mjs`

Execution rules:

- Only work inside this isolated fixture repo.
- Never overwrite files in `legacy/`.
- All stage receipts must include `input_sha`, `output_sha`, `command`, `exit_code`, `status`, and stable sequence fields.
- A resume may reuse a stage only when the prior receipt is intact and its `input_sha` still matches the current inputs.
- If input hashes drift, stop with stale-resume exit `32`.
- If a required receipt is missing or corrupt, stop with receipt-issue exit `33`.
- The final artifact is a migration candidate package, not a published doc.
