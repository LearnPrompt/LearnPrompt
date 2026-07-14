# Showcase：cloud-handoff-lab 的云端任务适配预演

验证日期：2026-07-11。环境证据分两层保存：

1. 官方一手文档：用来解释 Codex Cloud 的真实运行机制。
2. 本地 clean-room 预演：只证明 `codex-cloud-task-fit` 这类任务已经满足“可交给 Cloud”的前置条件，并且补丁能在干净临时 HOME、无 agent 网络、无 secret、无本机文件依赖的环境里复现。

## 这次 Showcase 验证什么

- 具体 bug：`timezone-rollup` 误按 UTC 自然日汇总，导致夜间事件落到错误日期。
- 具体问题：这个修复任务是否已经足够 repo-contained、deterministic、clean-checkout friendly，并且有明确 acceptance command，可以交给 Codex Cloud。
- 具体证据：冻结 task contract、environment contract、`cloud-fit-gate`、good patch、负面场景退出码和 clean-room replay。

## 这次 Showcase 不验证什么

- 不创建真实 Codex Cloud task。
- 不打开 PR。
- 不把本地预演冒充成“Codex Cloud 已经替我跑完”。
- 不证明任意含时区逻辑的仓库都适合云端，只证明这个最小 fixture 已经具备 handoff 条件。

## 目录

- `cloud-handoff-lab/fixture/`：最小 Git fixture，只含一个 bug 文件、一组测试和局部 `AGENTS.md`。
- `cloud-handoff-lab/contracts/`：正向任务卡、负面任务卡和环境 contract。
- `cloud-handoff-lab/patches/good.patch`：唯一允许的修复补丁。
- `cloud-handoff-lab/results/`：冻结后的最小公开结果，不含真实临时路径或运行标识。
- `cloud-handoff-lab/scripts/`：`cloud-fit-gate`、clean-room replay 和 privacy scan。

## 重跑命令

从仓库根执行：

```bash
node research/articles/codex-cloud-task-fit/showcase/cloud-handoff-lab/scripts/verify-showcase.mjs
```

预期：

- 正向场景 gate：exit `0`
- 正向场景 clean-room replay：补丁仅修改 `src/rollupByReporterDay.js`，`npm test -- --test-reporter tap` 通过
- 负面 `~/Library/Keychains` 依赖：exit `21`
- 负面浏览器登录态依赖：exit `22`
- 负面缺验收命令：exit `23`
- 负面任务方向不明确：exit `24`
- privacy scan：PASS

脚本会把原始临时目录创建在系统 `TMPDIR` 下，但不会把任何真实临时路径冻结进仓库。
