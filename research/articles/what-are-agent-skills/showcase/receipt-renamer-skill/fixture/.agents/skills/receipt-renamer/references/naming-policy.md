# Receipt Naming Policy

This repository uses one deterministic dry-run naming rule for imported receipt PDFs:

```text
YYYY-MM-DD_merchant-slug_CURRENCYamount.pdf
```

Rules:

1. `YYYY-MM-DD` comes from `receipt_date` and must already be a real calendar date in ISO format.
2. `merchant-slug` is lowercase ASCII, with non-alphanumeric separators collapsed to single hyphens.
3. `CURRENCY` is the uppercase ISO code from `currency`.
4. `amount` comes from `total_amount`, rounded to exactly two decimal places, using a decimal point.
5. The planner is dry-run only. It may generate a plan and report, but it must not rename files.
6. If any receipt record is missing `currency`, stop with exit code `21`.
7. If a planned target filename would collide with another planned name or an existing file in the same batch directory, stop with exit code `23`.
8. Reports must explain why each target filename matches the policy.
