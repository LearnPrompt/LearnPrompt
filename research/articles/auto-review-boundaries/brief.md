# Brief：Codex auto-review 的边界，不要把两种 surface 混成一种

## 文章卡

- 目标 MDX：`starlight/src/content/docs/codex/auto-review-boundaries.mdx`
- 研究目录：`research/articles/auto-review-boundaries`
- 图片目录：`starlight/public/images/articles/auto-review-boundaries/`
- 构建命令：`cd starlight && npm run build`
- 验证日期：2026-07-11

## 读者与产出

- 目标读者：已经在用 Codex 或准备把 Codex 接入团队 review/审批流程，但容易把 GitHub PR code review 和本地 approval reviewer 混成一个“自动审查”开关的工程师。
- 一句话产出：读完后，读者能明确区分 GitHub `@codex review` / Automatic reviews 与本地 `approvals_reviewer = "auto_review"` 的职责边界，知道各自的输入、输出、风险、不能证明什么，以及怎样用一个最小 PR fixture 在本地复现“diff + repo guidance + anchored finding”的审查合同。

## 核心主张

`auto review` 在 Codex 里至少指向两种当前 product surface：

1. GitHub Codex code review：以 pull request diff 为输入，触发方式是 `@codex review` 或 Automatic reviews，输出是托管在 GitHub PR 上的标准 code review，只标 P0/P1，并按 changed file 就近应用 `AGENTS.md` review guidelines。
2. `approvals_reviewer = "auto_review"`：它只决定谁来处理 eligible approval request；它不等于 PR code review，也不会扩大 sandbox，更不会让已经在 sandbox 内允许的动作额外多一层 review。

真正稳定的使用方式不是记名词，而是先问“我要的是 PR 风险发现，还是本地权限边界上的审批代理”。

## 非目标

- 不触发真实 GitHub `@codex review`、Automatic reviews、PR comment 或云端任务。
- 不把本地 `codex exec` 的 structured review 冒充成 GitHub 托管 code review。
- 不讲 managed rollout、企业组织级审批策略、完整 auto-review 生命周期页面。
- 不把一次本地 structured review 外推成“GitHub 托管结果必然一致”。

## 必须的证据

- 官方 GitHub code review 文档：`@codex review`、Automatic reviews、P0/P1、closest `AGENTS.md`。
- 官方 sandboxing 文档：`approvals_reviewer = "auto_review"` 所处位置、与 sandbox/approval policy 的关系、UI 中 “Approve for me for eligible approval requests” 的含义。
- 官方 config reference：`approvals_reviewer` 的精确定义，尤其是“Who reviews eligible approval prompts ... This setting doesn't change sandboxing...”。
- 一次本机 `codex-cli 0.142.2`、模型固定 `gpt-5.5` 的真实 read-only structured review：对一个 staged diff 的 JS PR fixture 返回 anchored finding。
- 一个 deterministic gate：验证真实 finding 命中 changed file/right-side changed line、明确指出 future timestamp/negative elapsed 行为漏洞、带 severity 与 repro；再用 fabricated out-of-diff finding 稳定非零退出。

## 验收条件

- 正文至少 8,000 字符，去代码后中文解释字符至少 2,500。
- 删除公开 `SourceCard`；底部来源仅保留实际读过的官方文档与 Orange Book 二手主题地图署名。
- 至少一张原创 SVG，解释 `diff -> candidate finding -> mechanical verification -> human/CI decision`。
- research pack 含 `brief.md`、`horizontal-research.md`、`vertical-research.md`、`evidence-ledger.md`、`asset-ledger.md`、`control-verification.md`、`review.md`、`release-gate-result.txt` 与可重跑 `showcase/`。
- writer 阶段保持 `showcase_status: partial`，不写 `quality_score`，不自评 PASS。
