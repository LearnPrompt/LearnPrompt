# Frontmatter Repair Contract

This candidate skill is distilled from three observable repair receipts.

## Scope

- File type: synthetic `.mdx`
- Required output fields:
  - `title`
  - `description`
  - `sidebar.order`
- Preserve all body content exactly as-is.

## Deterministic repair rules

1. If `title` is missing or blank, copy the first H1 text.
2. If `description` is missing or blank, copy the opening paragraph’s first sentence.
3. If `sidebar.order` is not a positive integer, replace it with `__ORDER_FALLBACK__`.
4. If all three fields are already valid, perform a no-op.

## Non-goals

- Do not rewrite the body.
- Do not infer missing facts from chat history or hidden reasoning.
- Do not promote this candidate to a team-wide production skill without human review.
