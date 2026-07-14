# 横向研究：四步循环的一手资料与同类教程

对比三类来源：产品一手能力文档、橙皮书主题地图、以及相邻黄金样稿的教学分工。
每条注明它能支撑什么、不能证明什么，并带核验日期。

## 1. Claude Code plan mode（一手，核验 2026-07-11）

来源：https://code.claude.com/docs/en/common-workflows （"Plan before editing"）与 https://code.claude.com/docs/en/permission-modes

- 原文："switch to plan mode. Claude reads files and proposes a plan but makes no edits until you approve."
- 进入方式：`claude --permission-mode plan`，或会话中 Shift+Tab 切换；可在文本编辑器里编辑计划再批准。
- 支撑本文 Plan 步：先只读、先出计划、批准前不落盘，是产品级能力，不是我们发明的礼仪。
- 不能证明：其它工具的等价机制细节（Codex 有自己的 plan/审批，另文覆盖）。

## 2. AGENTS.md 标准（一手，核验 2026-07-11）

来源：https://agents.md

- 定位为「a README for agents」，被 60k+ 开源项目使用，现由 Linux 基金会下的 Agentic AI Foundation 托管。
- 建议写 setup/build/test 命令、代码风格、测试说明、安全项、PR 规范。
- FAQ 明确："The agent will attempt to execute relevant programmatic checks and fix failures before finishing the task."（列了命令，Agent 会真的去跑并在完成前修复失败）。
- 示例里直接写 `pnpm test`、`pnpm lint`、"The commit should pass all tests before you merge"。
- 支撑本文 Verify 步：验收要可执行、要能产出退出码，而不是问模型「完成没」。
- 不能证明：具体某工具是否一定执行（取决于工具与配置）。

## 3. Claude Code 记忆 CLAUDE.md（一手，核验 2026-07-11）

来源：https://code.claude.com/docs/en/memory

- CLAUDE.md 是人写给 Claude 的持久指令，每次会话开头加载；建议放构建/测试命令、约定、架构、"总是做 X"的规则。
- 关键限定："Claude treats them as context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook."
- 强调具体可验证："Run npm test before committing" 优于 "Test your changes"；单文件建议 < 200 行。
- 还有 auto memory：Claude 依据用户纠正自动记笔记，每仓库共享。
- Claude Code 读 CLAUDE.md 不读 AGENTS.md，可用 `@AGENTS.md` 导入或 symlink 复用。
- 支撑本文 Learn 步：复盘就是把一次教训写回这类持久指令，让下次会话读得到；也支撑边界说明——写回是上下文层，硬拦截要靠 hook/权限。
- 不能证明：写回后模型一定遵守（是上下文非强制，这正是我们要讲的边界）。

## 4. git diff / git revert（一手，核验 2026-07-11）

来源：https://git-scm.com/docs/git-diff ，https://git-scm.com/docs/git-revert（git-revert 手册 2.54.0 起最新）

- git diff 显示工作区与提交/暂存区的逐行差异，是「5 分钟读完这次改动」的具体动作。
- git revert 通过新建反向提交安全撤销已提交改动、保留历史；未提交改动用 `git restore`/`git reset` 退回。
- 支撑本文 Patch 步（可审查切片=可读的 diff）与计划里的回滚字段。

## 5. Harness Engineering 橙皮书（二手主题地图，核验 2026-07-11）

来源：https://github.com/alchaincyf/harness-engineering-orange-book

- 中文整理了 harness 工程话题，旧稿据此建栏目并把四步当核心概念。
- 许可边界：仓库声明教育性分享需署名，但**没有标准开放许可**；没有项目所有者明确授权，不复制或改编其图片。
- 用途：仅作主题地图，保留链接与署名说明；四步的事实依据一律回到上面的官方一手资料。

## 6. 相邻黄金样稿（教学分工，核验 2026-07-11）

- `choose-claude-code-or-codex.mdx`：按工作方式选工具（五问、四模式）——本文不重复选型，只讲选定工具后一次任务怎么跑。
- `project-checklist.mdx`：开工前写一次的六格契约（仓库/运行/禁区/密钥/验收/回滚）——本文讲开工之后每个任务重复跑的循环，二者互补：清单是「进场前」，循环是「进场后」。
- `what-is-harness.mdx`：五组件抽象审计模型——本文把其中的验收与约束落到一次具体任务的执行节奏上。

## 综合结论（编辑判断）

一手资料各自独立存在：plan mode、AGENTS.md 可执行检查、CLAUDE.md 持久指令、git 的 diff/revert。
Plan→Patch→Verify→Learn 的贡献是把它们串成一个「一次任务」的最小闭环，并给每步一个客观锚点。
因此它是 LearnPrompt 的操作性综合，不是任何厂商或标准的官方流程；这一点必须在正文显式声明。
