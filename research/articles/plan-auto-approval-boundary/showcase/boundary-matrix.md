# 两套术语，不要混用：Claude Code 与 Codex 的权限原语

验证日期：2026-07-11。来源：本机 Claude Code 2.1.206、Codex CLI 0.142.2 的 `--help`，以及官方文档（见 evidence-ledger.md）。

三档风险边界（只读计划 / 普通自动执行 / 需要人工批准的高风险动作）是与工具无关的判断框架。但两个产品用不同的原语实现它，术语不能互相翻译。

## Claude Code：权限模式 + 权限规则（进程强制）

Claude Code 有两条轴：

1. 权限模式（permission mode）：`default`（CLI 里标为 Manual）、`plan`、`acceptEdits`、`auto`、`dontAsk`、`bypassPermissions`。
   - `plan`：只读文件、只跑只读命令来探索，不改源文件。
   - `acceptEdits`：自动接受文件编辑与 mkdir/touch/mv/cp 等常见文件命令（限工作目录内）。
2. 权限规则（permission rule）：`allow` / `ask` / `deny`，按 deny → ask → allow 顺序求值，第一个命中的决定结果；规则特异性不改变顺序。任一层级的 deny 都压过 allow。
   - 官方明确：规则由 Claude Code 强制，不是模型强制。提示词或 CLAUDE.md 只影响模型想做什么，不改变 Claude Code 允许什么。

高风险动作示例（deny 规则）：`Bash(git push *)`。安全写入示例（allow 规则）：`Bash(npm run *)`、`Bash(git commit *)`。

另有一层可选的 OS 级 sandbox，只约束 Bash 及其子进程，与权限规则互补（defense-in-depth）。

## Codex：审批策略 + 沙箱模式（两条正交轴）

Codex 也有两条轴，但名字和语义都不同：

1. 审批策略（approval_policy / `--ask-for-approval`）——决定模型何时向人请求批准：
   - `untrusted`：只自动跑受信任命令（如 ls、cat、sed）；模型提出非受信命令就升级给用户。
   - `on-request`：由模型决定何时请求批准。
   - `never`：从不请求；执行失败直接返回给模型。
   - `on-failure`：已废弃。
2. 沙箱模式（sandbox_mode / `--sandbox`）——决定文件系统与网络的 OS 级边界：
   - `read-only` / `workspace-write` / `danger-full-access`。
   - workspace-write 下出站网络默认关闭（`sandbox_workspace_write.network_access` 默认 false）。

沙箱与审批策略是两条正交轴：前者决定命令运行后能碰到什么，后者决定运行前什么时候可能询问人。`on-request` 是否发起询问由模型判断，因此不能单独充当确定性的高风险人工门禁。

## 同一档风险，两套原语

| 风险档 | Claude Code | Codex |
| --- | --- | --- |
| 只读计划 | `plan` 模式 | `--sandbox read-only` |
| 普通自动执行 | `acceptEdits` + 针对 Edit/安全 Bash 的 allow 规则 | `--sandbox workspace-write`；审批策略另行选择 |
| 高风险人工批准 | `ask`/`deny` 规则（如 `Bash(git push *)`） | 无单一确定性开关：保持高风险能力关闭，停止任务并由人显式重新授权；`untrusted` 只作额外命令门禁 |

## 容易混淆但不同的两点

- Claude Code 的 plan 模式是 agent 行为模式（Claude Code 进程不让它写）；Codex 的 read-only 是内核沙箱。二者都表现为只读，但强制层不同：一个是应用层，一个是 OS 层。
- Claude Code 的 allow/ask/deny 是预先写好的规则；Codex 的 approval_policy 里 `on-request` 是让模型临场决定何时问人。前者是确定性规则，后者依赖模型判断。
