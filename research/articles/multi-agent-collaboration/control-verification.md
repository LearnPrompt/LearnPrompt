# 控制与核验记录

核验日期：2026-07-11。

## 一手事实

- 官方 `code.claude.com/docs/en/sub-agents` 实时页面：subagent「runs in its own context window with a
  custom system prompt, specific tool access, and independent permissions」，且「works within a single
  session」，只把总结/结果回报主会话。
- 官方 `code.claude.com/docs/en/agent-teams`（页面自述 as of v2.1.178）：Agent teams「are experimental and
  disabled by default」，需设置 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`；「Each teammate is a full,
  independent Claude Code session」，共享任务列表并直接互发消息；「Two teammates editing the same file
  leads to overwrites.」
- 官方 `code.claude.com/docs/en/common-workflows`：「Each worktree is a separate checkout on its own
  branch.」subagent「reads files in its own context window and reports a summary.」
- 官方 `code.claude.com/docs/en/best-practices`：Writer/Reviewer 模式，「A fresh context improves code
  review since Claude won't be biased toward code it just wrote.」

## Showcase 控制复现

- `node run-independent-workers.mjs`：并行启动两个独立 Node 子进程，每个进程只在不同临时目录写自己的 owned file、自测通过；协调器从两份临时产物完成集成 → PASS，退出码 0。冻结结果见 `worker-a-result.txt`、`worker-b-result.txt`、`independent-workers-result.txt`。
- `node merge-gate.mjs task-a task-b`：write set 不重叠、contract 校验和一致、接口冻结、依赖满足 → APPROVE，退出码 0。
- `node e2e-test.mjs`：CSV→parser→renderer 管线输出与冻结 golden 逐字节一致 → PASS，退出码 0。
- `node merge-gate.mjs task-a task-c-bad-contract`：任务声明修改冻结 contract 且 write set 重叠 → REJECT，退出码 3。
- `node merge-gate.mjs task-a task-d-renderer-unfrozen`：接口未冻结 + 依赖未满足 → SEQUENTIAL，退出码 4。
- 门禁与端到端脚本均为确定性、零依赖，不运行任何模型，也不运行 Agent Team。
- 本机未开启 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`，未真实运行 Agent Team，也未伪造其运行记录；
  两个 worker 由两个独立本地进程（各只被授予一个文件所有权）扮演，只验证协调与合并门禁骨架。
- 原始输出先写在工作树外的 `$TMPDIR`，进程结束并完成脱敏检查后才冻结进研究包 results/。

## 发布前机械门禁

- 单篇 validator：`PASS article`、`PASS research`、`PASS status: partial`；冻结命令与关键输出见 `release-gate-result.txt`。
- 独立 worker 集成与三个门禁分支：退出码 0 / 0 / 3 / 4，与冻结结果一致。
- `npm --prefix starlight run build`：49 页构建成功；冻结摘录见 `release-gate-result.txt`。
- `git diff --check` 与 `git add -A && git diff --cached --check`：均通过。
- 当前仍等待独立只读 reviewer；writer 未自评、未写质量分或 PASS，`showcase_status` 保持 partial。
