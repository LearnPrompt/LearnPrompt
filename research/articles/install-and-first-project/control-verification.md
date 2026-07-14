# control-verification.md — 控制与核验记录

核对日期：2026-07-11。

## 1. 产品行为不混淆

- 当前安装叙事以官方 **Native Install (Recommended)** 为准，npm 归为 Advanced；不沿用旧
  npm 主线叙事（旧正文与旧橙皮书截图不作为当前行为依据）。
- permission mode、进入 plan 的方式、权限求值顺序均取自官方 permission-modes / permissions
  页，并与本机 `claude --help` 的 `--permission-mode` choices 交叉核对一致。
- 橙皮书只用于确定中文主题，不用其命令或截图证明当前产品行为。

## 2. 来源审计

- 一手：code.claude.com 的 quickstart / setup / best-practices / permission-modes /
  permissions 五页，均经 gstack /browse daemon 现场抓取（HTTP 200）。
- 本机：Claude Code 2.1.206，`claude --version` / `--help` / `command -v claude` 实测。
- 二手：alchaincyf/claude-code-orange-book（CC BY-NC-SA 4.0），仅作主题地图。
- 正文底部 H2 只列实际查阅过的来源。

## 3. Showcase 真实性与嵌套会话

- 本机嵌套 Claude Code 非交互会话可用（先用 `claude -p "..."` 探针确认，退出码 0）。因此
  Showcase 第一层是**真实在线模型运行**，非伪造：命令、退出码、git diff、脱敏后的模型自述
  均为实际产物。
- 第二层为确定性脚本 `verify-first-loop.mjs`，读者可一字不差重放，含一条真实失败路径。
- 复审前已加固为不可变 `baseline` tag 比较：冻结代码与该 tag 比对，README 必须相对该 tag 新增运行段；不会因候选提交导致 `HEAD` 前进而漏检。
- 正文与 showcase/README 明确区分“调用了在线模型的部分（措辞不可逐字复现）”与“确定性可复现
  部分”，不把两者混为一谈，也不用一次运行给模型能力排名。

## 4. 脱敏核验

- 原始日志写入 `$TMPDIR`（`lp-run-raw-*.log`），进程退出后才提取摘录，未把 live 日志留在
  被审仓库内。
- 提取时去除类别：本机 connectors 状态提示行（无密钥、无账号标识）。
- 复查 showcase 目录，确认不含：secrets/令牌/密钥、账号标识、会话类运行标识，或任何
  指向用户家目录 / 临时 worktree 的绝对路径。
- 命令中出现的 `/path/to/...` 为占位符，非真实本机路径。

## 5. 自查网格（写作期，不代表已通过独立审稿）

| 项 | 状态 |
| --- | --- |
| 深度门禁（字符/中文/H2） | 已通过 partial validator（2026-07-11） |
| 教学图 + asset-ledger + 许可 | 具备 |
| 删除 SourceCard 并保留底部真实来源 | 已在正文处理 |
| Showcase 真实 + 可复现 + 失败路径 | 具备 |
| 站点构建 49 页 | 已通过（2026-07-11） |
| 独立审稿 | 待另起只读会话执行；写作者不自评打分 |

## 6. 本轮机械验证结果

- `node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs --article starlight/src/content/docs/claude-code/install-and-first-project.mdx --research research/articles/install-and-first-project`
  → `PASS article` / `PASS research` / `PASS status: partial`
- 依据 showcase/README 的复现步骤，在临时目录重建练习仓库、应用 `readme.diff` 后运行
  `node verify-first-loop.mjs` → `3/3 acceptance checks passed`
- `npm --prefix starlight run build` → 成功构建 49 页，含
  `/claude-code/install-and-first-project/index.html`
- `git diff --check` → 通过
- 隐私扫描（research + 正文 + 图片目录）→ 无命中
