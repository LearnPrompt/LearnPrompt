# Control Verification

Verified at: 2026-07-12.

## Commands Run

```bash
hermes --version
hermes skills --help
hermes curator --help
hermes memory --help
node research/articles/hermes-learning-loop/showcase/scripts/classify-lessons.mjs
node research/articles/hermes-learning-loop/showcase/scripts/validate-learning-proposals.mjs
node research/articles/hermes-learning-loop/showcase/scripts/verify-showcase.mjs
node research/articles/hermes-learning-loop/showcase/scripts/privacy-scan.mjs
CODEX_NESTED_MODEL=gpt-5.5 node research/articles/hermes-learning-loop/showcase/scripts/run-codex-live.mjs
```

## Sanitization

- Raw CLI output was read in the terminal and reduced to `showcase/results/no-model-probe-summary.txt`.
- The research pack does not include local absolute user paths, account identifiers, session IDs, request IDs, real memory entries, real skill content, status output, config output, or profile content.
- The no-model probe only proves the local install: `Hermes Agent v0.17.0 (2026.6.19)`.

## Nested Live Attempt

Requested model: `gpt-5.5`.

Status: completed. The run used Codex `gpt-5.5` against the synthetic Showcase rather than starting Hermes. It read only the fixture, contract, and sanitized no-model probe; wrote only `reports/learning-proposals.json` and `reports/learning-proposals.md`; returned exec `0`; passed validator `0`; and left all protected files unchanged. Raw capture remained outside the worktree; only sanitized final artifacts and summary are committed.

## Deterministic matrix

- Valid `0`; missing provenance `91`; wrong store `92`; sensitive proposal `93`; approval bypass `94`; missing version scope `95`; privacy `0`.
- Frozen candidate hash remained unchanged and exact action counts matched the contract.

## Independent Review

A fresh Codex Spark session reviewed the article, full research pack, Showcase, source/license boundaries, and final rendered teaching image in a read-only sandbox. The writer did not participate in scoring or edit the review. Final result: PASS 100/100, blocker/major/minor = 0/0/0, visual PASS. The complete final report was first stored outside the worktree and then recorded in `review.md`.
