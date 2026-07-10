# 横向研究：Harness

验证日期：2026-07-10

| 资料 | 关键观察 | 本文采用 | 本文不采用 |
| --- | --- | --- | --- |
| [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/) | 人负责方向，Agent 负责执行；仓库应像地图；关键约束应机械化 | repo 可读性、短入口文档、结构测试 | 不把某一家内部实践当通用规范 |
| [Anthropic: Long-running agent harnesses](https://www.anthropic.com/engineering/harness-design-long-running-apps) | planner、generator、evaluator 分工；结构化 artifact；自评会失真 | 独立 evaluator、结构化交接、简化 harness | 不复刻特定产品实现 |
| [Anthropic: Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | task、trial、grader、transcript、outcome；agent harness 与 eval harness 不同 | 把执行与验收分开 | 不在入门篇展开完整统计评测 |
| [Harness Engineering 橙皮书](https://github.com/alchaincyf/harness-engineering-orange-book) | 中文主题地图，覆盖指令、约束、反馈、记忆、编排、能力 | 用于章节范围和中文问题意识 | 不作为易变事实的唯一来源 |
| [Learn Prompting](https://learnprompting.org/docs/introduction) | 用具体例子把概念变成可观察输入与输出 | 元数据、动机、示例、练习、来源 | 不照搬页面结构或措辞 |

## 分类差异

不同来源对 Harness 的拆分并不一致。有的突出 instructions、constraints、feedback、memory、orchestration；有的突出 tools、permissions、environment、evaluation。本文把它们整理为五个可操作问题，而不是宣布一个新标准：

1. 指令：Agent 应如何工作？
2. 能力：它可以调用什么？
3. 约束：它绝对不能做什么？
4. 状态：跨步骤保留哪些事实和证据？
5. 编排：谁推进、谁验收、何时停止？
