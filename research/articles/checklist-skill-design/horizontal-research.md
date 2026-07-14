# Horizontal research：checklist-skill-design

验证日期：2026-07-12

| 来源 | 类型 | 支撑什么 | 不能证明什么 |
| --- | --- | --- | --- |
| [Agent Skills Specification](https://agentskills.io/specification) | 一手规范 | `SKILL.md` 最小结构、可选 `scripts/ references/ assets/`、progressive disclosure 的三层加载 | 不规定 LearnPrompt 的 release gate exit code |
| [Build skills | ChatGPT Learn](https://learn.chatgpt.com/docs/build-skills) | OpenAI 官方 | Codex 的 `.agents/skills` 发现路径、显式 `$skill` 与按 `description` 隐式匹配、description 需要前置边界词 | 不定义 checklist row 字段 |
| [Customization | ChatGPT Learn](https://learn.chatgpt.com/docs/customization/overview) | OpenAI 官方 | repo skill 适合 repeatable workflow；Codex 先读 metadata，再读 `SKILL.md`，最后按需读 references / scripts | 不提供 release checklist 模板 |
| [Claude Code slash commands / skills](https://code.claude.com/docs/en/slash-commands) | Anthropic 官方 | `disable-model-invocation: true`、前后端 skill 目录与显式调用分离，可用于解释“高风险 checklist 常退回显式调用” | 不是 Codex 的行为规范 |
| [Claude Platform Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | Anthropic 官方 | metadata / instructions / resources 的 progressive disclosure、脚本作为 deterministic 操作 | 不定义 npm release gate |
| [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/) | npm 官方 | `npm pack --dry-run` 是 dry-run，本地只报告会做什么；适合作为 pre-publish evidence | 不会替你验证 changelog 或 install contract |
| [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) | npm 官方 | `bin` 字段如何暴露 CLI，可解释为什么 release smoke 需要验证实际可执行入口 | 不说明团队自己的 severity policy |
| 任务提供的本地只读橙皮书镜像与中文转写文本 | 主题地图 / 二手 | 提醒“设计模式”话题面和中文表述切入点 | 不是现行产品事实；仓库 README 无标准开源许可，不能复制图片或成段原文 |

## 主题地图使用边界

- 橙皮书只帮助定位“checklist 型 Skill”这个主题和中文命名。
- 本文的 row contract、退出码、severity policy、`N/A` 规则都是 LearnPrompt 的操作化设计，不冒充官方术语。
