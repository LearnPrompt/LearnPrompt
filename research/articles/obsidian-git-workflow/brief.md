# Brief: Obsidian + Git workflow

## Article card

- Topic: Obsidian vault sync, backup, Git version control, and Agent bulk edit boundaries.
- Target reader: Chinese Obsidian users who already let AI or scripts touch Markdown notes and now need safe review, discard, and recovery rails.
- Outcome: Readers can separate sync, backup, version control, and Agent candidate editing, then run a bounded diff gate before accepting note changes.
- Destination: `starlight/src/content/docs/obsidian-ai/obsidian-git-workflow.mdx`
- Research path: `research/articles/obsidian-git-workflow`
- Showcase: `vault-git-change-gate`
- Build command: `npm --prefix starlight run build`
- Verification date: 2026-07-12

## Non-goals

- Do not teach Obsidian placement, index routing, or maintenance proposal workflows again.
- Do not recommend one hosted Git provider.
- Do not treat Git as the backup strategy by itself.
- Do not copy Orange Book PDF text, screenshots, charts, or images.
- Do not teach destructive recovery as the first response.

## Source families

- Primary Obsidian help pages for local file model, sync guidance, backup boundary, offload warnings, and `.obsidian` workspace files.
- Primary Git documentation and Pro Git book for status, diff, worktree, restore, branching, merging, and conflict behavior.
- Obsidian AI Orange Book only as a Chinese topic map for §09 advanced workflow framing.

## Acceptance criteria

- Writer stage kept `showcase_status: partial` and no `quality_score`; after independent read-only review passed, final frontmatter is `showcase_status: verified` with `quality_score: 86`.
- Public MDX has no `SourceCard` import or usage.
- Article has at least 8 H2 sections and focuses on version boundary, diff review, candidate accept/discard, and conflict recovery.
- Showcase fixture is synthetic, has at least 8 Markdown notes, `.gitignore`, `.obsidian/workspace.json`, and a task contract.
- Showcase scripts initialize Git only in a system temp directory and never change branches or restore paths in the LearnPrompt repository.
- Deterministic validator covers exits `0`, `81`, `82`, `83`, `84`, `85`, and privacy `0`.
- Original SVG appears at `/images/articles/obsidian-git-workflow/vault-git-safety-rail.svg` with CC BY-NC-SA 4.0 ledger.
- `review.md` records the external independent read-only PASS at 86/100 with blocker/major/minor = 0/0/0 and visual PASS.
