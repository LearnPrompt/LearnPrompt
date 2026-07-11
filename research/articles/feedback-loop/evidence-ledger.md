# Evidence ledger：反馈循环

| 主张 | 证据 | 证据类型 | 核验日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- |
| 给 Agent 一个能跑出 pass/fail 的检查，回路就能自己闭合 | Claude Code Best practices：“Give Claude something that produces a pass or fail, and the loop closes on its own.” | 一手·官方文档 | 2026-07-11 | 高 | 文档随产品更新，需按发布日复核 |
| 没有可验证信号时，模型只会停在“看起来做完了” | 同上：“Claude stops when the work looks done. Without a check it can run, 'looks done' is the only signal available.” | 一手·官方文档 | 2026-07-11 | 高 | — |
| 好反馈要给证据（命令与返回、输出、截图），而非断言成功 | 同上：“Have Claude show evidence rather than asserting success: the test output, the command it ran and what it returned…” | 一手·官方文档 | 2026-07-11 | 高 | — |
| 修根因而非压症状，需要把报错原文喂进去 | 同上（对照表 Address root causes）：“the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error” | 一手·官方文档 | 2026-07-11 | 高 | — |
| 最好的结果来自紧的反馈回路 | 同上：“The best results come from tight feedback loops.” | 一手·官方文档 | 2026-07-11 | 高 | — |
| 停止/升级有四档 gating，Stop hook 连续 8 次阻塞后结束回合 | 同上：prompt / `/goal`（独立 evaluator 每轮复检）/ Stop hook（“Claude Code overrides the hook and ends the turn after 8 consecutive blocks”）/ 第二意见 subagent | 一手·官方文档 | 2026-07-11 | 高 | “8 次”为当前实现，易随版本变化 |
| 同一问题纠正超过两次应换策略（/clear 重来） | 同上：“If you've corrected Claude more than twice on the same issue in one session… Run /clear and start fresh.” | 一手·官方文档 | 2026-07-11 | 高 | — |
| 分离“做事的 agent”和“评审的 agent”是强杠杆 | Anthropic：Effective harnesses for long-running agents：“Separating the agent doing the work from the agent judging it proves to be a strong lever.” | 一手·工程研究 | 2026-07-11 | 高 | — |
| 自评倾向于夸奖自己的产物 | 同上：agents “confidently praising the work—even when… obviously mediocre.” | 一手·工程研究 | 2026-07-11 | 高 | — |
| 停止条件可写成事先约定的 sprint contract；失败则把详细反馈交回生成者 | 同上：“negotiated a sprint contract… if any one fell below it, the sprint failed and the generator got detailed feedback on what went wrong.” | 一手·工程研究 | 2026-07-11 | 高 | — |
| 好信号 = 两个专家独立得出同一 pass/fail | Anthropic：Demystifying evals：“A good task is one where two domain experts would independently reach the same pass/fail verdict.” | 一手·工程主张 | 2026-07-11 | 高 | — |
| 通常评产物而非路径 | 同上：“it's often better to grade what the agent produced, not the path it took.” | 一手·工程主张 | 2026-07-11 | 高 | — |
| Showcase：模糊通道只回“构建未通过”，退出码 1 | `showcase/feedback-signal/result.txt` 段 A（Node v24.11.0，2026-07-11 真实运行） | 一手·可复现实验 | 2026-07-11 | 高 | 仅本机一次运行；数值随机器略变 |
| Showcase：可操作通道 node --test 三条挂一条，指出 file:line + 期望 hello-world/实际 Hello-World | 同上段 B | 一手·可复现实验 | 2026-07-11 | 高 | 内层耗时随机器波动 |
| Showcase：失败信号将范围收窄到小写化；本文选择 trim 后加 toLowerCase 的一行候选补丁，重跑后三条全过 | 同上段 C、D | 一手·可复现实验 | 2026-07-11 | 高 | 通过当前用例不证明这是唯一实现 |
| 反馈层与 state/memory/evaluation/orchestration 的分工 | `vertical-research.md` 分工小节 | 编辑综合（基于一手分层叙事） | 2026-07-11 | 中高 | 分类为操作化归纳，非官方术语 |
| “好反馈四属性”“最快验收放最内圈”“信号连续不变即升级” | `vertical-research.md` 机制一/三/五 | 编辑综合（每条附一手支撑） | 2026-07-11 | 中高 | 属操作化归纳，非行业统一标准 |
| 橙皮书仅作二手主题地图，未复制其图片/成段文字 | `horizontal-research.md` 第 4 条；`visual-assets.md` 许可矩阵 | 二手·主题地图 | 2026-07-11 | 高 | 该仓库无标准开源许可，不可复制其素材 |
