# Release readiness report template

Use this shape when rendering the Markdown report:

1. Title with package name and expected version.
2. Summary bullets:
   - final exit code
   - ready or blocked
   - tests status is recorded separately by the caller
3. One Markdown table with the required row fields:
   - `id`
   - `question`
   - `result`
   - `severity`
   - `pass_rule`
   - `evidence`
   - `not_applicable_policy`
4. Final section:
   - what failed
   - what remains unverifiable
   - why this gate is dry-run only
