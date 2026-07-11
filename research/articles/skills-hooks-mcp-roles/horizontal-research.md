# 横向研究 — skills-hooks-mcp-roles

## 一手来源

### 1. Claude Code 官方文档 — Skills
- URL: https://code.claude.com/docs/en/skills
- 核对日期: 2026-07-11, Claude Code 2.1.206
- 支撑内容:
  - Skill 的正文按需加载（body loads only when it's used），不占用闲置上下文。
  - SKILL.md 由 YAML frontmatter 和 Markdown 正文组成；frontmatter 字段均可选，`description` 为官方建议填写的匹配信号，`when_to_use` 可补充使用场景，`name` 通常只是展示名。
  - 存放位置: `~/.claude/skills/`（个人）、`.claude/skills/`（项目）、plugin（插件）。
  - 用户可直接 `/skill-name` 调用，也可让 Claude 根据 `description` / `when_to_use` 判断是否加载。
  - 支持动态上下文注入（`!` 前缀命令）。
- 不能证明: Skill 正文如何影响模型内部路由决策的具体权重。

### 2. Claude Code 官方文档 — Hooks
- URL: https://code.claude.com/docs/en/hooks
- 核对日期: 2026-07-11
- 支撑内容:
  - PreToolUse 在工具调用执行前触发，从 stdin 接收 JSON（含 tool_name、tool_input）。
  - hookSpecificOutput.permissionDecision 可选 allow / deny / ask / defer。
  - exit 0 + 无输出 = 不表态，交回正常权限流程；**静默退出不等于预先批准**。
  - exit 2 = 阻断错误，stderr 回传给模型。
- 不能证明: Hook 的执行超时阈值、并行调度细节。

### 3. Claude Code 官方文档 — MCP
- URL: https://code.claude.com/docs/en/mcp
- 核对日期: 2026-07-11
- 支撑内容:
  - MCP 连接 Claude Code 到外部工具、数据库和 API。
  - 传输方式: HTTP（推荐）、SSE（已废弃）、stdio、WebSocket。
  - 安装范围: local / project / user。
  - 安全警告: "Verify you trust each server before connecting it. Servers that fetch external content can expose you to prompt injection risk."
  - 项目范围的 .mcp.json 需要用户批准才能使用。
- 不能证明: MCP 中模型对 tool 输出的信任级别细节。

## 二手主题地图

### Claude Code 橙皮书
- URL: https://github.com/alchaincyf/claude-code-orange-book
- 许可: CC BY-NC-SA 4.0
- 用途: 提供了 Skill、Hook、MCP 分工的中文主题概览，影响了本文的话题选择。
- 限制: 橙皮书是主题地图，不是一手事实来源。所有产品行为均已用当前官方文档重新核对。

## 同类教程

未发现与本文完全重叠的高质量同类教程。官方文档分别讲解三个机制但未提供统一决策树；橙皮书有简要分工表但无 Showcase。
