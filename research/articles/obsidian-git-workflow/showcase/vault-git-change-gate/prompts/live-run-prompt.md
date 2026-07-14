You are editing a synthetic Obsidian vault inside a temporary candidate Git worktree.

Read `TASK_CONTRACT.md`. Modify only:

- `notes/projects/alpha-plan.md`
- `notes/research/git-boundaries.md`
- `receipts/candidate-receipt.md`

Task:

1. Add a short paragraph to `notes/projects/alpha-plan.md` explaining that sync, backup, and Git solve different problems.
2. Add a short paragraph to `notes/research/git-boundaries.md` explaining that an Agent candidate should be reviewed by diff before merge.
3. Create `receipts/candidate-receipt.md` with these exact machine-readable fields and values:

```text
accepted: true
changed_paths:
- notes/projects/alpha-plan.md
- notes/research/git-boundaries.md
- receipts/candidate-receipt.md
link_check: passed
baseline_tree_hash: <exact output of git rev-parse main^{tree}>
candidate_commit: pending-before-commit
summary: synthetic candidate prepared for human diff review.
```

Do not substitute prose such as `links preserved` for `link_check: passed`. The controller will replace only the pending candidate commit after creating the commit; every other receipt field must already satisfy the contract.

Do not edit other paths. Do not add secrets, binary files, or external links.
