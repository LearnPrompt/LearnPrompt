# 横向研究：CLAUDE.md 最小可用文件

对比一手官方文档、本机 CLI 与二手主题地图，标明各自能证明什么、不能证明什么。
核验日期统一为 2026-07-11。

## 一手来源

### code.claude.com/docs/en/memory（官方 memory 文档）

支撑：

- CLAUDE.md 与 auto memory 是两套互补的记忆系统，都在每次会话开始时读入；
  官方原文：「Claude treats them as context, not enforced configuration.」要硬性阻止某动作，
  用 PreToolUse hook。
- 四个作用域按加载顺序从广到具体：Managed policy、User(`~/.claude/CLAUDE.md`)、
  Project(`./CLAUDE.md` 或 `./.claude/CLAUDE.md`)、Local(`./CLAUDE.local.md`，应加 .gitignore)。
  所有发现的文件被拼接进上下文，而不是互相覆盖。
- Size：官方建议「target under 200 lines per CLAUDE.md file」，越长越消耗上下文、越降低 adherence。
- Specificity 示例：用「Use 2-space indentation」而非「Format code properly」；
  「Run `npm test` before committing」而非「Test your changes」；
  「API handlers live in `src/api/handlers/`」而非「Keep files organized」。
- @import：`@path/to/import` 语法，相对路径相对于所在文件解析；
  原文「Imported files can recursively import other files, with a maximum depth of four hops.」
- AGENTS.md：「Claude Code reads `CLAUDE.md`, not `AGENTS.md`.」复用方式是 `@AGENTS.md` import 或 symlink。
- .claude/rules：按 `paths` frontmatter 作用域拆分规则，匹配文件时才载入。
- auto memory：Claude 自己写的学习笔记，存 `~/.claude/projects/<project>/memory/`，
  `MEMORY.md` 前 200 行或 25KB 载入；与「你写的」CLAUDE.md 互补。
- Troubleshoot：CLAUDE.md 作为 system prompt 之后的 user message 递送，「no guarantee of strict compliance」。

不能证明：模型对任意 CLAUDE.md 的实际遵循率；不同项目下的效果差异。

### code.claude.com/docs/en/best-practices（官方最佳实践）

支撑：

- 「keep it short and human-readable」；对每一行自问「Would removing this cause Claude to make mistakes?」
  否则删掉；「Bloated CLAUDE.md files cause Claude to ignore your actual instructions!」
- 可加「IMPORTANT / YOU MUST」提升 adherence；把 CLAUDE.md 纳入 git，价值随时间复利。
- 反模式：「The over-specified CLAUDE.md. If your CLAUDE.md is too long, Claude ignores half of it…」
- 与本文验收主题呼应：「give Claude something that produces a pass or fail, and the loop closes on its own」。
- hooks 是 deterministic、guarantee，CLAUDE.md instructions 是 advisory。

不能证明：具体项目的最优行数；量化的 adherence 提升幅度。

### code.claude.com/docs/en/features-overview（官方特性总览）

支撑：

- 新手路径：先用 CLAUDE.md 记项目约定，再按触发补别的扩展。
- 「Build your setup over time」：Claude 把某约定或命令弄错两次 → 加进 CLAUDE.md；
  重复粘贴的多步流程 → 做成 skill；要每次无条件发生 → 写 hook。
- CLAUDE.md vs Skill：CLAUDE.md 放「always know / always do X」；skill 放「有时才需要的参考或可触发工作流」。
  「Keep CLAUDE.md under 200 lines. If it's growing, move reference content to skills or split into .claude/rules/」。

不能证明：产品 UI 细节随版本变化的部分。

### 本机 Claude Code CLI（claude --version / --help）

支撑：

- 版本 2.1.206（`claude --version`）。
- `--bare` 明确会「skip … auto-memory … and CLAUDE.md auto-discovery」，反证：默认会自动发现并加载 CLAUDE.md。
- 存在 `--append-system-prompt`，与文档「想要 system prompt 级别用 --append-system-prompt」一致。

不能证明：闭源加载实现细节；跨平台差异。

## 二手主题地图

### alchaincyf/claude-code-orange-book（橙皮书）

角色：仅作中文主题地图，帮助确定「最小 CLAUDE.md / 禁区 / 维护方式」这些话题值得讲。
许可：仓库 README 声明 CC BY-NC-SA 4.0，引用需保留作者、仓库地址、许可与修改说明，不得商用。
不能证明：任何现行产品行为——所有产品事实以官方文档与本机 CLI 为准，不用橙皮书截图当现状证据。

## 与相邻文章的分工

- install-and-first-project：负责首次任务闭环（读项目→计划→小改动→验收→写回规则），本文不重复闭环。
- control-style-with-claude-md：负责从失败维护长期代码风格与工程约束，本文只教第一份最小文件与五类必要信息。
- 本文独有：把「空泛说明 vs 最小文件」放进同一机械验收，并明确 context 与 enforcement 的边界。
