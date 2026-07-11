# Horizontal Research：什么是 Agent Skill

核验日期：2026-07-12。

| 来源 | 类型 | 支撑什么 | 不能证明什么 |
| --- | --- | --- | --- |
| `agentskills.io/specification` | 一手规范 | Skill 的目录结构、`SKILL.md` frontmatter、`scripts/` / `references/` / `assets/`、渐进加载三层 | 不定义某个具体客户端怎样显式调用或怎样分发 |
| OpenAI `Build skills` | 一手产品文档 | Codex 把 Skill 作为可复用 workflow 格式；repo Skill 当前放在 `.agents/skills`；显式 `$skill` 仍可用；脚本适合确定性行为 | 不代表 Claude Code 的命令名或路径规范 |
| OpenAI `Customization overview` | 一手产品文档 | `AGENTS.md` 是持久项目指导；Skill 是可复用流程；MCP 是外部系统连接；它们互补 | 不提供 Skill 目录规范细节 |
| Claude Code `slash-commands` | 一手产品文档 | Claude Code 中 Skill 可自动触发或用 `/skill-name` 显式调用；`.claude/commands/` 与 `.claude/skills/` 的关系；当 CLAUDE.md 里某段已长成 procedure 时该抽成 Skill | 不代表 Codex 的显式调用语法 |
| Claude Code `features-overview` | 一手产品文档 | `CLAUDE.md`、Skills、MCP、plugins 各插在 agent loop 的哪一层；plugin 是 packaging layer | 不提供开放标准字段约束 |
| Claude Platform `agent-skills/overview` | 一手平台文档 | Skill 在不同 surface 不自动同步；Claude Code 技能仍是 filesystem-based；Claude API/claude.ai/Claude Code 共享范围不同 | 不定义 OpenAI repo Skill 的路径 |
| 本地临时镜像 `agent-skills-orange-book-zh.txt` 概念篇 | 二手主题地图 | 读者常见心智模型：Skill 像工作手册，MCP 像“手和接口”；能帮助组织中文教学结构 | 不是现行产品行为权威，且不能复制原文或图片 |
| 本地临时镜像 `agent-skills-orange-book/README_zh.md` | 二手主题地图 | 这本书的概念篇定位、作者署名、用途限制说明 | 不足以证明字段、路径、共享或显式调用的当前行为 |

## 关键并列结论

### 1. Skill 的“最小共同点”来自开放规范，不来自某个客户端

- 开放规范只保证：目录里至少有 `SKILL.md`，可以有 `scripts/`、`references/`、`assets/`，并按 metadata / body / resources 渐进加载。
- 这解释了为什么本文必须先讲“Skill 是什么”，再讲“Codex 和 Claude Code 怎么各自装配它”。

### 2. repo Skill 与 Claude Code 项目 Skill 路径不能混写

- OpenAI 当前 repo Skill 文档明确使用 `.agents/skills`。
- Claude Code 当前项目 Skill 文档明确使用 `.claude/skills`，且显式调用是 `/skill-name`。
- 因此正文必须写成“同一开放标准，不同客户端装配路径和显式调用不同”，不能偷懒写成统一标准路径。

### 3. Skill 和脚本不是替代关系，而是上下游分工

- OpenAI 文档建议：默认优先 instructions；只有在需要确定性行为或外部工具时再引入脚本。
- 开放规范也把 `scripts/` 设计成按需加载资源，而不是正文的一部分。
- 这正适合本文的收据案例：Skill 负责什么时候用、需要什么输入、失败码怎么解释；脚本负责日期/金额/文件名规则。

### 4. `AGENTS.md` / `CLAUDE.md` 与 Skill 的差别在加载时机和适用范围

- OpenAI 文档把 `AGENTS.md` 定位为 repo 级持久指导。
- Claude 文档把 `CLAUDE.md` 定位为每次会话都可见的 persistent context。
- Skill 则是按需、按任务加载。它适合反复流程，不适合所有会话都要看的通用约束。

### 5. plugin 的职责是分发，不是执行逻辑

- OpenAI `Build skills` 直接把 plugin 说成“when you want other people in your workspace to install it”。
- Claude `features-overview` 则把 plugin 说成 packaging layer，能打包 skills、hooks、subagents、MCP servers。
- 所以 plugin 不是 prompt 的升级版，也不是脚本宿主；它只是把一个或多个能力打成可安装包。
