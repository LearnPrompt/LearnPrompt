# Horizontal research

Verified at: 2026-07-12

## Obsidian official help

Obsidian's storage page supports the base model: a vault is a local folder containing Markdown plain text files, and `.obsidian` stores vault-specific settings. It also says `.obsidian/workspace.json` and `.obsidian/workspaces.json` update whenever files are opened and may be ignored when using Git.

The sync page supports the practical boundary: Obsidian can sync by first-party sync, cloud drives, local sync, Git, and Working Copy. It explicitly warns that Git sync is not automatic, requires push/pull, that iCloud/OneDrive/Google Drive offload can cause missing-file problems, and that users should avoid mixing multiple sync services for one vault.

The backup page supports the stronger boundary: sync services are not backups, and a backup should be a one-way copy to a safe location. It mentions Obsidian Git as a community plugin that can help version-control notes, while warning that data may be stored on an external hosting platform.

What these sources cannot prove: they do not define a complete Agent workflow, a `.gitignore` policy for every team, or a privacy policy for remote Git providers.

## Git official documentation

`git status` supports the inspection layer: it shows differences between index/HEAD, working tree/index, and untracked paths. `git diff` supports review: it compares working tree, index, commits, branches, or files. `git worktree` supports isolation: one repository can have multiple linked working trees and can add a branch or throwaway detached worktree without disturbing the main worktree. `git restore` supports path-level restoration from a chosen source, but it can remove tracked paths to match that source, so it is not a casual first response.

The Pro Git branching chapter supports branch and merge framing. Branches isolate work until completed; merging can fast-forward or create merge commits. If two branches change the same part differently, Git pauses the merge, marks files as unmerged, and inserts conflict markers for humans to resolve.

What these sources cannot prove: Git does not supply an independent offsite one-way backup by itself, does not decide semantic merge correctness, and does not know which vault notes are private.

## Orange Book topic map

`alchaincyf/obsidian-ai-orange-book` is used only as a Chinese topic map for §09 advanced workflows. The README credits author 花叔 / alchaincyf and says the work is free for learning and exchange, with attribution requested for reposting and citation. It does not publish a standard CC or OSI license. This article does not copy PDF text, screenshots, charts, or images.

What it cannot prove: current Obsidian or Git behavior, software defaults, remote provider privacy, or legal reuse rights beyond the README statement.

## Adjacent LearnPrompt tutorials

- `markdown-as-agent-memory`: covers Markdown handoff packets; this article does not re-teach durable memory fields.
- `vault-directory-for-ai`: covers placement contracts; this article does not re-teach folder roles.
- `claude-md-index-navigation`: covers read routing; this article does not re-teach index budgets.
- `ai-maintains-knowledge-base`: covers maintenance proposal queues; this article covers what happens when a candidate actually edits notes and needs version review.
