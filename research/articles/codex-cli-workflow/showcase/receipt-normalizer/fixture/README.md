# receipt-normalizer

Tiny fixture repository for a Codex CLI closed-loop tutorial.

Canonical rule: normalize user-entered receipt references to `RCPT-####`.

- Accept raw numbers like `7`
- Accept aliases like `receipt # 42`, `rcpt-12034`, or `RCP:0007`
- Upstream scanners sometimes prepend store codes, so canonicalization keeps the last four digits of the numeric sequence

The implementation is intentionally buggy; the tests define the intended behavior.
