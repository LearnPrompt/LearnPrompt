# Vertical research

Verified at: 2026-07-12

## Central question

How can an Obsidian user let an Agent bulk-edit notes without confusing sync, backup, Git version control, and acceptance review?

## Mechanism

1. Obsidian is a local file folder. External tools, Git, and Agents operate on the same files that Obsidian will later refresh.
2. Sync propagates the current file state across devices. It can faithfully propagate accidental edits or deletions.
3. Backup preserves a separate recovery copy. It should be one-way and independent from live syncing.
4. Git records snapshots and diffs. It makes candidate changes inspectable, but remote push/pull still needs intent, and Git history is not the same as a one-way offsite backup.
5. An Agent run should happen against a clean baseline in an isolated branch or worktree. The candidate is accepted only after deterministic gates and human review.

## Failure modes

- Sync mistaken for backup: a bad edit syncs to every device.
- Backup mistaken for version control: a copied folder may recover data but cannot explain which note changed or why.
- Git mistaken for sync: another device does not receive changes until push/pull.
- Git mistaken for privacy: a public remote can expose a private vault.
- Agent writes directly on the default branch: review and discard become harder.
- Agent changes files outside the task: hidden workspace files, exports, private notes, or binaries enter the diff.
- Merge conflict treated as a model problem: conflict markers require semantic human merge, not blind side selection.
- Recovery starts with destructive reset: uncommitted work can be lost before the user understands what changed.

## Editorial synthesis

The safe workflow is a two-lane rail:

- `main` keeps the reviewed baseline and remains unchanged during the candidate run.
- `candidate` worktree receives the Agent changes, receipt, and optional commit.

The deterministic gate does not decide whether the new note wording is good. It decides whether the candidate is even eligible for human review: isolated branch, allowed paths only, no secret-shaped text, no large binary, bounded diff size, valid internal links, non-empty receipt, and unchanged baseline tree.

## Boundary conditions

- Private vaults should not default to public remotes.
- `.obsidian` should be a team decision: workspace layout files are noisy and should usually be ignored, but themes, hotkeys, snippets, or plugin settings may be shared by some teams.
- Cloud-drive offload must be disabled for vault files before relying on local Git or Agent tools.
- Do not mix multiple sync services for one vault.
- Do not use this workflow for data that must never leave a device unless remote location, access control, and encryption are separately decided.
