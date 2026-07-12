# Evidence ledger

| Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Obsidian vaults are local folders of Markdown plain text files. | Obsidian Help, How Obsidian stores data. | Official documentation | 2026-07-12 | High | Does not define an Agent workflow. |
| Obsidian creates `.obsidian` for vault-specific settings. | Obsidian Help, How Obsidian stores data. | Official documentation | 2026-07-12 | High | Team policy for committing settings is editorial synthesis. |
| `.obsidian/workspace.json` and `.obsidian/workspaces.json` are noisy workspace layout files that may be ignored in Git. | Obsidian Help, How Obsidian stores data. | Official documentation | 2026-07-12 | High | "May" is not a universal mandate. |
| Sync is not backup; backup should be a separate one-way copy. | Obsidian Help, Back up your Obsidian files. | Official documentation | 2026-07-12 | High | Backup implementation is outside article scope. |
| Git sync across devices requires manual push/pull. | Obsidian Help, Sync your notes. | Official documentation | 2026-07-12 | High | Git clients/plugins may automate steps, but underlying remote exchange remains required. |
| iCloud/OneDrive offload should be prevented for vault files. | Obsidian Help, Sync your notes. | Official documentation | 2026-07-12 | High | UI labels vary by OS version. |
| Mixing sync services for one vault risks conflicts/corruption. | Obsidian Help, Sync your notes. | Official documentation | 2026-07-12 | High | Does not quantify probability. |
| `git status` shows working tree, index, HEAD, and untracked differences. | Git `git-status` docs. | Official documentation | 2026-07-12 | High | Does not interpret semantic correctness. |
| `git diff` compares working tree, index, commits, branches, and files. | Git `git-diff` docs. | Official documentation | 2026-07-12 | High | Large diffs still require review discipline. |
| `git worktree` can create linked working trees attached to the same repository. | Git `git-worktree` docs. | Official documentation | 2026-07-12 | High | A worktree is isolation, not backup. |
| `git restore` restores paths from a source and can remove tracked paths to match that source. | Git `git-restore` docs. | Official documentation | 2026-07-12 | High | Article warns not to use it before checking status and uncommitted work. |
| Merge conflicts pause merge and add conflict markers that humans must resolve. | Pro Git Basic Branching and Merging. | Official book | 2026-07-12 | High | Examples are code files, but mechanism applies to text notes. |
| Showcase fixture is synthetic and contains no nested `.git`. | `showcase/vault-git-change-gate/fixture/vault` and validator. | Local artifact | 2026-07-12 | High | Fixture is educational, not a real vault. |
| Deterministic validator covers exits 0, 81, 82, 83, 84, 85 and privacy 0. | `showcase/vault-git-change-gate/scripts/*.mjs` and `results/showcase-result.txt`. | Local actual run | 2026-07-12 | High | Synthetic fixture only. |
| Fresh `gpt-5.5` history is layered: writer initialization block; outer candidate rejected with `85` for receipt contract; final allowed retry passes with only three paths changed, 13 diff lines, validator `0`, and main unchanged. | `results/live-blocked-summary.md`, `results/live-controller-attempt-2-invalid.json`, `results/live-controller-summary.json`, `results/live-candidate-patch.json`, `results/live-candidate-receipt.md`. | Real model runs + deterministic validation | 2026-07-12 | High | Demonstrates this frozen synthetic task, not general model reliability. The accepted diff is stored as a JSON line array so blank context markers remain exact without violating the repository whitespace gate. |
| Orange Book is only a secondary topic map with non-standard README permission. | `alchaincyf/obsidian-ai-orange-book` README. | Repository README | 2026-07-12 | High | Does not grant standard CC/OSI reuse. |
