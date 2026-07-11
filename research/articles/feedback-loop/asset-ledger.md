# Asset ledger

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| `/images/articles/feedback-loop/feedback-loop-and-signal-quality.svg` | 解释反馈层机制、信号质量与停止条件：左侧展示行动→观察信号→诊断→候选改动→重跑验收的一轮回路，并标注“全部通过则停止”“信号连续不变或撞预算则升级”两条分支；右侧比较模糊信号与可操作信号如何把同一次失败分别导向大改与收窄到小写化相关修复，帮助读者据此审计自己的反馈回路 | 依据本文 `vertical-research.md` 机制层与 `showcase/feedback-signal/result.txt` 的真实运行原创绘制；停止/升级两条线取自 `evidence-ledger.md` 中 Claude Code Best practices 的一手条目 | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 根据本文教学框架原创绘制 SVG；未复制任何外部视觉资产 | 2026-07-11 |

## 说明

- 本文只渲染这一张本地教学图，为原创 SVG，可再分发条款采用 LearnPrompt 仓库的 CC BY-NC-SA 4.0。
- 图中具体信号（`FAIL: 构建未通过`、`repo/test/slugify.test.mjs:5`、expected `hello-world` / actual `Hello-World`、本文选择的 trim 后加 toLowerCase 候选修复）全部来自 `showcase/feedback-signal/result.txt` 的真实运行，已在证据台账登记核验日期 2026-07-11。
- 停止条件“全部验收通过则收工”“连续 8 次阻塞”“同一问题纠正超过两次换策略”由 Claude Code Best practices 一手支撑；“信号连续不变即升级”标注为编辑综合。
- 未使用 harness-engineering 橙皮书或任何第三方图片：该橙皮书未发布标准开源许可、再分发权不清楚，因此不复制、不改编，仅在底部作为二手主题地图链接。
