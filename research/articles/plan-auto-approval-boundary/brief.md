# Brief：Plan、Auto 与人工审批边界

## 文章卡

- 目标 MDX：`starlight/src/content/docs/ai-coding/plan-auto-approval-boundary.mdx`
- 研究目录：`research/articles/plan-auto-approval-boundary`
- 图片目录：`starlight/public/images/articles/plan-auto-approval-boundary/`
- 构建命令：`cd starlight && npm run build`（49 页全站构建）
- 验证日期：2026-07-11

## 读者与产出

- 目标读者：已经在用 coding agent、但还在用"我信任这个模型"来决定放不放权的开发者。
- 一句话产出：读完能按任务风险把动作分成只读计划、普通自动执行、需人工批准三档，并知道在 Claude Code 与 Codex 里分别用哪条原语实现，不把两套术语混用。

## 核心主张

权限边界应当由任务风险决定，并由 harness 或 OS 沙箱机械强制，而不是由模型名字或"信任感"决定。三档风险是工具无关的判断框架；Claude Code 与 Codex 用不同的原语落地，术语不能互译。

## 非目标

- 不给 Claude Code 与 Codex 的模型能力排名。
- 不覆盖企业 managed settings、MCP 审批、hooks 的完整细节，只在必要处点到。
- 不演示任何真实的 push、部署、发布、外部消息或不可逆破坏动作。

## 必须的证据

- Claude Code 权限模式与 allow/ask/deny 规则、plan 模式语义：官方文档 + 本机 `claude --help`（2.1.206）。
- Codex 审批策略与沙箱模式：官方 config 文档 + 本机 `codex --help`（0.142.2）。
- 一个可复现 showcase：用 `codex sandbox` 对同一批动作在 read-only / workspace-write 下逐条裁决，证明边界由内核强制。

## 验收条件

- 正文 ≥ 5000 字符、去代码后 ≥ 1800 中文解释字符、≥ 6 个 H2。
- 至少一张真正解释决策机制的本地教学图 + asset-ledger 许可闭环。
- 删除 SourceCard，底部保留真实来源并标注橙皮书为二手主题地图。
- writer 阶段保持 `showcase_status: partial`，不写 quality_score，review.md 不写 PASS。
- partial validator 通过，49 页构建通过。
