# Evidence ledger

核验日期：2026-07-12

| Claim | Evidence | Evidence type | Confidence | Limitation |
| --- | --- | --- | --- | --- |
| Obsidian Search is a core plugin with operators and property search syntax. | https://obsidian.md/help/Plugins/Search | Official documentation | High | Product behavior can change; verified on 2026-07-12. |
| Excluded files do not appear in Search results. | https://obsidian.md/help/Plugins/Search | Official documentation | High | Does not describe every third-party plugin. |
| Properties are stored as YAML at the top of files and are meant for small atomic human/machine-readable values. | https://obsidian.md/help/properties | Official documentation | High | Does not define LearnPrompt's `canonical_key`. |
| Obsidian does not support in-depth bulk property editing directly and suggests VS Code, scripts, or community plugins. | https://obsidian.md/help/properties | Official documentation | High | Exact UI wording may change. |
| Backlinks are links from another note to the active note; linked and unlinked mentions are distinct. | https://obsidian.md/help/Plugins/Backlinks | Official documentation | High | Backlinks UI is not a complete maintenance decision engine. |
| Obsidian supports Wikilinks and Markdown links. | https://obsidian.md/help/links | Official documentation | High | Link graph export is synthetic in this Showcase. |
| Orange Book §06 is used as a secondary topic map only. | Uncommitted routing snapshot supplied by controller and https://github.com/alchaincyf/obsidian-ai-orange-book README | Secondary + official repo README | Medium | The local routing snapshot is not committed; article does not reuse PDF prose or assets. |
| Showcase valid plan exits `0` and negative gates exit `71-75`; privacy exits `0`. | `showcase/knowledge-maintenance-proposal/results/deterministic-verifier.txt` | Local deterministic run | High | The contract applies to this synthetic fixture. |
| Writer nested run was blocked before reports; outer attempt 1 produced plausible proposals but validator rejected missing top-level fixture with `71`; final retry passed with protected files unchanged and validator `0`. | `results/live-attempt-summary.txt`, `results/live-controller-attempt-1-invalid.md`, `results/live-controller-summary.json`, `results/live-validation.txt` | Layered real-run evidence | High | Raw streams stayed outside the worktree; only sanitized evidence is committed. |
| Final fresh `gpt-5.5` live plan contains all six actions and only the two allowed report paths. | `results/live-maintenance-plan.json`, `results/live-maintenance-plan.md`, `results/live-controller-summary.json` | Real local run + deterministic validation | High | Proves this synthetic proposal contract, not autonomous maintenance safety in a real vault. |
| Teaching image is original, licensed CC BY-NC-SA 4.0, and browser-rendered at 1400x900 without crop or overflow after one layout correction. | `asset-ledger.md`, SVG source, `control-verification.md`, `review.md` | Original asset + independent visual inspection | High | Visual verdict applies to this frozen SVG revision. |
