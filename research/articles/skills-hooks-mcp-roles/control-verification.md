# 控制与验证记录 — skills-hooks-mcp-roles

## 产品事实不混淆

- Skill / Hook / MCP 三个机制的行为分别引自各自的当前官方文档页，未跨机制混用事实。
- Hook 的"静默退出不等于预先批准"直接引自官方 hooks 文档原句，未自行推断。
- MCP 的信任与 prompt injection 风险引自官方 mcp 文档 Warning 原句。

## 一手与二手分层

- 一手：官方 code.claude.com/docs 的 skills、hooks、mcp、features-overview 页，及本机 `claude --version` / `claude mcp --help`。
- 二手：Claude Code 橙皮书，仅作中文主题地图，标注 CC BY-NC-SA 4.0，不作为事实权威。

## Showcase 边界声明

- MCP server/harness 未使用官方 SDK，正文与 README 均声明"只验证本文最小 JSON-RPC 边界，不宣称完整 MCP conformance 或 Claude Code 在线集成"。
- Hook 用 fixture JSON 通过真实子进程 stdin 输入触发，非 Claude Code 在线事件。
- 机制闸门是本文教学模型，非官方工具；反例证明的是设计取舍，非产品行为。

## 脱敏检查

- 原始运行日志先写入工作树外的系统临时目录（`$TMPDIR` 下），检查后仅把脱敏结论冻结进仓库。
- 冻结结果只含相对路径与退出码，`grep` 扫描确认不含用户主目录、系统临时目录、worktree 临时目录等本机绝对路径类别。
- fixture 中的 hook 事件 JSON 不含真实 session/thread/request id。
- validator 的 RESEARCH_PRIVACY_RULES 扫描研究包通过。

## 门禁

- Showcase：release-gate.mjs 6/6，MASTER exit=0。
- partial validator：见 `release-gate-result.txt`。
- Starlight build：49 页，exit 0。
- git diff --check：无输出，exit 0。
