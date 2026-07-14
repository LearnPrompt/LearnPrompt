# 横向研究：约束层的一手资料与主题地图

对每个来源，说明它能支撑什么、不能证明什么。核验日期统一为 2026-07-11。

## 1. Claude Code 官方文档：Settings / 权限（一手）

- 链接：https://code.claude.com/docs/en/settings
- 支撑：三类权限规则 `deny` / `ask` / `allow` 及其优先级——`deny` 最高，`deny` 命中即拦，`ask` 次之，`allow` 最低（deny > ask > allow）。规则语法 `Tool(specifier)`，如 `Bash(npm run test:*)`、`Read(./.env)`、`Edit`。权限模式 `default` / `acceptEdits` / `plan` / `auto` / `dontAsk` / `bypassPermissions`，`manual` 是 `default` 的 alias；`auto` 的可用性受账户与部署方式影响。`permissions` 下有 `allow`/`ask`/`deny`/`additionalDirectories`/`defaultMode`。
- 不能证明：不代表 Codex 的机制；也不代表底层操作系统真的会阻止一条命令（权限系统是工具层决策，不是内核沙箱）。

## 2. Claude Code 官方文档：Hooks（一手）

- 链接：https://code.claude.com/docs/en/hooks
- 支撑：`PreToolUse` 钩子在工具调用执行前触发，可整体拦截。`hookSpecificOutput.permissionDecision` 取值 `allow`/`deny`/`ask`（另有 `defer` 走正常流程），配 `permissionDecisionReason`。退出码 2 对 PreToolUse 表示阻断该次工具调用，stderr 反馈给模型。这是把“不要”做成执行前确定性拒绝的机制。
- 不能证明：钩子是你自己写的脚本，逻辑对不对由你负责；它约束的是 Claude Code 的工具调用，不是任意进程。

## 3. Codex 官方配置参考（一手）

- 链接：https://learn.chatgpt.com/docs/config-file/config-reference（由 developers.openai.com/codex/config-reference 308 跳转而来）
- 支撑：`sandbox_mode` 取值 `read-only`（只读，禁写禁网）/`workspace-write`（可写工作区加 `/tmp` 与 `$TMPDIR`，默认禁网，可用 `sandbox_workspace_write.network_access=true` 开）/`danger-full-access`（不受限）。`approval_policy` 可用 `untrusted` / `on-request` / `never` 字符串，也可用 `{ granular = { ... } }` 按 `sandbox_approval`、`rules`、`mcp_elicitations`、`request_permissions`、`skill_approval` 分类控制提示；`on-failure` 已废弃。可加 `sandbox_workspace_write.writable_roots` 追加可写根。
- 不能证明：不代表 Claude Code 的权限模型；沙箱后端因平台而异（macOS 用 seatbelt）。

## 4. 本地 CLI 实测（一手，实验）

- Claude Code CLI 2.1.206、codex-cli 0.142.2，macOS 26.5.1，Node v24.11.0。
- 支撑：`codex sandbox`（默认 read-only，seatbelt）内写文件报 `Operation not permitted` 退出 1；读文件退出 0；`workspace-write` 下写 cwd 与 `$TMPDIR` 均成功（印证官方“可写 `$TMPDIR`”）。这是“硬边界拒绝禁止动作、放行合法动作”的真实证据，见 evidence-ledger 与 showcase/result.txt。
- 不能证明：单机实测不构成跨平台通用结论；不给产品排名。

## 5. Harness Engineering 橙皮书（二手主题地图）

- 链接：https://github.com/alchaincyf/harness-engineering-orange-book
- 用途：确认“约束/边界作为 Harness 一层”的中文叙事组织方式，作为主题地图。仓库为教育性分享、要求署名，未发布标准开源许可，因此不复制其图片或成段文字，仅在底部保留链接与署名。
- 不能证明：不作为任何当前产品行为的事实依据；产品细节一律回到一手文档与实测。

## 6. 同仓库黄金样稿（教学参照）

- what-is-harness.mdx、instruction-layer.mdx。
- 用途：校准结构（读完你能做什么 / 失败开场 / 机制 / Showcase / 边界 / 练习 / 来源）与分层叙事，避免与指令层重复。约束层专讲“什么绝对不能做”与强制方式。
