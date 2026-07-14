# Horizontal Research：流水线型 Skill 设计

核验日期：2026-07-12。

| 来源 | 类型 | 支撑什么 | 不能证明什么 |
| --- | --- | --- | --- |
| `https://agentskills.io/specification` | 一手规范 | Skill 至少包含 `SKILL.md`，可选 `scripts/`、`references/`、`assets/`，并按 metadata / body / resources 渐进加载 | 不规定某个客户端怎样做 checkpoint 或 receipt |
| `https://learn.chatgpt.com/docs/build-skills` | 一手产品文档 | Codex repo Skill 当前放在 `.agents/skills`；Skill 用于可复用 workflow；需要确定性行为时可下沉脚本 | 不定义 Claude Code 的路径或显式调用语法 |
| `https://learn.chatgpt.com/docs/customization/overview` | 一手产品文档 | `AGENTS.md` 负责持久项目规则，Skills 组织重复流程，MCP 负责外部系统连接 | 不提供阶段恢复 contract |
| `https://code.claude.com/docs/en/skills` | 一手产品文档 | 当同一套 instructions / checklist / multi-step procedure 反复出现时，该抽成 Skill；Skill body 只在使用时加载 | 不说明 OpenAI repo Skill 的目录约定 |
| `https://nodejs.org/api/crypto.html` | 一手运行时文档 | `createHash()` 可用于计算输入与输出哈希 | 不定义什么叫“应该 resume” |
| `https://nodejs.org/api/fs.html` | 一手运行时文档 | 文件系统 API 足够支撑确定性枚举、读写和复制 | 不保证你的目录遍历天然有业务语义 |
| `$TMPDIR/agent-skills-orange-book/README_zh.md` | 二手主题地图 | 橙皮书把“流水线型 Skill”列为设计模式之一，可帮助组织中文主题地图 | 其 README 只声明个人学习用途，不是标准开源许可，也不是现行产品事实来源 |
| `$TMPDIR/agent-skills-orange-book-zh.txt` | 二手主题地图 | 提示本篇可聚焦“设计模式”而不是字段入门 | 不可当成当前官方路径、字段、调用或恢复机制权威 |

## 并列结论

### 1. 官方资料给的是 Skill 容器，不是恢复协议

- 开放规范和产品文档都能证明 Skill 目录、元数据、渐进加载与脚本边界。
- 但它们都没有替你定义“transform 后 crash 应怎样 resume”。
- 因此本文必须明确区分：Skill 容器来自官方，receipt / checkpoint / invalidation 是 LearnPrompt 的操作化设计。

### 2. 流水线型 Skill 的关键边界不在“步骤数量”，而在“阶段之间是否可证明”

- 如果每一步只有自然语言，没有输入哈希、输出哈希、退出码和 checkpoint，你只是把多个动作排成序列，还没有得到恢复骨架。
- stage contract 的任务，是把“我做过了”变成可复核证据。

### 3. `AGENTS.md` 和 Skill 的差异在加载时机

- 项目级持久规则应放在 `AGENTS.md`。
- 只在命中特定任务时才需要加载的迁移流程，应放进 Skill。
- 这也是为什么本文 Showcase 把真实迁移逻辑放在 `.agents/skills/docs-migration-pipeline/`，而不是把五阶段规则塞回全局指令。

### 4. 只有脚本，没有 Skill，也不够

- 单独脚本能完成确定性迁移，但回答不了“什么时候只做 candidate、为什么 crash 可以 resume、哪些退出码代表必须停下”。
- Skill 正文负责协调，脚本负责机械执行，两者不能互换。

### 5. 橙皮书只能作为主题地图

- 它帮助确认“流水线型 Skill”确实是读者熟悉的命名方式。
- 但因为 README 未提供标准开源许可，本文不能复制其 PDF、截图或图片，也不能拿它证明当前产品行为。
