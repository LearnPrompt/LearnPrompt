# release-readiness-checklist contract

This checklist is a LearnPrompt operational gate for a small npm CLI release candidate. It is not an official npm or Agent Skills term.

## Required row shape

Every checklist row must contain:

- `id`
- `question`
- `evidence`
- `pass_rule`
- `severity`
- `not_applicable_policy`
- `result`

Allowed `result` values:

- `pass`
- `fail`
- `not_applicable`

Allowed `severity` values:

- `blocker`
- `major`
- `minor`

## Frozen exit codes

- `0`: ready
- `21`: missing changelog
- `22`: version mismatch
- `23`: unverifiable install command
- `24`: `not_applicable` used without inspected evidence

## N/A policy

Only mark a row `not_applicable` when the inspected repo proves the surface does not exist. The evidence cell must cite the inspected file or command output and explain why the row is outside scope. `N/A` without evidence is a gate failure.

## Current rows

1. `PACK-00`: `npm pack --dry-run --json` proves the package can be assembled locally.
2. `CHANGELOG-21`: `CHANGELOG.md` contains a `1.4.0` section with at least one user-visible change.
3. `VERSION-22`: `package.json`, the changelog heading, and the install contract agree on `1.4.0`.
4. `INSTALL-23`: the committed install command can be verified locally without publishing to the npm registry.
