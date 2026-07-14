# Phase 2 Wave D 状态

日期：2026-07-12
状态：完成，四对共 8 篇全部 verified；当前全站 41 verified / 0 待处理深度教程。

## 第一对结果

| 教程 | Frozen Showcase 与实跑 | 独立终审 | 最终状态 |
| --- | --- | --- | --- |
| `obsidian-ai/markdown-as-agent-memory.mdx` | `markdown-handoff-packet`：五个冻结 Markdown records；normal `0`，缺证据 `41`、矛盾 `42`、敏感标记 `43`、非文本 `44`，privacy `0`；fresh `gpt-5.5` 只写两份 handoff reports，packet unchanged、report match、assertions pass | Codex Spark 独立只读终审，blocker/major/minor = 0/0/0，97/100，视觉 PASS | verified |
| `obsidian-ai/vault-directory-for-ai.mdx` | `vault-placement-contract`：12 条完全合成 inbox，11 placed / 1 rejected；valid `0`、orphan `51`、role mismatch `52`、unknown root `53`、sensitive placed `54`、duplicate path `55`，privacy `0`；fresh `gpt-5.5` 只写两份 plan reports，validator `0`，manifest 与 synthetic vault inventory unchanged | Codex Spark 独立只读终审，blocker/major/minor = 0/0/0，96/100，视觉 PASS | verified |

## 第二对结果

| 教程 | Frozen Showcase 与实跑 | 独立终审 | 最终状态 |
| --- | --- | --- | --- |
| `obsidian-ai/claude-md-index-navigation.mdx` | `index-routing-budget`：26 个 synthetic text files，四任务有效 trace 精确 10 reads；valid `0`、missing `61`、duplicate `62`、recursive/budget `63`、stale target `64`、private target `65`，privacy `0`；writer 因旧 CLI 参数在模型前失败，外层 fresh `gpt-5.5` 在同一冻结合同上写三份报告，fixture unchanged、forbidden direct read `null`、validator `0` | Codex Spark 独立只读终审，blocker/major/minor = 0/0/0，100/100，视觉 PASS | verified |
| `obsidian-ai/ai-maintains-knowledge-base.mdx` | `knowledge-maintenance-proposal`：11 篇 synthetic notes，六类 action；valid `0`、missing evidence `71`、auto-apply `72`、unsupported merge `73`、stale without contradiction `74`、orphan without zero-degree `75`，privacy `0`；writer 因只读 state DB 失败，外层首次输出缺顶层 `fixture` 被 `71` 拒绝，最终允许重试 validator `0`、protected files 与 source hashes unchanged | 初次报告六项合计 97 却误写总分 87，未采纳；全新 Codex Spark 只读复核为 blocker/major/minor = 0/0/0，97/100，视觉 PASS | verified |

第二对仍使用两个独立 worktree lane 和各自的 `node_modules`。两位 writer 各只完整读取并使用一次项目 Skill；reviewer 与 writer 是不同会话，raw final report 均先写在 worktree 外。导航评审入库时只去除本机绝对图片链接；维护评审只去除本机链接风险和一个重复的同义 verdict 标题，没有改动分数、findings、视觉结论或 verdict。

## 第三对结果

| 教程 | Frozen Showcase 与实跑 | 独立终审 | 最终状态 |
| --- | --- | --- | --- |
| `obsidian-ai/obsidian-git-workflow.mdx` | `vault-git-change-gate`：10 篇 synthetic Markdown notes，无 nested `.git`；valid `0`、默认分支/未隔离 `81`、越界 `82`、敏感/二进制/超限 `83`、broken link/rename `84`、receipt/commit contract `85`，privacy `0`。writer 在模型前被只读 state DB 阻断，首次外层候选因 receipt 不完整被 `85` 拒绝，最终允许重试 validator `0`、三条 allowed paths、13 行 live diff、candidate commit in history、main unchanged。accepted diff 以可无损重建的 JSON 行数组和 SHA-256 归档 | Codex Spark 独立只读终审 86/100，blocker/major/minor = 0/0/0，视觉 PASS；提交前 whitespace 归档修复与中文主路径确定性修复分别由全新只读窄审确认，分数和视觉结论维持 | verified |
| `agent-frameworks/hermes-learning-loop.mdx` | `learning-write-approval-gate`：6 条 synthetic candidate lessons；stage-memory `2`、stage-skill `1`、reject-transient `1`、reject-sensitive `1`、needs-more-evidence `1`；valid `0`、missing provenance `91`、wrong store `92`、sensitive proposal `93`、approval bypass `94`、missing version/unknown action `95`，privacy `0`。fresh `gpt-5.5` 只读 fixture/contract/sanitized probe，只写两份 proposal reports，validator `0`、protected files unchanged，未启动 Hermes session 或读取真实 profile | Codex Spark 独立只读终审，blocker/major/minor = 0/0/0，100/100，视觉 PASS | verified |

第三对继续使用两个独立 worktree lane 和独立 `node_modules`；两位 writer 各只完整读取并使用一次项目 Skill，reviewer 均为新的只读会话，raw final reports 先写在 worktree 外。Git 篇合并后额外暴露两处归档工程问题：unified diff 空 context marker 触发 trailing whitespace，以及 sanitized report 写入随机临时 commit hash。前者改为带原始 SHA-256 的无损 JSON 行数组，后者只在验证后的报告层写稳定 marker；真实 commit 存在性和 ancestor gate 未削弱。连续两次主路径 replay 的完整 research tree SHA-256 一致。

## 第四对结果

| 教程 | Frozen Showcase 与实跑 | 独立终审 | 最终状态 |
| --- | --- | --- | --- |
| `agent-frameworks/openclaw-architecture-guide.mdx` | `gateway-node-channel-route-gate`：valid `0`，channel bypass `101`、node owns Gateway state `102`、role/scope/pair/capability escalation `103`、unsafe exposure `104`、legacy bridge/current WS mismatch `105`、unexpected write path `106`，privacy `0`。三次 live writer 均在模型前因共享用量限制退出，0 report、protected files unchanged；确定性合同成为权威证据。初审指出允许路径未覆盖完整文件集合后，控制器改为仓库外最小工作区，并机械拒绝新增、修改、删除和 symlink 替换 | 初审 89/100 后关闭 1 major / 2 minor；全新只读复审 98/100，blocker/major/minor = 0/0/0，视觉 PASS | verified |
| `agent-frameworks/deployment-channels-cost.mdx` | `deployment-budget-safety-gate`：valid `0`，缺 availability/persistence `111`、unsafe public/channel `112`、missing variable cost `113`、config-only fake health `114`、no caps/fallback/kill `115`，privacy `0`；合成预算月度总额 80.24、cap 100，明确不是价格或账单。live writer 在模型前因共享用量限制退出，0 report、protected files unchanged；确定性成本与安全合同为权威证据 | 全新只读终审 100/100，blocker/major/minor = 0/0/0，视觉 PASS | verified |

第四对继续使用两个独立 worktree lane 和独立 `node_modules`；两位 writer 各只完整读取并使用一次项目 Skill，reviewer 与 writer 为独立会话。外部 CLI 的用量限制发生在模型调用、Skill 读取和文件写入之前，失败历史保留在 worktree 外，没有伪装成 live 成功；每篇在允许的两次重试预算内完成确定性证据与独立终审。

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

## 最终合并后机械门禁

- 四对 8 套 Showcase 均从包含中文的真实主仓库路径重放；全部有效场景、负例、privacy 和写边界通过。
- 41 篇 verified 全量 validator：PASS。
- Validator 回归：1 positive / 3 depth negatives / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- Starlight 完整构建：49 pages PASS。
- 当前全站计数：41 verified / 0 个待处理深度教程；公开 MDX 中 `SourceCard` 零匹配。
- 主仓库在门禁后保持 clean。

## 本地提交

- `7364448 docs: goldenize markdown agent memory`
- `db29259 docs: goldenize vault placement contract`
- `6f2785b docs(obsidian-ai): goldenize index navigation (100)`
- `d7dae0e docs(obsidian-ai): goldenize knowledge maintenance (97)`
- `24e05af docs(obsidian-ai): goldenize git workflow (86)`
- `64027e3 docs(agent-frameworks): goldenize hermes learning loop (100)`
- `fc05b96 fix(showcase): stabilize obsidian git replay`
- `22b533f docs(agent-frameworks): goldenize openclaw architecture (98)`
- `51c0ed3 docs(agent-frameworks): goldenize deployment cost guide (100)`
- 本状态提交只更新 Wave D 控制面与全站计数。

没有 push、部署或发布。

## Wave D 结论

8/8 verified，0 review、0 partial、0 blocked。跨页边界、来源、图片、许可和外链结果见 [`phase2-wave-d-audit.md`](./phase2-wave-d-audit.md)。
