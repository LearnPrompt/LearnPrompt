# Hermes learning loop brief

- Topic: Hermes Agent learning loop, persistent memory, skills, write approval, and curator boundaries.
- Target reader: Chinese LearnPrompt readers who use coding agents and want Hermes to remember durable lessons without silently preserving bad assumptions, secrets, or one-off failures.
- Outcome: The reader can explain the observable learning mechanisms, decide what belongs in memory vs Skill, enable write approval, and review staged writes before they affect a future session.
- Destination MDX: `starlight/src/content/docs/agent-frameworks/hermes-learning-loop.mdx`.
- Research path: `research/articles/hermes-learning-loop`.
- Non-goals: Do not rank Hermes against other agents; do not describe model weight training; do not read real user Hermes memory, skills, config, status, or profile; do not copy Orange Book PDF, screenshots, figures, or images.
- Primary source families: NousResearch official Hermes docs, NousResearch GitHub repository/releases, local read-only CLI probe.
- Secondary topic map: `alchaincyf/hermes-agent-orange-book`, author HuaShu/花叔/alchaincyf, 2.0 based on Hermes v0.16.0, MIT license as of 2026-07-12.
- Showcase question: Can a write-approval gate classify synthetic candidate lessons into memory, Skill, rejection, or needs-more-evidence while requiring human approval for every staged write?
- Build command: `npm --prefix starlight run build`.
- Article status: writer stage remained `showcase_status: partial`; after independent read-only review passed, final status is `showcase_status: verified` with `quality_score: 100`.

## Acceptance Criteria

- At least 8 H2 sections in Chinese.
- Explain built-in memory, Skill, background review, approval commands, CLI/dashboard/messaging review surfaces, Curator, external providers, and version boundaries.
- Preserve Orange Book attribution and MIT boundary while relying on official sources for product facts.
- Include original 1400x900 SVG teaching image with asset ledger.
- Showcase artifacts include fixture, contract, scripts, results, control verification, release gate result, and the independent read-only PASS review.
