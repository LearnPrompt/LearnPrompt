# Showcase README — release-workbench

本 Showcase 证明的是**机制选择**，不是模型能力排名，也不是完整 MCP 实现。

围绕一个真实任务展开：**从一个 issue（`LP-42`）和一段 diff 生成结构化发布摘要**。同一个任务，用三种机制分别演示它们各自负责的问题，并给出一个被设计闸门拒绝的错误包装反例。

## 四个证明

| 编号 | 机制 | 证明 | 冻结结果 | 退出码 |
| --- | --- | --- | --- | --- |
| A | Skill | `SKILL.md` 固化 5 步可复用流程，机械契约检查通过 | `results/release-gate.txt` | 0 |
| B1 | Hook | PreToolUse 从 stdin 读 JSON，对 `git push` 返回 `permissionDecision: deny` | `results/hook-git-push.txt` | 0 |
| B2 | Hook | 对安全命令 `npm test` 静默退出、不作决定（交回正常权限流程） | `results/hook-npm-test.txt` | 0 |
| C | MCP | 独立 client 子进程通过 stdin/stdout 从 stdio server 取回 `LP-42` | `results/mcp-harness.txt` | 0 |
| D | 反例 | 把纯本地固定流程声明成 MCP，被机制闸门 `REJECT` | `results/mechanism-gate.txt` | 3（预期拒绝） |

## 目录

```text
release-workbench/
├── skills/release-brief/SKILL.md        # 固化的可复用工作流 + 输出契约
├── hooks/pre-tool-use.mjs               # PreToolUse hook：deny git push / 静默 npm test
├── mcp/issue-server.mjs                 # 最小 stdio JSON-RPC issue 服务器
├── mcp/client-harness.mjs               # 独立 client：真实子进程 stdin/stdout 通信
├── fixtures/                            # issue、hook 事件、机制 spec、发布摘要
├── scripts/check-skill-contract.mjs     # 机械契约检查
├── scripts/mechanism-gate.mjs           # 机制选择闸门（含反例红线）
├── scripts/release-gate.mjs             # 总验证器，一次跑完 A/B/C/D
└── results/                             # 冻结、脱敏的实际输出与退出码
```

## 复现命令

在仓库根目录执行：

```bash
node research/articles/skills-hooks-mcp-roles/showcase/release-workbench/scripts/release-gate.mjs
```

单独复现某一项：

```bash
node .../hooks/pre-tool-use.mjs < .../fixtures/hook-events/git-push.json   # deny
node .../hooks/pre-tool-use.mjs < .../fixtures/hook-events/npm-test.json   # 静默 exit 0
node .../mcp/client-harness.mjs                                             # 取回 LP-42
node .../scripts/mechanism-gate.mjs .../fixtures/mechanism-specs/local-flow-as-mcp.json  # REJECT
```

## 边界与限制

- **不是完整 MCP 实现**：`issue-server.mjs` 只实现演示所需的最小 JSON-RPC 方法
  （initialize / tools/list / tools/call / resources/list / resources/read），
  用来说明“MCP = Agent 跨一个进程边界访问外部系统/数据”。它不使用官方 SDK，
  **只验证本文最小 JSON-RPC 边界，不宣称完整 MCP conformance，也不代表 Claude Code 在线集成行为**。
- **Hook 静默 != 预先批准**：`npm test` 时 hook 不输出决定，只是把决定权交回 Claude Code
  正常权限流程；它没有“批准”这次调用。
- **deterministic 工程示范**：这里证明的是机制边界与证据，不是让某个模型在线实跑发布摘要。
- 结果文件只保留相对路径与退出码，不含本机绝对路径或运行标识。
