# 横向研究：Claude Code 与 Codex

验证日期：2026-07-10

| 资料 | 它擅长回答什么 | 本文如何使用 | 局限 |
| --- | --- | --- | --- |
| [Claude Code overview](https://code.claude.com/docs/en/overview) | Claude Code 当前有哪些执行面和基础能力 | 核对 terminal、IDE、desktop、browser 的现行描述 | 产品页不会替读者做具体选择 |
| [Claude Code permissions](https://code.claude.com/docs/en/permissions) | 权限规则和 permission mode | 解释本地执行不等于无边界执行 | 规则会随版本变化 |
| [Claude Code agents](https://code.claude.com/docs/en/agents) | subagent、background、team、worktree | 纠正“Claude Code 只能同步结对”的过时印象 | 不用于能力排名 |
| [Codex CLI](https://developers.openai.com/codex/cli) | 本地 inspect、edit、run、review、exec | 核对 CLI 与脚本化入口 | 页面迁移时 URL 可能重定向 |
| [Codex cloud](https://developers.openai.com/codex/cloud) | 独立环境、后台与并行任务 | 解释异步委派场景 | 不是所有任务都适合云环境 |
| [Harness engineering](https://openai.com/index/harness-engineering/) | repo 可读性、结构约束与机械验收 | 强调工具选择之后仍要设计环境 | 是工程经验，不是产品对比 |
| [Claude Code 橙皮书](https://github.com/alchaincyf/claude-code-orange-book) | 中文主题地图和学习顺序 | 用于发现研究问题 | 版本快照，不作为现行事实唯一依据 |
| [Codex 橙皮书](https://github.com/alchaincyf/codex-orange-book) | 中文主题地图和 Codex 实践线索 | 用于补齐章节范围 | 同上 |
| [Learn Prompting introduction](https://learnprompting.org/docs/introduction) | 教程的元数据、例子、引用和练习形态 | 作为编辑质量参照 | 主题不是 coding agent 选型 |

## 横向结论

两边的能力集合已大量重叠：都可以在本地读取和修改代码，也都在扩展后台、隔离或并行工作。可靠的文章不能继续沿用“Claude Code 等于本地、Codex 等于云端”的二分法。真正有区分力的是当前任务的反馈节奏、环境依赖、委派边界和验收设计。
