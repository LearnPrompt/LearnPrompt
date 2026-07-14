# markdown-handoff-packet showcase

This showcase isolates one question: what makes a Markdown packet durable enough
for a fresh filesystem-capable agent to continue work without prior chat?

Directory split:

- `fixture/packets/`: five frozen packet variants built around the same synthetic
  timezone-drift incident.
- `contracts/`: the frozen nested Codex prompt and output schema.
- `scripts/create-temp-repo.mjs`: copies one packet into a fresh temp Git repo.
- `scripts/release-gate.mjs`: deterministic packet gate for the five scenarios.
- `scripts/run-codex-live.mjs`: one writer-side real nested `codex exec` attempt
  against the normal packet only.
- `scripts/privacy-scan.mjs`: mechanical scan for runtime IDs, credentials, and
  absolute local paths.
- `scripts/verify-showcase.mjs`: offline replay of `0 / 41 / 42 / 43 / 44 / privacy 0`.
- `results/`: sanitized frozen artifacts only.

Expected deterministic exits:

- normal packet: `0`
- missing evidence or provenance: `41`
- contradictory status or decision: `42`
- structured sensitive marker: `43`
- binary-only or non-text memory: `44`
- privacy scan: `0`

Offline replay from the repository root:

```bash
node research/articles/markdown-as-agent-memory/showcase/markdown-handoff-packet/scripts/verify-showcase.mjs
```

One real nested Codex attempt from the repository root:

```bash
node research/articles/markdown-as-agent-memory/showcase/markdown-handoff-packet/scripts/run-codex-live.mjs
```

Article state rule: the writer keeps `showcase_status: partial`. If the nested
`gpt-5.5` attempt is blocked in this sandbox, the committed evidence stays
blocked; only sanitized frozen artifacts enter the repo.
