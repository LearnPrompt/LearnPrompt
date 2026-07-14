# 横向研究：多 Agent 协作

对比一手官方文档与二手主题地图，标明各自能证明什么、不能证明什么。核验日期统一为 2026-07-11。

## 一手来源

### code.claude.com/docs/en/sub-agents（官方 subagent 文档）

支撑：

- 「Each subagent runs in its own context window with a custom system prompt, specific tool access,
  and independent permissions.」——subagent 有独立上下文、独立工具访问、独立权限。
- 「the subagent does that work in its own context and returns only the summary」
  「works independently and returns results」——只把总结/结果回报给主会话。
- 「Subagents work within a single session.」——subagent 是单会话内的委派，不是独立会话。
- 用途：Preserve context、Enforce constraints（限制工具）、Reuse configurations、Specialize behavior、
  Control costs（路由到更快更便宜的模型）。

不能证明：subagent 之间能否直接通信（不能，只回报主 agent）；具体任务下的加速幅度。

### code.claude.com/docs/en/agent-teams（官方 agent team 文档，as of v2.1.178）

支撑：

- experimental：「Agent teams are experimental and disabled by default. Enable them by adding
  `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` to your settings.json or environment.」
- 本质：「Agent teams let you coordinate multiple Claude Code instances working together.
  One session acts as the team lead… Teammates work independently, each in its own context window,
  and communicate directly with each other.」「Each teammate is a full, independent Claude Code session.」
- 与 subagent 的区别：「Unlike subagents, which run within a single session and can only report back
  to the main agent, you can also interact with individual teammates directly without going through the lead.」
- 协作机制：shared task list（file locking 防竞争）、Mailbox（自动投递消息）、idle 通知。
- 代价：「Agent teams add coordination overhead and use significantly more tokens than a single session…
  For sequential tasks, same-file edits, or work with many dependencies, a single session or subagents
  are more effective.」
- 文件冲突：「Two teammates editing the same file leads to overwrites. Break the work so each teammate
  owns a different set of files.」
- 对比表：Subagents = own context / report back to main only / main manages all / lower token cost；
  Agent teams = own context, fully independent / teammates message each other / shared task list / higher token cost。

不能证明：真实项目中 agent team 比单会话快多少或质量更好（官方只说「usually worthwhile」，非基准）。

### code.claude.com/docs/en/common-workflows（官方常见工作流）

支撑：

- worktree：「Run parallel sessions with worktrees so concurrent edits don't collide.」
  「Each worktree is a separate checkout on its own branch.」命令 `claude --worktree feature-auth`。
- subagent：「Delegate research to subagents to keep your main context clean.」
  「The subagent reads files in its own context window and reports a summary.」

不能证明：worktree 的自动合并（官方定位是隔离并行，合并仍是手工/常规 git 流程）。

### code.claude.com/docs/en/best-practices（官方最佳实践）

支撑：

- 并行形态并列：Worktrees / Desktop app / Claude Code on the web / Agent teams，按「你想自己做多少协调」选。
- Writer/Reviewer 模式：「A fresh context improves code review since Claude won't be biased toward code
  it just wrote.」——独立 reviewer 用新上下文只看 diff 与验收标准。
- 对抗式 review：「A reviewer running in a fresh subagent context sees only the diff and the criteria
  you give it, not the reasoning that produced the change.」
- 反模式「The infinite exploration」：用 subagent 隔离探索，避免污染主上下文。

不能证明：具体项目下的最优并行度。

## 二手主题地图

### alchaincyf/claude-code-orange-book（橙皮书）

角色：仅作中文主题地图，帮助确定「什么时候拆、怎么分工、reviewer 独立」这些话题值得讲。
许可：仓库 README 声明 CC BY-NC-SA 4.0，引用需保留作者、仓库地址、许可与修改说明，不得商用。
不能证明：任何现行产品行为——subagent/agent team/worktree 的机制以官方文档为准，不用橙皮书截图当现状证据。

## 与相邻文章的分工

- what-is-harness / orchestration-layer：负责「编排」这一 Harness 组件的通用模型，本文只聚焦「拆不拆、怎么拆」。
- advanced-conversation-patterns：负责单会话内的对话与上下文管理，本文聚焦跨 worker 的协调与合并门禁。
- 本文独有：把「依赖图 → 冻结接口 → 不重叠所有权 → 合并门禁」放进一个可运行的 order-report-pipeline，
  并给出单 Agent / subagent / agent team / worktree / reviewer 的选择框架。
