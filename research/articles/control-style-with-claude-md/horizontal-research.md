# 横向研究：风格治理该落在哪一层

核验日期：2026-07-11。本文只把官方 Claude Code 文档当作现行行为的一手来源；橙皮书只作中文主题地图。

## 一手来源

### `memory`

文档：[How Claude remembers your project](https://code.claude.com/docs/en/memory)

支撑：

- `CLAUDE.md` 与 auto memory 都会在会话开始时载入。
- 官方原文明确：它们被当作 context，而不是 enforced configuration；要硬性阻止动作，用 `PreToolUse hook`。
- `CLAUDE.md` 支持多个放置位置与拼接加载；项目根与更上层目录不会互相覆盖，而是一起进入上下文。
- `Write effective instructions` 给出两个关键限制：具体、简洁；单个 `CLAUDE.md` 目标控制在 200 行以内。
- `.claude/rules/` 支持 `paths` frontmatter 做 path-scoped rules；规则可按目录与文件类型只在相关文件被处理时触发。
- `AGENTS.md` 不会被 Claude Code 直接读取，如需复用需在 `CLAUDE.md` 里 `@AGENTS.md` 或做符号链接。

不能证明：

- 模型在特定项目中对某条规则的真实遵循率。
- 某条路径规则是否一定带来更高成功率。

### `best-practices`

文档：[Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

支撑：

- `CLAUDE.md` 应保持短、可读，并逐行判断“删除它会不会更容易出错”；否则就删。
- 文件过长会导致真正重要的规则被忽略。
- 官方建议把 Claude 能产生 pass/fail 结果的检查接入循环，这与本文“可机械判断就下沉到检查器”的主张一致。
- 规则应具体到命令、路径、场景，而不是泛泛而谈。

不能证明：

- 200 行之外是否一定失效；这是经验性建议，不是硬阈值。
- 在没有脚本支持的情况下，模型是否一定会遵循更具体的自然语言规则。

### `features-overview`

文档：[Extend Claude Code](https://code.claude.com/docs/en/features-overview)

支撑：

- 新手应先从 `CLAUDE.md` 开始，再随着具体触发条件增加别的扩展。
- “Claude gets a convention or command wrong twice -> add it to CLAUDE.md” 直接支持“从重复失败提炼规则”。
- 官方区分了 `CLAUDE.md vs Rules vs Skills`：`CLAUDE.md` 适合核心约定与命令，`.claude/rules/` 适合目录或语言特定规则，skills 适合按需加载的参考或工作流。
- 同样给出经验法则：`CLAUDE.md` 超过 200 行时，应把参考内容移到 skills 或拆成 `.claude/rules/`。

不能证明：

- 哪一条具体风格规则应该写成 rule、skill 还是脚本；这仍需结合项目目标判断。

### `overview`

文档：[Overview](https://code.claude.com/docs/en/overview)

支撑：

- Claude Code 的产品定位：可读代码、改文件、跑命令、跨多文件工作。
- 这支持本文把它视为“带执行能力的编码代理”，因此对规则放置尤其需要区分软提醒与硬检查。

不能证明：

- 任何具体风格治理最佳实践；这里只提供产品定位与功能边界。

## 二手主题地图

### `claude-code-orange-book`

仓库：[Claude Code: The Complete Guide](https://github.com/alchaincyf/claude-code-orange-book)

角色：

- 只作为中文主题地图，帮助确认“CLAUDE.md 风格治理”是值得拆开的教程题目。
- 不用于证明现行产品行为、现行路径规则语义或当前文档原句。

许可：

- README 声明采用 CC BY-NC-SA 4.0。
- 本文不复制其图片和卡片式结构，只在底部来源保留主题地图与许可说明。

## 与相邻教程的分工

- `minimum-claude-md`：回答“第一份最小文件该写什么”；本文不重复最小五类信息。
- `skills-hooks-mcp-roles`：回答不同扩展机制的分工；本文只用到“什么时候不要继续写在 CLAUDE.md”这一边界，不进入扩展教程。
- 本文独有：从风格失败切入，建立根文件、path-scoped rules、确定性检查三层放置判断，并给出 UI/API 作用域 showcase。
