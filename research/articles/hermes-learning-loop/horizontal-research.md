# Horizontal Research

Verified at: 2026-07-12.

| Source | Type | Supports | Cannot Prove / Limitation |
| --- | --- | --- | --- |
| Hermes official memory documentation | Primary product docs | Built-in `MEMORY.md` / `USER.md`, 2200 / 1375 char limits, frozen session-start injection, write approval commands, background review notifications, external memory provider role. | Online docs may track a newer release than the local v0.17.0 install. |
| Hermes official skills documentation | Primary product docs | Skills are longer on-demand procedures; background review can suggest/stage skill changes; `skills.write_approval` stages create/edit/patch/delete/write_file/remove_file; `/skills pending|diff|approve|reject`. | The docs describe current behavior, not every historical local install. |
| Hermes official curator documentation | Primary product docs | Curator is a periodic maintenance path for skills, with archive/restore/backup/rollback and scoped lifecycle rules. | It differs from local v0.17.0 CLI help on bundled built-in handling; article must version-scope this. |
| Hermes tips documentation | Primary product docs | Memory vs Skills: memory stores "what", skills store "how"; memory is a frozen snapshot; context files and skills are different mechanisms. | Tips are pedagogical guidance, not a formal API contract. |
| NousResearch/hermes-agent GitHub repository and releases | Primary repository/release source | Confirms Hermes is an active open-source project and release timeline includes v0.18.x after local v0.17.0. | GitHub pages can fail to render some dynamic details; use docs for feature semantics. |
| Local `hermes --version`, `hermes skills --help`, `hermes curator --help`, `hermes memory --help` | Live no-model probe | Confirms this machine has Hermes Agent v0.17.0 (2026.6.19) and the local command surface. | Only proves this installation; does not prove current online docs or future CLI behavior. |
| Orange Book `alchaincyf/hermes-agent-orange-book` | Secondary Chinese topic map | Provides Chinese framing around Hermes learning loop, memory, skills, Curator, and security boundaries; README states v2.0 is based on Hermes v0.16.0 and the book moved to MIT license. | Not authoritative for current product behavior; this article does not copy its PDF, screenshots, charts, or images. |

## Editorial Synthesis

The article should not sell Hermes as a personality that "learns like a human." It should define "learning" as observable storage and maintenance mechanisms: bounded memory files injected at session start, on-demand skills for procedures, a turn-after background review that may propose writes, explicit approval gates, and separate periodic Curator maintenance.
