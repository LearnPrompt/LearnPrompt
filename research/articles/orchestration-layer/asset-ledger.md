# Asset ledger

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| `/images/articles/orchestration-layer/orchestration-state-machine-and-roles.svg` | 解释编排层机制与角色分工：左侧把一次任务画成状态机 INSPECT→IMPLEMENT→VERIFY，并标注 ROUTE 读判定后的三条分支——PASS→STOP_DONE、FAIL 且预算未尽→回 IMPLEMENT 带反馈重试、FAIL 且预算用尽→ESCALATE 升级给人，同时展示 retry_budget 为整数硬上限与“先简单后复杂”；右侧比较 worker（执行）、evaluator（独立判定）、orchestrator（控制流）三个角色如何分工，说明做事的和判分的不能是同一个角色，帮助读者据此审计自己的编排 | 依据本文 `vertical-research.md` 机制层与 `showcase/state-machine/result.txt` 的真实运行原创绘制；停止/升级/8 次上限取自 `evidence-ledger.md` 中 Claude Code Best practices 与 harness-design 的一手条目 | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 根据本文教学框架原创绘制 SVG；未复制任何外部视觉资产 | 2026-07-11 |

## 说明

- 本文只渲染这一张本地教学图，为原创 SVG，可再分发条款采用 LearnPrompt 仓库的 CC BY-NC-SA 4.0。
- 图中具体状态转换（INSPECT/IMPLEMENT/VERIFY/ROUTE、STOP_DONE、ESCALATE、retry_budget、handoff=human）全部来自 `showcase/state-machine/result.txt` 的真实运行，已在证据台账登记核验日期 2026-07-11。
- 停止条件“全部验收通过则收工”“sprint contract 事先约定 done”、升级线“Stop hook 连续 8 次阻塞”“同一问题纠正超过两次换策略”、角色线“分离做事与判分是强杠杆”，均由 Claude Code Best practices 与 harness-design 一手支撑；“连续失败/撞预算即升级”“编排七决定”标注为编辑综合。
- 未使用 harness-engineering 橙皮书或任何第三方图片：该橙皮书未发布标准开源许可、再分发权不清楚，因此不复制、不改编，仅在底部作为二手主题地图链接并署名。
