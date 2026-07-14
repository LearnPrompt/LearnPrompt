# Brief：检查清单型 Skill 设计

## 要解决的问题

很多“检查清单型 Skill”只会吐出一串问题或主观结论，最后变成“看起来没问题”。本文要把问题改写成：如何把 release checklist 做成可执行 gate，让每一行都有证据、通过规则、严重级别和 `N/A` 政策，并且能落成一次 dry-run 结果。

## 目标读者

已经在做 AI coding / release automation，会写基础 `SKILL.md`，但还没有把 checklist 做成 deterministic release gate 的开发者和内容型工程师。

## 学习目标

读完后，读者能够：

1. 区分“列问题”和“做 gate”的差别。
2. 给每个 checklist row 补齐 `id / evidence / pass_rule / severity / not_applicable_policy / result`。
3. 用一个小型 npm CLI release candidate 做 dry-run readiness 检查，而不是直接发布。
4. 解释为什么 `missing changelog`、`version mismatch`、`unverifiable install command`、`N/A without evidence` 应该有固定退出码。

## 中心结论

检查清单型 Skill 的价值，不在于让 Agent 多提几个问题，而在于把“通过条件”和“拒绝条件”写成结构化 contract。只有 checklist row 能回到证据、固定规则和严重级别，Skill 才能升级成 release gate。

## 明确不做

- 不重讲 `first-skill-md` 的最小字段限制和模板。
- 不重讲 `trigger-rules-and-structure` 的路由矩阵。
- 不把本文写成泛化 code review 教程。
- 不执行 `npm publish`、版本修改或任何外部发布动作。

## Frozen showcase

- 名称：`release-readiness-checklist`
- fixture：一个小型 npm CLI `clip-clean v1.4.0`
- 任务：检查 release candidate，生成结构化 Markdown / JSON 报告并运行 fixture tests
- 机械退出码：`ready=0`、`missing changelog=21`、`version mismatch=22`、`unverifiable install command=23`、`N/A without evidence=24`、`privacy=0`

## 验收条件

- 一手来源只用 Agent Skills specification、OpenAI Build skills / Customization、Claude 官方 Skill 文档、npm CLI 官方文档。
- 研究包包含 `brief.md`、`horizontal-research.md`、`vertical-research.md`、`evidence-ledger.md`、`asset-ledger.md`、`showcase/`、`control-verification.md`、`release-gate-result.txt`、`review.md`。
- writer 阶段 frontmatter 保持 `showcase_status: partial`，不写 `quality_score`，`review.md` 保持 `PENDING`。
- 跑 offline showcase、一次真实 nested Codex 尝试、privacy、partial validator、Starlight build 和 `git diff --check`，把退出码冻结到控制面。
