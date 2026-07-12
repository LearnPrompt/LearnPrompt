# Live routing task

This repository is a fully synthetic fixture. Do not use `cat`, `sed`, `rg`,
`grep`, `find`, `ls`, Python, or any direct file-reading mechanism.

Read fixture documents only with this exact wrapper form:

```bash
node scripts/read-doc.mjs <vault-relative-path> reports/read-trace.log
```

Run exactly ten wrapper reads in this order:

1. `CLAUDE.md`
2. `index.md`
3. the area index for `task-release-checklist`, then its canonical target
4. the area index for `task-citation-policy`, then its canonical target
5. the area index for `task-newsletter-runbook`, then its canonical target
6. the area index for `task-vault-audit`, then its canonical target

Task requests and route keys:

- `task-release-checklist`: projects, route key `release-checklist`
- `task-citation-policy`: research, route key `citation-policy`
- `task-newsletter-runbook`: publishing, route key `newsletter-runbook`
- `task-vault-audit`: systems, route key `vault-audit-runbook`

Use the indexes to discover each canonical target. Write only:

- `reports/routes.json`
- `reports/routes.md`
- `reports/read-trace.log` (created only by the wrapper)

The JSON must contain `generated_at`, `model`, `budget`, and exactly four
`routes`. Each route requires `task_id`, `route_key`, `area`, `area_index`,
`target`, `owner`, `verified_date`, `fallback`, `citation`, and
`target_heading`. Set the synthetic budget to `routed_reads: 10` and
`naive_inventory_files: 26`. Use exact canonical target paths as citations.
Do not modify fixture, contracts, scripts, cases, or results. Do not recursively
inventory anything. A deterministic validator, not your success message, decides
whether the run passes.
