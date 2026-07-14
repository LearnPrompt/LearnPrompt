# Asset ledger

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| `/images/articles/skills-hooks-mcp-roles/mechanism-decision-tree.svg` | 用决策树演示"需求属于哪一类 → Skill / Hook / MCP"的判定顺序：先问外部系统/数据（MCP）、再问事件时点保证（Hook）、再问重复工作流（Skill），底部另外拆解合法组合与误用红线，说明三种机制边界独立 | 依据本文 `vertical-research.md` 的机制与失败模式、`evidence-ledger.md` 第 1–20 条、以及 `showcase/release-workbench` 的机制闸门结果原创绘制 | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 原创 SVG；未复制第三方截图或产品视觉；箭头/判定框为手绘布局 | 2026-07-11 |

## 说明

- 本文只使用这一张本地原创图。它不是三列名词表，而是决策树 + 边界拆解：上半部回答"从问题出发该选哪个机制"，下半部回答"组合时守什么边界、误用会踩哪条红线"。
- 图中每条误用红线都对应 Showcase 里的机械反例或退出码证据（见 `evidence-ledger.md` 第 17–20 条）。
- 未使用橙皮书截图或 Claude Code 产品截图。旧截图不能证明当前行为，第三方截图的再分发边界也不如原创图清晰。
