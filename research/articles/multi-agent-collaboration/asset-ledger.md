# Asset ledger

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| `/images/articles/multi-agent-collaboration/merge-gate-flow.svg` | 展示「冻结 contract → 两个不重叠 Worker → write-set/校验和/端到端 merge gate」的完整流程，并在底部标注冲突路径被拒绝（exit 3），帮助读者理解合并门禁的判据与正负路径分叉 | 依据官方 agent-teams 文档（同文件覆盖警告、不重叠文件所有权）与本文 Showcase（merge-gate.mjs 的四条判据与退出码）原创绘制；事实边界见 `evidence-ledger.md` | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 根据本文教学框架原创绘制 SVG；未复制任何外部视觉资产 | 2026-07-11 |

## 说明

- 本文只渲染这一张本地教学图，为原创 SVG，可再分发条款采用 LearnPrompt 仓库的 CC BY-NC-SA 4.0。
- 图中事实（冻结 contract、write set 不重叠、校验和比对、退出码 0/3）均来自官方文档与本文 Showcase，
  已在证据台账登记核验日期 2026-07-11。
- 未使用 claude-code-orange-book 或任何第三方图片：橙皮书仅作中文主题地图，
  其截图不能证明现行产品行为，且 CC BY-NC-SA 4.0 的再分发需保留署名，本文不复制、不改编其视觉资产。
