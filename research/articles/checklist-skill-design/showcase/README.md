# checklist-skill-design showcase

This article freezes one showcase name: `release-readiness-checklist`.

Directory split:

- `release-readiness-checklist/fixture/`: isolated npm CLI release-candidate repo template, including `.agents/skills/release-readiness-checklist/`
- `release-readiness-checklist/contracts/`: frozen explicit `$release-readiness-checklist` prompt and output schema
- `release-readiness-checklist/scripts/create-temp-repo.mjs`: copies the fixture into a system temp repo, applies one scenario mutation, and commits a baseline
- `release-readiness-checklist/scripts/release-gate.mjs`: deterministic replay for `ready`, `missing-changelog`, `version-mismatch`, `unverifiable-install`, and `na-without-evidence`
- `release-readiness-checklist/scripts/run-codex-live.mjs`: runs one real Codex explicit skill call against the `ready` scenario
- `release-readiness-checklist/scripts/privacy-scan.mjs`: mechanical scan for runtime IDs and absolute local paths
- `release-readiness-checklist/scripts/validate-report.mjs`: row-level contract validator
- `release-readiness-checklist/scripts/verify-showcase.mjs`: offline replay of `0 / 21 / 22 / 23 / 24 / privacy 0`
- `release-readiness-checklist/results/`: sanitized frozen artifacts

Expected deterministic exits:

- `ready`: `0`
- `missing-changelog`: `21`
- `version-mismatch`: `22`
- `unverifiable-install`: `23`
- `na-without-evidence`: `24`
- `privacy scan`: `0`

Offline replay from the repository root:

```bash
node research/articles/checklist-skill-design/showcase/release-readiness-checklist/scripts/verify-showcase.mjs
```

Nested live run from the repository root:

```bash
node research/articles/checklist-skill-design/showcase/release-readiness-checklist/scripts/run-codex-live.mjs
```

Article state: `showcase_status: verified` after an independent read-only reviewer returned PASS 97/100 with no findings and a visual PASS. The writer-side host-blocked attempt and the successful outer-controller rerun are both preserved; neither result was rewritten or discarded.
