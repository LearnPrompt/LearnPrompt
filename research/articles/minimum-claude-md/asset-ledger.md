# Asset ledger

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| `/images/articles/minimum-claude-md/claude-md-scope-and-distillation.svg` | 展示 CLAUDE.md 的四个加载作用域与加载顺序，并说明「项目事实→具体规则（五类）→可执行验收」的蒸馏管线，同时用虚线标注 context 与 enforcement 的边界，帮助读者据此决定写什么、以及硬约束该放哪里 | 依据官方 memory 文档（作用域表、加载顺序、四跳与 200 行）与本文 Showcase 的 fail→pass 实测原创绘制；事实边界见 `evidence-ledger.md` | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 根据本文教学框架原创绘制 SVG；未复制任何外部视觉资产 | 2026-07-11 |

## 说明

- 本文只渲染这一张本地教学图，为原创 SVG，可再分发条款采用 LearnPrompt 仓库的 CC BY-NC-SA 4.0。
- 图中事实（四作用域、加载顺序、单文件建议 < 200 行、context 非 enforced、五类必要信息、
  空泛→5 FAIL / 最小→5 PASS）均来自官方文档与本文 Showcase，已在证据台账登记核验日期 2026-07-11。
- 未使用 claude-code-orange-book 或任何第三方图片：橙皮书仅作中文主题地图，其截图不能证明现行产品行为，
  且 CC BY-NC-SA 4.0 的再分发需保留署名，本文不复制、不改编其视觉资产。
