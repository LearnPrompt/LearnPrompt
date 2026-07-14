# release-feed-api fixture

This fixture repo exists only for the LearnPrompt `api-integration-skill-design` showcase.

- Skill path: `.agents/skills/release-feed-api/`
- Task: read a loopback release feed and write:
  - `reports/releases.json`
  - `reports/releases.md`
- Boundaries:
  - read `RELEASE_FEED_BASE_URL` and `RELEASE_FEED_TOKEN` only from environment variables
  - allow `GET` only
  - never publish or mutate upstream state
  - preserve redacted request/result evidence inside the reports

Run the fixture tests:

```bash
npm test
```
