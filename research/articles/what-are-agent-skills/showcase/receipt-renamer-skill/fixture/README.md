# receipt-renamer fixture

This fixture is a small isolated Git repo template for the `receipt-renamer` skill.

- `.agents/skills/receipt-renamer/`: the repo skill under test
- `incoming/`: three deterministic receipt batches
- `reports/`: dry-run outputs written by the skill
- `test/`: deterministic verification for the planner script

The planner never renames source files. It only writes dry-run report artifacts under `reports/`.
