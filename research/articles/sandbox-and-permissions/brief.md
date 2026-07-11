# Brief：把 Codex 的沙箱边界和审批时机拆成两个控制层

## 文章卡

- 目标 MDX：`starlight/src/content/docs/codex/sandbox-and-permissions.mdx`
- 研究目录：`research/articles/sandbox-and-permissions`
- 图片目录：`starlight/public/images/articles/sandbox-and-permissions/`
- 构建命令：`cd starlight && npm run build`（49 页全站构建）
- 验证日期：2026-07-11

## 读者与产出

- 目标读者：已经在本地用 Codex 或其他 coding agent，但还在把“别总停下来问我”和“给更大文件权限”混成一件事的开发者。
- 一句话产出：读完能把“沙箱/permission profile 决定命令碰得到什么”和“approval policy 决定 agent 何时停下来问”拆开理解，并按任务风险选择最小权限，而不是把 `danger-full-access` 当默认。

## 核心主张

本地 Agent 的控制面至少有两层：OS 沙箱或 permission profile 负责机械地限制文件与网络边界；approval policy 负责决定 agent 在执行前、执行中或失败后是否停下来征求人工确认。它们互相配合，但不能互相替代。

## 非目标

- 不给 Codex 做模型能力排名，也不比较 Claude Code 或其他工具的文字质量。
- 不在 Showcase 中实跑任何 `danger-full-access` 越界写、发布、删除、推送、部署或外部消息动作。
- 不覆盖企业 managed settings、MCP elicitations、hooks、rules 的完整治理矩阵，只在说明“它们不是 OS 沙箱”时点到。

## 必须的证据

- 2026-07-11 官方一手文档：`Sandbox`、`Agent approvals & security`、`Permissions`、`Configuration Reference`。
- 本机命令帮助：`codex --help` 与 `codex sandbox --help`，版本固定为 `codex-cli 0.142.2`。
- 一个无模型、确定性的 `codex sandbox --permissions-profile ...` 实测：同一实验室里分开执行 3 个 probe，记录真实退出码、副作用和脱敏后的最小证据。
- 一个一键 verifier：确认 `sentinel` 在失败路径中未被改写，且敏感 `.env` 内容没有进入日志。

## 验收条件

- 正文 ≥ 5000 字符、去代码后 ≥ 1800 中文解释字符、≥ 6 个 H2。
- 至少一张本地原创教学图，解释“任务风险 -> profile -> approval -> outcome”的决策链。
- 公开正文删除 `SourceCard`，底部来源保留官方文档、help 与 Orange Book 署名；Orange Book 只标注为二手主题地图。
- writer 阶段保持 `showcase_status: partial`，不写 `quality_score`，`review.md` 不写 PASS。
- partial validator 通过，49 页构建通过，`git diff --check` 通过。
