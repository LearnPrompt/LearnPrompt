# Evidence ledger：Claude Code 与 Codex

验证日期：2026-07-10

| 正文主张 | 证据 | 类型 | 置信度 | 备注 |
| --- | --- | --- | --- | --- |
| Claude Code 不只运行在终端 | [Overview](https://code.claude.com/docs/en/overview) | 官方产品文档 | 高 | 文档列出 terminal、IDE、desktop、browser |
| Claude Code 支持权限规则和不同执行模式 | [Permissions](https://code.claude.com/docs/en/permissions) | 官方产品文档 | 高 | 具体名称属于易变信息，已标验证日期 |
| Claude Code 有 subagent、background、team、worktree 等隔离方式 | [Agents](https://code.claude.com/docs/en/agents) | 官方产品文档 | 高 | 不推导绝对性能 |
| Codex CLI 能 inspect、edit、run，并有 exec/review 路径 | [Codex CLI](https://developers.openai.com/codex/cli) | 官方产品文档 | 高 | 本机 `codex --help` 二次核对 |
| Codex cloud 支持独立环境、后台和并行任务 | [Codex cloud](https://developers.openai.com/codex/cloud) | 官方产品文档 | 高 | 云端适用性取决于任务环境 |
| 仓库可读性和机械约束会影响 Agent 表现 | [Harness engineering](https://openai.com/index/harness-engineering/) | 官方工程文章 | 中高 | 属于工程经验总结 |
| 两个 CLI 对同一仓库诊断得到相近结论 | `showcase/claude-result.json` 与 `showcase/codex-result.json` | 本地现场实验 | 高（仅限本次环境） | 不能外推为模型排名 |
| Codex 首次运行因模型与 CLI 版本不兼容而失败 | `showcase/codex-first-attempt.txt` | 本地现场实验 | 高（仅限本次环境） | 保留失败，不升级全局 CLI |
| 实验开始时位于 `main` 且工作树干净 | `showcase/environment.txt` | 本地 Git 状态记录 | 高（仅限当时） | 后续文章修改会使状态变化 |
| 真实改稿从相同提交、相同目标文件与相同构建验收开始 | `showcase/workflow-comparison/README.md` 与 `frozen-brief.md` | 本地实验设计 | 高（仅限本次环境） | 两侧提示词与模型不同 |
| Claude discovery 提出三个内容缺口和四个编辑决策 | `showcase/workflow-comparison/claude-code/round-1-discovery.md` | 本地现场实验 | 高（仅限本次运行） | 证明探索产物，不证明模型普遍能力 |
| Claude 执行受到会话、插件、工具路径和依赖缓存影响 | `showcase/workflow-comparison/claude-code/execution-result.md` | 失败与恢复记录 | 高（仅限本机 Harness） | 不归因于 Claude 模型能力 |
| Codex 在一次冻结 brief 委派中修改单文件并完成构建 | `showcase/workflow-comparison/codex/delegation-result.md` | 本地现场实验 | 高（仅限本次运行） | brief 来自前置 discovery |
| 两条路线最终都只改一个 MDX 且构建通过 | `showcase/workflow-comparison/comparison.md` | 跨工件比较 | 高（仅限完成状态） | 不比较文字质量和速度 |
| 两侧最终成稿与命令错误摘录已经归档 | `showcase/workflow-comparison/outputs/` 与 `command-log.md` | 原始输出 + 脱敏命令记录 | 高（内容和关键状态） | 会话 ID 与认证信息有意省略 |
