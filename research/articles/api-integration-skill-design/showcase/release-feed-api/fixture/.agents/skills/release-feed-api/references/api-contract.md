# API Contract

This fixture uses a LearnPrompt request contract for a read-only HTTP integration. It is not an official HTTP or vendor standard.

## Inputs

- Base URL: environment variable `RELEASE_FEED_BASE_URL`
- Credential: environment variable `RELEASE_FEED_TOKEN`
- Config file: `release-feed.config.json`

## Request rules

1. Method must be `GET`.
2. Requests must be serial.
3. Authentication must be derived from the credential environment variable at runtime.
4. Reports must record only redacted, replayable evidence:
   - request path
   - method
   - page order
   - response status
   - release counts
   - retry counts
5. Reports must not record:
   - credential values
   - raw authorization headers
   - absolute local paths
   - runtime IDs

## Response schema

Each page must be a JSON object with:

- `releases`: non-empty array
- `next_page`: integer or `null`

Each release must include:

- `id`
- `tag`
- `title`
- `published_at`
- `summary_url`
- `notes`

If the array is empty or a required field is missing, treat it as a contract failure. Do not rewrite it as “no new version”.

## Exit codes

- `0`: success
- `41`: missing credential
- `42`: response contract violation
- `43`: `5xx` retry exhausted
- `44`: mutating method rejected before network
