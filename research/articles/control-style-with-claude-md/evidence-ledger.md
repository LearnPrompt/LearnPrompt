# 证据台账：control-style-with-claude-md

| 主张 | 证据 | 证据类型 | 核验日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- |
| `CLAUDE.md` 与 auto memory 都会在每次会话开始时载入 | Claude Code 官方 `memory` 页开头说明两套跨会话机制都会在每轮启动时提供持久知识 | 官方一手文档 | 2026-07-11 | 高 | 文档会更新，应按发布日期复核 |
| 官方明确把 `CLAUDE.md` 视为 context，而非 enforced configuration；硬性阻止动作要用 `PreToolUse hook` | `memory` 页 `CLAUDE.md vs auto memory` 段落原文 | 官方一手文档 | 2026-07-11 | 高 | 本文据此只把 hook 作为边界指针，不展开实现 |
| `CLAUDE.md` 应具体、简洁，建议控制在 200 行内；过长会降低遵循 | `memory` 页 `Write effective instructions` 与 `best-practices` 页关于 bloated `CLAUDE.md` 的说明 | 官方一手文档 | 2026-07-11 | 高 | 200 行是经验建议，不是硬阈值 |
| `.claude/rules/` 支持使用 `paths` frontmatter 做 path-scoped rules，只在处理匹配文件时应用 | `memory` 页 `Set up rules` / `Path-specific rules` | 官方一手文档 | 2026-07-11 | 高 | 仍属于上下文加载机制，不是强制测试 |
| 官方建议：约定或命令错了两次，才应加入 `CLAUDE.md`；若文件增长，应移到 `.claude/rules/` 或其他扩展 | `features-overview` 页 `Build your setup over time` 与 `CLAUDE.md vs Rules vs Skills` | 官方一手文档 | 2026-07-11 | 高 | 属于经验法则，不是硬规范 |
| Claude Code 产品定位包含读代码、改文件、跑命令，因此规则层需要区分软提醒与硬检查 | `overview` 页产品描述 | 官方一手文档 | 2026-07-11 | 高 | 只支撑产品定位，不直接支撑风格治理细则 |
| 橙皮书仓库 README 声明 CC BY-NC-SA 4.0 | `claude-code-orange-book` README `License` 段 | 二手来源许可核验 | 2026-07-11 | 高 | 只支撑主题地图许可，不支撑产品行为 |
| Showcase 的 `before` 快照在 UI 与 API 约束上都失败，退出码 1 | `showcase/style-scope/result.txt` 中 `SCENARIO before` | 实际运行 | 2026-07-11 | 高 | 该实验验证规则分层与脚本结果，不验证模型真实遵循 |
| Showcase 的 `after` 快照通过 UI 与 API 检查，退出码 0 | `showcase/style-scope/result.txt` 中 `SCENARIO after` | 实际运行 | 2026-07-11 | 高 | 同上 |
| Showcase 明确记录 `SKIP ui-token rule for src/api/handlers/profile.ts`，证明 UI 规则不应作用于 API | `showcase/style-scope/result.txt` 轨迹行 | 实际运行 | 2026-07-11 | 高 | 是教学性作用域证明，不是在线模型行为证明 |
| 单篇 validator 对本文当前 `partial` 状态通过 | `control-verification.md` 中 validator 记录 | 实际运行 | 2026-07-11 | 高 | 只验证结构与工件完整度，不等于终审通过 |
| `cd starlight && npm run build` 对当前全站通过 | `control-verification.md` 中 build 记录 | 实际运行 | 2026-07-11 | 高 | 构建结果随仓库变化而变化 |

## 编辑综合（非事实，需标注）

- “根规则 / 作用域规则 / 机械检查”的三层放置判断，是对官方文档分工的编辑综合，不是官方术语。
- “添加 -> 验证 -> 修剪”是 LearnPrompt 为控制规则膨胀提出的维护循环，依据官方的具体性、可删性和 pass/fail 建议整理而来。
- Showcase 的静态检查只证明机械约束与作用域设计，不证明 Claude Code 一定会在真实会话中自动服从这些规则。
