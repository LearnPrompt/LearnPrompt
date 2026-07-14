# brief.md — markdown-as-agent-memory

## Article card

- Topic: when a Markdown file becomes a durable, auditable handoff record that a fresh filesystem-capable agent can actually use.
- Target reader: Claude Code / Codex users who already understand cross-session memory in principle, but still need a concrete file-record contract.
- Destination MDX: `starlight/src/content/docs/obsidian-ai/markdown-as-agent-memory.mdx`
- Research root: `research/articles/markdown-as-agent-memory`
- Showcase root: `research/articles/markdown-as-agent-memory/showcase/markdown-handoff-packet`
- Public image: `starlight/public/images/articles/markdown-as-agent-memory/durable-memory-record.svg`

## Central question

What makes a Markdown file durable enough to survive a session boundary and
specific enough that a fresh filesystem-capable agent can produce a cited
handoff instead of re-summarizing chat?

## Reader outcome

After reading, the reader should be able to write a small Markdown packet with:

- explicit current status
- accepted decision
- rationale plus evidence pointer
- next command
- known limitation
- scope
- verification date
- provenance

The reader should also be able to say why that packet is not the same thing as a
chat dump, `CLAUDE.md`, `AGENTS.md`, task state, a database row, or secret
storage.

## Non-goals

- Do not repeat the memory-layer article's five lifecycle buckets.
- Do not re-teach recall/eviction policy.
- Do not turn the page into another product-memory comparison.
- Do not re-explain `CLAUDE.md + index.md` navigation design.
- Do not claim Markdown itself creates memory.
- Do not claim every agent automatically loads arbitrary Markdown files.

## Required proof

1. Official sources confirm the filesystem/plain-text/YAML/property boundaries.
2. Official sources confirm the product boundaries: Claude Code memory context
   and Codex `AGENTS.md` instruction surface.
3. Frozen fixture proves a fresh agent can answer status, decision, rationale,
   next command, limitation, and exact citations from five Markdown files only.
4. Negative packet variants are deterministically rejected with `41 / 42 / 43 / 44`.
5. Privacy scan remains `0`.
6. Writer-side failure history and the outer-controller successful replay are recorded as separate facts.

## Source families

- Primary product documentation: Obsidian Help, Claude Code docs, OpenAI Codex docs.
- Primary standards/docs for file portability and auditability: CommonMark, `git diff`.
- Internal calibration reference: `starlight/src/content/docs/agent-engineering/memory-layer.mdx`.
- Secondary topic map only: `obsidian-ai-orange-book`.

## Showcase question

Can a fresh `gpt-5.5` Codex invocation read only a frozen Markdown packet about a
scheduled-digest timezone drift incident and write exactly
`reports/handoff.json` plus `reports/handoff.md`, with precise packet citations
and no source-packet mutation?

## Acceptance criteria

- Frontmatter keeps `showcase_status: partial`.
- No `quality_score`.
- No `SourceCard`.
- Body exceeds 5,000 characters, 1,800 Chinese explanatory characters, and six H2 sections.
- Bottom sources retain Orange Book as secondary topic map only, with attribution
  note and explicit statement that no PDF prose, screenshots, or images were copied.
- Research pack includes `brief.md`, `horizontal-research.md`,
  `vertical-research.md`, `evidence-ledger.md`, `asset-ledger.md`, `showcase/`,
  `control-verification.md`, `release-gate-result.txt`, and `review.md`.
- Deterministic showcase, privacy scan, partial validator, Starlight build, and
  `git diff --check` are all executed and logged with exit codes.

## Build and verification commands

```bash
node research/articles/markdown-as-agent-memory/showcase/markdown-handoff-packet/scripts/verify-showcase.mjs
node research/articles/markdown-as-agent-memory/showcase/markdown-handoff-packet/scripts/run-codex-live.mjs
node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs --article starlight/src/content/docs/obsidian-ai/markdown-as-agent-memory.mdx --research research/articles/markdown-as-agent-memory
npm --prefix starlight run build
git diff --check
```

## Writer-stage state rule

Writer stage stays `partial`. A blocked writer run must not be rewritten into
success; an outer controller may replay the same frozen contract, but neither
result authorizes a writer self-score or PASS.
