# Control Verification

核验日期：2026-07-12。以下记录 writer 阶段门禁及外层控制器对同一冻结合同的补充实跑，不代替独立 reviewer。

## 一手来源与边界

- Obsidian 相关事实按 2026-07-12 的官方页面重新核对：`How Obsidian stores data`、`Manage vaults`、`Properties`。
- Codex / Claude Code 相关事实按 2026-07-12 的官方页面重新核对：`Introducing Codex`、`How Claude remembers your project`。
- 仓库外的本轮 current-source routing snapshot 只用于研究导航，没有把它当一手 authority，也不提交本机路径。
- `00/10/20/30/50/99` 的角色、canonical path、reject rail、`51/52/53/54/55` gates 都明确标注为 LearnPrompt 编辑综合，而不是 Obsidian 标准。

## Showcase 事实

- 冻结 Showcase：`research/articles/vault-directory-for-ai/showcase/vault-placement-contract/`
- frozen inputs：
  - `fixture/inbox-manifest.json`
  - `fixture/vault-policy.json`
- deterministic reference：
  - `cases/valid-plan.json`
  - `cases/valid-plan.md`
- completed live-attempt evidence：
  - `results/live-attempt-summary.json`
  - `results/live-attempt-excerpt.md`
  - `results/live-attempt-output.txt`

## 真实运行结果

- `node research/articles/vault-directory-for-ai/showcase/vault-placement-contract/scripts/verify-showcase.mjs`
  - exit `0`
  - `valid=0 orphan=51 role=52 root=53 sensitive=54 duplicate=55`
  - `unicode_paths_present=true`
  - `manifest_unchanged=true`
  - `fixture_inventory_unchanged=true`
- `node research/articles/vault-directory-for-ai/showcase/vault-placement-contract/scripts/privacy-scan.mjs`
  - exit `0`
  - `PASS privacy scan: no credential, runtime id, or local absolute path leakage found.`
- 外层控制器 live attempt 命令：
  - `CODEX_NESTED_MODEL=gpt-5.5 node research/articles/vault-directory-for-ai/showcase/vault-placement-contract/scripts/run-codex-live.mjs`
  - wrapper 与 nested `codex exec` 均 exit `0`
  - `status=completed`
  - `reports_written.json=true`
  - `reports_written.markdown=true`
  - `validation_exit_code=0`
  - `fixture_manifest_changed=false`
  - `fixture_inventory_changed=false`
  - `changed_paths=[reports/placement-plan.json, reports/placement-plan.md]`
  - 计划结果：12/12 accounted、11 placed、1 sensitive item rejected
  - writer-side 首次尝试的只读 state DB 阻断只作为历史运行事实保留；它不再代表当前 Showcase 状态

## 文稿与资产门禁

- partial validator：
  - `node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs --article starlight/src/content/docs/obsidian-ai/vault-directory-for-ai.mdx --research research/articles/vault-directory-for-ai`
  - exit `0`
  - `PASS article`
  - `PASS research`
  - `PASS status: partial`
- SVG render check：
  - 使用 `sharp` 将 `starlight/public/images/articles/vault-directory-for-ai/vault-placement-contract.svg` 渲染到 worktree 外临时 PNG
  - `pixelWidth=1400`
  - `pixelHeight=900`
  - 已对渲染结果做目视检查：无越框、无裁切、无关键标签缺失
- Starlight build：
  - `npm --prefix starlight run build`
  - exit `0`
  - `Found 49 HTML files.`
  - 目标路由：`/obsidian-ai/vault-directory-for-ai/`
- `git diff --check`
  - exit `0`
  - 无输出

## 最终状态

- 独立只读 reviewer：Codex Spark，仓库外 raw final report，writer 未参与评分或改写。
- 最终结论：PASS `96/100`，blocker/major/minor = `0/0/0`，视觉 PASS。
- frontmatter 已在 reviewer PASS 后更新为 `showcase_status: verified`、`quality_score: 96`。
- 完整 verdict 见 `review.md`。
