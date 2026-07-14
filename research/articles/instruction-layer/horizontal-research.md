# 横向研究：指令层的一手资料与主题地图

对比三类来源，标注各自能证明什么、不能证明什么。核验日期 2026-07-11。

## 1. Claude Code 官方 memory 文档（一手）

来源：https://code.claude.com/docs/en/memory （由 docs.claude.com/en/docs/claude-code/memory 301 跳转而来）。

能证明：

- CLAUDE.md 是用户手写、每次会话开头全量载入的指令文件；有四个作用域，按“托管策略 → 用户 → 项目 → 本地”从宽到窄的加载顺序进入上下文，越靠近工作目录读得越晚。原文：“loaded in full at launch”“from broadest scope to most specific”。
- 官方把 CLAUDE.md 明确定位为上下文而非强制配置：“Claude treats them as context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook instead.” 这直接支撑“指令层解释意图、约束层才是硬闸”的分工。
- 精确性建议有原文可引：“The more specific and concise your instructions, the more consistently Claude follows them.” 并给出对照例子：“Use 2-space indentation” 优于 “Format code properly”；“Run `npm test` before committing” 优于 “Test your changes”。
- 冲突处理：“if two rules contradict each other, Claude may pick one arbitrarily.” 支撑“必须显式声明冲突优先级”。
- 体量建议：单个 CLAUDE.md 目标控制在 200 行内，越长越占上下文、遵循度越低。
- `@path` 导入最大递归四跳；`/init` 生成起始文件；Claude Code 读 CLAUDE.md 而不读 AGENTS.md，可用 `@AGENTS.md` 导入或符号链接复用。

不能证明：

- 不能证明模型遵循率的具体数值（官方只给方向性结论）。
- 不能作为 Codex 行为的依据；两者是不同产品。

## 2. Codex 官方 AGENTS.md 文档 + agents.md 站点（一手）

来源：https://developers.openai.com/codex/guides/agents-md （308 跳转至 learn.chatgpt.com/docs/agent-configuration/agents-md）；https://agents.md/。

能证明（Codex 文档）：

- 发现顺序：全局 `~/.codex/AGENTS.md`（或 `AGENTS.override.md`）→ 项目根（通常 git 根）→ 沿路径走到当前工作目录，每一层择一。
- 合并机制：“Codex concatenates files from the root down… Files closer to your current directory override earlier guidance because they appear later in the combined prompt.” 支撑“越近越优先”。
- 体量上限：“stops adding files once the combined size reaches the limit defined by `project_doc_max_bytes` (32 KiB by default).” 支撑“达到上限后停止继续加入后续文件”，不应写成整体丢弃。
- `AGENTS.override.md` 在同层替换而非叠加。

能证明（agents.md 站点）：

- AGENTS.md 是“a simple, open format for guiding coding agents”，被 6 万多个开源项目采用，由 Linux 基金会下的 Agentic AI Foundation 托管。
- 定位是“a README for agents”，与面向人的 README 分工：README 给人看，AGENTS.md 放构建、测试、约定等 agent 需要的上下文。
- 格式即标准 Markdown、无必填字段；就近生效：“The closest AGENTS.md to the edited file wins; explicit user chat prompts override everything.” 支撑“单次任务的显式 prompt 压过仓库指令”。

不能证明：

- 不能证明某个具体项目一定被 Codex 正确加载（受 32 KiB 上限、路径影响）。
- 站点的“open format”不等于任何一家产品的内部实现细节。

## 3. harness-engineering 橙皮书（二手主题地图）

来源：https://github.com/alchaincyf/harness-engineering-orange-book。

用途与边界：

- 只作为中文主题地图，帮助确认“指令/能力/约束/状态/编排”这套分层叙事在中文语境的组织方式。
- 其仓库声明为教育性分享、注明署名，但未发布标准开源许可（见项目 visual-assets 许可矩阵）。因此不复制、不改编其任何图片或成段文字；本文图示为原创，事实全部回到上面两类一手来源核验。
- 底部来源区保留其链接与署名，并显式标注为二手主题地图，不作为事实权威。

## 4. 教学参照：同仓库黄金样稿

`agent-engineering/what-is-harness.mdx` 已把五组件讲成一套审计模型。本文与它分工：what-is-harness 横向铺开五层，本文纵向只深挖指令层的五个可执行维度与冲突解析，并给出与其他四层的清晰边界，避免重复。
