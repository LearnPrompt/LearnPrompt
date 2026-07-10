# Review：Claude Code 与 Codex 怎么选

审稿日期：2026-07-10
当前审稿对象：Workflow Showcase v2
独立审稿器：Codex CLI 0.142.2 / `gpt-5.4` / read-only / never approval
评审证据：原始评审输出在仓库外捕获；本文件是会话结束后的脱敏定稿，不是评审中的实时日志。
隔离声明：reviewer 使用独立只读会话，writer 未参与打分或修改评审结果。

旧的只读仓库诊断曾通过 91/100，但已被编辑反馈判定为过于抽象。该分数只作为历史记录，不代表当前版本状态。

## V2 初审结论：FAIL（81/100）

| 维度 | 初审分数 |
| --- | ---: |
| 事实与证据 | 18/25 |
| 解释深度 | 17/20 |
| Showcase | 15/20 |
| 教学设计 | 14/15 |
| 时效性 | 9/10 |
| 编辑质量 | 8/10 |

## V2 初审问题与处理

- Blocker：正文开头仍说“同一条只读任务、同提示词”，与真实改稿 v2 冲突。处理：重写 description、开场、学习目标和非跑分声明，统一为“同基线、不同输入成熟度的真实改稿”。
- Major：正文承诺保存“完整 brief、每次失败”，但当时只有二级摘要。处理：下调文案承诺，同时新增 `command-log.md` 和 `outputs/` 两份完整成稿。
- Major：review 同时保留旧 PASS 与新 PENDING。处理：重建本文件，旧分数明确标为历史，当前只保留 v2 状态。
- Minor：四个澄清问题如何改变 frozen brief 不够直接。处理：在 `frozen-brief.md` 新增“问题 → 编辑回答 → brief 字段”映射表。
- Minor：frontmatter 当前为 `showcase_status: partial`。处理：这是初审后的正确状态；只有 follow-up review、validator 和最终构建全部通过后才升为 `verified`。

## V2 Follow-up：FAIL（84/100，状态未收口）

独立 reviewer 确认前言、两份实际 MDX、命令日志、问题映射和 release gate 均已闭环，未发现 blocker 或新增 minor。唯一 major 是审稿发生时 frontmatter 仍为 `partial`、review 仍为 `PENDING`。

该问题属于发布状态同步，不是内容或证据缺口。完成以下机械收口：

- 将 `showcase_status` 更新为 `verified`。
- 按已确认的实质评分设置 `quality_score: 92`。
- 在 verified 状态下重跑 Skill validator、Starlight build 与 diff check。

## V2 最终结论：PASS（92/100）

| 维度 | 最终分数 |
| --- | ---: |
| 事实与证据 | 22/25 |
| 解释深度 | 18/20 |
| Showcase | 18/20 |
| 教学设计 | 14/15 |
| 时效性 | 10/10 |
| 编辑质量 | 10/10 |

未关闭问题：blocker 0 / major 0 / minor 0。

## V2 视觉补充终审：PASS（92/100）

新的 Codex `gpt-5.4` 独立只读会话核对正文、SVG、资产台账与本审稿记录；原始输出在仓库外捕获，writer 未参与打分或修改结论。图片把“先判断工作方式，再选择工具”转成可扫读的路由图，并准确保留探索、冻结任务与共同验收出口的边界；未引入额外产品事实或 MDX 风险。

Visual assessment: PASS
Asset: `/images/articles/choose-claude-code-or-codex/workflow-routing.svg`
Teaching role: 解释任务成熟度、环境依赖与反馈节奏如何路由到探索或完整委派
Decorative-only: no
Rights: CC BY-NC-SA 4.0

| 维度 | 视觉补充终审分数 |
| --- | ---: |
| 事实与证据 | 22/25 |
| 解释深度 | 18/20 |
| Showcase | 18/20 |
| 教学设计 | 14/15 |
| 时效性 | 10/10 |
| 编辑质量 | 10/10 |

未关闭问题：blocker 0 / major 0 / minor 0。

最终状态：PASS
