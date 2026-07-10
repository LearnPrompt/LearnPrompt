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

Store a README plus the smallest useful set of prompts, code, environment records, real results, failures, and tests. Keep secrets, session IDs, request IDs, and credentials out of committed artifacts.

### review.md

Record reviewer identity and isolation mode, initial verdict, blocker/major/minor findings, fixes, follow-up verdict, six-dimension score, and final state.

## Quality gate

Score against `research/golden-samples/quality-rubric.md`:

- Facts and evidence: 25
- Explanatory depth: 20
- Showcase: 20
- Teaching design: 15
- Currency: 10
- Editorial quality: 10

Require at least 85/100, no unresolved blocker, major, or minor finding, a passing Showcase, and a successful Starlight build. A missing independent review or an archived result that does not match the claimed command is a release blocker.

## Review prompt

```text
Read only. Review this one MDX article against its brief, evidence ledger,
showcase results, and the LearnPrompt 100-point rubric. Find unsupported
claims, invented standards, benchmark overreach, reproducibility gaps,
missing bottom sources, inaccurate attribution or licenses, SourceCard usage,
teaching failures, unnatural Chinese, and MDX risks. List blocker, major,
and minor findings; score all six dimensions; give PASS only when all finding
counts are zero and the score is at least 85. Do not edit files.
```
