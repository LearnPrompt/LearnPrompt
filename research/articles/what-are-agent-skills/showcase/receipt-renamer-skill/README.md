# receipt-renamer-skill showcase

This showcase isolates one question: when is a repeated receipt-cleanup prompt worth promoting into an on-demand skill package?

Directory split:

- `fixture/`: the isolated Git repo template, including `.agents/skills/receipt-renamer/`
- `contracts/`: the frozen nested Codex prompt and output schema
- `scripts/create-temp-repo.mjs`: copies the fixture into a system temp repo and commits a baseline
- `scripts/release-gate.mjs`: deterministic dry-run replay for `normal`, `missing-currency`, and `conflict`
- `scripts/run-codex-live.mjs`: attempts one real nested `codex exec` run against `normal-batch`
- `scripts/privacy-scan.mjs`: mechanical scan for runtime IDs and absolute local paths
- `scripts/verify-showcase.mjs`: offline replay of `0 / 21 / 23 / privacy 0`
- `results/`: sanitized frozen artifacts

Expected deterministic exits:

- normal batch: `0`
- missing `currency`: `21`
- target filename conflict: `23`
- privacy scan: `0`

Offline replay from the repository root:

```bash
node research/articles/what-are-agent-skills/showcase/receipt-renamer-skill/scripts/verify-showcase.mjs
```

Nested live run from the repository root:

```bash
node research/articles/what-are-agent-skills/showcase/receipt-renamer-skill/scripts/run-codex-live.mjs
```

Article state rule: the writer kept `showcase_status: partial` until an independent reviewer cleared the article. The writer-sandbox nested run was blocked by host permissions; the controller later reran the same frozen fixture, prompt, and schema successfully from the outer environment. The committed results preserve that final sanitized run, and the independent review later passed 96/100 with no findings.
