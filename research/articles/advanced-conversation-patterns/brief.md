# brief.md — advanced-conversation-patterns

## 文章卡

- **目标 slug / URL**：`claude-code/advanced-conversation-patterns`（保留现有 URL 与 sidebar
  order: 4，不改路径）。
- **目标读者**：已经能用 Claude Code 完成小任务，但一旦任务跨度变长，就会把探索、计划、
  实现和验收混在一条会话里，导致上下文漂移、重复解释和误修的人。
- **一句话产出**：读者能把一个真实 bug 修复拆成 `explore → frozen handoff →
  fresh implement → verify`，并知道什么时候该用 `continue`、`compact`，什么时候该
  `clear`、`resume` 或 `fork`。
- **中心主张**：长任务稳定性的关键不是“多聊几轮”，而是把会话操作当成工程边界：
  同一工作流内部用 `continue` / `compact` 维持连续性；需要清空脏上下文但保留成果时，
  先冻结 handoff，再用 `clear` 后的新 prompt 只带回必要结论；若要保留原调查历史并尝试
  另一条实现路线，再用 `fork`。真正让第二阶段可执行的，是冻结好的 handoff 与可运行的
  acceptance command，而不是模型自述；`resume` 只用于恢复旧 session，不负责清洗脏上下文。
- **Showcase 问题**：一个一次性 `slugify` bug 仓库里，怎样先只读定位
  `rock--roll` 的成因，再在全新进程中只依赖仓库和 handoff 做最小修复，并用真实命令验证？
- **必需证据**：
  1. 当前官方一手文档对 session、resume/fork、compact/clear、checkpoint、plan
     mode、verify loop 的说明；
  2. 一个可重跑的本地 deterministic Showcase，含正例与“缺 acceptance”负例；
  3. 一张解释操作选择与两阶段流程隔离的原创教学图；
  4. validator（partial）和 `starlight build` 的实际结果。
- **构建命令**：`npm --prefix starlight run build`

## 非目标

- 不展开多 agent 或 subagent 编排。
- 不把一次 Showcase 写成模型能力排名。
- 不声称 `resume`、`compact`、checkpoint 会自动保证质量。
- 不堆砌快捷键、命令清单；所有命令都要落在任务关系上解释。

## 与相邻文章的分工

- `install-and-first-project`：第一次闭环，解决“能否跑起来”。
- `minimum-claude-md`：把重复失败沉淀成长期共享规则。
- `control-style-with-claude-md`：长期风格与工程约束写法。
- **本篇**：长任务中会话如何分段，如何用 handoff 把探索与实现隔离。
- `skills-hooks-mcp-roles`：扩展能力分层，不讲本篇的上下文切换策略。

## 来源家族

- **一手来源**：Claude Code 官方文档 `best-practices`、`sessions`、`how-claude-code-works`、
  `checkpointing`、`common-workflows`、`cli-reference`，核对日期 2026-07-11。
- **本地实测**：`showcase/` 中的 deterministic 两阶段脚本与结果，核对日期 2026-07-11。
- **二手主题地图**：`alchaincyf/claude-code-orange-book`，许可声明为 CC BY-NC-SA 4.0，
  仅用于中文主题指引，不用来证明现行产品行为。
- **教学参考**：仓库内已发布样稿 `minimum-agentic-coding-workflow.mdx`，仅借鉴递进式
  教学结构，不借其事实结论替代官方资料。

## 验收标准

- 深度门禁：正文 ≥ 5000 字符，去代码后的中文解释字符 ≥ 1800，H2 ≥ 6。
- frontmatter 保持 partial，不写 `quality_score` 与 PASS 审稿结论。
- 至少一张本地图像，并在正文解释如何读图、图支持什么结论。
- Showcase 必须同时有：
  - 正例：Stage A 冻结 handoff；Stage B 用新进程、只依赖仓库+handoff 完成最小修复并验证；
  - 负例：handoff 缺 `acceptance.commands` 时，Stage B 明确拒绝继续。
- 运行并记录：
  - Stage A 正例；
  - Stage B 正例；
  - Stage B 负例；
  - `validate-golden-mdx.mjs`；
  - `npm --prefix starlight run build`。

## 关键决策

- 由于当前任务明确禁止再次调用 `/learnprompt-single-mdx`，本文只依据仓库内 skill 契约和
  一手资料重建，不使用外部写稿服务结果。
- Showcase 选择 Node 原生、零外部依赖的 `slugify` fixture，避免把复现门槛转移到安装网络依赖。
- 文章保留 `showcase_status: partial`。即使 deterministic Showcase 与 build 通过，独立审稿
  未完成前也不转 verified。
- 本文流程中的 frozen handoff 是跨进程交接工件；产品 checkpoint / rewind 只表示会话内的
  代码或对话回退能力，二者不互换。
