# 纵向研究 — skills-hooks-mcp-roles

## 核心问题

三种扩展机制各自解决什么问题，边界在哪，误用时会怎样？

## 从表面行为到机制

### Skill

表面：把多步操作写进一个文件，Claude 就能"学会"这套流程。

机制：Skill 正文**按需加载**——只有被调用或 Claude 判断描述匹配时才注入上下文（官方文档原文 "a skill's body loads only when it's used"）。这和 CLAUDE.md 不同：CLAUDE.md 在每次会话开始时全量加载，长内容持续占据上下文窗口；Skill 把流程从"始终存在"变成"按需调用"，适合流程固化而非事实声明。

正文可包含 `!` 前缀的命令（dynamic context injection），Claude Code 在 Skill 加载时执行命令并替换为输出，让 Skill 拿到当前环境状态。

### Hook

表面：在某个动作发生前或发生后自动触发一段脚本。

机制：Hook 的核心是**事件时点保证**。PreToolUse 在工具调用执行前触发，脚本从 stdin 收到 JSON（含 `tool_name` 和 `tool_input`），可以：
- 返回 `permissionDecision: "deny"` 阻止这次调用；
- 返回 `permissionDecision: "allow"` 放行；
- 静默退出（exit 0，无 stdout）——交回正常权限流程，**不等于预先批准**。

Hook 不拥有上下文，不参与推理，不负责业务逻辑。它的价值在于比 CLAUDE.md 里的"请不要 push"多了一层机械保证。

### MCP

表面：让 Claude 能读写 Jira、数据库、Slack 等外部系统。

机制：MCP 在 Claude Code 和外部系统之间建立一个**跨进程通道**（stdio、HTTP、SSE、WebSocket）。它引入了三重边界：
1. 进程边界：MCP server 是独立进程，Claude 通过 JSON-RPC 调用。
2. 信任边界：用户必须信任每个 server，项目级 .mcp.json 需要批准。官方文档警告 "Servers that fetch external content can expose you to prompt injection risk"。
3. 凭据边界：server 可能持有 API key、OAuth token，这些凭据暴露在 server 进程内。

## 失败模式

| 误用 | 后果 | 根因 |
| --- | --- | --- |
| 所有流程都做成 MCP | 纯本地逻辑多了进程、信任、凭据三重边界，维护成本翻倍 | 没区分"需要外部数据"和"需要可复用流程" |
| 用 Hook 写业务逻辑 | Hook 没有模型上下文、无法推理、难调试 | 把"时点保证"当成了"任意编排" |
| Skill 写成 CLAUDE.md 的延伸 | 始终加载、上下文爆炸 | 没用到 Skill 的按需加载特性，应直接写 CLAUDE.md 或 rules |
| Hook 静默退出被误解为"已批准" | 安全隐患：以为拦截了危险操作实际并没有 | 忽略了"静默 ≠ 预先批准"的设计语义 |

## 权衡

- Skill 最轻：一个 Markdown 文件就能工作，但它只管流程，不能保证时点、不能连接外部系统。
- Hook 保证时点但牺牲灵活性：脚本只能看到事件 JSON，看不到会话上下文。
- MCP 最强但边界最多：每加一个 server 就多一个进程、一组凭据和一个 prompt injection 入口。

## 组合边界

三种机制可以组合，前提是各守各的边界：
- Skill 的某一步调用 MCP tool 取外部数据 → Skill 管流程，MCP 管数据通道。
- Hook 在 PreToolUse 阻止 MCP tool 调用 → Hook 管时点，MCP 管连接。
- Skill 流程结束后触发 Hook → Skill 管步骤，Hook 管保证。

不应组合的场景：
- Skill 流程里嵌入 Hook 逻辑（Hook 应声明在配置里，不应写在 Skill 正文中手动调用）。
- MCP server 里实现 Skill 的固定步骤（那是把流程逻辑放到了进程外，没有必要）。

## 编辑综合

三个问题的判定顺序是 LearnPrompt 编辑部的教学设计，不是官方分类或行业标准。官方文档分别讲解三个机制，没有提供统一决策树。本文的三问法来源于对官方文档的操作性综合：先排除最重的选项（MCP），再排除第二重的（Hook），最后落到最轻的（Skill）。
