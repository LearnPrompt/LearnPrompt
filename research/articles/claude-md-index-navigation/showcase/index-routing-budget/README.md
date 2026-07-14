# Showcase: index-routing-budget

Status: Showcase live and deterministic gates complete; independent review PASS 100/100; article verified.

## Question

Can `CLAUDE.md + index.md` reduce navigation breadth when the instruction file defines routing behavior and project-authored indexes expose canonical entrypoints?

## Synthetic fixture

The vault under `fixture/synthetic-vault/` contains exactly 26 inspectable text files:

- 1 root `CLAUDE.md`
- 1 root `index.md`
- 4 area indexes: `projects/index.md`, `research/index.md`, `publishing/index.md`, `systems/index.md`
- 20 target notes: 5 per area

The four tasks in `fixture/tasks.json` each belong to a different area:

| Task | Area | Correct target |
| --- | --- | --- |
| `task-release-checklist` | `projects` | `projects/release-checklist.md` |
| `task-citation-policy` | `research` | `research/citation-policy.md` |
| `task-newsletter-runbook` | `publishing` | `publishing/newsletter-runbook.md` |
| `task-vault-audit` | `systems` | `systems/vault-audit-runbook.md` |

## Read contract

`scripts/read-doc.mjs` is the only allowed fixture-reading wrapper for routed execution. It appends one normalized vault-relative path per read to `reports/read-trace.log`.

The valid trace is exactly:

```text
CLAUDE.md
index.md
projects/index.md
projects/release-checklist.md
research/index.md
research/citation-policy.md
publishing/index.md
publishing/newsletter-runbook.md
systems/index.md
systems/vault-audit-runbook.md
```

This is a 10-read routed trace compared with a deterministic 26-file naive inventory. It is a synthetic comparison only and does not claim universal token savings.

## Commands

```bash
node research/articles/claude-md-index-navigation/showcase/index-routing-budget/scripts/verify-showcase.mjs
node research/articles/claude-md-index-navigation/showcase/index-routing-budget/scripts/privacy-scan.mjs
node research/articles/claude-md-index-navigation/showcase/index-routing-budget/scripts/article-gate.mjs
CODEX_NESTED_MODEL=gpt-5.5 node research/articles/claude-md-index-navigation/showcase/index-routing-budget/scripts/run-codex-live.mjs
```

## Deterministic exits

`scripts/validate-routes.mjs` reproduces:

- valid route: `0`
- missing route: `61`
- ambiguous duplicate route: `62`
- read-budget or recursive-scan violation: `63`
- stale or nonexistent target: `64`
- private/sensitive target route: `65`
- privacy scan: `0`

## Live attempt

The writer attempted the nested live run once on 2026-07-12. It exited `2` before model execution because the host rejected the obsolete `--ask-for-approval` argument. The sanitized failure history remains in `results/live-blocked-summary.md` and `results/live-attempt-summary.json`.

The outer controller corrected only the CLI invocation and reran the same frozen contract. Fresh `gpt-5.5` wrote the three allowed artifacts; the 26-file fixture stayed byte-identical, no forbidden direct reader was observed, and `validate-routes.mjs` accepted the exact 10-read trace. The accepted live artifacts are archived as `results/live-routes.json`, `results/live-routes.md`, and `results/live-read-trace.log`; the controller summary is `results/live-controller-summary.json`.
