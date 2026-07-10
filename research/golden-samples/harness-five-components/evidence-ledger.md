# Evidence ledger：Harness 的五个组件

验证日期：2026-07-10

| 正文主张 | 证据 | 类型 | 置信度 | 限定 |
| --- | --- | --- | --- | --- |
| 仓库应给 Agent 地图，关键约束应机械执行 | [OpenAI Harness engineering](https://openai.com/index/harness-engineering/) | 官方工程文章 | 高 | 来源是一家团队的实践总结 |
| 长任务可拆 planner、generator、evaluator 并使用结构化 artifact | [Anthropic long-running harnesses](https://www.anthropic.com/engineering/harness-design-long-running-apps) | 官方工程文章 | 高 | 具体实现不必照搬 |
| agent harness 与 eval harness 是不同层 | [Anthropic evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | 官方工程文章 | 高 | 本文只做入门区分 |
| 五组件是 LearnPrompt 的操作模型，不是行业标准 | `brief.md` 与 `horizontal-research.md` 的跨来源综合 | 编辑性综合 | 高 | 正文必须明示 |
| 最小 Harness 同时包含五个组件 | `showcase/minimal-harness/` 和验证输出 | 可运行本地实验 | 高（仅限结构存在性） | 不等于生产安全 |
| 验证结果为 5/5 PASS | `showcase/minimal-harness/result.txt` | 确定性测试记录 | 高 | 2026-07-10 实际运行 |
