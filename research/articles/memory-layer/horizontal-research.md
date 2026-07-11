# 横向研究：记忆层的一手资料、主题地图与同类教程

核验日期 2026-07-11。每条注明它能支撑什么、不能证明什么。

## 一手来源

### 1. Claude Code 官方文档：How Claude remembers your project（memory）
- 链接：https://code.claude.com/docs/en/memory
- 支撑：Claude Code 有两套互补记忆系统。CLAUDE.md（你写、指令/规则、层级 managed→user→project→local、全量载入、建议 < 200 行、@path 导入最多 4 跳、.claude/rules/ 可路径门控）；auto memory（模型写、learnings/patterns、存 `~/.claude/projects/<project>/memory/`、`MEMORY.md` 索引每次载入前 200 行或 25KB、topic 文件按需读、v2.1.59+、默认开、`autoMemoryEnabled`/`CLAUDE_CODE_DISABLE_AUTO_MEMORY` 可关、机器本地、每 git 仓一目录、worktree 共享）。两者都是「上下文而非强制配置」，硬拦截要用 PreToolUse 钩子。项目根 CLAUDE.md 在 /compact 后会从磁盘重读重注入；嵌套 CLAUDE.md 不自动重注入。「何时写入 CLAUDE.md」官方清单：模型第二次犯同样的错、code review 抓到本该知道的事、你又敲了一遍上次的纠正、新同事需要同样上下文。
- 不能证明：Codex 的任何行为；也不保证严格遵守（是 context，不是 system prompt）。

### 2. Codex 本地 CLI（codex-cli 0.142.2）
- 命令：`codex features list`、`codex --help`、`codex resume --help`。
- 支撑：Codex 暴露实验特性 `memories`（experimental, 当前 true）与稳定 `auto_compaction`（true）、`chronicle`（under development, true）；会话可 `resume`/`fork`/`archive`/`delete`（按 UUID 或 session 名）。跨会话「指导」的文档化机制是 AGENTS.md（指令类），与 instruction-layer 已核对：多份 AGENTS.md 按根到叶合并、`project_doc_max_bytes` 默认 32 KiB。
- 不能证明：`memories` 实验特性的具体召回/淘汰语义（仅有特性名，本文不臆测其内部行为，明确标注为实验性、以官方为准）；也不等同于 Claude Code auto memory。

### 3. Anthropic 工程博客：长任务 harness / evals
- 链接：https://www.anthropic.com/engineering/harness-design-long-running-apps ；https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- 支撑：长任务用结构化 artifact 承载状态；生成者容易自评过高、需独立 evaluator；压缩状态为事实索引、原始证据放独立日志/报告（可追溯性）。为「状态 vs 记忆 vs 反馈」的分工提供工程依据。
- 不能证明：具体产品的记忆文件格式或路径。

## 二手主题地图

### 4. Harness Engineering 橙皮书
- 链接：https://github.com/alchaincyf/harness-engineering-orange-book
- 用途：仅作中文主题地图，帮助确认「记忆/状态」在 harness 叙事里的位置与分层顺序。许可为教育性分享、要求署名、无标准开源许可（见 visual-assets.md 许可矩阵）：不复制其任何图片或成段文字，底部保留链接与署名。
- 不能证明：任何当前产品行为——产品事实一律回到来源 1/2 核验。

## 同类教程 / 邻篇

### 5. 本仓已 goldenize 的邻篇
- what-is-harness.mdx（五组件，状态=「下一步要记住什么」）、instruction-layer.mdx（CLAUDE.md/AGENTS.md 作为指令）、constraint-layer.mdx（隐私/密钥属约束）、feedback-loop.mdx（已界定「记忆=跨会话、反馈=即时、状态=本轮」）。
- 用途：保证本文与邻篇分工一致，不重复、不冲突。特别是 feedback-loop 已把「状态层」「记忆层」分开，本文必须沿用同一界定。

## 结论（编辑综合，非官方术语）

把信息按「生命周期 + 谁写谁读」分五个桶（当前上下文 / 任务状态 / 持久项目指令 / 自动记忆 / 原始证据），记忆层只管跨会话的持久桶，是对上述一手资料的操作化归纳，正文中明确标注，不冒充任何产品官方分类。
