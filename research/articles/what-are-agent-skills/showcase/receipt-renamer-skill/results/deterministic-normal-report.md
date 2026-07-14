# Receipt Rename Dry Run

- Batch: `normal-batch`
- Policy: `.agents/skills/receipt-renamer/references/naming-policy.md`
- Dry run: `yes`
- Planned receipts: `3`

## Planned filenames

- `metro-card.pdf` -> `2026-05-14_metro-card_USD7.25.pdf` (2026-05-14, USD7.25)
- `airport-taxi.pdf` -> `2026-05-15_airport-taxi_USD48.00.pdf` (2026-05-15, USD48.00)
- `monitor-stand.pdf` -> `2026-05-18_desk-foundry_USD124.40.pdf` (2026-05-18, USD124.40)

## Acceptance summary

- No source receipt file was renamed.
- Every target name follows `YYYY-MM-DD_merchant-slug_CURRENCYamount.pdf`.
- Missing `currency` must fail with exit `21`.
- Filename collisions must fail with exit `23`.

