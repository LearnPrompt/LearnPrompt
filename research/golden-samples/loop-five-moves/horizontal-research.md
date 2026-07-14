# 横向研究：Loop Engineering

验证日期：2026-07-10

| 资料 | 关键观察 | 本文用途 | 局限 |
| --- | --- | --- | --- |
| [Addy Osmani: Loop Engineering](https://addyosmani.com/blog/loop-engineering/) | Loop 位于单次 Harness 之上，涵盖 discovery、handoff、verification、persistence、scheduling | 五动作主框架与边界 | 个人工程文章，不是正式标准 |
| [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/) | repo legibility、mechanical constraints、持续回填经验 | 说明每一轮内部仍需要 Harness | 不直接定义 Loop |
| [Anthropic: Long-running harnesses](https://www.anthropic.com/engineering/harness-design-long-running-apps) | 多轮任务需要结构化 artifact、状态与 evaluator | 解释交接、持久化和独立验证 | 聚焦长任务 harness，不覆盖所有调度系统 |
| [Loop Engineering 橙皮书](https://github.com/alchaincyf/loop-engineering-orange-book) | 九章中文主题地图，覆盖发现、交接、验证、状态、调度、成本和理解 | 确定章节范围与案例问题 | 快照资料，事实需回到原始来源和现场实验 |

## 横向结论

Harness 解决“一次 Agent 执行如何可靠”，Loop 解决“下一次执行如何从上次结果继续”。两者相邻但不等价：没有 Harness 的 Loop 会稳定地产生不可验证结果；没有 Loop 的 Harness 则需要人反复启动和搬运状态。
