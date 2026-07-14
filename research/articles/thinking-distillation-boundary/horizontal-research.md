# Horizontal Research：thinking-distillation-boundary

核对日期：2026-07-12。

| 来源 | 类型 | 支撑什么 | 不能证明什么 |
| --- | --- | --- | --- |
| `learn.chatgpt.com/docs/build-skills` | OpenAI 官方产品文档 | Codex 的 Skill 目录结构、显式 `$skill` / 隐式 description 匹配、Record & Replay、写 Skill 时应明确 scope/boundaries、inputs/outputs、需要确定性行为时再下沉脚本 | 不能证明 Anthropic 或开放规范的具体实现细节 |
| `learn.chatgpt.com/docs/customization/overview` | OpenAI 官方产品文档 | `AGENTS.md`、Skills、MCP、Subagents 的分层；“改错写回 AGENTS.md，形成 feedback loop”；Skill 适合可复用 workflow | 不能证明 hidden CoT 暴露策略 |
| `developers.openai.com/api/docs/guides/reasoning` | OpenAI 官方 API 文档 | raw reasoning tokens 不直接暴露；reasoning summary 是单独 opt-in 的摘要输出；encrypted reasoning 可在同会话上下文中延续，但不是公开展示的 chain-of-thought | 不能证明任何“思维蒸馏型 Skill”是官方术语 |
| `code.claude.com/docs/en/skills` | Claude Code 官方文档 | Skill 目录、渐进披露、`SKILL.md` / `references/` / `scripts/` / `assets/`、何时用 Skill、何时配 MCP、Skill 适合 repeatable workflows / references / helper scripts | 不提供“distillation”这一术语，也不替我们定义 candidate 是否可发布 |
| `claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills` | Claude 官方博客 / 产品更新 | 当前 Anthropic 把 Skills 区分为 capability uplift 与 encoded preference；强调 eval、benchmark、clean context、A/B comparator；说明 observe-refine-test 已进入 skill authoring 流程 | 不是规范文本，不能代替具体 CLI contract |
| `agentskills.io/specification` | 开放规范 / 一手 | Skill 最小目录、`SKILL.md`、`scripts/` / `references/` / `assets/` 与 progressive disclosure | 不能证明某个具体客户端的显式命令语法或调用预算 |
| `agentskills.io/skill-creation/evaluating-skills` | 开放规范 / 一手教程 | test case 结构、with-skill vs baseline、clean context、assertions、grading evidence、脚本比 LLM 更适合机械校验 | 不能证明某家产品一定提供同样的 evaluator UI |
| `alchaincyf/agent-skills-orange-book` README / README_zh | 二手主题地图 | 主题地图里确实有“思维蒸馏型”设计模式；README 明确作者、用途和个人/教育用途许可边界 | 不能支撑当前产品行为；也不授权复制 PDF 原文、截图或图片 |

## 结论

这篇文章的中心论证必须依赖三组来源组合：

1. OpenAI reasoning 文档定义“summary 可见、raw reasoning 不直接暴露”的产品边界。
2. OpenAI / Claude / Agent Skills 规范共同定义“Skill 是 workflow 容器，scripts 与 references 适合承载可观察 contract 与 evaluator”的 authoring 边界。
3. 本地 Showcase 负责证明 LearnPrompt 的 distillation contract：只吃 observable receipts、产出 candidate、跑 holdout、保留拒绝码，不冒充官方标准。
