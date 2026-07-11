# Horizontal Research — content-automation-pipeline

## 一手产品资料

| 来源 | 支撑什么 | 不能证明什么 |
| --- | --- | --- |
| Claude Code 官方 `Common workflows` | 证明 Claude Code 已经提供 `plan` 模式、worktrees、把 Claude 接入脚本等工作流积木，适合把“先审后改”“隔离运行”“离线脚本化”写进教程 | 不能直接证明任何一套“内容流水线”术语是官方标准 |
| Claude Code 官方 `hooks-guide` 与 `hooks` reference | 证明 Hook 是生命周期事件上的确定性控制层，`PreToolUse` 可以 deny / ask / allow，并通过 stdin/stdout/exit code 交换结构化决定 | 不能替代编辑判断，也不能单独证明一篇周报该不该发布 |
| Claude Code 官方 `permissions` | 证明真正的 allow / ask / deny 是由 Claude Code 权限系统执行，而不是由 prompt 或 Markdown 口头约束 | 不能说明内容筛选理由是否充分，也不能替代人工批准 |
| Claude Code 官方 `features-overview`、`how-claude-code-works`、`skills` | 证明 Skill、Hook、权限、Subagent、workflows 都是挂在同一 agentic loop 之上的不同层次；Skill 适合承载可复用工作流 | 不能给出本文这套 `snapshot / normalize / dedupe / score / draft / verify / approve` 的官方命名 |

## 二手主题地图

| 来源 | 价值 | 边界 |
| --- | --- | --- |
| [alchaincyf/claude-code-orange-book](https://github.com/alchaincyf/claude-code-orange-book) | 提供“内容自动化”“工作流拆层”“Agent 实践”这些中文入口，适合帮助读者从已有认知进入本文 | 不能充当当前 Claude Code 行为的事实权威；产品行为仍以官方文档和本地实跑为准 |

许可：该仓库 README 声明采用 CC BY-NC-SA 4.0。本文不复用其截图，只在来源区保留链接、作者仓库和许可说明。

## 教学参考

| 参考 | 借鉴点 | 不照搬的部分 |
| --- | --- | --- |
| `starlight/src/content/docs/claude-code/skills-hooks-mcp-roles.mdx` | 证明“机制边界”最适合用退出码、manifest、负例反证来教学，而不是只讲概念定义 | 本文不是扩展点选型，不展开 MCP |
| `starlight/src/content/docs/claude-code/control-style-with-claude-md.mdx` | 证明“软规则”和“硬检查”应分层；这正适合迁移到“草稿”“verify contract”“批准门禁”的边界 | 本文不讲 `.claude/rules/` 的目录级作用域 |
| `starlight/src/content/docs/claude-code/multi-agent-collaboration.mdx` | 证明把状态、contract、合并门禁写成独立工件，能显著降低“我以为已经好了”的错觉 | 本文不讨论多 Agent 分工，而是单条内容流水线的状态机 |

## 结论

横向对照后的稳定判断是：

1. 官方文档提供的是工作流原语与安全边界，不会替你发明内容生产线术语。
2. 因此，`snapshot / normalize / dedupe / score / draft / verify / approve` 必须明确标成本文的七阶段操作模型。
3. 真正值得教给读者的，不是如何再写一个抓取脚本，而是如何让每一段失败都停在对应阶段，并留下足够证据让下一位编辑继续接手。
