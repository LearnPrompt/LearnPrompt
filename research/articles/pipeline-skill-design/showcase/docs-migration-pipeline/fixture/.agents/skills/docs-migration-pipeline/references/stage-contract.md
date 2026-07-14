# Stage Contract

This showcase uses a LearnPrompt-specific stage contract for failure recovery. It is not an official Agent Skills standard.

## Stages

1. `inventory`
   - Input: `legacy/*.md`
   - Output: `work/inventory.json`
2. `normalize`
   - Input: `work/inventory.json`
   - Output: `work/normalized/*.json`
3. `transform`
   - Input: normalized records
   - Output: `work/transformed/*.mdx`
4. `validate`
   - Input: transformed candidates
   - Output: `reports/validation.json`
5. `package-candidate`
   - Input: validated candidates
   - Output: `migration-candidate/docs/*.mdx` and `migration-candidate/manifest.json`

## Receipt fields

Every successful stage writes `receipts/<stage>.json` with:

- `stage`
- `input_sha`
- `output_sha`
- `command`
- `exit_code`
- `status`
- `started_seq`
- `finished_seq`
- `input_files`
- `output_files`

Sequence fields are stable counters, not wall-clock timestamps.

## Exit codes

- `0`: success
- `30`: simulated crash after `transform`
- `32`: stale resume because current input hash no longer matches an existing receipt
- `33`: receipt missing, unreadable, or output no longer matches the receipt

## Resume rule

`--resume` may skip a stage only when:

1. the receipt exists and is parseable;
2. the required fields are present;
3. the stage outputs still exist;
4. re-computing the current input yields the same `input_sha`;
5. re-computing the current outputs yields the same `output_sha`.

If any check fails, the receipt is not reusable.
