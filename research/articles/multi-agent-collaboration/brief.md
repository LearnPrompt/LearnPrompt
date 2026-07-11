# Brief：多 Agent 协作适合解决什么问题

## 要解决的问题

一个人已经会让单个 Claude Code 会话完成任务，但一遇到「大一点」的活就本能地想拆多个 Agent。
他不知道什么时候值得拆 subagent、什么时候该开 agent team、什么时候该用独立 worktree session，
更常见的是为了并行而并行：两个 Agent 改同一批文件互相覆盖，接口还没定就并行开工，
最后合并时才发现根本对不上。问题不在「拆不拆」，而在拆之前没有先画依赖图、冻结接口、
分配不重叠的文件所有权，也没有一个合并门禁来验证结果。

## 目标读者

会用单个 Claude Code 会话完成可验收任务、现在想扩展到并行协作，但容易「为并行而并行」的实践者。
默认会用命令行、能读 JSON 与简单脚本，但没系统读过官方 sub-agents / agent-teams 文档，
容易把 subagent、agent team、worktree session 混为一谈。

## 学习目标

读者读完能够：

1. 在拆分前先画依赖图、冻结接口与验收标准、分配不重叠的文件所有权。
2. 用一张选择框架表，在单 Agent / subagent / agent team / worktree session 之间做出有依据的选择。
3. 准确区分 subagent（单会话内、独立上下文/工具/权限、只回报主会话）与 agent team
   （独立 Claude Code 会话、共享任务列表与消息、可直接交互、当前 experimental）。
4. 用一个合并门禁（write set 不重叠 / 冻结 contract 校验和 / 端到端测试）在应用前挡住冲突。
5. 知道什么时候根本不该并行：接口未冻结、依赖未满足、多 Agent 会改同一批文件。

## 中心结论

多 Agent 协作的收益来自边界清楚，不来自 Agent 数量。能不能安全并行，取决于三件事先做没做：
依赖图、冻结接口、不重叠的文件所有权；做完再用合并门禁验证。official 明确同文件并行编辑会互相覆盖，
所以「谁拥有哪个文件」必须在开工前定死，而不是在合并时才发现。

## 非目标

- 不做模型速度或质量排名，不保证多 Agent 更快。
- 不写 Agent Teams UI 全手册（显示模式、tmux/iTerm2 配置等只在需要时点到）。
- 不展开 Skills / Hooks / MCP 的写法。
- 不触发部署或远端协作。

## 需要的证明

- 一手来源：code.claude.com 官方 sub-agents / agent-teams / common-workflows / best-practices。
- 一个具体、零依赖、可复现的 Showcase：order-report-pipeline，演示不重叠 write set 的正例合并，
  以及两条负例（声明改冻结 contract 被拒、接口未冻结被判 sequential），保存精确命令、输出、退出码。
- 两个 worker 必须由不同子进程在不同临时目录实际产出各自 owned file，保存 self-test、输出列表、SHA 与
  “集成确实读取 worker 临时产物”的冻结结果，不能只靠任务卡和仓库终态自述。
- 明确披露：本地确定性进程只证明任务图/文件所有权/合并门禁，不证明模型或 Agent Teams 产品的速度与质量。

## 验收条件

- 选择框架覆盖单 Agent / subagent / agent team / worktree / 独立 reviewer 五种形态，各有适用与代价。
- subagent 与 agent team 的区分与官方文档一致，并标明 agent team 当前为 experimental。
- Showcase 正例退出码 0 且端到端 PASS；负例一退出码 3；负例二退出码 4，均可由读者复现。
- 至少一张原创教学图，含具体 alt、紧随图注、asset-ledger、CC BY-NC-SA 4.0。
- 通过单篇 validator、49 页站点构建与 `git diff --check`。

## 未决假设（无人值守下的最小安全假设）

- 文章卡称「agent team 是独立 Claude Code sessions」。2026-07-11 官方 agent-teams 文档原文为
  "Each teammate is a full, independent Claude Code session"，一致，直接采用。
- 真实 Agent Team 需要 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 且当前 experimental；
  本机未开启该实验开关，故 Showcase 用两个独立本地进程扮演不重叠所有权的 worker，
  只验证协调骨架，不伪造 Agent Team 运行，并在正文与 Showcase 明确披露这一边界。
