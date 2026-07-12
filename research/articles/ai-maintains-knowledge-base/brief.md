# Brief

日期：2026-07-12

## Article card

- Topic: AI-assisted Obsidian knowledge-base maintenance as an approval queue.
- Target reader: 已经用 Obsidian/Markdown 管知识库，想让 AI 定期发现重复、过期、缺来源、孤立和冲突笔记，但不希望 AI 静默改库的个人或小团队。
- One-sentence outcome: 读者能设计一条 detect -> evidence -> proposal -> human approval 的维护流程，让 AI 只生成证据充分的维护提案。
- Destination MDX: `starlight/src/content/docs/obsidian-ai/ai-maintains-knowledge-base.mdx`
- Research path: `research/articles/ai-maintains-knowledge-base`
- Showcase path: `research/articles/ai-maintains-knowledge-base/showcase/knowledge-maintenance-proposal`
- Build command: `npm --prefix starlight run build`

## Non-goals

- 不重复讲 inbox placement；相邻文章 `vault-directory-for-ai` 已覆盖目录放置合同。
- 不把页面写成 RAG vs wiki 宣言。
- 不预演下一篇 Git 分支、回滚和冲突恢复工作流。
- 不声称 Obsidian 官方提供 AI 自动维护。
- 不复制 Orange Book PDF 正文、截图、图表或图片。

## Required proof

- 官方 Obsidian Search、Properties、Backlinks、Internal links 页面支撑可观察信号与限制。
- Orange Book §06 只作为中文主题地图，作者花叔/alchaincyf，README 许可为学习交流转载引用需注明出处，不是标准 CC/OSI 许可证。
- 合成 Showcase 包含至少 10 篇 Markdown 笔记、冻结 manifest/link graph/current sources、六类 outcome、确定性 validator、隐私扫描和 live attempt 摘要。
- Writer 阶段保持 `showcase_status: partial`，不写 `quality_score`，`review.md` 保持 PENDING。

## Acceptance criteria

- 正文至少 6 个 H2、至少 6,000 body characters、至少 1,800 个中文解释字符。
- 无 `SourceCard` import 或渲染。
- 有原创教学图、具体 alt、紧随图注、完整 asset ledger，许可为 CC BY-NC-SA 4.0。
- Showcase deterministic verifier: valid `0`、missing evidence `71`、auto-apply `72`、unsupported merge `73`、stale no contradiction `74`、orphan no zero-degree evidence `75`、privacy `0`。
- Nested live run 最多尝试一次；若宿主阻断，保留脱敏摘要并不声称成功。

