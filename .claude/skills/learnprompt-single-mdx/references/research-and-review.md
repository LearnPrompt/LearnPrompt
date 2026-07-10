# Research and review contract

## Research pack

### brief.md

Record the problem, target reader, learning outcomes, central claim, non-goals, required proof, and acceptance criteria.

### horizontal-research.md

Compare at least:

- Primary product documentation or original research.
- The relevant Orange Book as a Chinese topic map when it influenced the page.
- One high-quality teaching reference when it improves pedagogy.

For each source, state what it supports and what it cannot prove.

### vertical-research.md

Trace the central question from surface behavior to mechanism, failure modes, trade-offs, and boundary conditions. Explicitly label editorial synthesis.

### evidence-ledger.md

Use columns for claim, evidence, evidence type, verification date, confidence, and limitation. Every central factual claim and every “actual run” statement needs a row.

### showcase/

Store a README plus the smallest useful set of prompts, code, environment records, real results, failures, and tests.

Raw execution logs must be captured outside the worktree and reduced to sanitized excerpts before entering the research pack. Do not place a live `review` or `--uncommitted` output file inside the repository being reviewed; the reviewer may ingest its own growing log.

Committed artifacts must not contain:

- Secrets, credentials, private keys, bearer tokens, or real API keys.
- Account identifiers or authentication headers.
- Session, thread, turn, item, or request identifiers.
- User-specific absolute paths such as `/Users/<name>/...` or temporary worktree paths.

An actual identifier or local absolute path is a release blocker. A redaction note may name the identifier category without retaining its value.

### review.md

Record reviewer identity and read-only isolation mode, initial verdict, blocker/major/minor findings, fixes, follow-up verdict, six-dimension score, and final state. The final report must include:

- An explicit `blocker 0 / major 0 / minor 0` unresolved-finding line.
- A PASS line whose `/100` score matches the article's `quality_score`.
- An isolation statement that the reviewer used a separate read-only session and the writer did not score or alter the verdict.
- An attestation that raw review output was captured outside the worktree and only frozen, sanitized evidence entered the research pack.
- Exactly one `最终状态` line, with `PASS` as the last non-empty line in the file.

## Quality gate

Score against `research/golden-samples/quality-rubric.md`:

- Facts and evidence: 25
- Explanatory depth: 20
- Showcase: 20
- Teaching design: 15
- Currency: 10
- Editorial quality: 10

Require at least 85/100, no unresolved blocker, major, or minor finding, a passing Showcase, and a successful Starlight build. A missing independent review, malformed final review report, an archived result that does not match the claimed command, a self-referential live log, or a committed sensitive runtime identifier is a release blocker. The deterministic validator enforces the report shape, capture attestation, and privacy patterns; the independent reviewer still judges semantic scope and whether archived evidence is genuinely self-referential.

## Review prompt

```text
Read only. Review this one MDX article against its brief, evidence ledger,
showcase results, and the LearnPrompt 100-point rubric. Find unsupported
claims, invented standards, benchmark overreach, reproducibility gaps,
missing bottom sources, inaccurate attribution or licenses, SourceCard usage,
privacy leaks, self-referential logs, teaching failures, unnatural Chinese,
and MDX risks. List blocker, major,
and minor findings; score all six dimensions; give PASS only when all finding
counts are zero and the score is at least 85. Do not edit files.
```
