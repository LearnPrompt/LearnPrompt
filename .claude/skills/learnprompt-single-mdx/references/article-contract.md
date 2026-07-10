# LearnPrompt MDX contract

## Frontmatter

Use the repository schema and quote date-like strings:

```yaml
---
title: 具体、可判断的标题
description: 一句话说明读者完成后能做什么
sidebar:
  order: 1
difficulty: beginner
updated_from: "2026-07"
author: LearnPrompt 编辑部
verified_at: "2026-07-10"
reading_time: 12 分钟
research_path: research/articles/article-slug
showcase_path: research/articles/article-slug/showcase
showcase_status: partial
legacy_status: current
---
```

Add `quality_score` only after final review passes. Preserve an existing page's URL and required non-source components when rewriting.

Legacy `source_repo` and `source_url` fields may remain as migration metadata, but they are optional and never replace the visible bottom source section. If one is present, keep both accurate.

## Default article shape

Adapt headings to the subject, but include every function:

1. Metadata table with difficulty, reading time, verification date, and author.
2. A concrete opening problem with consequences.
3. “读完你能做什么” or an equivalent learning-outcome section.
4. A mental model or mechanism, not just a feature list.
5. A decision table, sequence, or worked example when it materially clarifies the topic.
6. A real Showcase with input, environment, execution, output, and limitations.
7. Failure modes, boundaries, and when not to use the method.
8. A copyable prompt, configuration, or code artifact where useful.
9. An exercise with observable completion criteria.
10. A final bottom source section with primary sources, clearly labeled secondary topic maps, and applicable attribution or license notes.

## Source policy

- Never import or render `SourceCard` in a public tutorial.
- Put sources in the final H2 section, using Markdown links that readers can inspect.
- Identify which links are official documentation, original research, or other primary material.
- If an Orange Book influenced the topic, structure, wording, or examples, retain its link and applicable attribution or license in this section.
- If a page was independently rebuilt and an Orange Book only suggested the topic, label it as a secondary topic map rather than a factual authority.
- Do not list a source that the writer did not actually inspect.

A typical ending is:

```markdown
## 来源与延伸阅读

- [官方文档或原始研究](https://example.com/primary-source)
- [相关橙皮书](https://example.com/topic-map)

官方资料支撑当前产品行为。橙皮书作为中文主题地图，按其许可保留署名；本文结构、论证和 Showcase 已重新组织并复核。
```

## Editorial rules

- Write natural Chinese; translate meaning instead of preserving English syntax.
- Define an English term in Chinese on first use.
- Prefer paths, commands, outputs, and before/after evidence over adjectives.
- Do not call a taxonomy an industry standard unless a primary standard says so.
- Do not turn an uncontrolled run into a model ranking.
- Separate draft, build, preview, review, publish, and deployment states.
- Keep bottom sources, attribution, and source licenses accurate.
- Use Starlight directives such as `:::note` and `:::caution`; do not import a component when a built-in directive is sufficient.

Use these golden samples for calibration, not copying:

- `starlight/src/content/docs/ai-coding/choose-claude-code-or-codex.mdx`
- `starlight/src/content/docs/agent-engineering/what-is-harness.mdx`
- `starlight/src/content/docs/loop-engineering/five-moves.mdx`
