# Showcase: vault-git-change-gate

This showcase demonstrates a safe candidate-edit rail for an Obsidian vault.

The committed fixture is a fully synthetic vault. It contains Markdown notes, `.gitignore`, `.obsidian/workspace.json`, and a task contract. It intentionally contains no nested `.git` directory.

## Reproduce

```bash
node research/articles/obsidian-git-workflow/showcase/vault-git-change-gate/scripts/verify-showcase.mjs
node research/articles/obsidian-git-workflow/showcase/vault-git-change-gate/scripts/privacy-scan.mjs
CODEX_NESTED_MODEL=gpt-5.5 node research/articles/obsidian-git-workflow/showcase/vault-git-change-gate/scripts/run-codex-live.mjs
```

All Git operations happen in a system temporary directory. The scripts do not restore, reset, branch, or commit inside the LearnPrompt repository.

## Exit codes

| Exit | Meaning |
| ---: | --- |
| 0 | valid candidate |
| 81 | candidate is on the default branch or lacks isolation |
| 82 | candidate changed paths outside the allowlist |
| 83 | secret-shaped text, large binary, or oversized diff |
| 84 | broken internal link or renamed note without reference update |
| 85 | missing receipt, missing acceptance, or empty change |
| 90 | live nested attempt blocked or invalid |

## Privacy

The fixture uses only synthetic note content. The privacy scan rejects private keys, bearer tokens, API-key shapes, session identifiers, user home paths, and runtime temporary paths in committed artifacts.

## Live history

The preserved history has three stages: writer-side state DB block; first outer retry rejected with `85` for an incomplete receipt contract; final allowed retry accepted with validator `0`, exactly three changed paths, 13 diff lines, and the main baseline unchanged. Raw streams stayed outside the worktree; only sanitized failure evidence, the accepted receipt, the accepted diff as a lossless JSON line array, and summaries are committed. JSON line-array storage preserves the single-space marker used for blank diff context lines without creating trailing-whitespace violations in the repository.
