# Horizontal research

验证日期：2026-07-12。

## 一手官方资料

| 来源 | 支撑什么 | 不能证明什么 |
| --- | --- | --- |
| Claude Code worktrees | Claude 可在独立 git worktree 中运行，隔离文件修改，并能与 subagent/worktree 结合 | 不能证明本机某次模型请求一定成功 |
| Claude Code permissions | deny 优先于 allow、权限有明确 precedence，workspace trust 影响 project allow 规则 | 不能替代具体 handoff contract |
| Claude Code sub-agents | subagent 有独立 context 和权限，适合隔离侧任务 | 不能说明本篇必须使用 subagent；本篇明确不用 |
| Claude Code sessions | `--continue` / `--resume` 属于会话恢复能力 | 不能替代 Git 工件级交接 |
| Codex worktrees | Codex 桌面 App 的 worktree 与 Handoff 是产品内 Git 流程 | 不能直接等同于本文的跨工具 handoff contract |
| Codex code review | review 可以在当前任务或 detached task 中运行，review pane 反映 Git 仓库状态 | 不能证明实现者和 reviewer 自动隔离；仍需显式流程设计 |
| Codex AGENTS.md | Codex 会按全局与项目层级加载 `AGENTS.md` 指令链 | 不能代替冻结 contract 和 deterministic gate |
| Codex prompting | prompt 至少应说明 goal、context、output、boundaries | 不能替代真实测试或 SHA 级验收 |

## 二手主题地图

| 来源 | 贡献 | 限制 |
| --- | --- | --- |
| Claude Code 橙皮书 | 提供中文术语和主题地图，帮助确定教程切口 | 不作为 2026-07 的现行产品事实依据 |
| Codex 橙皮书 | 提供中文语境与相邻题目关系 | 不作为本文的实测凭证 |

## 现有 LearnPrompt 相邻教程

| 教程 | 本篇借鉴什么 | 本篇不重复什么 |
| --- | --- | --- |
| `choose-claude-code-or-codex` | 选型时先看工作方式而非品牌 | 不再做“该选谁”的决策树 |
| `multi-agent-collaboration` | 用冻结 contract、write set 与 gate 解释协调边界 | 不做多 worker 拆分与 team/subagent 编排 |
| `codex-cli-workflow` | 用真实 `codex exec` + deterministic gate 固定补丁与报告 | 不重讲交互 Codex 与 exec 的基础入门 |

## 编辑部综合判断

本篇需要把两个常见误解拆开：

1. “双工具协作”不等于“品牌天性分工”。官方资料都说明两边有 worktree、隔离 review 或独立会话能力，所以角色分配是流程决策，不是产品宿命。
2. “handoff”不是某个专有 UI 按钮的名字。Codex 桌面 App 确有 Handoff，但本文用的是更抽象也更跨工具的 contract/receipt/gate 模型，必须明确标注为编辑部操作模型。
