---
name: receipt-renamer
description: Prepare a dry-run rename plan for a batch of receipt PDFs. Use when the user wants repository-style receipt filenames normalized under the local naming policy without renaming files yet.
---

# Receipt Renamer

Use [the naming policy](references/naming-policy.md), keep the run as a dry run, and let the deterministic planner do the filename work.

## Inputs

- A batch manifest JSON such as `incoming/normal-batch/receipts.json`
- A Markdown report path under `reports/`
- A JSON plan path under `reports/`

## Workflow

1. Confirm this is a dry run and that no files should be renamed yet.
2. Read [the naming policy](references/naming-policy.md).
3. Run:

   ```bash
   node .agents/skills/receipt-renamer/scripts/plan-renames.mjs \
     --batch <batch-manifest> \
     --policy .agents/skills/receipt-renamer/references/naming-policy.md \
     --report <report-path> \
     --json <json-path>
   ```

4. If the planner exits `21`, stop and report which receipt is missing `currency`.
5. If the planner exits `23`, stop and report which target filename conflicts.
6. On success, summarize the planned target filenames and point to both generated report files.
7. Only run `npm test` if the caller explicitly asks for verification after the dry-run plan exists.

## Verification

- The planner exits `0`.
- Both report files exist.
- No source receipt file is renamed.
- The written summary matches the generated plan.

## Boundaries

- Never rename, delete, or overwrite receipt source files in this skill.
- Never change the naming policy from within the skill.
- Do not invent receipt fields that the batch manifest does not contain.
