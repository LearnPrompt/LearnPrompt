# Task contract

## Goal

Update exactly two notes so a synthetic Obsidian vault explains the boundary between sync, backup, Git, and Agent candidate review.

## Allowed write paths

- `notes/projects/alpha-plan.md`
- `notes/research/git-boundaries.md`
- `receipts/candidate-receipt.md`

## Required receipt

The candidate must write `receipts/candidate-receipt.md` with:

- `accepted: true`
- changed paths
- link check summary
- baseline tree hash
- candidate commit hash

## Hard gates

- Do not edit the default branch directly.
- Do not edit files outside the allowed write paths.
- Do not add secret-shaped text.
- Do not add binaries larger than 256 KiB.
- Keep diff under 120 changed lines.
- Do not create broken Wiki links or Markdown links.
- Leave the main branch byte-identical until the candidate is accepted.
