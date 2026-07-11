# Asset ledger

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| `/images/articles/constraint-layer/soft-reminder-vs-hard-boundary.svg` | 解释软约束→硬边界与多层防线机制：上路展示同一禁止动作在只有 AGENTS.md 文字提醒时被放行（边界失效、不可验证），下路展示它依次经过路径/命令 deny 规则、执行前钩子（exit 2）、操作系统沙箱三层硬边界被拒绝，底部展示合法动作在同一套硬边界下照常通过，帮助读者据此判断一条约束落在文字还是强制上 | 依据本文 `vertical-research.md` 机制层与 `showcase/constraint-gate/result.txt` 的真实三段结果原创绘制；三层机制取自 `evidence-ledger.md` 对 Claude Code 权限/钩子与 Codex 沙箱一手文档的登记 | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 根据本文教学框架原创绘制 SVG；未复制任何外部视觉资产 | 2026-07-11 |

## 说明

- 本文只渲染这一张本地教学图，为原创 SVG，可再分发条款采用 LearnPrompt 仓库的 CC BY-NC-SA 4.0。
- 图中的具体元素（config/app.env 被 TAMPERED、2/5 allowed、exit 2、Operation not permitted、docs/notes.md 通过）全部来自 `showcase/constraint-gate/result.txt` 的真实运行，已在证据台账登记核验日期 2026-07-11。
- 图中把“执行前钩子 exit 2”标注为 Claude Code 机制、“read-only 沙箱”标注为 Codex 机制，二者分列不同层，避免把不同产品术语混成同一机制。
- 未使用 harness-engineering 橙皮书或任何第三方图片：该橙皮书未发布标准开源许可、再分发权不清楚，因此不复制、不改编，仅在底部作为二手主题地图链接。
