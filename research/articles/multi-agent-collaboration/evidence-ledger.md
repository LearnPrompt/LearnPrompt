# 证据台账：多 Agent 协作

| 主张 | 证据 | 证据类型 | 核验日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- |
| subagent 在独立上下文窗口运行，有自定义 system prompt、特定工具访问和独立权限 | 官方 sub-agents 文档：「Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions.」 | 官方一手文档 | 2026-07-11 | 高 | 文档会更新，需按发布日复核 |
| subagent 独立工作、只把总结/结果回报主会话，且在单会话内 | 官方 sub-agents 文档：「works independently and returns results」「Subagents work within a single session.」 | 官方一手文档 | 2026-07-11 | 高 | subagent 之间不能直接通信 |
| Agent Teams 当前为 experimental，默认关闭，需设置 CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS | 官方 agent-teams 文档 Warning：「Agent teams are experimental and disabled by default. Enable them by adding CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS…」 | 官方一手文档 | 2026-07-11 | 高 | 实验特性随版本变化，本页描述基于 v2.1.178 |
| 每个 teammate 是完整、独立的 Claude Code 会话，各有独立上下文，彼此直接通信 | 官方 agent-teams 文档：「Each teammate is a full, independent Claude Code session.」「Teammates work independently, each in its own context window, and communicate directly with each other.」 | 官方一手文档 | 2026-07-11 | 高 | 不继承 lead 的对话历史 |
| 与 subagent 不同，你可以不经过 lead 直接与某个 teammate 交互 | 官方 agent-teams 文档：「Unlike subagents, which run within a single session and can only report back to the main agent, you can also interact with individual teammates directly without going through the lead.」 | 官方一手文档 | 2026-07-11 | 高 | 需在 agent panel/split pane 操作 |
| agent team 共享任务列表并互发消息；任务领取用 file locking 防竞争 | 官方 agent-teams 文档 Architecture（Task list、Mailbox）与「Task claiming uses file locking…」 | 官方一手文档 | 2026-07-11 | 高 | 任务状态可能滞后（文档列为 limitation） |
| agent team 协调开销大、token 显著更多；顺序任务/同文件编辑/多依赖时单会话或 subagent 更合适 | 官方 agent-teams 文档：「Agent teams add coordination overhead and use significantly more tokens than a single session… For sequential tasks, same-file edits, or work with many dependencies, a single session or subagents are more effective.」 | 官方一手文档 | 2026-07-11 | 高 | 未给量化倍数 |
| 两个 teammate 编辑同一文件会互相覆盖，应让每个 teammate 拥有不同文件集 | 官方 agent-teams 文档：「Two teammates editing the same file leads to overwrites. Break the work so each teammate owns a different set of files.」 | 官方一手文档 | 2026-07-11 | 高 | 本文合并门禁即据此设计 |
| worktree 是各自分支上的独立 checkout，用于让并发编辑不相撞 | 官方 common-workflows：「Each worktree is a separate checkout on its own branch.」「Run parallel sessions with worktrees so concurrent edits don't collide.」 | 官方一手文档 | 2026-07-11 | 高 | 合并仍是常规 git 流程，非自动 |
| 用 subagent 委派探索/检索，只把总结带回主上下文 | 官方 common-workflows：「The subagent reads files in its own context window and reports a summary.」；best-practices「infinite exploration」修复项 | 官方一手文档 | 2026-07-11 | 高 | — |
| 独立 reviewer 用 fresh context 减少偏袒自己刚写代码的偏差 | 官方 best-practices：「A fresh context improves code review since Claude won't be biased toward code it just wrote.」 | 官方一手文档 | 2026-07-11 | 高 | reviewer 被要求找 gap 时可能过度报告 |
| 对抗式 reviewer 只看 diff 与验收标准，不看产生改动的推理 | 官方 best-practices：「A reviewer running in a fresh subagent context sees only the diff and the criteria you give it, not the reasoning that produced the change.」 | 官方一手文档 | 2026-07-11 | 高 | — |
| 并行形态并列：Worktrees / Desktop / web / Agent teams，按需要的协调量选择 | 官方 best-practices「Run multiple Claude sessions」列表 | 官方一手文档 | 2026-07-11 | 高 | — |
| Showcase 两个 worker 由两个独立 Node 子进程在不同临时目录运行，各只写一个 owned file、自测通过，并由协调器从两份临时产物完成集成 | `run-independent-workers.mjs`、`workers/run-worker.mjs`、`results/worker-a-result.txt`、`worker-b-result.txt`、`independent-workers-result.txt` | 可运行脚本 + 实测 | 2026-07-11 | 高 | 证明本地进程/文件所有权/产物交接，不证明 Claude 或 Agent Teams 能力 |
| Showcase 正例：独立 worker 产物集成 PASS；不重叠 write set → 门禁 APPROVE(exit 0) → 仓库终态端到端 PASS(exit 0) | Showcase `results/independent-workers-result.txt`、`positive-result.txt`；run-independent-workers / merge-gate / e2e-test 实测 | 可运行脚本 + 实测 | 2026-07-11 | 高 | 确定性流程演示，非模型能力实验 |
| Showcase 负例一：任务声明改冻结 contract → 门禁在应用前 REJECT，exit 3 | Showcase results/negative-contract-conflict.txt；merge-gate.mjs 实测 | 可运行脚本 + 实测 | 2026-07-11 | 高 | 退出码语义为本 Showcase 约定 |
| Showcase 负例二：接口未冻结/依赖未满足 → 门禁判 SEQUENTIAL，exit 4 | Showcase results/negative-sequential.txt；merge-gate.mjs 实测 | 可运行脚本 + 实测 | 2026-07-11 | 高 | 退出码语义为本 Showcase 约定 |
| 冻结 contract 的 SHA-256 为 9fda86…5b66，门禁据磁盘实际校验和比对 | 本机 `shasum -a 256 contract/order-summary.schema.json`；merge-gate.mjs 逻辑 | 本机实测 | 2026-07-11 | 高 | 改动 contract 会改变校验和 |
| 橙皮书 README 声明 CC BY-NC-SA 4.0，仅作中文主题地图 | claude-code-orange-book 仓库 README 许可 | 二手来源许可核验 | 2026-07-11 | 中 | 不用其截图证明现行产品行为 |

## 编辑综合（非事实，需标注）

- 「依赖图 → 冻结接口 → 不重叠所有权 → 合并门禁」是对官方零散约束的操作化归纳，非官方分类、非行业标准。
- 合并门禁四条判据与退出码（0/3/4）是本文 Showcase 约定，不代表 Claude Code 产品内置该门禁。
- 本地确定性 Showcase 只证明任务图/文件所有权/合并门禁，不证明任何模型或 Agent Teams 产品的速度与质量。

## 关于「Agent Team 未真实运行」的披露

本机未开启 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 实验开关，故未真实运行 Agent Team，也未伪造其运行记录。
Showcase 用两个独立本地进程（分别只被授予一个文件所有权）扮演不重叠所有权的 worker，
只隔离并验证「协调 + 合并门禁」这一层可机械检查的骨架。文中所有关于 agent team 的行为均来自官方文档，已在上表登记。
