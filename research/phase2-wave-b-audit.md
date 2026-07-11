# Phase 2 Wave B 收官审计

审计日期：2026-07-12

结论：本地生产门禁 PASS。Wave B 范围内 14 篇教程全部 `verified`、全部移除公开 `SourceCard`、每篇都有一张可教学图片；Phase 2 Wave B 本轮实际新增或重做 13 篇，另含 Phase 1 已完成的 `codex-form-factors.mdx`。

## 审计范围

- Claude Code：8 篇。
- Codex：6 篇。
- 当前全站：27 verified / 14 个仍含 SourceCard 的待处理深度教程。

## 官方资料时效复核

Claude Code 当前行为重新对照以下官方页面：

- [Worktrees](https://code.claude.com/docs/en/worktrees)
- [Permissions](https://code.claude.com/docs/en/permissions)
- [Sessions](https://code.claude.com/docs/en/sessions)
- [Memory](https://code.claude.com/docs/en/memory)
- [Hooks](https://code.claude.com/docs/en/hooks)
- [Skills](https://code.claude.com/docs/en/skills)
- [Common workflows](https://code.claude.com/docs/en/common-workflows)

Codex 当前行为重新对照以下官方页面：

- [Worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)
- [Code review](https://learn.chatgpt.com/docs/code-review)
- [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Permissions](https://learn.chatgpt.com/docs/permissions)
- [Sandboxing](https://learn.chatgpt.com/docs/sandboxing)
- [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment)
- [GitHub integration](https://learn.chatgpt.com/docs/third-party/github)
- [Prompting](https://learn.chatgpt.com/docs/prompting)

本机版本锚点仍为 Claude Code 2.1.206、codex-cli 0.142.2。审计没有发现需要用橙皮书旧版本、旧价格、旧命令或旧产品形态覆盖官方资料的页面。

## 跨篇分工与重复内容

| 容易混淆的页面 | 已确认分工 |
| --- | --- |
| `install-and-first-project` / `codex-cli-workflow` | 前者教第一次可验收小改；后者教非交互 `codex exec` 的 patch/report/release gate |
| `minimum-claude-md` / `control-style-with-claude-md` | 前者给最小持久上下文；后者教根规则、路径规则与机械检查分层 |
| `advanced-conversation-patterns` / `codex-claude-code-dual-track` | 前者处理 Claude Code 会话内外的上下文切换；后者处理跨工具 receipt、故障降级和状态声明 |
| `multi-agent-collaboration` / `codex-claude-code-dual-track` | 前者是多 worker 并行、所有权与依赖；后者是双通道切换与 failover，不把品牌当固定角色 |
| `codex-form-factors` / `codex-cloud-task-fit` | 前者选择执行面；后者只判断任务是否适合保守的离线优先无人值守 Cloud lane |
| `auto-review-boundaries` / `codex-claude-code-dual-track` | 前者区分 PR review 与 approval reviewer；后者区分实现、诊断 receipt 与 integrator gate |

允许跨篇复用 `contract / receipt / gate / worktree` 这些基础词，但没有复用同一中心问题或同一 Showcase 充当多篇结论。

## 术语与状态审计

- 没有把“Claude 负责思考、Codex 负责执行”写成品牌天性。
- Codex 桌面 App 的产品内 Handoff 与 LearnPrompt 自建跨品牌 handoff contract 已明确分开。
- Claude Code 的 `CLAUDE.md`、rules、hooks、permissions、worktrees、sessions 与 Codex 的 `AGENTS.md`、sandbox、approval、permission profiles、Cloud、code review 均保持分列。
- 修正 `codex-claude-code-dual-track.mdx` 中一处 writer-stage `partial` 残留，把它改成“partial → 独立终审 → verified”的状态机说明。
- 14 篇均为 `showcase_status: verified`；没有 `partial` / `planned` 残留。

## 图片、来源与许可

- 14/14 篇各有一张本地教学图片，不以封面或 logo 充数。
- 14/14 篇均有 final visual PASS attestation 与 asset ledger。
- 公开页没有 SourceCard；底部保留实际使用的一手资料、橙皮书二手主题地图和许可说明。
- Claude Code / Codex 橙皮书只作为 CC BY-NC-SA 4.0 中文主题地图使用，不承担现行产品事实证明。

## 外链审计

- 共检查 60 个去重外链。
- 54 个当前返回 2xx / 3xx。
- 6 个返回 404，全部是 `github.com/LearnPrompt/LearnPrompt/tree/main/research/...` 的本地新 research 目录；对应六个本地目录均存在。当前没有 push / merge，所以远端 `main` 尚未包含这些路径。
- 发布后需要对这 6 个未来链接再跑一次远端检查；这不阻塞本地生产门禁，但阻止把当前状态写成“已在线发布”。

## 最终机械门禁

- 27 篇 verified 全量 validator：PASS。
- Validator 回归：1 positive / 3 depth negatives / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- Starlight 完整构建：49 pages PASS。
- Wave B 14 篇：14 verified / 0 SourceCard / 0 partial / 14 teaching images。
- 全站剩余 SourceCard：14。
- 没有 push、部署或发布。
