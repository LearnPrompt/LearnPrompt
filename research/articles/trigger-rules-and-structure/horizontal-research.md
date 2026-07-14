# Horizontal research：触发边界与目录分层

| 来源 | 它支持什么 | 它不能证明什么 |
| --- | --- | --- |
| [Agent Skills Specification](https://agentskills.io/specification) | 开放规范里的最小目录、`SKILL.md` frontmatter、`scripts/` / `references/` / `assets/` 可选目录、progressive disclosure、相对路径引用约束 | 不能证明 Codex 或 Claude Code 的具体目录位置、listing 预算、显式调用语法 |
| [Build skills | ChatGPT Learn](https://learn.chatgpt.com/docs/build-skills) | Codex 当前从 `.agents/skills` 扫描 repo skills；支持显式 `$skill` 与隐式 `description` 匹配；skills listing 预算是上下文窗口的 2%，未知窗口时 8000 字符；可用 `agents/openai.yaml` 扩展 UI / policy / dependencies | 不能代表所有 Agent Skills 客户端都支持 `openai.yaml` |
| [Customization | ChatGPT Learn](https://learn.chatgpt.com/docs/customization/overview) | Codex 里 skills 和 `AGENTS.md` / memories / MCP / subagents 的分层关系 | 不是 skills authoring 规范，不说明目录细节 |
| [Claude Code slash commands / skills docs](https://code.claude.com/docs/en/slash-commands) | Claude Code 的触发排错、frontmatter 失效时 `/skill-name` 仍可运行但 description 消失、listing 会截短 | 不能证明开放规范也有相同行为 |
| [Claude Code features overview](https://code.claude.com/docs/en/features-overview) | Claude Code 支持 `/<name>` 显式调用与自动匹配；默认描述先载入、正文后载入；`disable-model-invocation: true` 会让 Skill 只显式可见 | 不能证明其他 Anthropic surface 或 Codex 也接受同字段 |
| [Claude Platform Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | `name` / `description` 的必填性与基本约束，尤其是 `description` 既要说明做什么也要说明何时使用 | 不是 Claude Code CLI 的完整行为文档 |
| 任务提供的两份工作树外橙皮书中文主题地图 | 中文主题地图，帮助定位“触发、冲突、渐进加载、安装路径”这些话题的常见讲法；提供近邻冲突的教学例子 | 不能作为当前客户端算法事实；即使 README 把 Agent Skills 称为开放标准，也不能据此推出每个客户端都共享同一字段、同一目录和同一预算 |
| 仓内黄金样稿 [starlight/src/content/docs/agent-skills/first-skill-md.mdx](../../../starlight/src/content/docs/agent-skills/first-skill-md.mdx) | 教学节奏校准：它已经覆盖了 `name` / `description` 基础硬限制、最小模板和打包步骤，因此本文应避免重复 | 不是外部事实来源，不能替代官方文档 |

## 结论

1. “目录结构”这件事，开放规范只给出最小骨架；真正的路径、listing 预算和显式调用语法属于客户端实现。
2. “触发规则”这件事，Codex 与 Claude Code 都把 skill description 当成隐式匹配入口，但具体扫描路径、预算、禁隐式字段和显式语法都不同。
3. 橙皮书适合当主题地图，帮助生成近邻冲突和排错章节；不适合充当“关键词优先级”“某客户端固定算法”的权威证据。
