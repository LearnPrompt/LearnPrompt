# Asset ledger

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| `/images/articles/instruction-layer/instruction-map-and-conflict.svg` | 解释指令层机制与冲突解析：左侧展示目标/范围/顺序/验收/冲突优先级五个维度如何各自落到一个真实资源，右侧比较安全约束、显式任务指令、通用风格偏好三层的优先级阶梯，帮助读者据此把模糊指令改成可执行地图 | 依据本文 `vertical-research.md` 机制层与 `showcase/instruction-map/` 的真实结果原创绘制；五维度取自 `evidence-ledger.md` 对官方“具体、可验证”建议的操作化归纳 | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 根据本文教学框架原创绘制 SVG；未复制任何外部视觉资产 | 2026-07-11 |

## 说明

- 本文只渲染这一张本地教学图，为原创 SVG，可再分发条款采用 LearnPrompt 仓库的 CC BY-NC-SA 4.0。
- 图中的具体资源（formatDate 返回 YYYY-MM-DD、只改 src/format-date.mjs、node --test 全过、0/5 与 5/5、Sat, 11 Jul 2026 vs 2026-07-11）全部来自 `showcase/instruction-map/result.txt` 的真实运行，已在证据台账登记核验日期 2026-07-11。
- 优先级阶梯中“安全约束 > 显式任务指令 > 通用偏好”属编辑综合，其中“显式 prompt 覆盖一切”由 agents.md 一手支撑；图注与正文均标注为操作化归纳，不冒充官方术语。
- 未使用 harness-engineering 橙皮书或任何第三方图片：该橙皮书未发布标准开源许可、再分发权不清楚，因此不复制、不改编，仅在底部作为二手主题地图链接。
