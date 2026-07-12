# Vertical Research

Verification date: 2026-07-12.

## Central question

When does `CLAUDE.md + index.md` actually reduce Agent navigation breadth?

## Mechanism

Official behavior begins at `CLAUDE.md`, not at `index.md`. Claude Code loads `CLAUDE.md` instructions in scope and treats them as context. Those instructions can tell the Agent to begin with a root `index.md`, but the plain index file is just project-authored Markdown until the instruction, prompt, or workflow points to it.

The practical mechanism is therefore:

1. Instruction file defines the routing behavior.
2. Root index exposes a small set of area entrypoints.
3. Area index exposes canonical route rows.
4. The Agent reads one target and cites the target path.
5. A validator rejects broad scans, stale rows, duplicates, missing routes, and private targets.

## Why `@path` is not progressive disclosure

Claude Code supports `@path` imports from `CLAUDE.md`, but imported files are expanded and loaded into launch context. Importing every area index into `CLAUDE.md` may make the instruction file easier to maintain, but it spends context at launch and does not demonstrate on-demand index routing. Progressive disclosure requires the Agent to read only the selected index path during the task.

## Why `index.md` is not a product feature

Neither Claude Code nor Codex official docs identify arbitrary `index.md` files as special navigation files. `index.md` becomes useful because the project establishes a contract:

- root index names canonical area indexes;
- area index rows are compact and structured;
- route rows have owner, verified date, fallback, and canonical target;
- the workflow validates read order and target citations.

## Failure modes

- Missing route: task has no row; validator exits `61`.
- Ambiguous duplicate route: two rows claim the same task or scoped route; validator exits `62`.
- Recursive scan: trace contains full inventory or wrong order; validator exits `63`.
- Stale/nonexistent target: verified date is old or canonical file is absent/wrong; validator exits `64`.
- Private/sensitive target: row points at private material; validator exits `65`.

## Editorial synthesis

The real teaching point is not "indexes are magic." The useful contract is "routing budget replaces recursive discovery." Indexes reduce breadth only when they are short, current, canonical, and mechanically checked. A prose dump called `index.md` increases context noise; a compact route table can reduce ambiguity.
