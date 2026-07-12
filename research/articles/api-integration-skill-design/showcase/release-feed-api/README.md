# release-feed-api showcase

This showcase supports the LearnPrompt article `api-integration-skill-design`.

- Fixture repo: [`fixture/`](./fixture/)
- Frozen prompt: [`contracts/prompt.md`](./contracts/prompt.md)
- Frozen schema: [`contracts/final-report.schema.json`](./contracts/final-report.schema.json)
- Offline/unit verification entry: `node research/articles/api-integration-skill-design/showcase/release-feed-api/scripts/verify-showcase.mjs`
- Live Codex attempt entry: `node research/articles/api-integration-skill-design/showcase/release-feed-api/scripts/run-codex-live.mjs`

Current writer-stage expectation:

- fixture tests should pass
- real loopback HTTP may be host-blocked in this sandbox; if so, the scripts freeze blocked evidence instead of fabricating success
- frontmatter remains `showcase_status: partial`
