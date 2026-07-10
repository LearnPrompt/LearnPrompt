# Evidence ledger：一个 Loop 的五个动作

验证日期：2026-07-10

| 正文主张 | 证据 | 类型 | 置信度 | 限定 |
| --- | --- | --- | --- | --- |
| Loop Engineering 位于单次 Harness 之上 | [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) | 原始工程文章 | 中高 | 仍是新兴术语，不宣称正式标准 |
| 五动作可整理为 discover、handoff、verify、persist、schedule | 同上与 [橙皮书](https://github.com/alchaincyf/loop-engineering-orange-book) | 原始文章 + 主题地图综合 | 中高 | LearnPrompt 用于教学的操作框架 |
| 长任务需要结构化 artifact 和独立 evaluator | [Anthropic long-running harnesses](https://www.anthropic.com/engineering/harness-design-long-running-apps) | 官方工程文章 | 高 | 与 Loop 的对应是本文推断 |
| 一次 Harness 需要可读环境和机械约束 | [OpenAI Harness engineering](https://openai.com/index/harness-engineering/) | 官方工程文章 | 高 | 用于解释 Loop 的下层基础 |
| Showcase 完成五动作并在第二次运行进入 idle | `showcase/test/loop-demo.test.mjs` | 可运行确定性测试 | 高（示例范围内） | worker 是 mock，不是模型 |
| 测试 1/1 通过，退出码 0 | `showcase/result.txt` | 本地现场实验 | 高 | 2026-07-10 实际运行 |
| Demo 实际打印五动作并把工件写入临时目录 | `showcase/demo-result.txt` | 本地现场实验 | 高 | 需要系统临时目录写权限 |
