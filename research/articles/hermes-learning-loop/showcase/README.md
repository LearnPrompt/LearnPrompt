# Showcase: learning-write-approval-gate

This Showcase demonstrates a write-approval gate for Hermes learning proposals without reading any real profile, memory, skills, config, or session database.

## Inputs

- `fixture/session-lessons.json`: six synthetic candidate lessons.
- `contracts/proposal-contract.json`: allowed actions, required fields, rejection codes, privacy patterns, and exact action counts.
- Local no-model probe: `hermes --version`, `hermes skills --help`, `hermes curator --help`, `hermes memory --help`.

## Commands

```bash
node research/articles/hermes-learning-loop/showcase/scripts/classify-lessons.mjs
node research/articles/hermes-learning-loop/showcase/scripts/validate-learning-proposals.mjs
node research/articles/hermes-learning-loop/showcase/scripts/verify-showcase.mjs
node research/articles/hermes-learning-loop/showcase/scripts/privacy-scan.mjs
CODEX_NESTED_MODEL=gpt-5.5 node research/articles/hermes-learning-loop/showcase/scripts/run-codex-live.mjs
```

## Result Summary

- Valid contract: `0`.
- Privacy check: `0`.
- Missing provenance/evidence would fail as `91`.
- Wrong memory/Skill store would fail as `92`.
- Sensitive content in proposals would fail as `93`.
- Auto-applied or approval false would fail as `94`.
- Unknown action or missing version scope would fail as `95`.

A fresh `gpt-5.5` proposal run completed without launching Hermes or reading a real profile. It read only the synthetic fixture, contract, and sanitized no-model probe; wrote only the two allowed reports; passed validation with protected files unchanged; and archived sanitized success evidence under `results/live-*`.
