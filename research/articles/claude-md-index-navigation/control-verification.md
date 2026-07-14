# Control Verification

Verification date: 2026-07-12.

## Environment

- Node: `v24.11.0`
- npm: `11.6.1`
- Nested model requested: `gpt-5.5`
- Writer live attempt limit: attempted once only; outer controller later supplemented the same frozen contract without re-invoking the article Skill.
- Image render tool: `sharp` from `starlight/node_modules/sharp`, output to a temporary PNG outside the worktree.

## Commands and results

| Command | Exit | Relevant result |
| --- | ---: | --- |
| `node research/articles/claude-md-index-navigation/showcase/index-routing-budget/scripts/verify-showcase.mjs` | 0 | Valid route `0`; missing `61`; duplicate `62`; scan/budget `63`; stale/nonexistent `64`; private/sensitive `65`; source unchanged. |
| `node research/articles/claude-md-index-navigation/showcase/index-routing-budget/scripts/privacy-scan.mjs` | 0 | No secrets, local absolute paths, or runtime identifiers found. |
| `node research/articles/claude-md-index-navigation/showcase/index-routing-budget/scripts/article-gate.mjs` | 0 | Verified metadata, source policy, teaching image, research files, and independent PASS review present. |
| `CODEX_NESTED_MODEL=gpt-5.5 node research/articles/claude-md-index-navigation/showcase/index-routing-budget/scripts/run-codex-live.mjs` | 2 | Blocked by host CLI argument handling before a model route could be produced; sanitized summary preserved. |
| Outer-controller replay of the same command after correcting the CLI shape | 0 | Fresh `gpt-5.5`; fixture unchanged; three reports written; exact 10-read trace; forbidden direct read `null`; validator `0`; raw stream outside worktree. |
| `node -e "const sharp=require('./starlight/node_modules/sharp'); sharp('starlight/public/images/articles/claude-md-index-navigation/index-routing-budget.svg').png().toFile('<temp-render-png>')..."` | 0 | Rendered PNG 1400x900 outside the worktree for visual inspection. |
| `npm --prefix starlight run build` | 0 | Built 49 pages; `/obsidian-ai/claude-md-index-navigation/` generated. |
| `git diff --check` | 0 | No whitespace errors. |
| `node - <<'NODE' ... chinese/h2 count ... NODE` | 0 | Chinese explanatory characters without code: 2975; H2 count: 10. |

## Image inspection

Rendered file: temporary PNG outside the worktree.

Inspection result:
- Size is 1400x900.
- No crop at edges.
- Main route nodes are readable: task, `CLAUDE.md`, root index, area index, canonical target.
- Budget comparison is readable: `10 reads` versus `26 files`.
- Rejection branches `61`, `62`, `63`, `64`, `65` are visible and labels fit their boxes.
- Diagram is explanatory rather than a decorative banner.

## Independent review

- Reviewer: separate Codex Spark read-only session; writer did not score or edit the verdict.
- Raw final report: captured outside the worktree, then normalized only to remove a local absolute image link.
- Verdict: PASS 100/100; blocker/major/minor = 0/0/0; final visual assessment PASS.

## Limitations

- Live `gpt-5.5` evidence is available from the outer-controller replay; writer failure history remains separately preserved.
- The deterministic 10/26 comparison is synthetic and only demonstrates the fixture contract.
- The synthetic 10/26 result is not claimed as a universal token-saving ratio.
- Final state: `showcase_status: verified`, `quality_score: 100`.
