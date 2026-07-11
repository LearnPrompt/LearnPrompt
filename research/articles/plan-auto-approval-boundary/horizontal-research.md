# 横向研究：权限边界的一手资料与主题地图

验证日期：2026-07-11。区分事实（来源）、推断（编辑综合）与主题地图（二手）。

## 一手来源

### 1. Claude Code 官方权限文档

- 链接：https://code.claude.com/docs/en/permissions
- 支撑：权限模式（default/plan/acceptEdits/auto/dontAsk/bypassPermissions）；allow/ask/deny 规则；求值顺序 deny → ask → allow，第一个命中决定结果；deny 从任一层级都压过 allow；规则由 Claude Code 强制、不是模型强制；plan 模式只读探索不改源文件；OS 沙箱是补充层，只约束 Bash。
- 不能证明：Codex 的行为；也不能证明未来版本不变。

### 2. 本机 Claude Code CLI

- 命令：`claude --help`（2.1.206）
- 支撑：`--permission-mode` 取值确为 acceptEdits/auto/bypassPermissions/manual/dontAsk/plan；`--allowedTools`/`--disallowedTools` 存在；`--dangerously-skip-permissions` 存在。
- 用途：把文档说法与本机实际可用参数对齐，作为时效性锚点。

### 3. Codex 官方 config 文档

- 链接：https://developers.openai.com/codex/config-basic 、config-reference（当前重定向到 learn.chatgpt.com）
- 支撑：`approval_policy`（untrusted/on-request/never，on-failure 废弃）；`sandbox_mode`（read-only/workspace-write/danger-full-access）；workspace-write 下 `sandbox_workspace_write.network_access` 默认关闭。
- 不能证明：Claude Code 的行为。

### 4. 本机 Codex CLI

- 命令：`codex --help`、`codex exec --help`、`codex sandbox --help`（0.142.2）
- 支撑：`codex --help` 暴露 `--ask-for-approval` 四个取值及其官方一句话解释（untrusted 只自动跑受信命令并升级、on-request 由模型决定、never 从不问、on-failure 废弃）；`codex exec --help` 暴露 `--sandbox` 三个取值；`codex sandbox` 子命令能把任意命令放进沙箱跑。
- 用途：既是文档对齐锚点，也是 showcase 的执行工具。

### 5. Claude Code 沙箱文档

- 链接：https://code.claude.com/docs/en/sandboxing（在权限文档中引用）
- 支撑：permissions 与 sandboxing 是互补的两层；sandbox 提供 OS 级强制、只作用于 Bash 及子进程；`autoAllowBashIfSandboxed` 默认 true 时沙箱边界替代整体 Bash 提示，但内容级 ask 规则（如 `Bash(git push *)`）和 deny 仍生效。
- 不能证明：Codex 沙箱实现细节（不同内核机制）。

## 二手主题地图

### 6. Codex 橙皮书（alchaincyf/codex-orange-book）

- 链接：https://github.com/alchaincyf/codex-orange-book
- 许可：仓库 README 声明 CC BY-NC-SA 4.0。
- 角色：旧占位稿的 source_repo，作为中文主题地图，提示"权限边界"这一选题。仅作二手参考，不承担任何当前产品事实；所有事实以上面一手来源为准，并在正文底部按许可保留署名。
- 不能证明：当前 CLI 版本行为（橙皮书是快照，需重新核验）。

## 同类教学参考

- LearnPrompt 现有黄金样稿 `choose-claude-code-or-codex.mdx`：确立"先判断工作方式再选工具、不比模型跑分"的口径，本文沿用其术语纪律，但把焦点从选型转到权限边界的三档划分。
- `natural-language-to-mvp.mdx`：确立冻结与验收的教学节奏，本文借用其"证据优先、失败边界必写"的结构。

## 编辑综合（非来源）

三档风险模型是本文的操作化综合，不是任一厂商的官方分类。它把两个产品各自的两条正交轴（Claude Code：权限模式 + allow/ask/deny 规则；Codex：审批策略 + 沙箱模式）投影到同一个风险坐标上，方便读者迁移判断，但不改变各自的原语与强制层。
