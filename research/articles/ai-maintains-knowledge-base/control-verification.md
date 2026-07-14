# Control verification

核验日期：2026-07-12

## Showcase

- Command: `node research/articles/ai-maintains-knowledge-base/showcase/knowledge-maintenance-proposal/scripts/verify-showcase.mjs`
- Exit: `0`
- Result: valid plan `0`; missing provenance/evidence `71`; destructive mutation or auto-apply `72`; unsupported merge `73`; stale flag without current-source contradiction `74`; orphan claim without zero-degree graph evidence `75`; privacy scan `0`.
- Additional checks: expected action counts, evidence paths, source inventory, source hashes, and allowed changed paths checked by `scripts/validate-plan.mjs`.

## Privacy

- Command: `node research/articles/ai-maintains-knowledge-base/showcase/knowledge-maintenance-proposal/scripts/privacy-scan.mjs`
- Exit: `0`
- Result: no credential, runtime id, account id, or local absolute path leakage found.

## Live attempt

- Command: `CODEX_NESTED_MODEL=gpt-5.5 node research/articles/ai-maintains-knowledge-base/showcase/knowledge-maintenance-proposal/scripts/run-codex-live.mjs`
- Writer attempt: exit `1`; host blocked local state initialization and wrote no reports. Sanitized history: `results/live-attempt-summary.txt`.
- Outer-controller attempt 1: exec `0`, reports 2/2, protected files unchanged, validator `71` because the top-level `fixture` field was missing. Rejected evidence: `results/live-controller-attempt-1-invalid.md`.
- Final allowed retry: exec `0`, reports 2/2, protected files unchanged, validator `0`; six actions present, source inventory/hash unchanged. Accepted evidence: `results/live-controller-summary.json`, `results/live-maintenance-plan.*`, `results/live-validation.txt`.

## Image inspection

- SVG source: `starlight/public/images/articles/ai-maintains-knowledge-base/knowledge-maintenance-control-loop.svg`
- Required dimensions: `1400x900`.
- Writer renderer attempts were blocked; the outer controller then used Chrome headless to render a 1400x900 PNG outside the worktree.
- First controller raster exposed the `75` row crossing the rejection panel and a crowded invariant line. The SVG was corrected and rerendered.
- Final visual result: PASS; all four stages, 71-75 gates, later-apply boundary, and source-unchanged invariant are fully visible with no crop or overflow.

## Partial validator and build

- Partial validator command: `node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs --article starlight/src/content/docs/obsidian-ai/ai-maintains-knowledge-base.mdx --research research/articles/ai-maintains-knowledge-base`
- Partial validator exit: `0`
- Starlight build command: `npm --prefix starlight run build`
- Starlight build exit: `0`
- Diff check command: `git diff --check`
- Diff check exit: `0`
- Versions: Node `v24.11.0`, npm `11.6.1`, Astro `v6.3.3`.

## Independent review

- Initial reviewer report had six scores totaling 97 but mistakenly printed 87 as the total; that inconsistent report was not adopted.
- A fresh Codex Spark read-only reviewer independently rechecked the article, research pack, Showcase, visual asset, privacy, and license boundaries.
- Raw final report was captured outside the worktree; in-repo normalization only removed local-link risk and one duplicated identical verdict heading.
- Verdict: PASS 97/100; blocker/major/minor = 0/0/0; final visual assessment PASS.
- Final state: `showcase_status: verified`, `quality_score: 97`.

## Merged-path replay

- The first replay from the real repository path failed because four scripts derived filesystem paths from `new URL(...).pathname`, leaving Chinese path segments percent-encoded.
- `verify-showcase.mjs`, `validate-plan.mjs`, `privacy-scan.mjs`, and `run-codex-live.mjs` now decode file URLs with Node.js `fileURLToPath`.
- After the fix, the full `0/71/72/73/74/75` matrix and privacy `0` replayed successfully from the Chinese repository path; source inventory and hashes remained unchanged.
