# Horizontal Research

Verification date: 2026-07-12.

## Primary product documentation

### Claude Code memory documentation

Source: <https://code.claude.com/docs/en/memory>

Supports:
- Each Claude Code session starts with a fresh context window.
- `CLAUDE.md` files are written instructions and are loaded as context, not enforced configuration.
- `CLAUDE.md` and `CLAUDE.local.md` in the hierarchy above the working directory load at launch.
- Subdirectory `CLAUDE.md` files are discovered and load on demand when Claude reads files in those directories.
- `@path` imports expand into launch context; imports organize large instructions but do not provide progressive disclosure.
- Claude Code reads `CLAUDE.md`, not `AGENTS.md`; an `AGENTS.md` file must be imported or symlinked for Claude Code to use it.

Cannot prove:
- It does not define any behavior for a plain `index.md`.
- It does not prove that every project should use indexes.
- It does not prove universal token or latency savings.

### Codex `AGENTS.md` documentation

Source: <https://developers.openai.com/codex/guides/agents-md> redirects to <https://learn.chatgpt.com/docs/agent-configuration/agents-md>.

Supports:
- Codex reads `AGENTS.md` files before work.
- Codex discovers global and project instruction files, walking from project root to current directory.
- It concatenates guidance root-to-current-directory and applies a documented 32 KiB default combined project-doc limit.
- Fallback filenames are configurable, but arbitrary `index.md` files are ignored unless configured as instruction fallbacks or explicitly read by workflow.

Cannot prove:
- It does not prove Codex auto-loads arbitrary indexes.
- It is a portability analogy, not a Claude Code behavior source.

### Obsidian official documentation

Sources:
- <https://obsidian.md/help/Files%2Band%2Bfolders/How%2BObsidian%2Bstores%2Bdata>
- <https://obsidian.md/help/Plugins/Search>
- <https://obsidian.md/help/properties>

Supports:
- Obsidian notes are Markdown-formatted plain text files inside a vault folder.
- External editors and file managers can edit notes; Obsidian refreshes external changes.
- Search is a core plugin but excluded files do not appear in search results.
- Properties are YAML at the top of files and are meant for small, atomic human/machine-readable values.

Cannot prove:
- Obsidian does not define `CLAUDE.md + index.md` navigation.
- Search/property behavior does not prove an Agent should recursively scan a vault.

## Secondary topic map

Source: <https://github.com/alchaincyf/obsidian-ai-orange-book>

Supports:
- Topic selection: the repository README highlights `CLAUDE.md + index.md` as a navigation insight.
- It provides a Chinese framing for Obsidian + Claude Code workflows.

Cannot prove:
- The README claim that this does "80%" of the work is an anecdotal topic-map claim, not a current product guarantee.
- The README license says the work is free to share for learning/exchange with attribution, but it is not a standard CC/OSI license.
- This article does not copy its PDF prose, screenshots, diagrams, or images.

## Teaching references

Closest LearnPrompt examples inspected:
- `starlight/src/content/docs/obsidian-ai/markdown-as-agent-memory.mdx`
- `starlight/src/content/docs/obsidian-ai/vault-directory-for-ai.mdx`
- `starlight/src/content/docs/obsidian-ai/obsidian-git-workflow.mdx`
- `starlight/src/content/docs/agent-engineering/what-is-harness.mdx`

Design effect:
- Use a concrete opening problem, explicit boundaries, a mechanism diagram, deterministic Showcase, failure codes, exercise, and bottom sources.
- Avoid duplicating handoff packet fields, vault placement contract, or Git rollback.
