# Horizontal research：反馈层的一手资料与主题地图

对比三类来源，标明各自能证明什么、不能证明什么。核验日期 2026-07-11。

## 1. Claude Code 官方文档：Best practices（一手，产品行为 + 工程主张）
链接：https://code.claude.com/docs/en/best-practices （由 anthropic.com/engineering/claude-code-best-practices 308 跳转到此）

能支撑：
- “Give Claude a way to verify its work”：给一个能跑出 pass/fail 的检查（测试、构建退出码、linter、把输出和 fixture 做 diff 的脚本、截图对比），循环就能自己闭合。
- “Claude stops when the work looks done. Without a check it can run, 'looks done' is the only signal available”——没有可验证信号，模型只会停在“看起来做完了”。
- “Address root causes, not symptoms”：把报错原文粘进去、修根因、并验证构建通过，而不是压掉报错。
- “Have Claude show evidence rather than asserting success”——要证据（测试输出、命令与返回、截图），不是断言成功。
- 停止/升级的四档 gating：一条 prompt 内自查；`/goal` 条件由独立 evaluator 每轮复检；Stop hook 作为确定性闸，“Claude Code overrides the hook and ends the turn after 8 consecutive blocks”；第二意见（verification subagent）。
- “The best results come from tight feedback loops.”（缩短反馈延迟）
- 失败模式“trust-then-verify gap”：能不能验证决定要不要 ship；“Correcting over and over”→两次纠正无效就 `/clear` 重来（升级/换策略的直觉）。

不能证明：具体到某语言的测试框架细节；也不构成“反馈层五属性”这类分类（那是本文操作化综合）。

## 2. Anthropic 工程博客：Effective harnesses for long-running agents（一手，工程研究）
链接：https://www.anthropic.com/engineering/harness-design-long-running-apps

能支撑：
- 分离“做事的 agent”和“评审的 agent”是强杠杆：“Separating the agent doing the work from the agent judging it proves to be a strong lever.” 自评会“confidently praising the work—even when… obviously mediocre.”
- evaluator 直接操作运行中的系统（Playwright MCP 点击真实应用）拿反馈，而非只做静态审查。
- 用文件做结构化 artifact 交接：“Communication was handled via files.”
- 停止条件写成 sprint contract：动工前先约定“done”长什么样；“if any one fell below it, the sprint failed and the generator got detailed feedback on what went wrong.”

不能证明：任何具体模型的排名；也不代表所有任务都要上多 agent。

## 3. Anthropic 工程博客：Demystifying evals for AI agents（一手，工程主张）
链接：https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

能支撑：
- 好信号 = 无歧义的 pass/fail：“A good task is one where two domain experts would independently reach the same pass/fail verdict.”
- 把用户报障转成用例：“Converting user-reported failures into test cases ensures your suite reflects actual usage.”
- 通常评产物而非路径：“it's often better to grade what the agent produced, not the path it took.”
- 饱和无信号：“An eval at 100% tracks regressions but provides no signal for improvement.”

不能证明：本文 Showcase 的具体数值（那些来自真实运行）。

## 4. Harness Engineering 橙皮书（二手，中文主题地图）
链接：https://github.com/alchaincyf/harness-engineering-orange-book

用途与边界：仅作中文主题地图，帮助确认“反馈层作为 harness 一环”的叙事位置。该仓库为教育性分享、要求署名，但未发布标准开源许可，再分发权不清楚——因此不复制其任何图片或成段文字，只在底部作为二手来源保留链接与署名。产品行为一律回到上面三条一手资料核验。

## 教学参照
邻篇 golden sample `instruction-layer.mdx` / `what-is-harness.mdx` 确立了本系列的分层叙事、失败开场、Showcase 结构与橙皮书署名方式，本文沿用以保持一致。
