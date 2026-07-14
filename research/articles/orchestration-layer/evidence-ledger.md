# Evidence ledger：编排层

| 主张 | 证据 | 证据类型 | 核验日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- |
| 推荐顺序是探索→规划→实现→提交，且 scope 清楚时可跳过规划 | Claude Code Best practices：“Explore first, then plan, then code”；四阶段 Explore/Plan/Implement/Commit；“If you could describe the diff in one sentence, skip the plan.” | 一手·官方文档 | 2026-07-11 | 高 | 文档随产品更新，需按发布日复核 |
| 独立 evaluator 每轮复检直到条件成立 | 同上（`/goal`）：“A separate evaluator re-checks it after every turn and Claude keeps working until it holds.” | 一手·官方文档 | 2026-07-11 | 高 | — |
| Stop hook 是确定性闸，连续 8 次阻塞后 Claude Code 覆盖并结束回合 | 同上：“a Stop hook runs your check as a script and blocks the turn from ending until it passes. Claude Code overrides the hook and ends the turn after 8 consecutive blocks.” | 一手·官方文档 | 2026-07-11 | 高 | “8 次”为当前实现，易随版本变化 |
| 第二意见：verification subagent 用全新模型试图推翻结果，做事的不是判分的 | 同上：“a verification subagent … has a fresh model try to refute the result, so the agent doing the work isn't the one grading it.” | 一手·官方文档 | 2026-07-11 | 高 | — |
| 全新上下文改善代码审查，因为不会偏向刚写的代码 | 同上（Writer/Reviewer）：“A fresh context improves code review since Claude won't be biased toward code it just wrote.” | 一手·官方文档 | 2026-07-11 | 高 | — |
| 同一问题纠正两次无效应换策略（/clear 重来） | 同上：“After two failed corrections, `/clear` and write a better initial prompt incorporating what you learned.” | 一手·官方文档 | 2026-07-11 | 高 | — |
| 多会话/并行/fan out 属于 automate and scale 的放大手段 | 同上：Automate and scale 一节（`claude -p`、worktrees、agent teams、fan out across files） | 一手·官方文档 | 2026-07-11 | 高 | — |
| 分离做事的 agent 与判分的 agent 是强杠杆 | Anthropic：Effective harnesses for long-running agents：“Separating the agent doing the work from the agent judging it proves to be a strong lever.” | 一手·工程研究 | 2026-07-11 | 高 | — |
| 独立 evaluator 也是 LLM，但把它调 skeptical 比让生成者自我批判可行得多 | 同上：“tuning a standalone evaluator to be skeptical turns out to be far more tractable than making a generator critical of its own work.” | 一手·工程研究 | 2026-07-11 | 高 | — |
| 停止条件写成事先约定的 sprint contract，动工前定义 done | 同上：“the generator and evaluator negotiated a sprint contract: agreeing on what 'done' looked like … before any code was written.” | 一手·工程研究 | 2026-07-11 | 高 | — |
| sprint 失败把详细反馈交回生成者去改，而非无脑重试 | 同上：“the sprint failed and the generator got detailed feedback on what went wrong.” | 一手·工程研究 | 2026-07-11 | 高 | — |
| 角色间通过文件交接状态 | 同上：“Communication was handled via files: one agent would write a file, another agent would read it…” | 一手·工程研究 | 2026-07-11 | 中高 | 具体载体随系统不同 |
| 每个编排组件都编码了“模型自己做不到”的假设，值得质疑（保持简单） | 同上：“every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing.” | 一手·工程研究 | 2026-07-11 | 高 | — |
| 好验收 = 两个专家独立得出同一 pass/fail | Anthropic：Demystifying evals：“A good task is one where two domain experts would independently reach the same pass/fail verdict.” | 一手·工程主张 | 2026-07-11 | 高 | — |
| 通常评产物而非路径 | 同上：“it's often better to grade what the agent produced, not the path it took.” | 一手·工程主张 | 2026-07-11 | 高 | — |
| Showcase 场景 A：一次失败被路由回 IMPLEMENT，修正后 VERIFY 通过走 STOP_DONE，退出码 0，用掉 1 次重试 | `showcase/state-machine/result.txt` 场景 A（Node v24.11.0，2026-07-11 真实运行） | 一手·可复现实验 | 2026-07-11 | 高 | 确定性桩 worker，非在线模型；不构成模型排名 |
| Showcase 场景 B：预算用尽后走 ESCALATE、handoff=human、退出码 1 | 同上场景 B | 一手·可复现实验 | 2026-07-11 | 高 | 同上 |
| Showcase run.mjs 整体退出码 EXIT=2（有场景升级即判需人接手） | 同上文件末尾 | 一手·可复现实验 | 2026-07-11 | 高 | 数值由脚本逻辑决定 |
| 编排七决定与 instruction/capability/constraint/state/feedback 的分工 | `vertical-research.md` 分工小节 | 编辑综合（基于一手分层叙事） | 2026-07-11 | 中高 | 分类为操作化归纳，非官方术语 |
| “编排七决定”“先简单后复杂”“连续失败/撞预算即升级” | `vertical-research.md` 机制一/五/六 | 编辑综合（每条附一手支撑） | 2026-07-11 | 中高 | 属操作化归纳，非行业统一标准 |
| 橙皮书仅作二手主题地图，未复制其图片/成段文字 | `horizontal-research.md` 第 4 条；`asset-ledger.md` 许可记录 | 二手·主题地图 | 2026-07-11 | 高 | 该仓库无标准开源许可，不可复制其素材 |
