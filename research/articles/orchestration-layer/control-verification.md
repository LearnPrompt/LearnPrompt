# Control verification

核验日期：2026-07-11。以下由 writer 之外的控制面在独立复核阶段执行；原始输出保存在仓库外的临时目录，本文件只保留无本地路径的最小结论。

## Showcase 复现

控制面将 `showcase/state-machine/` 复制到新临时目录后运行 `node run.mjs` 复现：

- 场景 A（`retry_budget=2`）：第一版候选 VERIFY 失败（expected=hello-world / actual=Hello-World），被路由回 IMPLEMENT；第二版候选 VERIFY 三条全过，走 STOP_DONE，退出码 0；用掉 1 次重试。
- 场景 B（`retry_budget=1`，worker 卡住）：两版候选都失败，第二次失败时预算已用尽，走 ESCALATE、handoff=human，退出码 1。
- `run.mjs` 整体退出码 EXIT=2（有场景升级即判需人接手）。
- worker 为确定性桩、非在线模型；两个场景跑同一台 orchestrator、同一份 acceptance，只换候选与预算，因此不构成任何模型排名。

## 内容与构建门禁（writer 阶段自检，待独立 reviewer 复核）

- partial validator（`showcase_status: partial`）：PASS。
- Starlight 完整构建：PASS，49 页生成，目标路由 `/agent-engineering/orchestration-layer/` 已产出。
- 正文字符与去代码中文字符达标，H2 ≥ 6（具体数值以最终 reviewer 复核为准）。

这些记录不代替独立 reviewer 的事实判断和最终评分。writer 阶段保持 `showcase_status: partial`，未写 `quality_score`，未写 PASS。
