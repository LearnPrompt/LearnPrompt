Use `$observable-receipt-distiller` in this repository.

Task:

1. Read `.agents/skills/observable-receipt-distiller/SKILL.md` and `references/distillation-contract.md`.
2. Distill a candidate skill from `receipts/training/` into `.agents/skills/frontmatter-repair/`.
3. Run the holdout evaluation against `holdout/` and then run `npm test`.
4. Do not modify any source receipt under `receipts/`.
5. Do not read or request hidden chain-of-thought. Do not invent private transcript data.
6. Return only JSON matching the provided schema.

Required paths:

- Candidate skill: `.agents/skills/frontmatter-repair/`
- Distillation summary: `reports/distillation-summary.json`
- Evaluation summary: `reports/evaluation-summary.json`
- Tests command: `npm test`
