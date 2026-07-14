# 独立审稿记录：记忆层

## 评审元数据

- Reviewer：Claude Opus，独立只读终审会话。
- 只读模式：仅开放 Read、Glob、Grep；未开放 Edit、Write 或 Bash。
- 隔离声明：reviewer 使用独立只读会话，writer 未参与打分或修改评审结果。
- 原始评审输出在工作树外采集；进程退出后才读取报告，仓内只保留冻结、脱敏后的评审摘要。
- 评审对象：`starlight/src/content/docs/agent-engineering/memory-layer.mdx`、完整研究包、Showcase 与教学图。

## 初审与修正

初审结论为 FAIL 92/100：blocker 0 / major 1 / minor 1。

1. major：`asset-ledger.md` 把五桶模型和「写入→召回→淘汰」误写成产品行为。已改为 LearnPrompt 的操作模型，并与产品事实分开。
2. minor：`control-verification.md` 对 `claude --help` 的 `--bare` 说明作了过度推断。已收窄为该模式会禁用 auto-memory 并跳过 CLAUDE.md 自动发现，不再声称两者各自有独立开关。

证据口径修正后重新运行单篇 validator，并完成 49 页 Starlight 构建；两项均通过。

## 独立复审结论

终审结论：PASS 94/100

未关闭问题：blocker 0 / major 0 / minor 0

- 事实与证据：24/25。产品事实有一手来源、本地 CLI 版本与 2026-07-11 核验日期；五桶及生命周期明确标为编辑归纳。
- 解释深度：19/20。覆盖机制、信息分桶、召回门控、淘汰纪律、失败模式和跨产品边界。
- Showcase：18/20。确定性脚本保存了无记忆失败、召回后成功、过期淘汰和跳过召回失败；完整结果可复现。
- 教学设计：14/15。学习目标、决策表、递进实验、练习与可观察验收条件完整。
- 时效性：10/10。Claude Code 2.1.206、Codex CLI 0.142.2 与相关官方资料均按日期核验。
- 编辑质量：9/10。中文自然、结构可扫读、无 SourceCard，底部来源和许可完整。

扣分来自少量教学摘录的压缩与继续精简空间，不构成未关闭 finding，也不影响复现结果或核心结论。

## 最终视觉评估：PASS

Visual assessment: PASS
Asset: /images/articles/memory-layer/memory-lifecycle-and-buckets.svg
Teaching role: 左栏用生命周期区分五类信息，并标出记忆层负责的跨会话三桶；右栏解释写入、相关性召回、注入与过期/污染/隐私淘汰，帮助读者理解“记忆不等于自动记住”。
Decorative-only: no
Rights: CC BY-NC-SA 4.0
Issues: none

最终状态：PASS
