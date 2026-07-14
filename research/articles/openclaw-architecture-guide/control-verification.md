# Control verification

Verified at: 2026-07-12.

## Environment boundary

- Repository work occurred only in the isolated Wave D lane.
- `command -v openclaw` returned no executable, so no local Gateway/channel/Node command was claimed or fabricated.
- No real OpenClaw profile, config, state, channel message, channel/account identifier, token, device record, pairing record, or Node was read.
- Showcase inputs use synthetic names and placeholder credential shapes only.

## Commands

```bash
node research/articles/openclaw-architecture-guide/showcase/scripts/build-route-audit.mjs
node research/articles/openclaw-architecture-guide/showcase/scripts/validate-route-audit.mjs
node research/articles/openclaw-architecture-guide/showcase/scripts/verify-showcase.mjs
node research/articles/openclaw-architecture-guide/showcase/scripts/privacy-scan.mjs
CODEX_NESTED_MODEL=gpt-5.4 node research/articles/openclaw-architecture-guide/showcase/scripts/run-codex-live.mjs
node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs --article starlight/src/content/docs/agent-frameworks/openclaw-architecture-guide.mdx --research research/articles/openclaw-architecture-guide
npm --prefix starlight run build
git diff --check
```

## Deterministic contract

The verifier freezes the synthetic fixture hash, checks the expected current Gateway WS trace, validates the declared ownership and authorization layers, and creates independent mutations for codes `101` through `105`. It also snapshots a minimal execution tree, accepts exactly the two report paths, injects `reports/unexpected.txt`, and requires exit `106`. Privacy scanning covers reports and results.

## Fresh-model layer

Requested model: `gpt-5.4`.

Status: BLOCKED before report generation. The controller now copies only the synthetic fixture and contract into a repository-external minimal execution workspace, passes the prompt through stdin, and snapshots the complete directory/file inventory plus hashes. Exactly two report paths are allowed; any other addition, deletion, or modification is exit `106`. Raw capture stays outside the repository and only sanitized per-attempt summaries are retained.

The initial controlled attempt plus two permitted retries all exited with the same account-level usage-limit message before either report was written. The frozen summary contains an `attempts` array with all three models, exit codes, report flags, validation/boundary codes, changed paths, unexpected paths, and protected-file verdicts. No further retry was made and no model success was invented. After this blocked layer was frozen, the deterministic builder regenerated the canonical synthetic reports so the independent 0/101–106 contract remains reproducible.

Before this in-lane work, the attempted external `gpt-5.5` writer also stopped at the same usage limit before producing a turn, reading the article Skill, or changing lane files. This final writer fallback performed the Skill workflow directly; the external startup failure is not counted as article evidence.

## Independent review

The initial independent read-only reviewer returned FAIL 89/100 with one major and two minor findings: incomplete exact write-path enforcement, an overbroad operator/node role statement, and missing per-attempt frozen evidence. The outer controller repaired all three without rerunning the blocked model layer. A fresh independent read-only follow-up reproduced 0/101–106 and privacy, attacked unexpected files, contract modification, fixture deletion, results creation, and symlink replacement, and closed every finding. Final verdict: PASS 98/100, blocker/major/minor = 0/0/0, visual PASS. Raw initial and follow-up reports were preserved outside the worktree before the sanitized combined record was frozen in `review.md`.

## Teaching image render

Headless Chrome rendered `openclaw-control-plane-route.svg` to an external temporary PNG at 1400×900. Writer visual inspection passed for clipping, overflow, arrow direction, rejection rail readability, and teaching alignment. The sanitized inspection note is stored at `showcase/results/visual-inspection.md`; the external PNG is not committed. This is not a substitute for the independent final visual verdict.
