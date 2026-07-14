# Brief

## Article card

- Topic: `CLAUDE.md + index.md` routing budget for Obsidian-style Markdown vaults.
- Target reader: Chinese-speaking LearnPrompt reader who already knows what an Obsidian vault is and wants to let Claude Code or Codex navigate a shared/synthetic vault without recursive scanning.
- Outcome: The reader can design a small instruction surface plus project-authored indexes that route an Agent to canonical entrypoints and reject unsafe routes.
- Destination MDX: `starlight/src/content/docs/obsidian-ai/claude-md-index-navigation.mdx`
- Research path: `research/articles/claude-md-index-navigation`
- Showcase path: `research/articles/claude-md-index-navigation/showcase/index-routing-budget`
- Build command: `npm --prefix starlight run build`
- Verification date: 2026-07-12

## Frozen editorial question

Teach when `CLAUDE.md + index.md` actually reduces navigation breadth: the instruction file defines routing behavior, while project-authored indexes expose canonical entrypoints. Do not claim `index.md` is a Claude Code feature.

## Non-goals

- Do not repeat the durable handoff packet tutorial.
- Do not repeat the vault placement contract tutorial.
- Do not teach Git rollback or branch workflow.
- Do not use a real personal vault, private note, account identifier, or product screenshot.
- Do not claim universal token savings from one synthetic comparison.

## Required proof

- Official Claude Code memory documentation for `CLAUDE.md`, `@path` imports, subdirectory loading, and `AGENTS.md` boundary.
- Official Codex `AGENTS.md` documentation for analogous instruction-chain behavior.
- Obsidian official pages only for plain-text vault and search/property boundaries.
- Synthetic Showcase with exactly 26 inspectable text files and deterministic 10/26 routed trace.

## Acceptance criteria

- MDX is fully rewritten, contains no `SourceCard`, and reaches `showcase_status: verified` only after independent review.
- Research pack contains brief, horizontal research, vertical research, evidence ledger, asset ledger, Showcase README/contracts/scripts/results, control verification, release-gate result, and final review.
- Teaching image exists at `/images/articles/claude-md-index-navigation/index-routing-budget.svg` with concrete alt/caption and CC BY-NC-SA 4.0 license.
- Deterministic verifier reproduces exits `0`, `61`, `62`, `63`, `64`, `65`; privacy scan exits `0`.
- Writer nested live attempt is attempted at most once; any permitted outer recovery keeps the same frozen contract and preserves the blocked history separately.
