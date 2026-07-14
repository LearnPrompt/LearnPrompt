# Brief：什么是 Agent Skill

## 问题

旧稿只剩一句“把稳定工作流包装成可复用能力”，但没有回答读者真正卡住的判断题：

1. 我已经有一个常用 prompt，什么时候才值得升级成 Skill，而不是继续复制粘贴？
2. Skill、`AGENTS.md` / `CLAUDE.md`、普通脚本、MCP、plugin 各管哪一段，不该互相顶替什么？
3. 一个“好像适合做 Skill”的任务，怎样用真实证据证明它更像按需加载的工作包，而不是一段变长的提示词？

## 目标读者

已经在 Codex、Claude Code 或类似 agent 工具里反复做同类任务，开始积累自己的 prompt / SOP / 脚本，但还没有把它们整理成 Skill 的工程师、内容作者、技术 PM。

## 学习目标

读完后读者能：

1. 用当前一手文档说清 Agent Skill 的最小结构、渐进加载和可发现元数据。
2. 区分一次性 prompt、始终适用的 `AGENTS.md` / `CLAUDE.md`、确定性脚本、外部系统连接（MCP）和分发层（plugin）。
3. 用一个真实可重放的费用收据重命名案例，判断某个重复任务是不是已经值得从 prompt 升级成 Skill。
4. 知道什么时候不要做 Skill：需求仍在探索、规则还没稳定、只有一次、或脚本本身已经足够。

## 中心论点

Skill 不是“更长的 prompt”，而是一个**按需加载的工作包**：它把发现元数据、工作说明、参考资料、确定性脚本和验收边界装进一个可复用目录里。只有当任务满足“重复发生、边界稳定、值得沉淀、且保留人类意图与机械转换分层”时，才值得从普通 prompt 升级成 Skill。

## 非目标

- 不重复讲 `first-skill-md` 里已经展开的字段红线、最小模板和打包教程。
- 不把 OpenAI 的 `.agents/skills` 和 Claude Code 的 `.claude/skills` 混成同一种路径规范。
- 不把 Skill 冒充成脚本本身，也不把 plugin 当作执行逻辑。
- 不把 writer sandbox 的失败伪装成成功；若主控外层补跑，必须保持同一冻结契约并单独记录。

## Showcase 问题

冻结 `receipt-renamer-skill`：把“费用收据批量重命名计划”做成 repo Skill，明确由 Skill 协调输入、读取命名政策、调用确定性脚本并生成 dry-run 报告；脚本负责精确日期、金额和文件名规则。

Showcase 需要回答：

1. 正常批次是否稳定 exit `0` 并产出计划？
2. 缺 `currency` 的批次是否稳定 exit `21`？
3. 目标文件名冲突批次是否稳定 exit `23`？
4. privacy scan 是否稳定 exit `0`？
5. writer sandbox 若不能安全嵌套 `codex exec`，主控能否用同一冻结契约在外层补跑并证明 Skill 被显式加载？

## 需要的证据

- 一手官方资料：
  - `https://agentskills.io/specification`
  - `https://learn.chatgpt.com/docs/build-skills`
  - `https://learn.chatgpt.com/docs/customization/overview`
  - `https://code.claude.com/docs/en/slash-commands`
  - `https://code.claude.com/docs/en/features-overview`
  - `https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview`
- 二手主题地图：
  - 本地临时镜像 `agent-skills-orange-book-zh.txt`
  - 本地临时镜像 `agent-skills-orange-book/README_zh.md`
- 冻结 showcase：
  - `research/articles/what-are-agent-skills/showcase/receipt-renamer-skill/`
  - writer sandbox 的真实阻塞记录与主控外层成功补跑的冻结结果
  - 一张原创 SVG，解释 `prompt -> Skill metadata/body -> references/script -> verified output`

## 关键问题

1. 为什么“我老在贴同一个 prompt”还不够，必须再看流程边界、输入契约和验收方式？
2. 为什么一个好 Skill 常常要同时有自然语言工作流和确定性脚本，而不是二选一？
3. 为什么 plugin 是分发层，不该承担“何时触发”和“怎么执行”？
4. 为什么同一个 Skill 概念，在 Codex repo、Claude Code 项目、Claude API surface 上的路径和共享方式不同？

## 验收条件

- writer 阶段 frontmatter 保持 `showcase_status: partial`，独立终审通过后才允许写入 `verified` 与最终分数。
- 正文至少 6 个 H2，且能回答真实问题、机制、边界、何时不用、练习和来源。
- 删除 `SourceCard` import / 组件，只保留底部真实来源。
- Showcase 至少交付 fixture、runner、schema、离线 replay 和真实外层调用结果。
- 跑 `verify-showcase.mjs`、partial validator、Starlight build、privacy scan、`git diff --check`。

## 目标文件

- `starlight/src/content/docs/agent-skills/what-are-agent-skills.mdx`
- `research/articles/what-are-agent-skills/`
- `starlight/public/images/articles/what-are-agent-skills/`
