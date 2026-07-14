# Vault Placement Contract Showcase

This frozen showcase demonstrates one question only:

> Can an agent turn a synthetic Obsidian inbox into a stable placement plan
> without guessing across a personal vault?

## Scope

- Fixture root: `fixture/synthetic-vault/`
- Frozen inputs:
  - `fixture/inbox-manifest.json`
  - `fixture/vault-policy.json`
- Public outputs from one live Codex attempt:
  - `reports/placement-plan.json`
  - `reports/placement-plan.md`

## Contract

- The numbering and folder names are a LearnPrompt example contract, not an
  Obsidian standard.
- `00_收件箱` is intake only and is never a canonical destination.
- Every manifest item must be accounted for exactly once.
- The sensitive-marker item must be rejected with `destination: null`.
- No fixture file may be moved, renamed, or deleted.
- Raw nested-agent logs stay outside the worktree. Only sanitized evidence may
  be committed here.

## Deterministic exits

- `0`: valid plan
- `51`: orphan or unaccounted item
- `52`: folder-role mismatch
- `53`: unstable or unknown root
- `54`: sensitive item placed instead of rejected
- `55`: duplicate canonical destination

## Verification entrypoints

- `node scripts/validate-placement-plan.mjs --plan <json>`
- `node scripts/privacy-scan.mjs`
- `node scripts/run-codex-live.mjs`

`verify-showcase.mjs` is added after the live attempt so the fixture stays free
of reference answers during the nested run.
