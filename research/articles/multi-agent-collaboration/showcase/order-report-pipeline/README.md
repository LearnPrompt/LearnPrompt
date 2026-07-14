# Showcase：order-report-pipeline —— 任务图、文件所有权与合并门禁

这个 Showcase 用一个真实、零依赖的小仓库，演示「多 Agent 协作」里唯一能被机械验证的那部分：
先冻结接口、给每个 worker 分配不重叠的文件所有权，再用协调器的合并门禁在应用前挡住冲突，
最后用端到端测试证明合并后的结果。

它证明的是**流程结构**（任务图、write set 归属、merge gate 的退出码），
**不**证明 Claude 模型或 Agent Teams 产品本身的速度或质量。见文末「这不是什么」。

## 目录

```text
order-report-pipeline/
├── README.md                          # 本文件
├── contract/order-summary.schema.json # 冻结接口：parser 输出 = renderer 输入
├── src/parse-orders.mjs               # Worker A 独占：CSV → 汇总对象
├── src/render-summary.mjs             # Worker B 独占：汇总对象 → Markdown
├── fixtures/orders.csv                # 端到端输入
├── fixtures/expected-summary.md       # 冻结 golden 输出
├── tasks/task-a-parser.json           # 任务卡 A（write set 只含 parser）
├── tasks/task-b-renderer.json         # 任务卡 B（write set 只含 renderer）
├── tasks/task-c-bad-contract.json     # 负例一：声明修改冻结 contract
├── tasks/task-d-renderer-unfrozen.json# 负例二：接口未冻结 + 依赖未满足
├── workers/run-worker.mjs             # 单 worker 进程：只在隔离临时目录写一个 owned file
├── run-independent-workers.mjs        # 并行启动两个 worker，并用其临时产物做集成验收
├── merge-gate.mjs                     # 协调器合并门禁（确定性）
├── e2e-test.mjs                       # 合并后端到端验收
└── results/                           # 三条分支的冻结脱敏输出与退出码
```

## 复现步骤

前置：Node.js（脚本零外部依赖）。在本目录内运行：

```bash
# 正例：不重叠 write set → 门禁放行 → 端到端 PASS
node run-independent-workers.mjs                                          # 退出码 0
node merge-gate.mjs tasks/task-a-parser.json tasks/task-b-renderer.json   # 退出码 0
node e2e-test.mjs                                                          # 退出码 0

# 负例一：两个任务都动共享 contract → 合并前拒绝
node merge-gate.mjs tasks/task-a-parser.json tasks/task-c-bad-contract.json  # 退出码 3

# 负例二：接口未冻结/依赖未满足 → 判定 sequential
node merge-gate.mjs tasks/task-a-parser.json tasks/task-d-renderer-unfrozen.json  # 退出码 4
```

三条分支 2026-07-11 的实际输出与退出码保存在 `results/`。

`run-independent-workers.mjs` 不是把任务卡当成 worker 证据。它用 `Promise.all` 同时启动两个独立
Node 子进程，为每个进程创建不同的系统临时输出目录。每个 worker 先核对冻结 contract 校验和，
只写自己的一个 owned file，跑自己的 self-test，再报告输出文件列表和 SHA-256。协调器随后从这两个
临时目录加载产物做端到端验收，而不是直接导入仓库里预写好的 `src/` 终态。进程退出后临时目录被清理，
脱敏摘要冻结在 `results/worker-a-result.txt`、`worker-b-result.txt` 与
`independent-workers-result.txt`。

## 合并门禁的四条判据

`merge-gate.mjs` 不调用任何模型，只做机械检查：

1. **write set 两两不重叠**：没有两个任务改同一个文件，否则退出码 3。
2. **不触碰冻结 contract**：任一任务把 contract 列进 write set 即退出码 3。
3. **contract 校验和一致**：每个任务卡声明的 `contract_checksum` 必须等于磁盘上 contract 的实际 SHA-256。
4. **规划闸门**：任一任务 `interface_frozen=false` 或依赖未满足 → 判定 sequential，退出码 4，不假装能并行。

## 这是什么，不是什么

- 这是**独立 worker 产物 + 任务图 + 合并门禁的确定性演示**：它证明两个隔离进程只写各自 owned file，协调器确实用它们的临时产物完成集成，write set 与冻结 contract 也能机械把关。
- 这**不是**模型能力实验：脚本不运行 Claude，也不运行 Agent Team，因此不能证明多 Agent 更快或更好。
- 真实的 Agent Team 需要设置 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 且当前为 experimental；
  本 Showcase 未依赖其可用性，也**没有伪造** Agent Team 运行记录。两个 worker 由两个独立本地进程
  （分别只被授予一个文件的所有权）扮演，用于隔离出「协调」这一层可验证的骨架。

## 局限

- 校验和与 write set 检查是把关下限：它挡得住「谁改了不该改的文件」，
  挡不住「改对了文件但逻辑写错」——那要靠 `e2e-test.mjs` 这类合并后验收。
- fixture 很小，端到端只覆盖一条 happy path；真实项目需要更多用例。
- 退出码语义（0/3/4）是本 Showcase 的约定，不是行业标准。
