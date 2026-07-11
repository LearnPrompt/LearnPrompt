# Showcase：handoff-degradation-lab

验证日期：2026-07-12。环境证据分三层保存：

1. 官方一手文档：解释 worktree、permissions、sessions、review、`AGENTS.md` 与 prompting 的当前机制。
2. 主会话捕获的 Claude 健康检查脱敏 summary：证明这台机器在 2026-07-12 的两次 Claude 探针都没有拿到 model result。
3. writer 本轮构建的 Node fixture、Codex 实现 lane、integrator gate 与离线 replay：证明双线流程怎样在健康/降级之间切换。

## 这次 Showcase 验证什么

- 一个最小 incident 归档 bug 能否被写成可交接的双线 contract。
- Claude lane 是否先经过 health check，且健康时只读产出 diagnosis receipt。
- Codex lane 是否能在隔离临时 Git worktree 接收冻结 contract，实施最小 patch，并交出结构化 receipt。
- integrator gate 是否会在 `degraded_single_lane` 下放行，在“缺 Claude completion receipt 却声称 dual_track_complete”或“写集越界 / contract drift”时稳定拒绝。

## 这次 Showcase 不验证什么

- 不比较 Claude 与 Codex 的模型能力或成功率。
- 不把 ChatGPT desktop 的 Handoff UI 直接复刻成本篇 contract。
- 不把一次 Claude 503 探针写成“产品不稳定”的结论。

## 目录

- `handoff-degradation-lab/fixture/`：最小 Git fixture，只含 bug 文件、测试、README 和局部 `AGENTS.md`。
- `handoff-degradation-lab/contracts/`：冻结 contract 与 Codex 输出 schema。
- `handoff-degradation-lab/prompts/`：live lane 使用的最小 prompt。
- `handoff-degradation-lab/scripts/`：临时 repo 创建、integrator gate、privacy scan 与离线 replay。
- `handoff-degradation-lab/results/`：本轮真实或脱敏后的最小公开工件。

## 离线重跑

从仓库根执行：

```bash
node research/articles/codex-claude-code-dual-track/showcase/handoff-degradation-lab/scripts/verify-showcase.mjs
```

实际冻结结果：

- `degraded_single_lane` gate：exit `0`
- `invalid-dual-track`：exit `30`
- `bad-write-set`：exit `31`
- `contract-drift`：exit `32`
- privacy scan：PASS

writer 内嵌 Codex preflight 曾在宿主 runtime 初始化阶段失败；主控随后在外层隔离 worktree 完成真实 `codex exec`。最终只改 `src/archiveIncident.js`，`npm test` 为 2/2，通过 `degraded_single_lane` gate。缺 Claude diagnosis 却声明双线完成、写集越界和 contract drift 三条负例分别以 30/31/32 退出；privacy scan PASS。文章仍保持 partial，只因为独立终审尚未完成。
