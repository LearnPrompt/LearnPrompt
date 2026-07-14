You are maintaining a synthetic Markdown knowledge base. Do not edit any source note or manifest.

Read only these files:

- `maintenance-manifest.json`
- `link-graph.json`
- `current-sources.json`
- `notes/*.md`

Write exactly two files:

- `reports/maintenance-plan.json`
- `reports/maintenance-plan.md`

The JSON must follow `contracts/maintenance-plan.schema.json`. Its top level must include exactly these contract fields before the proposals:

```json
{
  "fixture": "knowledge-maintenance-proposal",
  "generated_by": "gpt-5.5-live",
  "source_preservation_rule": "Source notes and frozen manifests must remain byte-identical; AI may write only a maintenance proposal.",
  "applied_changes": [],
  "proposals": []
}
```

Populate `proposals` with exactly six auditable proposals:

- `merge-candidate`
- `stale-flag`
- `source-needed`
- `orphan-review`
- `conflict-review`
- `no-op`

Every proposal must include:

- `action`
- `note_paths`
- `evidence_paths`
- `observed_fact`
- `proposed_change`
- `confidence`
- `requires_human_approval: true`
- `source_preservation_rule`
- `reason`

Rules:

- Merge candidates must share the same frozen canonical key and have complementary content.
- Stale status requires contradiction with `current-sources.json`.
- Orphan review requires zero in-degree and zero out-degree in `link-graph.json`.
- Conflict review must preserve both competing source paths.
- Missing-source notes must not receive an invented URL.
- No-op must demonstrate restraint.
- The model success message is not proof; a deterministic validator will check the reports.
