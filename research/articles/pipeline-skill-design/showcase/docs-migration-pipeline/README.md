# docs-migration-pipeline showcase

This showcase isolates one question: how do you recover a multi-stage Skill without turning the whole job into a single huge prompt?

Directory split:

- `fixture/`: isolated Git repo template with 3 legacy Markdown docs and `.agents/skills/docs-migration-pipeline/`
- `contracts/`: frozen nested Codex prompt and output schema
- `scripts/create-temp-repo.mjs`: copies the fixture into a system temp repo and commits a baseline
- `scripts/release-gate.mjs`: deterministic scenario runner for fresh success, crash, resume, stale resume, receipt issue, and rerun stability
- `scripts/run-codex-live.mjs`: runs one real `codex exec` call with explicit `$docs-migration-pipeline`
- `scripts/privacy-scan.mjs`: mechanical scan for runtime IDs and absolute local paths
- `scripts/verify-showcase.mjs`: offline replay of all frozen scenarios and privacy scan
- `results/`: sanitized frozen artifacts

Frozen deterministic exits:

- fresh success: `0`
- crash after transform: `30`
- resume after crash: `0`
- stale resume after input tamper: `32`
- missing or corrupt receipt: `33`
- rerun stability compare: `0`
- privacy scan: `0`

Offline replay from the repository root:

```bash
node research/articles/pipeline-skill-design/showcase/docs-migration-pipeline/scripts/verify-showcase.mjs
```

One real nested Codex attempt from the repository root:

```bash
CODEX_NESTED_MODEL=gpt-5.5 node research/articles/pipeline-skill-design/showcase/docs-migration-pipeline/scripts/run-codex-live.mjs
```

Article state: `showcase_status: verified` after an independent read-only reviewer returned PASS 98/100 with no findings and a visual PASS. The host-blocked attempt and successful outer-controller rerun remain preserved as separate evidence.

Current result:

- offline replay: passed
- writer-side Codex attempt: blocked by read-only state DB and app-server initialization permissions; preserved as historical evidence
- outer-controller gpt-5.5 explicit `$docs-migration-pipeline`: completed; crash `30`, resume `0`, verify `0`, source unchanged, stable candidate hash
- committed live evidence: `results/live-run-summary.json`, `results/codex-stderr-summary.txt`, `results/codex-last-message.json`, `contracts/prompt.md`, `contracts/final-report.schema.json`
