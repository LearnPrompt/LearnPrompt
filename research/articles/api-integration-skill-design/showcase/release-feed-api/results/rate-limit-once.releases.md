# Release Feed Report

- Status: success
- Release count: 3
- Request method: GET
- Pagination: serial
- 429 retries: 1
- 5xx retries: 0

## Releases

- `v2.4.0` | Release Feed API | 2026-07-01 | /notes/v2.4.0
- `v2.3.1` | Rate Limit Retry | 2026-06-22 | /notes/v2.3.1
- `v2.3.0` | Schema Validation | 2026-06-12 | /notes/v2.3.0

## Evidence

- Base URL source: `env:RELEASE_FEED_BASE_URL`
- Credential source: `env:RELEASE_FEED_TOKEN`
- Request order: `/releases?page=1 -> /releases?page=1 -> /releases?page=2`
- Response schema: `release-feed.v1`
- Notes: Evidence stores request paths, page order, statuses, and retry counts only; secret transport material stays redacted.
