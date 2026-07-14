# brief.md — Claude Code 安装与第一个项目

## 文章卡

- **目标 slug / URL**：`claude-code/install-and-first-project`（保留现有 URL 与 sidebar order: 1，不改）。
- **目标读者**：第一次在终端使用 Claude Code、准备拿一个低风险 git 项目练手的人。
- **一句话产出**：读者完成安装/登录核验后，能在一个可丢弃的小仓库中完成
  “先盘点 → 冻结计划 → 最小改动 → 真实验收 → 检查 diff”的第一次闭环，而不是把
  “工具能打开”误认为成功。
- **中心主张**：第一次使用的成功判据不是安装成功，而是能对一个可验收的最小改动跑通
  INSPECT→PLAN→EDIT→VERIFY→DIFF，并且验收由独立于模型自述的检查决定。
- **必需证据**：一个真实的 Claude Code 非交互会话（冻结任务 + 只改 README + 退出码 +
  git diff），加上一个可被读者一字不差重放的确定性验收门（含一条失败路径）。
- **构建命令**：`npm --prefix starlight run build`（49 页）。

## 非目标（明确不做）

- 不穷举 Web / Desktop / IDE / Cloud 界面，只讲终端首日路径。
- 不深挖整个权限系统，只给第一天够用的边界（default/Manual 起步、plan 模式探索、
  allow/deny 少量白名单）。
- 不展开 CLAUDE.md 设计（交给 `minimum-claude-md`）。
- 不做模型排名，不用一次非受控运行给模型能力下结论。

## 与相邻文章的分工

- 本篇：只建立“第一次闭环”。
- `minimum-claude-md`（order 2）：第一份项目指令 CLAUDE.md。
- `project-checklist`：更完整的六格开工契约。

## 来源家族

- 一手：code.claude.com 官方 quickstart / setup / best-practices / permissions /
  permission-modes（2026-07-11 现场核对）；本机 `claude --version` / `--help` /
  `command -v claude`（2026-07-11）。
- 二手主题地图：alchaincyf/claude-code-orange-book（CC BY-NC-SA 4.0），只用于确定中文
  主题，不用旧版本命令证明当前行为。

## 关键决策记录

- 官方 Quickstart 现在把 **Native Install 标为 Recommended**，npm 降级为 Advanced
  选项。因此正文改用 native 安装叙事，旧 npm 主线叙事作废。
- Showcase 选择“补齐 README 本地运行说明，且不改代码逻辑、不新增依赖”作为冻结任务，
  因为它足够小又包含完整闭环，且约束可被机械验收（代码文件未改 + 测试通过）。
- 嵌套 Claude Code 非交互会话在本机可用，故 Showcase 第一层是真实在线模型运行；
  第二层用确定性脚本保证读者可复现，两层职责在 showcase/README 里分清。

## 验收标准（本文自身）

- 深度门禁：≥5000 正文字符、≥1800 中文解释字符（去代码后）、≥6 个 H2。
- 至少一张原创教学图 + 完整 asset-ledger + CC BY-NC-SA 4.0。
- 删除 SourceCard 后底部 H2 保留真实来源与许可。
- Showcase 通过、单篇 validator（partial）通过、49 页构建通过。
- 独立审稿零阻断/major/minor 且 ≥85 才可转 verified 并写 quality_score。
