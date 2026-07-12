You are validating a synthetic Obsidian placement contract. Work only inside this
frozen showcase.

Read:

- `fixture/inbox-manifest.json`
- `fixture/vault-policy.json`
- `placement-plan.schema.json`
- the synthetic inbox files under `fixture/synthetic-vault/00_收件箱/`

Task:

1. Produce one placement plan that accounts for all 12 inbox items.
2. Follow the LearnPrompt example contract exactly:
   - `00_收件箱` is transient intake only and is never a destination.
   - `decision-note` and `task-list` belong in `10_项目`.
   - `synthesis-note` belongs in `20_知识库`.
   - `draft-deliverable` belongs in `30_输出`.
   - `source-snapshot` belongs in `50_资源`.
   - `runbook` and `template` belong in `99_系统`.
   - the `sensitive-marker` item must be rejected with `destination: null`.
3. Write `reports/placement-plan.json` that matches `placement-plan.schema.json`.
4. Write `reports/placement-plan.md` as a readable summary with:
   - a one-line summary count
   - a Markdown table with columns:
     `source item | action | destination | role | reason | canonical | sensitivity`
5. Do not move, rename, delete, or rewrite any fixture file.
6. Do not read or use any reference answer outside the frozen inputs listed
   above.
7. Final response must match `response-schema.json`.

Allowed file writes:

- `reports/placement-plan.json`
- `reports/placement-plan.md`
