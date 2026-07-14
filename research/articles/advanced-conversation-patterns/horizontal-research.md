# horizontal-research.md — 横向研究

核对日期：2026-07-11。

## 1. 官方一手资料：Claude Code Docs

### `best-practices`

- 支撑内容：
  - 长任务里 context window 会很快膨胀，早期指令可能丢失，需要主动管理上下文。
  - 推荐 workflow 是 `Explore first, then plan, then code`。
  - 需要给 Claude 一个可运行的验证门，而不是只让它“看起来完成”。
  - 推荐把 session 当作可持续 workstream，并在需要时 resume。
- 不能证明的内容：
  - 它解释的是官方推荐操作，不证明任何一次特定项目里一定更优。
  - 它不能替代本文对 handoff 结构的教学设计，handoff 字段是本文编辑综合。

### `sessions`

- 支撑内容：
  - `--continue`、`--resume`、`/resume` 的会话恢复语义。
  - `/clear` 会清空当前上下文，但之前的会话仍可恢复。
  - `/compact` 在同一 session 内做摘要压缩。
  - `--fork-session` / `/branch` 是复制历史到新 session ID，而不是覆盖原 session。
- 不能证明的内容：
  - 文档说明的是会话机制，不证明哪一种操作对某个具体 bug 最合适，选择仍需结合任务关系。

### `checkpointing`

- 支撑内容：
  - checkpoint 可 restore code / conversation / both，也可以针对局部做 summarize。
  - summarize 与 `fork` 的边界：前者压缩同一 session，后者保留原 session 并分叉新 session。
  - checkpoint 不能追踪 bash 命令造成的文件修改，不是 git 替代品。
- 不能证明的内容：
  - 它不能证明“用了 checkpoint 就更安全”；真正的安全仍取决于验收门和文件边界。

### `how-claude-code-works`

- 支撑内容：
  - Claude Code 的 agentic loop 是 gather context → take action → verify results。
  - session 保存在本地 transcript，resume 是延续同一会话，fork 是复制历史到新 ID。
  - context fills up 后会自动清理旧输出并进行摘要，但早期细节仍可能退化。
- 不能证明的内容：
  - 它不能替代本地 Showcase；loop 解释的是机制，不是本文场景的实证。

### `common-workflows` 与 `cli-reference`

- 支撑内容：
  - bug 修复 prompt 应给出重现命令和症状；
  - CLI 的 `--continue`、`--resume`、`--fork-session` 参数形态。
- 不能证明的内容：
  - 它们给的是 recipes 和 reference，不说明在“长任务脏上下文”场景下该怎么组合使用。

## 2. 二手主题地图：Claude Code Orange Book

- 能支持：
  - 旧稿主题“对话模式/进阶对话技巧”确实属于 Claude Code 章节脉络。
  - 中文术语映射可以帮助确认本篇仍应放在 `claude-code` 分区。
- 不能支持：
  - 不能用其旧命令、截图、流程描述证明 2026-07-11 的官方行为。
  - 不能直接沿用其结构，因为当前需求强调 explore/plan、checkpoint、resume/fork 的现行语义。

## 3. 教学参考：仓库内 `minimum-agentic-coding-workflow`

- 能支持：
  - 教学结构上，应从一个真实 bug 或真实失败后果开篇，而不是先列命令。
  - “计划、边界、验证门、复盘”式结构更适合 LearnPrompt 深教程。
- 不能支持：
  - 这篇文章讲的是一次任务最小闭环，不覆盖 `continue/compact/clear/resume/fork`
    的选择边界，也不提供 session 级证据。

## 4. 编辑结论

- 本篇不能写成“快捷键手册”，因为用户问题不是不会按命令，而是不知道何时保持同一上下文，
  何时切出干净上下文。
- 一手资料已经足以支撑操作语义，所以橙皮书只保留底部署名与许可。
- Showcase 不必冒充真实 Claude run。题卡要求的是“两个相互独立的本地确定性进程”，因此
  用 deterministic handoff/implement 脚本证明流程隔离更符合证据边界；正文必须明确说明
  这不等于证明 Claude 产品或模型行为。
