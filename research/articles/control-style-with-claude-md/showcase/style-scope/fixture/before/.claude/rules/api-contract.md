---
paths:
  - "src/api/**/*.ts"
---

# API Contract Rules

- Handlers return `jsonOk(...)` or `jsonError(...)`.
- Do not return raw objects directly from route handlers.
