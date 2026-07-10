# 横向研究：开工清单的一手资料与同类教程

对比至少三类来源：产品一手文档、橙皮书主题地图、以及相邻黄金样稿的教学分工。

## 1. AGENTS.md 标准（一手，核验 2026-07-11）

来源：https://agents.md

- 定位为“a README for agents”：给 AI 编码 Agent 提供上下文和指令的固定、可预期的位置。
- 推荐小节：项目概览、构建与测试命令、代码风格、测试说明、安全注意事项；可加提交/PR 规范、部署步骤。
- 单文件放仓库根；monorepo 可在子包放嵌套 AGENTS.md，就近者优先。
- 强调 Agent 会“尝试执行相关的程序化检查并在完成前修复失败”，即验收要可执行。
- 支撑本文：开工清单应包含运行/测试命令、边界、安全项，且验收要能跑。
- 不能证明：不同工具具体如何读取（Claude Code 读 CLAUDE.md，不读 AGENTS.md，见下）。

## 2. Claude Code 记忆（CLAUDE.md）（一手，核验 2026-07-11）

来源：https://code.claude.com/docs/en/memory

- CLAUDE.md 是人写给 Claude 的持久指令，每次会话开头加载；建议放构建命令、约定、项目结构、“总是做 X”的规则。
- 明确：Claude Code 读 CLAUDE.md，不读 AGENTS.md；已有 AGENTS.md 可用 `@AGENTS.md` 导入或 symlink 复用。
- 强调指令要具体可验证：`Run npm test before committing` 优于 `Test your changes`。
- 关键限定：CLAUDE.md 是上下文不是强制配置——“Claude treats them as context, not enforced configuration”。要硬拦截用 hook。
- 支撑本文：清单要具体、可验证；也支撑“禁改目录写进清单只是提醒，不是强制”的边界说明。
- 不能证明：具体权限如何强制（见权限文档）。

## 3. Claude Code 权限（deny 规则）（一手，核验 2026-07-11）

来源：https://code.claude.com/docs/en/permissions

- 权限规则 allow/ask/deny，按 deny→ask→allow 顺序求值；deny 优先。
- 可对文件和命令写 deny，如 `Read(.env)`、`Bash(git push *)`；Read/Edit deny 遵循 gitignore 语义。
- 明确：`Permission rules are enforced by Claude Code, not by the model`；提示词/CLAUDE.md 只影响意图，不改变允许什么。
- 支撑本文：清单里的“禁改目录/密钥”从软提醒升级为系统强制，要靠 deny 规则或沙箱。
- 不能证明：其它工具（Codex）的等价机制细节。

## 4. git 回滚（一手，核验 2026-07-11）

来源：https://git-scm.com/docs/git-revert

- git revert 通过新建反向提交安全撤销已提交改动，保留历史；git reset --hard 丢弃未提交改动、可改写历史更危险。
- 支撑本文：清单的“回滚方式”应区分未提交（restore/reset）与已提交（revert）。

## 5. Harness Engineering 橙皮书（二手主题地图，核验 2026-07-11）

来源：https://github.com/alchaincyf/harness-engineering-orange-book

- 中文整理了 harness 工程话题，旧稿据此建栏目。
- 许可边界：仓库声明教育性分享需署名，但没有标准开放许可；没有项目所有者的明确授权，不复制或改编其图片。
- 用途：仅作主题地图，保留链接与署名说明；产品与工程事实一律回到上面的官方一手资料。

## 6. 相邻黄金样稿（教学分工，核验 2026-07-11）

- `choose-claude-code-or-codex.mdx`：工具选型，用本文件当 Showcase 目标——本文不重复选型。
- `minimum-agentic-coding-workflow.mdx`：Plan→Patch→Verify→Learn 每个任务的循环——本文讲开工前的一次性契约，不重复四步。
- `what-is-harness.mdx`：五组件抽象审计模型——本文把它落到“开工清单”这份具体工件，并在图里做映射。

## 综合结论（编辑判断）

一手资料一致指向：给 Agent 的项目指令应当具体、含可执行的命令与边界，且真正的边界靠工具强制而非措辞。
本文把这些共识收敛成一份六格、可校验的开工清单，并与相邻文章明确分工。
