# Synthetic CLAUDE.md

Route every task through the smallest declared index path.

Rules:
- Start by reading `index.md`.
- Use the root index to choose exactly one area index for each task.
- Read only the chosen area index and its canonical target.
- Do not recursively inventory the vault.
- Treat private or sensitive routes as rejected targets.
- Use `scripts/read-doc.mjs` for every fixture read so the trace is auditable.
