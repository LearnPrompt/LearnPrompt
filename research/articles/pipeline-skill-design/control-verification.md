# Control Verification

核验日期：2026-07-12。以下记录真实机械门禁、独立评审和边界。

## 文章边界

- 只改 `pipeline-skill-design.mdx`、本篇 `research/articles/pipeline-skill-design/` 与 `starlight/public/images/articles/pipeline-skill-design/`。
- 不重复 `content-automation-pipeline` 的周报生产/人工发布边界。
- 不重复 `first-skill-md` 的字段教程。
- `checkpoint`、`receipt`、`resume`、`invalidation`、`idempotency` 都作为 LearnPrompt 操作模型书写，不冒充官方 Skill 规范。

## Showcase contract

- Showcase 名称：`docs-migration-pipeline`
- 目标：把 3 个 legacy Markdown 文档迁移成 Starlight-compatible docs candidate
- 环境：隔离临时 Git repo
- 保证：只生成 candidate，不覆盖 source，不发布
- Skill 目录：`.agents/skills/docs-migration-pipeline/`
- 五阶段：`inventory -> normalize -> transform -> validate -> package-candidate`

## Showcase 事实

- 冻结 Showcase：`showcase/docs-migration-pipeline/`
- offline replay：fresh success `0`、crash-after-transform `30`、resume `0`、stale resume `32`、receipt issue `33`、rerun stability `0`、privacy `0`
- `resume-summary.json` 中 `reused_stages` 为 `inventory, normalize, transform`，证明 resume 真复用了 checkpoint
- `rerun-stability.txt` 中两次 full rerun 的 `candidate_sha` 一致
- fixture `npm test`：`1/1` 通过
- writer 隔离层首次真实 Codex 显式 `$docs-migration-pipeline` 调用被阻断：`codex exec` exit `1`，原因是 state DB 只读与 in-process app-server 权限限制；失败证据保留。
- 外层主控把 schema 已有的 `notes` 属性补入 `required` 后，用同一冻结 fixture / prompt / schema 与 gpt-5.5 补跑成功：
  - `exec_exit_code=0`，crash `30`，resume `0`，verify `0`
  - source unchanged，candidate hash 为 `cdc8bf70d44838e2239ff00052b092cb0ce7d198b77ec5b581e17f799e8dc892`
  - 写入 `migration-candidate/`、`receipts/`、`reports/` 与 `work/`；模型没有隐瞒 checkpoint / intermediate 文件

## Writer 与终审门禁

- offline replay：PASS，exit `0`
- live Codex explicit Skill call：PASS，`codex exec` exit `0`
- privacy scan：PASS，exit `0`
- writer-stage partial validator：PASS，exit `0`
- fixture `npm test`：PASS，exit `0`
- Starlight build：PASS，49 pages，exit `0`
- `git diff --check`：PASS，exit `0`
- SVG 已实际渲染并人工检查：PASS；invalidation 文本与 resume 说明经重排后无溢出、裁切或重叠。

## 当前状态

- 独立只读 reviewer：PASS 98/100，blocker 0 / major 0 / minor 0，视觉 PASS。
- frontmatter：`showcase_status: verified`
- `quality_score`：98
- `review.md`：PASS
- verified validator：PASS，exit `0`
