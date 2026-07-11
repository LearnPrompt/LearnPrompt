# Evidence ledger

| Claim ID | Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Claude Code worktree 会把并行 session 放进独立工作目录，隔离文件改动 | Claude 官方 worktrees 文档 | 官方文档 | 2026-07-12 | 高 | 证明机制，不证明本机 run 成功 |
| C2 | Claude 权限遵循 settings precedence，且 deny 先于 allow | Claude 官方 permissions 文档 | 官方文档 | 2026-07-12 | 高 | 不替代具体项目规则 |
| C3 | Claude subagent 有独立 context 与权限 | Claude 官方 sub-agents 文档 | 官方文档 | 2026-07-12 | 高 | 本篇没有实际启用 subagent |
| C4 | Codex 会按全局与项目链条发现 `AGENTS.md` | Codex `AGENTS.md` 文档 | 官方文档 | 2026-07-12 | 高 | 只说明指令发现，不说明工件级交接 |
| C5 | Codex review 可以在当前任务或 detached review task 中运行 | Codex code review 文档 | 官方文档 | 2026-07-12 | 高 | 不等于实现与评审默认隔离 |
| C6 | Codex worktree/Handoff 属于产品内 Git 工作流 | Codex worktrees 文档 | 官方文档 | 2026-07-12 | 高 | 本文 handoff contract 不是该 UI 的同义词 |
| C7 | 本机版本锚点为 `Claude Code 2.1.206`、`codex-cli 0.142.2`、`node 24.11.0`、`npm 11.6.1` | `showcase/handoff-degradation-lab/results/environment.txt` | 本机命令 | 2026-07-12 | 高 | 仅代表本机 |
| C8 | `handoff-degradation-lab` 的 baseline repo 与 codex worktree 可以从 fixture 重建 | `scripts/create-temp-repo.mjs`、`results/baseline-sha.txt` | 可重跑本地脚本 | 2026-07-12 | 中 | 需本地 git 与 node 可用 |
| C9 | 实际 Claude 探针没有拿到 model result，因此不能伪造 diagnosis receipt | `results/claude-health-summary.json` | 主会话脱敏 harness summary | 2026-07-12 | 高 | 不是完整 raw transcript |
| C10 | writer 内嵌 Codex preflight 在宿主 runtime 初始化阶段失败，没有模型完成或 fixture 改动 | `results/codex-nested-run-summary.json` | 真实本机 run 摘要 | 2026-07-12 | 高 | 只证明该嵌套环境不可用，不外推 Codex 产品稳定性 |
| C11 | 外层真实 `codex exec` 只改 `src/archiveIncident.js`，返回与 schema、baseline SHA、contract SHA 对齐的 completion receipt，测试 2/2 | `results/codex-live-run-summary.json`、`codex-completion-receipt.json`、`codex-good.patch`、`codex-live-test-output.txt` | 真实本机模型运行 + 确定性测试 | 2026-07-12 | 高 | 单个最小 fixture，不是模型能力基准 |
| C12 | `degraded_single_lane` replay 为 0；缺 Claude diagnosis 却声明双线完成、写集越界和 contract drift 分别为 30/31/32；privacy scan 为 0 | `results/replay-result.txt`、`results/gate-*.txt`、`results/privacy-scan.txt` | 确定性 gate 重放 | 2026-07-12 | 高 | 退出码是本文教学约定，不是产品标准 |
| C13 | 本篇原创 SVG 直接教授 healthy dual-track 与 degraded_single_lane 的分叉、receipt 与 gate | `/images/articles/codex-claude-code-dual-track/handoff-degradation-lab.svg`、`asset-ledger.md` | 原创教学图 | 2026-07-12 | 待定 | 待独立 reviewer 视觉评估 |
