# handoff-degradation-lab

这个 lab 只回答一个问题：**当你保留 Claude Code 与 Codex 两条通道时，怎样用 Git 工件交接、怎样在一条 lane 故障时降级，而不是假装双线都完成了。**

目录分工：

- `fixture/`：baseline 仓库文件，离线可复现。
- `contracts/`：冻结 handoff contract 与 Codex 输出 schema。
- `prompts/`：健康 lane / 实现 lane 需要的最小提示。
- `scripts/create-temp-repo.mjs`：把 `fixture/` 复制到系统临时目录、初始化成 Git 仓库，并额外创建 `codex-lane` worktree。
- `scripts/integrator-gate.mjs`：零模型 gate；验证 baseline SHA、contract SHA、receipt 完整性、写集范围、patch 可应用与测试结果。
- `scripts/privacy-scan.mjs`：扫描 article research root，拒绝真实 UUID、绝对 HOME、绝对临时路径与绝对 shell 路径。
- `scripts/verify-showcase.mjs`：一键离线 replay degraded gate、三条负例与 privacy scan；不会再次调用模型。
- `results/`：真实运行后的最小脱敏工件，以及 replay 冻结结果。

从仓库根离线重放：

```bash
node research/articles/codex-claude-code-dual-track/showcase/handoff-degradation-lab/scripts/verify-showcase.mjs
```

单独创建隔离 baseline repo 与 codex worktree：

```bash
node research/articles/codex-claude-code-dual-track/showcase/handoff-degradation-lab/scripts/create-temp-repo.mjs
```

创建脚本的实际输出契约：

- 返回 JSON，包含 `repo_dir`、`worktree_dir` 与确定性的 `baseline_sha`
- 不调用模型
- 不写回 LearnPrompt 工作树

本次真实情况：

- `create-temp-repo.mjs` 已确认 baseline repo 与 codex worktree 可以创建。
- Claude lane 只有健康检查失败 summary，没有 diagnosis receipt。
- writer 内嵌 `codex exec` 因只读 state DB / app-server 初始化失败而未产出 completion receipt；该失败被保留为 preflight 证据。
- 主控外层随后完成真实 `codex exec`：只改 `src/archiveIncident.js`，`npm test` 为 2/2，结构化 receipt 与 patch 已冻结。
- 离线 replay 的正向 `degraded_single_lane` 为 0，三条负例为 30/31/32，privacy scan PASS。
- 文章仍是 `partial`，仅表示独立 reviewer 和最终发布门禁尚未完成。
