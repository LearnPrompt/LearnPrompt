# Review：Constraint Layer

## 评审元数据

- Reviewer：Codex CLI / gpt-5.4，独立只读初审与最终 reviewer。
- 审稿模式：read-only，只读取目标 MDX、研究包、Showcase 与教学资产。
- 隔离声明：reviewer 使用独立只读会话，writer 未参与打分或修改评审结果。
- 原始评审输出保存在仓库外的控制面日志中，未将机器本地路径或运行标识纳入研究包。

## 审稿与修订链路

初审结论为 FAIL（87/100）：0 blocker、1 major、1 minor。

- 补齐 Codex `approval_policy` 的 granular 对象形态与当前提示类别，不再把三个字符串写成完整枚举。
- 将 Claude Code 当前权限模式更新为 `default`、`acceptEdits`、`plan`、`auto`、`dontAsk`、`bypassPermissions`，并说明 `manual` alias 与 auto 可用性边界。
- 新增 `control-verification.md`，记录 writer 之外的软提醒、确定性 policy gate、read-only 沙箱复现及 49 页构建。

最终 reviewer 确认正文、horizontal/vertical research 与 evidence ledger 已同步，软提醒没有冒充在线 Agent 违令实测，policy gate 明确是教学模型，所有问题关闭。

## 视觉与内容终审结论：PASS（95/100）

未关闭问题：blocker 0 / major 0 / minor 0

| 维度 | 得分 | 结论 |
| --- | ---: | --- |
| 事实与证据 | 25/25 | Claude Code 与 Codex 当前原语、一手来源和本地实测一致。 |
| 解释深度 | 19/20 | 软提醒、执行前判定、执行时沙箱与其余 Harness 层分工完整。 |
| Showcase | 19/20 | 三种约束姿态与合法/禁止动作均可复现，产品与教学模型边界明确。 |
| 教学设计 | 14/15 | 失败开场、机制图、对照实验、失败模式和练习递进清楚。 |
| 时效性 | 9/10 | 当前 CLI 与官方文档按 2026-07-11 核验，并标注平台限制。 |
| 编辑质量 | 9/10 | 中文自然、结构可扫读，无未关闭编辑问题。 |

Visual assessment: PASS
Asset: /images/articles/constraint-layer/soft-reminder-vs-hard-boundary.svg
Teaching role: 直观区分软提醒、执行前判定和执行时沙箱，并展示禁止动作被拦、合法动作通过的核心机制。
Decorative-only: no
Rights: CC BY-NC-SA 4.0
Issues: none

最终状态：PASS
