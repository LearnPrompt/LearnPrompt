# 证据台账：第一份最小 CLAUDE.md

| 主张 | 证据 | 证据类型 | 核验日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- |
| CLAUDE.md 是每会话读入的 context，不是 enforced configuration | 官方 memory 文档：「Claude treats them as context, not enforced configuration」 | 官方一手文档 | 2026-07-11 | 高 | 文档会更新，需按发布日复核 |
| 要硬性阻止某动作应使用 PreToolUse hook 或 managed settings 的 permissions.deny | 官方 memory 文档 troubleshoot 段与 managed CLAUDE.md 表；best-practices「hooks are deterministic and guarantee」 | 官方一手文档 | 2026-07-11 | 高 | CLAUDE.md 本身不提供强制 |
| 四个作用域按加载顺序：Managed policy、User(~/.claude/CLAUDE.md)、Project(./CLAUDE.md 或 ./.claude/CLAUDE.md)、Local(./CLAUDE.local.md) | 官方 memory 文档「Choose where to put CLAUDE.md files」表 | 官方一手文档 | 2026-07-11 | 高 | 具体路径随平台不同（managed policy 三平台不同） |
| 所有发现的 CLAUDE.md 被拼接进上下文而非互相覆盖，靠近工作目录的后读 | 官方 memory 文档「How CLAUDE.md files load」 | 官方一手文档 | 2026-07-11 | 高 | 子目录文件按需在读取该目录文件时载入 |
| 建议单个 CLAUDE.md 文件控制在 200 行以内 | 官方 memory 文档「Size: target under 200 lines」；features-overview「Keep CLAUDE.md under 200 lines」 | 官方一手文档 | 2026-07-11 | 高 | 为建议而非硬校验 |
| 具体性示例：Use 2-space indentation / Run `npm test` before committing / API handlers live in `src/api/handlers/` | 官方 memory 文档「Specificity」示例 | 官方一手文档 | 2026-07-11 | 高 | 原文为英文示例，正文译述含义 |
| @import 使用 `@path` 语法，可递归 import，最大深度为四跳 | 官方 memory 文档：「Imported files can recursively import other files, with a maximum depth of four hops.」（curl 原文第 97 行核对） | 官方一手文档 | 2026-07-11 | 高 | **与本任务文章卡「五跳」说法不一致**；以官方现行原文为准，见下方说明 |
| Claude Code 只读 CLAUDE.md，不直接读 AGENTS.md；复用用 @AGENTS.md 或 symlink | 官方 memory 文档「AGENTS.md」段 | 官方一手文档 | 2026-07-11 | 高 | Windows symlink 需管理员/开发者模式，故推荐 import |
| CLAUDE.local.md 是项目私有偏好，应加 .gitignore，与 CLAUDE.md 一起载入、同样对待 | 官方 memory 文档 Local 行与 import 段 | 官方一手文档 | 2026-07-11 | 高 | 跨 worktree 时应改从 home 目录 import |
| .claude/rules 可用 paths frontmatter 按文件作用域拆分规则，匹配文件时载入 | 官方 memory 文档「Organize rules with .claude/rules/」 | 官方一手文档 | 2026-07-11 | 高 | 无 paths 的规则无条件载入 |
| auto memory 是 Claude 自己写的学习笔记，存 ~/.claude/projects/<project>/memory/，MEMORY.md 前 200 行或 25KB 载入 | 官方 memory 文档「Auto memory / How it works」 | 官方一手文档 | 2026-07-11 | 高 | 需 v2.1.59+；机器本地 |
| /init 可自动生成起始 CLAUDE.md | 官方 memory 文档 Tip；best-practices | 官方一手文档 | 2026-07-11 | 高 | 已存在时 /init 提建议而非覆盖 |
| 过度膨胀的 CLAUDE.md 会让模型忽略一半规则 | best-practices：「The over-specified CLAUDE.md … Claude ignores half of it」与「Bloated CLAUDE.md files cause Claude to ignore your actual instructions!」 | 官方一手文档 | 2026-07-11 | 高 | 未给出量化阈值 |
| 弄错两次就写进 CLAUDE.md；可加 IMPORTANT/YOU MUST 提升 adherence | best-practices；features-overview「Build your setup over time」 | 官方一手文档 | 2026-07-11 | 高 | 强调词效果未量化 |
| 本机 Claude Code CLI 版本为 2.1.206，默认自动发现并加载 CLAUDE.md | 本机 `claude --version`；`--bare` 帮助文本称其会 skip「CLAUDE.md auto-discovery」，反证默认加载 | 本机 CLI 实测 | 2026-07-11 | 高 | 闭源加载实现未公开 |
| 空泛项目说明缺齐五类必要信息，最小 CLAUDE.md 五类齐全 | Showcase `check-claude-md.mjs`：vague 5 FAIL(exit 1)，minimal 5 PASS(exit 0)，见 result.txt | 可运行脚本 + 实测 | 2026-07-11 | 高 | 字段完整度检查，非模型遵循度实验 |
| 真实只读会话中 CLAUDE.md 被读入上下文并被遵循 | Showcase live-read-only-check.md：模型复述测试命令、禁区路径并原样输出金丝雀令牌 FIELDS-LOADED-7Q2，exit 0 | 在线模型单次受控实测 | 2026-07-11 | 中 | 单次运行，非基准，不代表长期遵守 |
| 橙皮书 README 声明 CC BY-NC-SA 4.0，仅作中文主题地图 | claude-code-orange-book 仓库 README 许可 | 二手来源许可核验 | 2026-07-11 | 中 | 不用其截图证明现行产品行为 |

## 关于四跳 / 五跳的出入（重要）

本任务文章卡写明：「@import 当前最大递归深度是五跳，不能复用旧的四跳说法。」
但 2026-07-11 现场核对官方 memory 文档（WebFetch 逐字引用 + curl 原始 markdown 第 97 行双重核对），
现行原文为：「Imported files can recursively import other files, with a maximum depth of four hops.」
按 skill「以一手来源和现场工具核实现行行为」的原则，正文采用官方现行的「四跳」，
并把此出入列为待 reviewer 复核项，请复核者以发布日的官方文档再确认一次。

## 编辑综合（非事实，需标注）

- 「五类必要信息」是对官方零散建议按「一次小改动闭环」的操作化归纳，非官方分类、非行业标准。
- 「每次失败只补一条能改变行为的规则」是基于官方建议的编辑判断。
