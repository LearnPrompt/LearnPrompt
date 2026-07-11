---
name: learnprompt-single-mdx
description: Create or rewrite exactly one LearnPrompt Starlight MDX tutorial to the repository's golden-sample standard, with bottom-of-page auditable sources instead of SourceCard, a research pack, evidence ledger, reproducible showcase, independent review, quality score, and successful site build. Use for one LearnPrompt article, tutorial, chapter, or MDX page; in batch goals, invoke once per topic in an isolated task.
---

# LearnPrompt single MDX tutorial

Produce one publishable tutorial and its auditable evidence. Do not batch several chapters inside one invocation.

## Required reading

Before editing, read:

1. `research/golden-samples/README.md`
2. `research/golden-samples/quality-rubric.md`
3. [references/article-contract.md](references/article-contract.md)
4. [references/research-and-review.md](references/research-and-review.md)
5. [references/visual-assets.md](references/visual-assets.md)
6. The closest existing golden sample and the target section's adjacent tutorials

Use an Orange Book as a topic map when relevant. Verify current product behavior with primary sources and live tools.

## Workflow

### 1. Freeze the article card

Record the topic, target reader, one-sentence outcome, destination MDX path, research path, non-goals, source families, showcase question, and build command.

If a missing decision would materially change the article, ask at most three focused questions. In an unattended goal, make the smallest safe assumption and record it in `brief.md`.

### 2. Inspect before editing

- Confirm the real repository root and run `git status --short`.
- Preserve unrelated user changes.
- Read the target file, content schema, sidebar configuration, its bottom source section, and at most three relevant neighboring tutorials.
- State a 3-6 item plan before making changes.

### 3. Build the research pack

Create `research/articles/<slug>/` unless the user supplies another path. Produce:

```text
brief.md
horizontal-research.md
vertical-research.md
evidence-ledger.md
asset-ledger.md
showcase/
review.md
```

Keep facts, inferences, and editorial synthesis separate. Put every time-sensitive claim behind a verification date.

### 4. Design a concrete showcase

Demonstrate the article's central decision with a real task, not a generic repository scan.

Save the exact input, environment, commands or code, actual output, failures, and reproduction limits. If comparing tools, hold the task and acceptance criteria constant, use isolated workspaces, compare workflows rather than model intelligence, and disclose configuration differences prominently.

Capture raw command output outside the repository first, using a temporary directory such as `$TMPDIR`. Inspect it, then commit only the smallest sanitized excerpt needed to prove the result. Remove local absolute paths, account identifiers, credentials, and session, thread, turn, item, or request identifiers.

Never stream a reviewer or agent's output into an untracked file inside the same worktree it is reviewing. Commands such as `codex review --uncommitted` may discover and reread their own growing log, producing a self-referential scan. Write the raw log outside the worktree, freeze it after the process exits, and only then create a sanitized Showcase artifact.

If a real run cannot be completed, set `showcase_status: partial`. Never invent a successful result.

### 5. Write the MDX

Follow [references/article-contract.md](references/article-contract.md). Start from a real problem, explain the mechanism and trade-offs, show the evidence, state when not to use the method, and end with an exercise and sources.

Treat the depth floor as a release gate, not a target: a deep tutorial needs at least 5,000 body characters, at least 1,800 Chinese explanatory characters after fenced code is removed, and at least six H2 sections. Do not pad with repetition, oversized code dumps, source lists, or decorative markup. Navigation and index pages use a separate workflow and must not be forced through this deep-tutorial skill.

Include at least one local teaching image that explains a mechanism, decision, sequence, comparison, or verified result. Follow [references/visual-assets.md](references/visual-assets.md): use a descriptive alt, an immediate `图注：` line, a matching `asset-ledger.md` row, and source/license disclosure. A cover, logo, or decorative banner does not satisfy this requirement.

Never import or render `SourceCard` in a public tutorial. When rewriting a legacy page, remove the import and component only after its bottom source section accurately lists the material actually used and the applicable attribution or license.

Set `showcase_status: partial` while writing. Do not set `quality_score` until independent review passes.

### 6. Verify and review

Run the showcase checks and `cd starlight && npm run build`. Save the actual results.

Use a separate read-only model session or human reviewer. Record initial findings, fix every blocker, major, and minor finding, and run a follow-up review. If independent review is unavailable, leave the article partial and report the blocker.

Do not infer review success from process exit code alone. Require a final report that matches the requested scope and finding format, and archive only its sanitized evidence. In `review.md`, record reviewer identity, read-only isolation, an explicit statement that the reviewer used a separate session and the writer did not score or alter the verdict, zero blocker/major/minor counts, all six rubric scores, a PASS line whose score matches frontmatter, and an attestation that raw review output was captured outside the worktree. `最终状态：PASS` must be the only final-status line and the last non-empty line.

After review passes with at least 85/100, no unresolved finding, and no release-gate failure:

- Set `showcase_status: verified`.
- Set `quality_score` to the final score.
- Record `最终状态：PASS` in `review.md`.

### 7. Run the deterministic gate

From the repository root:

```bash
node "$CLAUDE_SKILL_DIR/scripts/validate-golden-mdx.mjs" \
  --article <starlight-relative-mdx-path> \
  --research <research-relative-directory>
```

Then rerun `cd starlight && npm run build` after the final metadata change.

## Batch boundary

For a multi-chapter goal, let the goal own the topic queue, isolated worktrees, concurrency, retries, and final summary. Give each worker one article card and invoke this skill once. Never let two workers edit the same MDX, research directory, sidebar block, or content schema simultaneously.

Do not commit, push, publish, or merge unless the user explicitly requests it.
