# Horizontal research：编排层的一手资料与主题地图

对比三类来源，标明各自能证明什么、不能证明什么。核验日期 2026-07-11。

## 1. Claude Code 官方文档：Best practices（一手，产品行为 + 工程主张）
链接：https://code.claude.com/docs/en/best-practices

能支撑：
- 顺序：推荐的四阶段工作流 “Explore first, then plan, then code”——Explore（plan mode 只读）→ Plan（写实现计划）→ Implement（切出 plan mode 写码并对照计划验证）→ Commit。并提醒“scope 清楚、改动小”时可跳过规划直接做，说明顺序是可裁剪的控制流，不是仪式。
- 停止的四档 gating（按“设置成本 vs 省下的注意力”排列）：① 一条 prompt 内自查迭代；② 设成 `/goal` 条件，“A separate evaluator re-checks it after every turn and Claude keeps working until it holds”（独立评估器每轮复检直到成立）；③ Stop hook 作为确定性闸，“a Stop hook runs your check as a script and blocks the turn from ending until it passes. Claude Code overrides the hook and ends the turn after 8 consecutive blocks”（连续 8 次阻塞后覆盖钩子并结束回合）；④ 第二意见，“a verification subagent … has a fresh model try to refute the result, so the agent doing the work isn't the one grading it”。
- 角色分工：Writer/Reviewer 模式——一个会话写、另一个全新上下文审；“A fresh context improves code review since Claude won't be biased toward code it just wrote.”对抗式复审 subagent 只看 diff 和验收标准，不看产生它的推理。
- 升级：失败模式 “Correcting over and over” → “After two failed corrections, `/clear` and write a better initial prompt incorporating what you learned.”（同一问题纠正两次无效就换策略重来，而不是继续加轮次）。
- 扩展与并行：非交互 `claude -p`、worktree/agent teams 多会话、fan out across files（把任务列表分发给多次 `claude -p`）。说明多 Agent/并行是“automate and scale”一节的可选放大手段，而不是默认起点。

不能证明：任何具体的“编排七决定”分类（那是本文对上述一手线索的操作化归纳）；也不给具体多 Agent 框架的实现细节。

## 2. Anthropic 工程博客：Effective harnesses for long-running agents（一手，工程研究）
链接：https://www.anthropic.com/engineering/harness-design-long-running-apps

能支撑：
- 角色分工是强杠杆：“Separating the agent doing the work from the agent judging it proves to be a strong lever.” 并解释：evaluator 仍是 LLM、天生偏向 LLM 产物，但“tuning a standalone evaluator to be skeptical turns out to be far more tractable than making a generator critical of its own work.”
- 停止条件写成事先约定：“Before each sprint, the generator and evaluator negotiated a sprint contract: agreeing on what 'done' looked like for that chunk of work before any code was written.”；“The generator proposed what it would build and how success would be verified, and the evaluator reviewed that proposal…”
- 失败处理：sprint 失败时“the generator got detailed feedback on what went wrong”，即把详细反馈交回生成者去改，而不是无脑重试同一路径。
- 状态交接：“Communication was handled via files: one agent would write a file, another agent would read it and respond either within that file or a new file…”
- 保持简单：“every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing.”（每加一个编排组件都是在假设模型自己做不到，这个假设值得反复质疑）。

不能证明：任何模型排名；也不代表所有任务都要上多 Agent。

## 3. Anthropic 工程博客：Demystifying evals for AI agents（一手，工程主张）
链接：https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

能支撑：
- 验收要无歧义：“A good task is one where two domain experts would independently reach the same pass/fail verdict.”——编排的停止条件必须读一个两个人独立判都一致的信号，才不会在“到底算不算完成”上打转。
- 通常评产物而非路径：“it's often better to grade what the agent produced, not the path it took.”——编排的 VERIFY 只认输出对不对，不规定 worker 走哪条实现路线。

不能证明：本文 Showcase 的具体状态转换数值（那些来自真实运行）。

## 4. Harness Engineering 橙皮书（二手，中文主题地图）
链接：https://github.com/alchaincyf/harness-engineering-orange-book

用途与边界：仅作中文主题地图，帮助确认“编排层作为 harness 收口一环”的叙事位置，以及“先简单后复杂”的顺序。该仓库为教育性分享、要求署名，但未发布标准开源许可，再分发权不清楚——因此不复制其任何图片或成段文字，只在底部作为二手来源保留链接与署名。产品行为一律回到上面三条一手资料核验。

## 教学参照
邻篇 golden sample `what-is-harness.mdx`（编排组件那一节）、`feedback-loop.mdx` 确立了本系列的分层叙事、失败开场、Showcase 结构与橙皮书署名方式，本文沿用以保持一致，并把 what-is-harness 里“编排＝谁推进/验收/停止”的一句话展开成完整机制。
