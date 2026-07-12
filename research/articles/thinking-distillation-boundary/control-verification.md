# Control Verification

核验日期：2026-07-12。以下记录只保留本篇真实边界与控制结果。

## 文章边界

- 只改 `starlight/src/content/docs/agent-skills/thinking-distillation-boundary.mdx`、`research/articles/thinking-distillation-boundary/` 与 `starlight/public/images/articles/thinking-distillation-boundary/`。
- 不把“思维蒸馏型”写成官方 Skill 术语。
- 不处理真实用户聊天、真实 transcript、真实 credential 或隐藏 chain-of-thought。
- writer 阶段 frontmatter 固定为 `showcase_status: partial`；`review.md` 保持 `PENDING`。

## Showcase contract

- Showcase：`observable-receipt-distiller`
- 环境：隔离 temp Git repo
- 训练数据：3 份完全合成 frontmatter 修复 receipts
- 候选产物：`.agents/skills/frontmatter-repair/`
- 留出集：4 个 fixtures，覆盖 missing title、missing description、invalid sidebar order、already-valid no-op
- LearnPrompt exit codes：`0 / 51 / 52 / 53 / 54`；privacy scan `0`

## 已验证事实

- offline replay：PASS。`normal 0 / evidence-poor 51 / sensitive 52 / transcript 53 / holdout-fail 54 / privacy 0` 全部冻结在 `showcase/observable-receipt-distiller/results/`。
- normal 场景：candidate 已生成到 `results/frozen-candidate/`，holdout `4/4`，source receipts unchanged，fixture `npm test` 通过。
- holdout-fail 场景：故意替换 broken helper 后退化为 `1/4`，证明 evaluator 真实在工作。
- privacy scan：PASS，未冻结 runtime ID、绝对本机路径或 credential-shaped 值。

## writer-side blocked 与外层 live success

- 命令固定为 `CODEX_NESTED_MODEL=gpt-5.5 node research/articles/thinking-distillation-boundary/showcase/observable-receipt-distiller/scripts/run-codex-live.mjs`
- 真实结果：`blocked`
  - `codex exec` 退出码：`1`
  - `blocker_reason`：stderr 末尾为 repeated `stream disconnected` retries
  - `candidate_written`: `false`
  - `source_receipts_unchanged`: `true`
  - `changed_files`: `[]`
  - `npm test`：exit `1`，因为 candidate 未生成
- writer 结论：当前 writer 宿主没有拿到可用 live candidate；该 blocked 事实保留。
- 外层补跑：同一冻结 fixture / prompt / schema 下，`gpt-5.5` 显式调用退出 `0`，candidate 真实生成，source receipts unchanged，holdout `4/4`，`npm test` 退出 `0`。
- 外层 changed files：只包含 `.agents/skills/frontmatter-repair/` 与 `reports/`；未修改 receipts。
- 结论：执行面 blocked 与 contract success 分层记录；candidate 仍需人工批准。

## 当前状态

- frontmatter：`showcase_status: verified`
- `quality_score`：99
- `review.md`：PASS，blocker / major / minor = 0 / 0 / 0
- 视觉评估：PASS
- 真实 live success：完成

## Final gate commands

- `node research/articles/thinking-distillation-boundary/showcase/observable-receipt-distiller/scripts/verify-showcase.mjs` → exit `0`
- `node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs --article starlight/src/content/docs/agent-skills/thinking-distillation-boundary.mdx --research research/articles/thinking-distillation-boundary` → exit `0`
- `npm --prefix starlight run build` → exit `0`
- `git diff --check` → exit `0`
- 逐条 stdout / scenario 结果冻结于 `research/articles/thinking-distillation-boundary/release-gate-result.txt`
