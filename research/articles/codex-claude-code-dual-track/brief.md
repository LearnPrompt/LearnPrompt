# Brief：双工具双线不靠品牌分工，靠 Git 工件交接与降级

## 文章卡

- 目标 MDX：`starlight/src/content/docs/codex/codex-claude-code-dual-track.mdx`
- 研究目录：`research/articles/codex-claude-code-dual-track`
- 图片目录：`starlight/public/images/articles/codex-claude-code-dual-track/`
- 构建命令：`cd starlight && npm run build`
- 验证日期：2026-07-12

## 目标读者

已经同时在用 Claude Code 与 Codex，或者团队里准备保留两条 agent 通道，但担心上下文断裂、两个工具互相覆盖、一次故障就整条流程停住的工程师、技术作者和小团队维护者。

## 一句话产出

读完后，读者能用一套与品牌无关的 Git handoff contract，把 Claude Code 与 Codex 组织成“诊断 lane / 实现 lane / integrator gate”三段流程；当其中一条 lane 健康检查失败时，也知道怎样降级为 `degraded_single_lane`，并明确这不等于双线流程已经完成。

## 核心主张

这篇文章不回答“该选谁”，也不回答“如何并行拆很多 worker”。它回答的是：**当你决定两个工具都保留时，怎样用 Git 工件让上下文可交接、写集可约束、失败可降级、验收可独立。**

编辑部操作模型中的双线并不是“Claude 天生探索、Codex 天生实现”。当前官方资料显示，两边都支持 worktree、隔离 review 或独立会话，所以角色可以互换。真正该冻结的是：

1. 谁在这一轮只读、谁在这一轮允许写。
2. 哪份 contract 是唯一事实来源。
3. 哪条 lane 的 receipt 缺失时只能降级，不能冒充 `dual_track_complete`。

## 非目标

- 不做 Claude Code 与 Codex 的模型能力、速度、价格或成功率排名。
- 不把 ChatGPT desktop 的 Handoff UI 直接等同于本文的 handoff contract；本文 contract 仅是 LearnPrompt 编辑部的操作模型。
- 不把 2026-07-12 这次 Claude 503 探针外推成产品稳定性结论。
- 不引入多 worker 编排；并行拆任务属于 `multi-agent-collaboration` 的主题。

## 与相邻教程的分工

- `choose-claude-code-or-codex`：回答“怎么选工作方式与工具入口”。
- 本篇：回答“两个都保留时，怎样切 lane 而不丢上下文、证据和验收边界”。
- `multi-agent-collaboration`：回答“如何把任务拆成多个并行 worker 并管理文件所有权”。

## Showcase 问题

构造最小 Node.js fixture `handoff-degradation-lab`，故意留下一个 bug：incident 应按记者本地日期归档，但当前实现按 UTC 日期归档，导致夜间事件落入错误目录。然后验证：

1. Claude lane 先做健康检查。
2. 健康时，Claude 只能只读检查 fixture，产出 diagnosis receipt，不改源码。
3. Codex lane 只在隔离临时 Git worktree 里接收冻结 contract，实施最小 patch。
4. integrator/gate 机械核对 baseline SHA、contract SHA、allowed paths、patch 可应用、tests、changed files 和 lane receipts。
5. 实际 2026-07-12 本机 `Claude Code 2.1.206` 两次探针未拿到模型结果，因此真实状态只能是 `degraded_single_lane`。
6. 若缺 Claude completion receipt 却宣称 `dual_track_complete`，gate 必须非零退出；写集越界或 contract drift 也要有独立非零退出码。

## 需要的证据

- 官方一手资料：
  - `https://code.claude.com/docs/en/worktrees`
  - `https://code.claude.com/docs/en/permissions`
  - `https://code.claude.com/docs/en/sub-agents`
  - `https://code.claude.com/docs/en/sessions`
  - `https://learn.chatgpt.com/docs/environments/git-worktrees`
  - `https://learn.chatgpt.com/docs/code-review`
  - `https://learn.chatgpt.com/docs/agent-configuration/agents-md`
  - `https://learn.chatgpt.com/docs/prompting`
- 本机版本锚点：`claude --version`、`codex --version`、`node --version`、`npm --version`
- `handoff-degradation-lab` 的 fixture、contract、prompt、真实 receipt、good/bad patch、integrator gate、replay 和 privacy scan
- 一张 1400x900 原创教学 SVG，讲清 healthy dual-track 与 degraded_single_lane 的分叉关系

## 验收条件

- 公开页删除 `SourceCard` import 和组件，只保留底部真实来源与橙皮书许可说明。
- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`，不把自己写成 verified。
- 正文至少满足深度教程门槛，且明确包含 handoff contract、失败分支、何时不要双线、练习和验收清单。
- research pack 包含 `brief.md`、`horizontal-research.md`、`vertical-research.md`、`evidence-ledger.md`、`asset-ledger.md`、`control-verification.md`、`release-gate-result.txt`、`review.md` 与可重跑 `showcase/`。
- 单篇 validator、Showcase replay、Starlight build 和 `git diff --check` 都要记录真实结果；若 live codex run 无法安全完成，必须保留 `partial` 并在控制面说明原因。
