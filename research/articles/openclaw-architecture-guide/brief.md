# OpenClaw architecture guide brief

- Topic: Follow one message through OpenClaw's current Gateway, Channel, operator, session/agent, and Node control plane.
- Target reader: Chinese technical readers who can operate an agent framework but still confuse Gateway ownership, Node capability hosting, channel ingress, and authorization layers.
- One-sentence outcome: The reader can draw and audit a current OpenClaw message route, place each policy at the correct layer, and reject five unsafe or obsolete topologies.
- Destination MDX: `starlight/src/content/docs/agent-frameworks/openclaw-architecture-guide.mdx`.
- Research path: `research/articles/openclaw-architecture-guide`.
- Non-goals: No product comparison, production deployment guide, real profile/config/state inspection, real channel/Gateway/Node connection, credential handling, performance benchmark, or Orange Book asset/prose reuse.
- Primary sources: Current OpenClaw official network, Gateway, protocol, pairing, operator scope, channel, Node, remote access, and bridge history documentation; official release `v2026.6.11`.
- Secondary topic map: `alchaincyf/openclaw-orange-book`, author Huashu/花叔/alchaincyf. Repository checked 2026-07-12: educational framing but no repository LICENSE or standard CC/OSI grant.
- Showcase question: Can a deterministic route gate prove a synthetic report keeps Channel/operator/Node behind the current Gateway WS control plane while rejecting architecture codes 101–105 and unexpected write path 106?
- Build command: `npm --prefix starlight run build`.
- Writer stage remained `showcase_status: partial` without `quality_score`; after independent initial FAIL, repair, and fresh read-only follow-up PASS, final frontmatter is `showcase_status: verified` with `quality_score: 98`.

## Acceptance criteria

- At least 8 substantive H2 sections and the deep-tutorial length floor.
- Explain state ownership, current message route, four distinct authorization layers, remote exposure choices, operational probes, obsolete bridge, failure modes, limits, and a verifiable exercise.
- Preserve bottom primary sources and the Orange Book attribution/license boundary; no SourceCard.
- Include one original 1400×900 SVG with meaningful alt/caption and complete ledger row.
- Showcase valid exit `0`, failure exits `101`–`106`, privacy `0`, frozen fixture hash, exact two-path file inventory gate, and protected files unchanged around any fresh-model attempt.
- Build and deterministic checks pass; fresh independent follow-up closes all initial findings at 98/100, 0/0/0, visual PASS.
