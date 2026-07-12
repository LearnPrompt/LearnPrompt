# horizontal-research.md — markdown-as-agent-memory

## 1. Primary sources and what they can prove

| Source | What it supports | What it cannot prove | How the article uses it |
| --- | --- | --- | --- |
| Obsidian Help: How Obsidian stores data | Notes are Markdown-formatted plain text files inside a local vault/folder; `.obsidian` stores vault settings; Git users may ignore `workspace.json` churn | It does not define Agent memory semantics or handoff contracts | Grounds the claim that Markdown packets are ordinary filesystem artifacts, not hidden app state |
| Obsidian Help: Properties | YAML properties sit at the top of a file; properties are intended for small, atomic human/machine-readable values | It does not define which packet fields are sufficient for agent handoff | Supports the article's recommendation to keep `status`, `scope`, and `verified_at` explicit and compact |
| CommonMark Spec 0.31.2 | Markdown syntax is standardized as portable text | It does not define memory, recall, or agent behavior | Lets the article say Markdown is a transport and readability layer, not a memory engine |
| Git `git diff` docs | Git can compare working tree, index, trees, commits, and filesystem paths | It does not define knowledge architecture | Supports the "auditable" part of the contract: text records can be diffed and reviewed |
| Claude Code memory docs | Claude sessions start fresh; `CLAUDE.md` and auto memory are loaded as context, not enforced configuration | It does not say arbitrary repo Markdown becomes memory automatically | Defines the product boundary between durable packet files and product-managed memory surfaces |
| OpenAI Codex AGENTS guide | Codex reads `AGENTS.md` files before doing work and layers project instructions | It does not say `AGENTS.md` is a universal memory format or that every Markdown file is auto-loaded | Defines the Codex-side instruction boundary and prevents the article from overselling packet auto-discovery |

## 2. Teaching references and scope discipline

| Reference | Why it helps | Why it is not treated as factual authority |
| --- | --- | --- |
| `starlight/src/content/docs/agent-engineering/memory-layer.mdx` | Shows the LearnPrompt golden-sample level for mechanism, sources, failure modes, and exercise design | This article is explicitly narrower: file-record contract only, not lifecycle buckets or recall policy |
| `starlight/src/content/docs/obsidian-ai/claude-md-index-navigation.mdx` | Helps keep the distinction between navigation/index files and durable handoff packets | It discusses index design, which this article must not re-teach |
| `obsidian-ai-orange-book` | Useful as a Chinese topic map for neighboring ideas and naming | It is a secondary topic map only; README attribution terms are not a standard CC/OSI license grant, and no PDF prose/screenshots/images may be copied |

## 3. Editorial direction chosen from the comparison

Three choices fall out of the source comparison:

1. The article should define a packet contract, not a product-memory taxonomy.
2. The article should explain why plain text plus citations plus diffability are
   enough for handoff, while refusing to say Markdown itself "creates memory."
3. The article should keep product references short and boundary-focused:
   `CLAUDE.md`, auto memory, and `AGENTS.md` appear only to show what the packet
   is not.

## 4. Gaps that require editorial synthesis

- No official source defines the exact six-field packet contract used here.
- No official source defines exit codes `41 / 42 / 43 / 44`; they are a
  LearnPrompt teaching contract for this fixture.
- Official docs do not provide a ready-made "fresh agent handoff packet"
  example; the frozen timezone-drift fixture supplies that missing pedagogical object.

These gaps are filled in the article, but always labeled as LearnPrompt's
teaching synthesis rather than an external standard.
