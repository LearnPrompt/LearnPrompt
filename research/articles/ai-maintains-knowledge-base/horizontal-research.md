# Horizontal research

核验日期：2026-07-12

| Source | Type | Supports | Cannot prove |
| --- | --- | --- | --- |
| Obsidian Search help: https://obsidian.md/help/Plugins/Search | Official product documentation | Search is a core plugin; supports operators, path/content/file search, property search with `[property]`, `[property:value]`, `[property:null]`; excluded files do not appear in Search results. | It does not define AI maintenance, duplicate detection, or a safe auto-edit workflow. |
| Obsidian Properties help: https://obsidian.md/help/properties | Official product documentation | Properties are YAML at the top of files, support typed structured data, are meant for small atomic human/machine-readable values; nested properties, Markdown in properties, and in-depth bulk property editing are not supported directly. | It does not say properties alone can decide stale/duplicate/orphan status. |
| Obsidian Backlinks help: https://obsidian.md/help/Plugins/Backlinks | Official product documentation | Backlinks are links from another note to the active note; linked and unlinked mentions are distinct; excluded files do not appear in unlinked mentions. | It does not prove an apparent orphan should be deleted or merged. |
| Obsidian Internal links help: https://obsidian.md/help/links | Official product documentation | Obsidian supports Wikilinks and Markdown links; links create a knowledge network; internal links may auto-update on rename depending on settings. | It does not define a complete graph export format or AI reviewer. |
| Obsidian AI Orange Book, §06, repository README: https://github.com/alchaincyf/obsidian-ai-orange-book | Secondary topic map | Suggests the "compiler/wiki" framing and the topic "let AI maintain your knowledge base". README grants learning/exchange sharing with attribution. | Its scale, social reach, RAG, and autonomous-maintenance claims are not used as current facts here. It is not a standard CC/OSI license. |
| Existing LearnPrompt adjacent tutorials | Local editorial context | `markdown-as-agent-memory` covers handoff records; `vault-directory-for-ai` covers inbox/placement; `obsidian-git-workflow` will cover rollback and Git. | They do not answer maintenance proposal schema or evidence gates for this article. |

## Synthesis

The official Obsidian pages give observable signals: search results, properties, backlinks, and link formats. They also impose limits: excluded files can hide search/unlinked-mention evidence, properties are small atomic metadata, and bulk property editing is not a built-in general workflow. Therefore the article treats AI maintenance as an editorial proposal queue, not as product-supported automatic truth maintenance.

