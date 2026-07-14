Use `$release-readiness-checklist` for this task.

Work only inside the current temporary Git repository.

Task:

1. Read the release candidate for `clip-clean` version `1.4.0`.
2. Produce a dry-run release-readiness report only. Do not edit files, bump versions, or publish anything.
3. Write:
   - `reports/release-readiness.json`
   - `reports/release-readiness.md`
4. Run `npm test`.
5. Return JSON that matches the provided schema.

Important boundaries:

- This is a release gate, not a release action.
- If the skill cannot be found or the host blocks execution, say so plainly and stop.
- Every checklist row must stay structured. Do not collapse rows into a paragraph.
- Do not rewrite the checklist contract, changelog, or install command.
