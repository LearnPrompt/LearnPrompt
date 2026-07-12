# Phase 2 Wave D 状态

日期：2026-07-12
状态：进行中，第一对完成；当前全站 35 verified / 6 待处理深度教程。

## 第一对结果

| 教程 | Frozen Showcase 与实跑 | 独立终审 | 最终状态 |
| --- | --- | --- | --- |
| `obsidian-ai/markdown-as-agent-memory.mdx` | `markdown-handoff-packet`：五个冻结 Markdown records；normal `0`，缺证据 `41`、矛盾 `42`、敏感标记 `43`、非文本 `44`，privacy `0`；fresh `gpt-5.5` 只写两份 handoff reports，packet unchanged、report match、assertions pass | Codex Spark 独立只读终审，blocker/major/minor = 0/0/0，97/100，视觉 PASS | verified |
| `obsidian-ai/vault-directory-for-ai.mdx` | `vault-placement-contract`：12 条完全合成 inbox，11 placed / 1 rejected；valid `0`、orphan `51`、role mismatch `52`、unknown root `53`、sensitive placed `54`、duplicate path `55`，privacy `0`；fresh `gpt-5.5` 只写两份 plan reports，validator `0`，manifest 与 synthetic vault inventory unchanged | Codex Spark 独立只读终审，blocker/major/minor = 0/0/0，96/100，视觉 PASS | verified |

## 隔离、重试与隐私边界

- 两篇分别位于两个独立 worktree lane，分别安装依赖，不共享 `node_modules`。
- 每篇 writer 只完整读取并使用一次 `.claude/skills/learnprompt-single-mdx/SKILL.md`；后续证据收口没有重复调用 Skill。
- Markdown writer 的首次 nested run 因旧命令形状失败；Vault writer 的首次 nested run 因只读 state DB 初始化失败。两条历史都没有被改写成成功，外层控制器只对同一冻结 prompt/schema/fixture 各补跑一次并成功。
- reviewer 与 writer 是独立会话；reviewer 使用 read-only sandbox，raw final report 保存在 worktree 外。仓库内 `review.md` 只做本机绝对链接去除和 validator 标题格式规范，没有改动分数、findings、视觉结论或 verdict。
- 两套 Showcase 都只使用合成事故、合成 vault 和结构化敏感标记；privacy scan 均为 `0`，没有真实 vault、账号、token、聊天、runtime ID 或本机绝对路径进入提交。

## 图片与来源门禁

- `durable-memory-record.svg`：1400×900 原创教学图，解释五文件 packet、fresh Agent 读取、两份带引用输出和 `41/42/43/44` 拒绝分支；Chrome 实渲染后视觉 PASS。
- `vault-placement-contract.svg`：1400×900 原创教学图，解释 inbox → role decision → canonical path / reject rail 与 `51/52/53/54/55` gates；实渲染后视觉 PASS。
- 两张图均有具体 alt、紧随图注、`asset-ledger.md` 与 CC BY-NC-SA 4.0 记录，不是装饰性封面。
- 两篇公开 MDX 均无 `SourceCard`；底部保留官方来源、Orange Book 署名、非标准许可证边界，以及“未复制 PDF 正文、截图或图片”的说明。

## 合并后机械门禁

- 两套 Showcase 从包含中文的真实主仓库路径重放 PASS，重放后无 tracked diff。
- 35 篇 verified 全量 validator：PASS。
- Validator 回归：1 positive / 3 depth negatives / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- Starlight 完整构建：49 pages PASS。
- 当前全站计数：35 verified / 6 个仍含 SourceCard 的待处理深度教程。
- 主仓库在门禁后保持 clean。

## 本地提交

- `7364448 docs: goldenize markdown agent memory`
- `db29259 docs: goldenize vault placement contract`
- 本状态提交只更新 Wave D 控制面与全站计数。

没有 push、部署或发布。

## 剩余 Wave D

- `obsidian-ai/claude-md-index-navigation.mdx`
- `obsidian-ai/ai-maintains-knowledge-base.mdx`
- `obsidian-ai/obsidian-git-workflow.mdx`
- `agent-frameworks/hermes-learning-loop.mdx`
- `agent-frameworks/openclaw-architecture-guide.mdx`
- `agent-frameworks/deployment-channels-cost.mdx`
