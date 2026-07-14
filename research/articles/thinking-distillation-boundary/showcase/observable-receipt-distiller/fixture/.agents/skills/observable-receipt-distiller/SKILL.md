---
name: observable-receipt-distiller
description: Distill a candidate skill from observable repair receipts, then prove it on holdout fixtures. Use when you have repeated accepted patches, corrections, and validator results, but do not have permission to use private transcripts or hidden chain-of-thought.
---

Distill a candidate skill only from observable receipts.

1. Read [the distillation contract](references/distillation-contract.md).
2. Use the training receipts under `receipts/training/`; reject marker files under `receipts/negative/` according to the contract.
3. Generate a candidate skill in `.agents/skills/frontmatter-repair/` by running:

```bash
node .agents/skills/observable-receipt-distiller/scripts/distill-candidate.mjs \
  --receipts receipts/training \
  --candidate .agents/skills/frontmatter-repair \
  --summary reports/distillation-summary.json
```

4. Evaluate the candidate on the 4 holdout fixtures:

```bash
node .agents/skills/observable-receipt-distiller/scripts/evaluate-candidate.mjs \
  --candidate .agents/skills/frontmatter-repair \
  --holdout holdout \
  --summary reports/evaluation-summary.json
```

5. Run `npm test`.
6. Do not modify any source receipt under `receipts/`.
7. Return a structured report only after the candidate exists, the holdout has run, and tests are complete.
