Use `$receipt-renamer` for this task.

Work only inside the current temporary Git repository.

Task:

1. Read `incoming/normal-batch/receipts.json`.
2. Produce a dry-run rename plan only. Do not rename any receipt files.
3. Write:
   - `reports/normal-batch-plan.json`
   - `reports/normal-batch-plan.md`
4. Run `npm test`.
5. Return JSON that matches the provided schema.

Important boundaries:

- This is a dry run, not a real rename.
- If the skill cannot be found, say so plainly and stop.
- Do not edit the naming policy or the planner script.
