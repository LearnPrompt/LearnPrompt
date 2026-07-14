# horizontal-research.md — 横向来源比较

核对日期：2026-07-11。官方文档通过 gstack /browse daemon（goto → sleep 3 → text）现场抓取，均 HTTP 200；CLI 事实用本机 Claude Code 2.1.206 复核。

## 一手来源

### 1. 官方 Quickstart — https://code.claude.com/docs/en/quickstart
- 能支撑：当前推荐安装路径（Step 1 首个 tab 即 **Native Install (Recommended)**，命令
  `curl -fsSL https://claude.ai/install.sh | bash`）；登录流程（运行裸 `claude`，浏览器
  认证，`/login` 切换）；第一个演示循环（cd 项目 → 问 what does this project do → 首次改动
  需授权 → 让它 commit）；底部 pro tip：`Shift+Tab` 循环 permission mode。
- 不能证明：具体某个第三方仓库的行为；也不替代 setup 页的系统要求。

### 2. 官方 Setup（Advanced setup）— https://code.claude.com/docs/en/setup
- 能支撑：系统要求（macOS 13+/Win10 1809+/Ubuntu 20.04+ 等，4GB+ RAM）；native 安装命令
  与 Quickstart 一致；验证方式 `claude --version` 与 `claude doctor`；npm 已归入
  **Advanced installation options**（`npm install -g @anthropic-ai/claude-code`，需 Node 22+，
  禁用 sudo，装的是同一 native binary）。
- 不能证明：读者本机是否满足要求，需各自 `claude doctor`。

### 3. 官方 Best practices — https://code.claude.com/docs/en/best-practices
- 能支撑：Explore→Plan→Code→Commit 四阶段；“If you could describe the diff in one
  sentence, skip the plan”；给模型一个能跑出 pass/fail 的验证途径并要它展示证据；
  CLAUDE.md 要短、逐行自问是否必要；纠正超过两次就 /clear 重开。
- 不能证明：这些建议在任意仓库都会一次成功；它是原则不是保证。

### 4. 官方 Permission modes — https://code.claude.com/docs/en/permission-modes
- 能支撑：六种模式（default/Manual、acceptEdits、plan、auto、dontAsk、bypassPermissions）
  的含义；进入 plan 模式的三条路径（Shift+Tab 循环 / `/plan` 前缀 / `--permission-mode plan`）；
  除 bypass 外 protected paths 写入永不自动放行。
- 不能证明：某台机器实际拦截了哪条命令，需本地实测。

### 5. 官方 Permissions（Configure permissions）— https://code.claude.com/docs/en/permissions
- 能支撑：allow/ask/deny 三类规则；求值顺序 deny → ask → allow；规则由 Claude Code 而非
  模型强制；settings.json 层级与示例（allow `Bash(npm run *)`、deny `Bash(git push *)`）。
- 不能证明：读者项目里到底该 allow 哪些命令，需按项目定。

### 6. 本机 CLI（2026-07-11）
- `claude --version` → `2.1.206 (Claude Code)`；`command -v claude` → `~/.local/bin/claude`
  （native 安装位置，非 npm 的 node_modules/.bin）。
- `claude --help`：确认 `-p/--print`、`--permission-mode`（choices 含 plan、manual、
  acceptEdits、bypassPermissions、dontAsk、auto）、`--allowedTools`、`install`/`auth`/
  `doctor` 子命令。
- 能支撑：native 安装叙事、plan 模式旗标、非交互运行方式都与官方文档一致。

## 二手主题地图

### alchaincyf/claude-code-orange-book（CC BY-NC-SA 4.0）
- 用途：确定“安装与第一个项目”这一中文主题、以及“先读后改、先计划后执行、小 diff、
  写项目规则”这些教学重点的选题。
- 明确边界：**只作主题地图**。其命令与截图是历史快照，不用来证明当前产品行为；本文所有
  当前行为都以上面 1–6 的一手来源为准。按其许可在底部保留署名与链接。

## 高质量教学参照

- 站内黄金样稿 `agent-engineering/what-is-harness.mdx`：借鉴其“机制表 + 真实 showcase +
  它证明了什么/没证明什么”的结构，以及原创 SVG + 底部一手来源的写法。用于校准教学深度，
  不复制内容。
