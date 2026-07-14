---
name: release-feed-api
description: Read a read-only release feed over HTTP, enforce an auditable request contract, and write redacted JSON and Markdown reports. Use when the task is to inspect releases from a REST endpoint without mutating upstream state.
compatibility: Designed for Codex in a git repository with node and npm. Requires loopback HTTP only and environment-provided base URL plus credential.
---

# release-feed-api

## When to use

Use this skill when the user asks for a read-only release feed check, release summary report, or REST integration example that must keep credentials, retry policy, schema validation, and pagination explicit.

## Required reading

- `references/api-contract.md`

## Workflow

1. Read the request contract.
2. Run:

   ```bash
   node .agents/skills/release-feed-api/scripts/fetch-releases.mjs
   ```

3. Keep the generated reports if the fetch succeeds:
   - `reports/releases.json`
   - `reports/releases.md`
4. Run `npm test`.
5. Return only the JSON object requested by the caller schema.

## Boundaries

- Read the base URL and credential only from `RELEASE_FEED_BASE_URL` and `RELEASE_FEED_TOKEN`.
- Reject any configured method other than `GET` before making a network request.
- Paginate serially. Do not fan out concurrent page fetches.
- If the server returns `429`, obey `Retry-After` before retrying.
- Retry `5xx` responses only up to the configured limit, then fail with exit `43`.
- Do not print credential values or raw authorization headers into reports, logs, or final output.
- Never edit source files outside `reports/`.
