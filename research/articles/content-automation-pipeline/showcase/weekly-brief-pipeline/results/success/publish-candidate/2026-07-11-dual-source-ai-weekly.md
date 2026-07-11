# 发布候选（本地）

approval_id: weekly-approval-2026-07-11
approved_by: human-editor
approved_at: 2026-07-11T10:30:00Z
状态：publish-candidate（仅本地候选，未外发）

# 双来源 AI 周报草稿（2026-07-11）

状态：draft
说明：本文件是离线回放生成的草稿，未外发，只有在 approve 阶段收到人工批准工件后才会进入本地 publish-candidate。

## 本周入选条目

### Claude Code hooks guide explains deterministic lifecycle automation
- source_url: https://code.claude.com/docs/en/hooks-guide
- 来源快照: Anthropic Docs Snapshot
- 发布时间: 2026-07-10
- 筛选理由: 命中核心 AI coding 工具主题；直接解释工作流、门禁或验证机制；来源是官方文档快照，适合做本周基线；人工重要度=3
- 摘要: Hooks run at lifecycle events and can deny, ask, or allow a tool call without pretending that silence equals approval.

### Claude Code permissions page clarifies deny ask allow precedence
- source_url: https://code.claude.com/docs/en/permissions
- 来源快照: Anthropic Docs Snapshot
- 发布时间: 2026-07-09
- 筛选理由: 命中核心 AI coding 工具主题；直接解释工作流、门禁或验证机制；来源是官方文档快照，适合做本周基线；人工重要度=3
- 摘要: Permission rules are enforced by Claude Code itself, and plan mode keeps edits off disk until approval.

### OpenAI documents Codex CLI local agent workflows
- source_url: https://developers.openai.com/codex/cli
- 来源快照: OpenAI AI Coding Snapshot
- 发布时间: 2026-07-10
- 筛选理由: 命中核心 AI coding 工具主题；直接解释工作流、门禁或验证机制；来源是官方文档快照，适合做本周基线；人工重要度=3
- 摘要: The Codex CLI docs focus on local execution, approvals, and terminal-first agent workflows.

### Common workflows page highlights worktrees plan mode and piping into scripts
- source_url: https://code.claude.com/docs/en/common-workflows
- 来源快照: Anthropic Docs Snapshot
- 发布时间: 2026-07-08
- 筛选理由: 命中核心 AI coding 工具主题；直接解释工作流、门禁或验证机制；来源是官方文档快照，适合做本周基线；人工重要度=2
- 摘要: The workflow guide recommends worktrees for isolated parallel sessions and plan mode for review before edits touch disk.

## 编辑提示

- 如果后续要接模型改写，只允许替换“摘要”文本，不允许绕过 source_url、筛选理由、verify 或 approve。
- publish-candidate 仍只是本地发布候选，不代表已发往外部平台。
