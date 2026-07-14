# Evidence Ledger

Verified at: 2026-07-12.

| Claim | Evidence | Evidence type | Confidence | Limitation |
| --- | --- | --- | --- | --- |
| Built-in memory is bounded, curated, and persists across sessions. | Hermes memory docs: `MEMORY.md` and `USER.md` with persistent storage and session-start injection. | Primary docs | High | Docs may change after verification date. |
| Default official char limits are 2200 for MEMORY and 1375 for USER. | Hermes memory docs configuration section. | Primary docs | High | Version-scoped to online docs checked 2026-07-12. |
| Memory snapshot is frozen at session start; mid-session writes affect later sessions. | Hermes memory docs frozen snapshot section and tips page. | Primary docs | High | Does not prove implementation internals for every install. |
| Memory stores "what"; Skills store "how". | Hermes tips and skills docs. | Primary docs | High | Editorial shorthand, but directly supported by docs. |
| Background review may save memory or update/stage skills after a turn. | Hermes memory docs background review notification and skills approval section. | Primary docs | High | "May" is important; no guarantee every turn learns correctly. |
| `memory.write_approval: true` stages writes; commands include `/memory pending`, `/memory approve`, `/memory reject`. | Hermes memory docs. | Primary docs | High | Docs also mention approval on/off; article focuses on requested commands. |
| `skills.write_approval: true` stages skill writes; commands include `/skills pending`, `/skills diff`, `/skills approve`, `/skills reject`. | Hermes skills docs. | Primary docs | High | Full diff best reviewed in CLI/dashboard/pending JSON; chat may truncate. |
| Curator is a separate periodic skill maintenance path. | Hermes curator docs and local `hermes curator --help`. | Primary docs + local probe | High | Bundled built-in scope differs between local v0.17.0 help and current docs. |
| External memory providers are optional and run alongside built-in memory. | Hermes memory docs; local `hermes memory --help` says built-in memory is always active. | Primary docs + local probe | Medium-high | Provider list differs between online docs and local help, so article avoids stable counts. |
| Local probe version is Hermes Agent v0.17.0 (2026.6.19). | `hermes --version`, sanitized summary in `showcase/results/no-model-probe-summary.txt`. | Live no-model probe | High for local machine | Output also contained local project/Python/SDK details; research pack stores only sanitized subset. |
| Showcase reproduces valid `0`, rejection exits `91-95`, privacy `0`, exact action counts, and unchanged candidate hash. | `showcase/results/deterministic-verifier.txt`, `showcase/results/showcase-result.txt`. | Deterministic run | High | Synthetic fixture only. |
| Fresh `gpt-5.5` wrote only two proposal reports; validator returned `0` and protected files stayed unchanged. | `showcase/results/live-controller-summary.json`, `live-learning-proposals.*`, `live-validation.txt`. | Real model run + deterministic validation | High | This is a proposal-only run, not a real Hermes memory/Skill write. |
| Orange Book v2.0 is based on Hermes v0.16.0 and MIT licensed. | `alchaincyf/hermes-agent-orange-book` README and LICENSE. | Secondary topic map + repository license | High | Product facts must still go back to official docs and local probe. |
