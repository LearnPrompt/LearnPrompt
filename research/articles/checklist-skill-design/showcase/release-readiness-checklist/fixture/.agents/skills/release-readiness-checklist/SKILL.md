---
name: release-readiness-checklist
description: Inspect a small npm CLI release candidate and produce a row-by-row release-readiness checklist report with evidence, pass rules, severity, N/A policy, and a final gate. Use when the task is to review a release candidate without publishing it.
compatibility: Designed for Codex in a git repository with node and npm. Dry-run only; no external publish.
---

# Release readiness checklist

## When to use

Use this skill when the user asks for a release-readiness check, release candidate inspection, pre-publish checklist, or dry-run go/no-go decision for a small npm CLI package.

## Workflow

1. Read `references/checklist-contract.md`.
2. Run:

   ```bash
   node .agents/skills/release-readiness-checklist/scripts/collect-evidence.mjs \
     --expected-version 1.4.0 \
     --output-json reports/release-readiness.json \
     --output-md reports/release-readiness.md
   ```

3. Keep the generated report even if the exit code is non-zero. The point is to preserve evidence, not to stop at the first failing row.
4. Run `npm test`.
5. Return only the JSON object requested by the caller schema.

## Boundaries

- Never run `npm publish`.
- Never edit `package.json`, `CHANGELOG.md`, or `release/install-command.txt`.
- Do not replace checklist rows with “looks fine” prose.
- If the host blocks the skill or model execution, report that block plainly instead of fabricating a pass.
