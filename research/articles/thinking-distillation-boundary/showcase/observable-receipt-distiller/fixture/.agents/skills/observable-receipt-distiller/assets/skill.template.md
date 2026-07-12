---
name: frontmatter-repair
description: Repair synthetic MDX frontmatter when title, description, or sidebar.order drift from the frontmatter contract. Use for files that follow the same observable patterns proven in the receipts; do not use on private transcripts, secret-bearing material, or arbitrary YAML.
---

Repair one synthetic MDX file at a time.

1. Read [the frontmatter contract](references/frontmatter-contract.md).
2. Run `node scripts/repair-frontmatter.mjs --file <path>`.
3. Only repair rules proven by the receipts:
   - title from the first H1
   - description from the opening paragraph’s first sentence
   - invalid `sidebar.order` to `__ORDER_FALLBACK__`
4. Preserve the body verbatim.
5. Leave already-valid files unchanged.
6. If the file contains private transcript material or secret markers, stop and escalate instead of repairing.
