# 证据台账 — skills-hooks-mcp-roles

来源核对日期统一为 2026-07-11，Claude Code 版本 2.1.206。

| # | 声明 | 证据 | 证据类型 | 验证日期 | 置信度 | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Skill 正文按需加载，闲置时几乎不占上下文 | 官方 skills 文档 "a skill's body loads only when it's used, so long reference material costs almost nothing until you need it" | 一手文档 | 2026-07-11 | 高 | 未量化 token 成本 |
| 2 | SKILL.md 由 YAML frontmatter + Markdown 正文组成；frontmatter 字段均可选，`description` 为建议字段，`name` 通常是展示名 | 官方 skills 文档 “Every skill needs a SKILL.md file with two parts…” 与 Frontmatter reference “All fields are optional. Only description is recommended” | 一手文档 | 2026-07-11 | 高 | plugin-root 的命令名规则例外，本文不展开 |
| 3 | 项目 Skill 存于 `.claude/skills/<name>/SKILL.md` | 官方 skills 文档 "Where skills live" 表格 | 一手文档 | 2026-07-11 | 高 | — |
| 4 | Skill 可 `/skill-name` 直接调用；Claude 自动匹配时使用 `description` / `when_to_use`，不是依赖 `name` 触发 | 官方 skills 文档 “Claude uses skills when relevant…” 与 frontmatter reference | 一手文档 | 2026-07-11 | 高 | 实际路由权重未公开 |
| 5 | 当 CLAUDE.md 里某段变成"流程"而非"事实"时，应改为 Skill | 官方 skills 文档 "when a section of CLAUDE.md has grown into a procedure rather than a fact" | 一手文档 | 2026-07-11 | 高 | — |
| 6 | PreToolUse 在工具执行前触发，可阻止调用 | 官方 hooks 文档 "Before a tool call executes. Can block it." | 一手文档 | 2026-07-11 | 高 | — |
| 7 | Hook 从 stdin 收 JSON，含 tool_name、tool_input | 官方 hooks 文档 JSON Input Example（tool_name: "Bash", tool_input.command） | 一手文档 | 2026-07-11 | 高 | — |
| 8 | permissionDecision 可为 allow/deny/ask/defer | 官方 hooks 文档 hookSpecificOutput 表格 | 一手文档 | 2026-07-11 | 高 | — |
| 9 | 静默退出（exit 0 无输出）不等于批准，交回正常权限流程 | 官方 hooks 文档 "The hook can deny the call, but staying silent doesn't approve it." | 一手文档 | 2026-07-11 | 高 | — |
| 10 | exit 2 阻断工具调用，stderr 回传给模型 | 官方 hooks 文档 exit code 表格 "Blocks the tool call" | 一手文档 | 2026-07-11 | 高 | — |
| 11 | MCP 连接外部工具、数据库、API | 官方 mcp 文档 "MCP servers give Claude Code access to your tools, databases, and APIs." | 一手文档 | 2026-07-11 | 高 | — |
| 12 | 当你在从别的工具往聊天里复制数据时，就该接 MCP | 官方 mcp 文档 "Connect a server when you find yourself copying data into chat from another tool" | 一手文档 | 2026-07-11 | 高 | — |
| 13 | stdio server 是本地进程，适合需要直接系统访问的场景 | 官方 mcp 文档 "Stdio servers run as local processes on your machine." | 一手文档 | 2026-07-11 | 高 | — |
| 14 | MCP 存在信任和 prompt injection 风险 | 官方 mcp 文档 "Verify you trust each server before connecting it. Servers that fetch external content can expose you to prompt injection risk." | 一手文档 | 2026-07-11 | 高 | — |
| 15 | MCP 有 local/project/user 三种范围，project 需批准 | 官方 mcp 文档 "MCP installation scopes" 表格 + "Claude Code prompts for approval before using project-scoped servers" | 一手文档 | 2026-07-11 | 高 | — |
| 16 | 本机 Claude Code 版本 2.1.206，`claude mcp add` 支持 stdio | `claude --version` 输出 2.1.206；`claude mcp --help` 显示 add 子命令 | 一手实跑 | 2026-07-11 | 高 | 本机单次核对 |
| 17 | release-workbench Skill 契约检查通过（重复流程 -> Skill） | showcase results/release-gate.txt [A] exit 0 | 一手实跑 | 2026-07-11 | 高 | deterministic 脚本，非在线模型跑 |
| 18 | Hook 对 git push 返回 deny，对 npm test 静默 | showcase results/hook-git-push.txt、hook-npm-test.txt | 一手实跑 | 2026-07-11 | 高 | 用 fixture JSON 模拟事件，非 Claude Code 在线触发 |
| 19 | MCP 子进程可取回 LP-42 外部 issue 数据 | showcase results/mcp-harness.txt exit 0 | 一手实跑 | 2026-07-11 | 高 | 仅最小 JSON-RPC 边界，非完整 MCP conformance |
| 20 | 纯本地固定流程包装成 MCP 被机制闸门 REJECT | showcase results/mechanism-gate.txt exit 3 | 一手实跑 | 2026-07-11 | 高 | 闸门是本文教学模型，非官方工具 |
