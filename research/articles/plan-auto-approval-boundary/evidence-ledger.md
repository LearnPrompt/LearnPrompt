# Evidence Ledger：Plan、Auto 与人工审批边界

每条中心事实与每个"实测"陈述都列一行。类型：一手文档 / 本机 CLI / 实测 / 编辑综合。

| 编号 | 主张 | 证据 | 类型 | 验证日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Claude Code 权限模式含 default/plan/acceptEdits/auto/dontAsk/bypassPermissions | code.claude.com/docs/en/permissions | 一手文档 | 2026-07-11 | 高 | 版本会变 |
| C2 | `--permission-mode` 本机取值为 acceptEdits/auto/bypassPermissions/manual/dontAsk/plan | `claude --help`（2.1.206） | 本机 CLI | 2026-07-11 | 高 | 仅此版本 |
| C3 | plan 模式只读探索、不改源文件 | permissions 文档 | 一手文档 | 2026-07-11 | 高 | — |
| C4 | allow/ask/deny 按 deny→ask→allow 求值，第一个命中决定，deny 从任一层级压过 allow | permissions 文档 | 一手文档 | 2026-07-11 | 高 | — |
| C5 | 权限规则由 Claude Code 强制、不是模型强制；提示词/CLAUDE.md 不改变允许范围 | permissions 文档（Note 块） | 一手文档 | 2026-07-11 | 高 | — |
| C6 | `deny Bash(git push *)` 可在放开 Bash 的同时锁死 push | permissions 文档通配示例 | 一手文档 | 2026-07-11 | 高 | 复合命令需逐子命令匹配 |
| C7 | Claude Code 的 OS 沙箱只约束 Bash 及子进程，与权限规则互补 | permissions / sandboxing 文档 | 一手文档 | 2026-07-11 | 高 | — |
| C8 | Codex approval_policy 取值 untrusted/on-request/never，on-failure 废弃，及各自含义 | `codex --help`（0.142.2） | 本机 CLI | 2026-07-11 | 高 | 仅此版本；on-request 由模型决定何时询问，不能当作确定性人工门禁 |
| C9 | Codex sandbox_mode 取值 read-only/workspace-write/danger-full-access | `codex exec --help`；config-reference | 本机 CLI + 一手文档 | 2026-07-11 | 高 | — |
| C10 | workspace-write 下出站网络默认关闭（network_access 默认 false） | config-reference | 一手文档 | 2026-07-11 | 中高 | 文档为重定向后页面 |
| C11 | 审批与沙箱是正交配置轴；前者控制何时可能询问，后者控制运行边界，二者不自动映射 | `codex --help` + `codex exec --help` | 本机 CLI | 2026-07-11 | 高 | 不能把 on-request 包装成高风险动作必问 |
| C12 | read-only 沙箱下 cat 成功、echo>> 被拒（Operation not permitted） | showcase/experiment-output.md | 实测 | 2026-07-11 | 高 | 仅 macOS Seatbelt |
| C13 | workspace-write 下工作区写入成功、写 $HOME 被拒、联网被拒 | showcase/experiment-output.md | 实测 | 2026-07-11 | 高 | 仅 macOS Seatbelt |
| C14 | 三档风险模型是 LearnPrompt 的操作化综合，非厂商官方分类 | 本研究编辑综合 | 编辑综合 | 2026-07-11 | 高 | 不冒充标准 |
| C15 | plan 模式（应用层）与 read-only 沙箱（OS 层）强制层不同，术语不能互译 | 对比 C3/C5 与 C9/C12 | 编辑综合 | 2026-07-11 | 高 | — |
| C16 | 橙皮书为二手主题地图，CC BY-NC-SA 4.0，仅提示选题不承担现行事实 | github.com/alchaincyf/codex-orange-book README | 一手（许可）+ 二手（内容） | 2026-07-11 | 中 | 快照，需重新核验 |

## 命令核验记录

- `claude --help` → 确认 C2。
- `codex --help` / `codex exec --help` / `codex sandbox --help` → 确认 C8、C9、C11。
- `codex sandbox -c sandbox_mode=...` 四条实验 → 确认 C12、C13。原始输出在仓库外临时目录捕获，脱敏后进入 showcase。
