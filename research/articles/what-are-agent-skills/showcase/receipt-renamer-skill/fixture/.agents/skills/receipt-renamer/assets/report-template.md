# Receipt Rename Dry Run

- Batch: `{{BATCH_ID}}`
- Policy: `{{POLICY_PATH}}`
- Dry run: `yes`
- Planned receipts: `{{COUNT}}`

## Planned filenames

{{ITEMS}}

## Acceptance summary

- No source receipt file was renamed.
- Every target name follows `YYYY-MM-DD_merchant-slug_CURRENCYamount.pdf`.
- Missing `currency` must fail with exit `21`.
- Filename collisions must fail with exit `23`.
