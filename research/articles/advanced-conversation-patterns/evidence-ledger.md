# evidence-ledger.md — 证据台账

核对日期统一为 2026-07-11。证据类型：一手文档 / 本地实测 / 二手主题地图 / 编辑综合。

| # | 声明 | 证据 | 类型 | 验证日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Claude Code 推荐长任务遵循 `Explore first, then plan, then code` | `https://code.claude.com/docs/en/best-practices` | 一手文档 | 2026-07-11 | 高 | 这是推荐 workflow，不保证所有任务都必须四阶段 |
| 2 | 官方强调应给 Claude 一个可运行的 pass/fail 验证门，而不是只看“像不像完成” | `best-practices` 的 “Give Claude a way to verify its work” | 一手文档 | 2026-07-11 | 高 | 验证门本身仍可能设计错误 |
| 3 | 上下文窗口会随着消息、文件、命令输出变长而膨胀，性能和记忆会退化 | `best-practices`、`how-claude-code-works` | 一手文档 | 2026-07-11 | 高 | 未量化到具体 token 阈值 |
| 4 | `claude --continue` 会恢复当前目录最近一次 session；`claude --resume` 打开 picker 或按名恢复 | `https://code.claude.com/docs/en/sessions`、`cli-reference` | 一手文档 | 2026-07-11 | 高 | CLI 细节未来可能变更 |
| 5 | `/clear` 会清空当前上下文，但旧 conversation 仍可恢复 | `sessions` 页 “Manage context within a session” | 一手文档 | 2026-07-11 | 高 | 清空的是当前上下文，不是删除本地 transcript |
| 6 | `/compact` 在同一 session 中用摘要替换历史，可附带 focus 指令 | `sessions` 页 “Manage context within a session” 与 `how-claude-code-works` | 一手文档 | 2026-07-11 | 高 | 摘要会压缩细节，不自动提升质量 |
| 7 | `--fork-session` / `/branch` 会复制历史到新 session ID，原 session 保持不变 | `sessions` 页、`cli-reference`、`how-claude-code-works` | 一手文档 | 2026-07-11 | 高 | 如果原上下文本身脏，fork 也会复制噪声 |
| 8 | checkpoint 支持 restore code / restore conversation / restore both / summarize，并可跨会话持久 | `checkpointing`、`best-practices` | 一手文档 | 2026-07-11 | 高 | 细节 UI 可能调整 |
| 9 | checkpoint 不追踪 bash 命令造成的文件修改，不是 git 替代品 | `checkpointing` 限制说明 | 一手文档 | 2026-07-11 | 高 | 只覆盖官方现行行为 |
| 10 | Claude Code 的 agentic loop 是 gather context → take action → verify results | `how-claude-code-works` | 一手文档 | 2026-07-11 | 高 | 机制说明，不是本文 Showcase 结果 |
| 11 | 官方 bug workflow 建议提供重现命令和具体症状 | `common-workflows` 的 “Fix bugs efficiently” | 一手文档 | 2026-07-11 | 高 | 提示词 recipe，不是强制接口 |
| 12 | 本机 `claude` CLI 存在，版本为 `2.1.206 (Claude Code)` | `command -v claude`、`claude --version` | 本机实测 | 2026-07-11 | 高 | 本文 Showcase 未把真实模型运行当成发布门 |
| 13 | Showcase fixture 的基线 bug 是 `slugify(\"Rock & Roll\")` 输出 `rock--roll`，与期望 `rock-roll` 不符 | `showcase/results/stage-a-summary.txt` 中记录的 baseline test 结果 | 本地实测 | 2026-07-11 | 高 | 只代表此 fixture |
| 14 | Stage A 只读探索冻结了 symptom/evidence/allowed_files/acceptance/risks 五类 handoff 信息 | `showcase/handoff/handoff-good.json` 与 `stage-a-explore.mjs` | 本地实测 | 2026-07-11 | 高 | handoff 字段是本文编辑综合，不是官方固定 schema |
| 15 | Stage B 在新进程、临时副本、只依赖 repo+handoff 的前提下完成最小修复，并通过 `node tests/run-tests.mjs` | `showcase/results/positive-run.txt` 与 `stage-b-implement.mjs` | 本地实测 | 2026-07-11 | 高 | 证明的是流程隔离，不是 Claude 模型行为 |
| 16 | 负例 handoff 缺 `acceptance.commands` 时，Stage B 会拒绝继续执行 | `showcase/results/negative-run.txt` | 本地实测 | 2026-07-11 | 高 | 这是本文 deterministic gate，不是官方内建功能 |
| 17 | 教学图同时展示“操作选择”和“两阶段隔离流水线” | `/images/articles/advanced-conversation-patterns/conversation-patterns-map.svg` | 编辑综合 | 2026-07-11 | 高 | 图本身是教学重组，不是外部原始证据 |
| 18 | `alchaincyf/claude-code-orange-book` 许可为 CC BY-NC-SA 4.0，只能作二手主题地图 | 橙皮书仓库 README 许可声明 | 二手主题地图 | 2026-07-11 | 高 | 不证明现行产品行为 |

## 一手 / 推断 / 编辑边界

- 一手事实以第 1–11 条官方文档为准。
- 本地 Showcase 事实以第 12–16 条为准，只证明 deterministic 流程隔离。
- 第 17 条属于编辑综合：它把多份一手事实与本地 Showcase 重新组织成一张教学图。
- 第 18 条只负责许可与署名边界，不作为功能权威。
