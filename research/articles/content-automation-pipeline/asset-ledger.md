# Asset ledger

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| `/images/articles/content-automation-pipeline/pipeline-state-gates.svg` | 解释双来源周报从 `snapshot` 到 `approve` 的七阶段状态推进；同时展示 `missing-source-field`、`verify-failed`、`no-approval` 三条失败分支为何分别停在 `normalize`、`verify` 与 `approve`，以及哪些工件构成可追溯证据链 | 依据本文 `vertical-research.md` 的状态分层、`evidence-ledger.md` 第 1–17 条，以及 `showcase/weekly-brief-pipeline/results/` 内 success / missing-source-field / verify-failed / no-approval 四组 manifest、`run-result.txt` 与 command-summary 原创绘制 | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 原创 SVG；未复制第三方截图或产品视觉；重排为七阶段主路径与三条失败卡片，并以 `pipeline-state-gates-visual-check.png` 做 1280x860 实际渲染复检 | 2026-07-11 |

## 说明

- 本文只使用这一张本地原创图。
- 图中退出码、状态名与工件路径均对应 Showcase 的真实输出。
- `research/articles/content-automation-pipeline/visual-check.txt` 记录了 PNG 渲染与人工复检结论。
- 未使用橙皮书截图或 Claude Code 产品截图，因为旧截图不能证明当前行为，而本文需要强调的是状态机与证据链，而不是 UI 形态。
