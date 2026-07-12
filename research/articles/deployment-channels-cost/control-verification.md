# Writer-side control verification

Date: 2026-07-12.

## Scope

Only the article MDX, `research/articles/deployment-channels-cost/`, and its article-local public image directory were edited. No deployment, cloud account, real channel, OpenClaw config/profile, credential, invoice, push, publish, or commit was performed.

## Writer startup layering

- A previous fresh `gpt-5.5` writer process was blocked by the Codex usage limit before producing a model turn, before reading the single-MDX Skill, and before changing the lane.
- This fallback writer performed the single article task and kept the article partial/PENDING.
- The Showcase's bounded `gpt-5.4` recommendation was attempted once. It exited `1` before writing either allowed report; protected files remained unchanged. The captured warnings do not establish an accepted model result, so the live layer is recorded as blocked rather than inferred as successful.

## Deterministic proof

After the blocked live attempt, the deterministic generator restored the two reference reports. `verify-showcase.mjs` then produced:

```text
valid: expected 0, actual 0
missing-availability-persistence: expected 111, actual 111
unsafe-public-channel: expected 112, actual 112
missing-variable-cost: expected 113, actual 113
config-only-health: expected 114, actual 114
missing-kill-switch: expected 115, actual 115
privacy: expected 0, actual 0
fixture hash unchanged: yes
selected candidate: vps-container; example monthly total: 80.24; cap: 100.00
```

Fixture SHA-256: `4cf82e987c89769cb648b647ea9fca0aa1732fc685a7fabb9f2a01a6c139bdc3`. The final deterministic fixture also binds candidate capacity and the concurrency limit to `peak_concurrency=3`; this strengthening happened after the blocked live attempt and was not represented as a model result.

## State boundary

- `showcase_status: verified`
- `quality_score: 100`
- independent read-only reviewer: PASS 100/100, blocker/major/minor = 0/0/0, visual PASS
- complete raw final report was preserved outside the worktree before the sanitized verdict was frozen in `review.md`
