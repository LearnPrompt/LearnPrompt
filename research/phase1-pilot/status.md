# Phase 1 pilot status

更新时间：2026-07-11

## 当前状态

| 文章 | Lane | 状态 | Writer 工件 | 最终结果 |
| --- | --- | --- | --- | --- |
| `ai-coding/project-checklist.mdx` | A | blocked | 无 | Claude Code 在进入任务前连续遇到认证/网关错误，初次调用与两次自动重试均未生成工件 |
| `agent-skills/first-skill-md.mdx` | B | blocked | 无 | Claude Code 在进入任务前连续遇到认证/网关错误，初次调用与两次自动重试均未生成工件 |
| `codex/codex-form-factors.mdx` | A | verified | 完整 | 93/100，独立复审 0 blocker / 0 major / 0 minor，validator 与 49 页构建通过 |

Phase 1 gate：**未通过**。三种母稿必须全部通过后才能进入 Phase 2；当前不跳过两篇 blocked 文章。

## 前两篇失败链路

两个 lane 使用同一 Phase 0 基线 `766b95b`，各自拥有独立 worktree 与独立 `starlight/node_modules`。每次调用都只包含一个 `/learnprompt-single-mdx` 任务。

### 初次调用

- 结果：`401 Invalid authentication credentials`
- 现场：文章和 `research/articles/` 均无改动。
- 诊断：Codex 桌面线程中的失效 `CLAUDE_CODE_OAUTH_TOKEN` 覆盖了本机仍可用的 Claude 登录。

### 第一次自动重试

- 调整：仅对 writer 子进程取消 `CLAUDE_CODE_OAUTH_TOKEN`。
- 结果：仍为 `401 Invalid authentication credentials`。
- 最小矩阵：基础调用、strict MCP、工具与权限组合都成功；只有 `--setting-sources project` 会复现 401。

### 第二次自动重试

- 调整：取消失效 token，同时移除 `--setting-sources project`；保留 strict MCP、限定工具和隔离 worktree。
- 结果：`503 所有供应商已熔断，无可用渠道`。
- 现场：两个 lane 仍为 clean，未生成目标 MDX diff 或研究工件。

两篇均已耗尽“初次调用 + 两次自动重试”的预算，不自动发起第四次调用。

## `codex-form-factors` 生产记录

### Writer

- 第一次调用：进程持续 5 分 36 秒，没有终端输出、目标 diff 或研究目录，人工中止；清理了含账户标识的调试日志。
- 第一次重试：成功识别项目级 `/learnprompt-single-mdx`，生成 1 篇 MDX、完整 research pack 和 3 张真实任务卡；writer 保持 `partial`，未写分数或 PASS。
- Writer 检查：单篇 validator 通过，Starlight 构建 49 页通过。

### 独立评审与修复

1. 初审：Codex `gpt-5.4`，全新只读会话；2 blocker / 3 major / 1 minor，61/100，FAIL。
2. 修复：纠正 Chrome extension / ChatGPT web / desktop app 层级；限定本地配置共享范围；补 Windows 一手资料；缩窄 Showcase 外推；将 Card 2 明确写成失败实验；脱敏原始日志；逐项标注来源类型。
3. Follow-up 1：全新只读会话；0 blocker / 0 major / 1 minor，95/100，FAIL。唯一问题是把单次继承到的 `danger-full-access` 外推成通用默认值。
4. 修复：删除“默认值”断言，改为要求显式核对实际权限模式。
5. Follow-up 2：第三个全新只读会话；0 blocker / 0 major / 0 minor，93/100，PASS。

### 最终门禁与提交

- `showcase_status: verified`
- `quality_score: 93`
- 单篇 validator：PASS verified (93/100)
- Lane A 完整构建：49 页 PASS
- 主分支 cherry-pick 后完整构建：49 页 PASS
- SourceCard：目标 MDX 零命中
- 隐私扫描：session/request/account 标识与本机绝对路径零命中
- Lane commit：`cdd3641 docs(codex): goldenize codex-form-factors (93)`
- 主分支 cherry-pick：`afbb39f docs(codex): goldenize codex-form-factors (93)`

## 边界

- 不把 CLI 启动、401、503 或进程存活记作文章写作进度。
- 不为两篇 blocked 任务自动发起第四次调用。
- 不用主控制器代写来伪装 `/learnprompt-single-mdx` 已成功执行。
- 当前没有 push、部署或发布。
- Phase 1 未通过前不启动 Phase 2 波次。
