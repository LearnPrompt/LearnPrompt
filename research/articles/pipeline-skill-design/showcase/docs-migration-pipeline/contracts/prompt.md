Run the project skill `$docs-migration-pipeline` in this isolated fixture repo.

Task contract:

1. Confirm that the repo contains exactly three legacy Markdown docs under `legacy/`, and that the skill lives in `.agents/skills/docs-migration-pipeline/`.
2. Simulate one crash after the `transform` stage by running the pipeline in crash mode.
3. Resume the pipeline from the preserved checkpoint.
4. Run the receipt verifier and save its JSON output to `reports/receipt-verify.json`.
5. Do not overwrite any source file under `legacy/`.
6. Do not publish, push, or commit.
7. The final output must summarize:
   - whether `$docs-migration-pipeline` was invoked explicitly;
   - crash exit code;
   - resume exit code;
   - receipt verification exit code;
   - final candidate hash;
   - whether only candidate/receipt/report files changed.

Important boundaries:

- This is a migration candidate pipeline, not a publish pipeline.
- Source docs must remain unchanged.
- If any command fails, report the exact failure instead of guessing.
