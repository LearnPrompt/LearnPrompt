# Writer-stage release gate

Date: 2026-07-12.

| Gate | Writer-stage result | Evidence |
| --- | --- | --- |
| Official-source research | PASS | horizontal/vertical research and evidence ledger |
| Orange Book boundary | PASS | secondary topic map only; no copied PDF/image/text; no standard repo license |
| Deterministic Showcase | PASS | `results/deterministic-verifier.txt` with 0/111-115 |
| Showcase privacy | PASS | `privacy-scan.mjs` exit 0 |
| Fresh-model layer | BLOCKED transparently; reviewer accepted deterministic authority | `results/live-controller-summary.json` and `live-blocked-summary.md`; no reports written, protected files unchanged |
| Teaching image | PASS writer check and independent visual review | article-local 1400x900 SVG, asset ledger, `visual-check.md`, `review.md` |
| Independent review | PASS 100/100, 0/0/0, visual PASS | `review.md` |
| Single-article validator | PASS verified 100/100 | article/research/status all PASS |
| Starlight build | PASS after lane-local `npm ci` | first attempt lacked lane dependencies; final build produced 49 pages |
| Diff boundary | PASS | `git diff --check` exit 0; changed paths only the target MDX, its research directory, and its article-local image directory |

Final status: verified 100/100. Fresh-model failure was not converted into success; the independent reviewer accepted the replayable deterministic cost/safety contract as the authoritative proof layer.
