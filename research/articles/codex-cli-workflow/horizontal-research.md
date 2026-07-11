# 横向研究

验证日期：2026-07-11。本文只把官方文档与本机 CLI 当成事实来源；Codex Orange Book 只保留为中文二手主题地图。

## 1. 官方文档：Non-interactive mode

- 来源：`https://learn.chatgpt.com/docs/non-interactive-mode`
- 支撑什么：
  - `codex exec` 用于脚本与 CI。
  - 默认把进度流写到 `stderr`，最终消息写到 `stdout`。
  - 开启 `--json` 后，`stdout` 变成 JSONL 事件流。
  - `--output-schema` 可约束最终输出结构。
  - `codex exec resume --last` 可继续非交互会话。
  - 默认要求在 Git 仓库内运行；必要时可 `--skip-git-repo-check`。
- 不能证明什么：
  - 不能证明你本机这版 CLI 支持某个具体模型。
  - 不能代替本机 `--help` 的参数形状核对。

## 2. 官方文档：Developer commands（CLI surface）

- 来源：`https://learn.chatgpt.com/docs/developer-commands?surface=cli`
- 支撑什么：
  - `--ephemeral`、`--json`、`--output-schema`、`--output-last-message`、`--ignore-user-config`、`--ignore-rules`、`--skip-git-repo-check` 都是现行 CLI 选项。
  - `codex exec resume [SESSION_ID]` 与 `--last` 的语义。
  - `--model` 用于本次 run 覆盖配置模型。
- 不能证明什么：
  - 文档列出参数，不代表某个模型对旧版 CLI 一定兼容。
  - 文档没有替你区分全局 flag 与子命令 flag，仍要以本机 `codex --help` / `codex exec --help` 交叉核对。

## 3. 官方文档：Agent approvals & security

- 来源：`https://learn.chatgpt.com/docs/agent-approvals-security`
- 支撑什么：
  - sandbox 与 approval policy 是两条独立轴线。
  - `workspace-write` + `on-request` 是版本控制目录的推荐默认组合。
  - `--ask-for-approval never` 与各类 sandbox 可组合。
  - `workspace-write` 下 `.git`、`.agents`、`.codex` 仍受保护。
  - 版本控制目录与非版本控制目录的默认建议不同。
- 不能证明什么：
  - 不能证明当前仓库的实际工作流一定安全；还要看你是否显式设置参数、是否在隔离目录中运行。

## 4. 本机 CLI 帮助与 doctor

- 来源：`codex --version`、`codex --help`、`codex exec --help`、`codex exec resume --help`、`codex doctor`
- 支撑什么：
  - 当前机器是 `codex-cli 0.142.2`。
  - `codex exec` 自己暴露 `--ephemeral`、`--json`、`--output-schema`、`--skip-git-repo-check`，但 `--ask-for-approval` 在全局帮助里，不在 `codex exec --help` 列表里。
  - `codex exec resume --last` 依赖“最近一次已记录的 session”。
  - `codex doctor` 显示本机默认 config 是高权限的，所以自动化应显式写 `--ignore-user-config` 与自己的 sandbox / approval。
- 不能证明什么：
  - doctor 里的默认模型不等于“这版 CLI 一定支持它”。

## 5. 真实 showcase：receipt-normalizer

- 来源：工作树外临时 Git 仓库中的一次真实 `codex exec`、raw JSONL、raw stderr、最终 JSON、patch、测试输出、deterministic gate。
- 支撑什么：
  - 只改一个实现文件、跑测试、看 diff、出结构化报告是可行的。
  - `--json` 的真正消费对象是 stdout 里的事件流，而不是 stderr。
  - 一个看似可用的模型名如果与当前 CLI 版本不兼容，会在调用早期失败；因此“固定模型”也要做本机可用性验证。
- 不能证明什么：
  - 单次成功不能外推到“Codex 自动化最强”或“所有仓库都适合 exec”。

## 6. 中文二手主题地图：Codex Orange Book

- 来源：`https://github.com/alchaincyf/codex-orange-book`
- 用法：
  - 只用来保留中文选题脉络：Codex CLI 不该被写成聊天技巧，而应被写成工程闭环。
- 不能证明什么：
  - 不作为 2026-07-11 的当前事实权威。
  - 不作为参数、模型、权限和 UI 的现行依据。
