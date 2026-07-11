# evidence-ledger.md — 证据台账

核对日期统一为 2026-07-11。证据类型：一手文档（官方 docs）/ 本机实测（CLI 或 showcase）/ 二手主题地图。

| # | 声明 | 证据 | 类型 | 验证日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 官方 Quickstart 把 Native Install 标为 Recommended，命令为 `curl -fsSL https://claude.ai/install.sh \| bash` | code.claude.com/docs/en/quickstart（现场抓取，Step 1 首 tab） | 一手文档 | 2026-07-11 | 高 | 官方随版本可能调整；发布日需复核 |
| 2 | npm 安装现为 Advanced 选项（`npm install -g @anthropic-ai/claude-code`，需 Node 22+，禁 sudo，装同一 native binary） | code.claude.com/docs/en/setup（Advanced installation options） | 一手文档 | 2026-07-11 | 高 | 同上 |
| 3 | 本机 Claude Code 版本 2.1.206，可执行文件在 `~/.local/bin/claude`（native 位置） | `claude --version`、`command -v claude` | 本机实测 | 2026-07-11 | 高 | 仅代表本机，读者需自测 |
| 4 | 验证安装用 `claude --version`，更详细用 `claude doctor` | setup 页；本机 `claude --help` 列出 `doctor` 子命令 | 一手文档 + 本机实测 | 2026-07-11 | 高 | — |
| 5 | 登录方式：运行裸 `claude`，浏览器认证订阅账号；会话内 `/login` 切换 | quickstart Step 2；setup 认证节 | 一手文档 | 2026-07-11 | 高 | 免费 claude.ai plan 不含 Claude Code |
| 6 | 改文件前总要授权（Find file → Show changes → Ask approval → Make edit） | quickstart Step 5 | 一手文档 | 2026-07-11 | 高 | 取决于 permission mode |
| 7 | 官方推荐工作流 Explore→Plan→Code→Commit；plan 阶段只读探索 | best-practices 页 | 一手文档 | 2026-07-11 | 高 | 原则非保证 |
| 8 | “If you could describe the diff in one sentence, skip the plan.” | best-practices 页（原文引用） | 一手文档 | 2026-07-11 | 高 | — |
| 9 | 应给模型能跑出 pass/fail 的验证途径，并要它展示证据而非断言完成 | best-practices 页 | 一手文档 | 2026-07-11 | 高 | — |
| 10 | 纠正同一问题超过两次应 /clear 重开并写更精确 prompt | best-practices 页 | 一手文档 | 2026-07-11 | 高 | — |
| 11 | 六种 permission mode：default(Manual)/acceptEdits/plan/auto/dontAsk/bypassPermissions 及各自含义 | permission-modes 页；本机 `--help` 的 `--permission-mode` choices | 一手文档 + 本机实测 | 2026-07-11 | 高 | auto 需版本/账号条件 |
| 12 | 进入 plan 模式三法：Shift+Tab 循环 / `/plan` 前缀 / `claude --permission-mode plan` | permission-modes 页；本机 `--help` | 一手文档 + 本机实测 | 2026-07-11 | 高 | Shift+Tab 循环随可用模式而变 |
| 13 | 权限规则 allow/ask/deny，求值顺序 deny → ask → allow，由 Claude Code 而非模型强制 | permissions 页 | 一手文档 | 2026-07-11 | 高 | — |
| 14 | settings.json 示例：allow `Bash(npm run *)`、deny `Bash(git push *)` | permissions 页（原文示例） | 一手文档 | 2026-07-11 | 高 | 具体白名单需按项目 |
| 15 | 除 bypassPermissions 外，protected paths（.git/.claude 等）写入永不自动放行 | permission-modes 页 | 一手文档 | 2026-07-11 | 中高 | 未逐条本机复验全部路径 |
| 16 | 真实非交互会话：冻结任务下 claude 退出码 0，只改 README.md（+31 行），代码文件未动 | showcase：`readme.diff`、`run-summary.txt`、`git diff --name-status` | 本机实测（在线模型） | 2026-07-11 | 高 | 换模型/日期措辞会变；玩具仓库 |
| 17 | 改动后 `npm test` 通过（all tests passed，exit 0），基线也通过 | showcase 实测 | 本机实测 | 2026-07-11 | 高 | — |
| 18 | 确定性验收门：好状态 3/3 退出码 0；往代码追加一行后 FAIL no-code-edit、退出码 1；撤销后恢复 | showcase：`verify-first-loop.mjs`、`gate-output.txt` | 本机实测（确定性） | 2026-07-11 | 高 | 只检查三条事实，不判文案质量 |
| 19 | 二手主题地图 alchaincyf/claude-code-orange-book 采用 CC BY-NC-SA 4.0 | 橙皮书仓库 README 许可声明 | 二手主题地图 | 2026-07-11 | 高 | 仅作选题，不证明当前行为 |

## 一手 vs 二手边界

第 1–18 条均以官方文档或本机实测为准。第 19 条橙皮书只用于确定中文主题，不用其历史命令或
截图证明当前产品行为；正文所有当前行为都指向第 1–15 条的一手来源。
