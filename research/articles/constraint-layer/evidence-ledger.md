# 证据台账

每条核心事实与每处“实测”都登记来源、类型、验证日期、置信度与局限。核验日期 2026-07-11。

| # | 声明 | 证据 | 证据类型 | 验证日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Claude Code 权限有 deny/ask/allow 三类，优先级 deny > ask > allow，deny 命中即拦 | code.claude.com/docs/en/settings | 官方一手文档 | 2026-07-11 | 高 | 文档随版本更新，需按发布日期复核 |
| 2 | 权限规则语法为 Tool(specifier)，如 Bash(...)、Read(./.env)、Edit | code.claude.com/docs/en/settings | 官方一手文档 | 2026-07-11 | 高 | 通配符语义细节以官方为准 |
| 3 | 权限模式含 default/acceptEdits/plan/auto/dontAsk/bypassPermissions；manual 是 default 的 alias | code.claude.com/docs/en/settings；本机 `claude --help` | 官方一手文档 + CLI | 2026-07-11 | 高 | auto 可用性受账户与部署方式影响 |
| 4 | PreToolUse 钩子在执行前触发，可用 permissionDecision:"deny" 或 exit 2 阻断该次工具调用 | code.claude.com/docs/en/hooks | 官方一手文档 | 2026-07-11 | 高 | 钩子逻辑由使用者编写，正确性自负 |
| 5 | Codex sandbox_mode 取值 read-only / workspace-write / danger-full-access | learn.chatgpt.com/docs/config-file/config-reference；`codex exec --help` 显示 possible values | 官方文档 + CLI 实测 | 2026-07-11 | 高 | 跳转自 developers.openai.com/codex/config-reference |
| 6 | workspace-write 默认可写工作区加 /tmp 与 $TMPDIR，网络默认关闭 | 同上文档；本地实测写 $TMPDIR 成功 | 官方文档 + 实测 | 2026-07-11 | 高 | 平台相关，可写根可被 writable_roots 调整 |
| 7 | Codex approval_policy 支持 untrusted/on-request/never 字符串或 granular 对象；granular 可按 sandbox_approval/rules/mcp_elicitations/request_permissions/skill_approval 分类控制提示；on-failure 已废弃 | 官方配置参考；`codex --help` 列出字符串策略 | 官方文档 + CLI 实测 | 2026-07-11 | 高 | granular 是配置文件对象形态，本机 CLI 帮助不展开其字段 |
| 8 | read-only 沙箱内写文件被拒（Operation not permitted，exit 1），读文件放行（exit 0） | showcase/constraint-gate/result.txt 阶段 3 | 实测 | 2026-07-11 | 高 | macOS seatbelt；其他平台后端不同 |
| 9 | 纯文字 AGENTS.md 提醒拦不住禁止写入：无闸门时 config/app.env 被追加 TAMPERED | showcase/constraint-gate/result.txt 阶段 1 | 实测 | 2026-07-11 | 高 | 演示用最小仓库，非生产 |
| 10 | 确定性闸门对同一组动作给出 2/5 allowed、3 denied、退出码 2，判定在执行前 | showcase/constraint-gate/result.txt 阶段 2 | 实测 | 2026-07-11 | 高 | policy-gate.mjs 是机制模型，非产品本身 |
| 11 | 本地环境：Claude Code 2.1.206、codex-cli 0.142.2、Node v24.11.0、macOS 26.5.1 | `claude --version` / `codex --version` / `node --version` / `sw_vers` | 实测 | 2026-07-11 | 高 | 版本会更新 |
| 12 | 橙皮书为教育性分享、要求署名、无标准开源许可，故不复制其图片/成段文字 | github.com/alchaincyf/harness-engineering-orange-book；visual-assets.md 许可矩阵 | 二手来源 + 项目许可说明 | 2026-07-11 | 中 | 仅作主题地图，不作事实依据 |

## 事实 / 推断 / 综合的分界

- 事实：条 1–7、12（有一手文档或项目声明）。
- 实测：条 8–11（本机真实运行，输出冻结在 showcase/result.txt）。
- 综合（编辑归纳）：约束层与指令/能力/状态/编排的分工、“执行前判定 vs 执行时拦截”两分法、失败模式清单——见 vertical-research.md，正文标注为操作化归纳，不冒充官方术语。
