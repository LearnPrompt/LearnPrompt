# 证据台账：从自然语言需求到可运行 MVP

| 主张 | 证据 | 证据类型 | 核验日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- |
| 商业 MVP 的原意是用最小投入收集最大量可验证认知（validated learning），关注市场假设验证 | Wikipedia《Minimum viable product》转述 Eric Ries 定义；术语由 Frank Robinson 提出、Blank/Ries 推广 | 二手百科 + 转述一手定义 | 2026-07-11 | 高 | 百科为二手，仅作对照；本文刻意区分“商业 MVP”与“可交付切片” |
| 应在写代码前就约定 done 长什么样，用带硬阈值的验收标准判定每轮成败 | Anthropic《Effective harnesses for long-running agents》 | 官方工程实践一手 | 2026-07-11 | 高 | 原文讲运行期 harness，本文将其前移到需求阶段属编辑推论 |
| 把“做事的 Agent”与“判断做对的 Agent”分开是很强的杠杆；交接用文件等结构化 artifact | 同上 Anthropic 文章 | 官方工程实践一手 | 2026-07-11 | 高 | 支撑“验收独立于实现”，非本文冻结方法的直接来源 |
| coding agent 以自然语言描述任务开始，并通过 permissions/sandbox 控制可改范围与审批 | OpenAI Codex CLI 文档（learn.chatgpt.com/docs/codex/cli） | 官方产品文档一手 | 2026-07-11 | 高 | 产品文档不规定需求应削减到多小 |
| 冻结切片后 `node radar.mjs feed.json --top 3` 恰好输出 3 条且含来源，退出码 0 | 本文 Showcase 实测，见 showcase/news-radar-mvp/result.txt | 可复现实测 | 2026-07-11 | 高 | fixture 为构造的最小数据，非真实新闻源分布 |
| 缺失输入文件时 radar 打印可读错误并以退出码 1 结束 | 同上 result.txt（`node radar.mjs nope.json`） | 可复现实测 | 2026-07-11 | 高 | 仅覆盖列出的失败态 |
| 4 条验收检查（Top3、去重、缺文件非零、零命中非零）全绿、`node verify.mjs` 退出码 0；脚本从自身路径读取静态 fixture，验收过程不写源目录 | 同上 result.txt（`node verify.mjs`）及 verify.mjs | 可复现实测 | 2026-07-11 | 高 | 检查集是最小验收，非完备测试 |
| Claude Code 橙皮书 README 声明 CC BY-NC-SA 4.0 | 仓库 README 许可核验 | 二手来源许可核验 | 2026-07-11 | 中 | 因此不复制其图片/成段文字，仅作主题地图链接 |

## 编辑综合（非事实，需标注）

- “交给 Agent 的最小单位是可验收切片，而非一个想法”是把 Anthropic 验收/评审实践
  前移到需求阶段的操作性推论。
- “输入 / 输出 / 失败态 / 验收动作”四维法是本文对范围削减的操作化归纳，
  用来给“砍到多小”一个可停止的判据，不是某个来源的既有分类。
- “backlog 显式化以防功能回流”是基于工程经验的编辑判断。
