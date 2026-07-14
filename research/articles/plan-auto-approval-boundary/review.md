# Review：Plan、Auto 与人工审批边界

## 评审元数据

- Reviewer：Codex CLI / gpt-5.4，独立只读初审、follow-up 与最终 reviewer。
- 审稿模式：read-only，只读取目标 MDX、研究包、Showcase 与教学资产。
- 隔离声明：reviewer 使用独立只读会话，writer 未参与打分或修改评审结果。
- 原始评审输出保存在仓库外的控制面日志中，未将机器本地路径或运行标识纳入研究包。

## 审稿与修订链路

初审结论为 FAIL（78/100）：0 blocker、2 major、1 minor。

- 删除把 Codex `on-request` / `untrusted` 包装成确定性高风险人工门禁的表述，改为外部人类 gate 显式重新授权。
- 将 approval policy 的本机证据精确指向 `codex --help`，与 sandbox mode 的 `codex exec --help` 分开。
- 删除未由本次实验支撑的 Linux 实现断言，仅保留 macOS Seatbelt 实测与其他平台未核验。

第一次 follow-up 为 FAIL（86/100）：新增 1 major、1 minor。

- 将没有实测的 read-only 网络裁决改为“本次未测”，同步正文和 Showcase 汇总表。
- 新增 `control-verification.md`，记录 writer 之外的 Showcase 复现、深度指标、partial validator 与 49 页构建。

最终 reviewer 确认所有问题关闭，正文、研究包、实验表格和 SVG 表述一致，没有新增 finding。

## 视觉与内容终审结论：PASS（89/100）

未关闭问题：blocker 0 / major 0 / minor 0

| 维度 | 得分 | 结论 |
| --- | ---: | --- |
| 事实与证据 | 22/25 | 两套权限原语、CLI 锚点与实测边界可核查，未把未测项包装成结果。 |
| 解释深度 | 18/20 | 三档风险、正交配置轴、强制层与外部人类 gate 的权衡清楚。 |
| Showcase | 18/20 | 同一文件在 read-only/workspace-write 下的裁决可复现，平台边界明确。 |
| 教学设计 | 13/15 | 学习目标、机制图、决策表、失败模式和练习形成完整路径。 |
| 时效性 | 9/10 | 官方资料与本机 CLI 版本均按 2026-07-11 核验。 |
| 编辑质量 | 9/10 | 中文自然、术语纪律稳定，无未关闭编辑问题。 |

Visual assessment: PASS
Asset: /images/articles/plan-auto-approval-boundary/risk-tier-primitives.svg
Teaching role: 解释三档风险边界如何分别映射到 Claude Code 与 Codex 的不同权限原语，并强调应用层、OS 层与外部人类 gate 的差异。
Decorative-only: no
Rights: CC BY-NC-SA 4.0
Issues: none

最终状态：PASS
