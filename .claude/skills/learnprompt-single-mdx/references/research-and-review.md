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

### asset-ledger.md

Use columns for public path, teaching purpose, original source, creator, license, modifications, and verification date. Every image rendered by the MDX needs one row. For an original diagram, identify LearnPrompt as creator and the repository license. For an external asset, use an immutable source URL when possible and state whether the file was cropped, annotated, translated, or otherwise adapted.

The `License` cell must name an actual license or an explicit permission reference. `原创`, `自有`, or `project-owned` describes ownership, not reuse terms, and is insufficient by itself.

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
- A final visual assessment block that names each public image path and includes `Visual assessment: PASS`, `Decorative-only: no`, and `Rights: <exact license or permission reference>`.
- Exactly one `最终状态` line, with `PASS` as the last non-empty line in the file.

## Quality gate

Score against `research/golden-samples/quality-rubric.md`:

- Facts and evidence: 25
- Explanatory depth: 20
- Showcase: 20
- Teaching design: 15
- Currency: 10
- Editorial quality: 10

Require at least 85/100, no unresolved blocker, major, or minor finding, a passing Showcase, at least one purposeful teaching image with a complete asset ledger, and a successful Starlight build. A missing independent review, malformed final review report, decorative-only image, unlicensed asset, archived result that does not match the claimed command, self-referential live log, or committed sensitive runtime identifier is a release blocker. The deterministic validator enforces the report shape, asset existence, ledger linkage, capture attestation, and privacy patterns; the independent reviewer still judges teaching value, license sufficiency, semantic scope, and whether archived evidence is genuinely self-referential.

## Review prompt

```text
Read only. Review this one MDX article against its brief, evidence ledger,
showcase results, and the LearnPrompt 100-point rubric. Find unsupported
claims, invented standards, benchmark overreach, reproducibility gaps,
missing bottom sources, inaccurate attribution or licenses, SourceCard usage,
privacy leaks, self-referential logs, teaching failures, unnatural Chinese,
decorative or unlicensed visuals, inaccurate alt/captions, and MDX risks. List blocker, major,
and minor findings; score all six dimensions; give PASS only when all finding
counts are zero and the score is at least 85. Do not edit files.
```
