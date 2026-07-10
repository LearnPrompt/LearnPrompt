# Brief：Codex 的四种执行面怎么选

## 问题

本文聚焦四种开发任务常用的执行面：本地 CLI、IDE 插件、ChatGPT 桌面 App 里的 Codex 模式、Codex Cloud。新读者常把“选 Codex”当成选模型，实际上先要判断：任务的反馈节奏、环境依赖、权限风险和异步需求分别是什么。

母稿把 CLI、IDE、Chrome、桌面并排比较，混淆了执行面、访问入口和能力插件。2026-07-11 的官方文档仍明确提供 Chrome extension：它通过桌面 App 的 Plugins 安装，用于需要已登录浏览器状态的任务。官方同时把 ChatGPT web、desktop app、CLI、IDE extension、Codex cloud 列为不同可用入口。本文因此不宣称“Chrome 已消失”，而是解释为什么 Chrome extension 不应与本地 CLI 或 Cloud 当作同层运行环境比较。

## 目标读者

已经安装至少一种 Codex 入口、但不确定该用哪个的工程师或内容工作者；不假设读者是 Codex 新用户，也不假设所有入口共享任务、账号状态或本地配置。

## 学习目标

读完读者能：

1. 用环境依赖、反馈节奏、权限风险、异步需求四个维度给任务分类，而不是先问“该用哪个产品”。
2. 根据官方文档区分 CLI、IDE、桌面 App 与 Cloud 的运行位置、配置边界和交付方式，并把 ChatGPT web 与 Chrome extension 放回正确层级。
3. 用三张真实任务卡验证本地 sandbox、独立评审隔离和 Cloud 环境预配置；清楚标注 IDE、桌面 App 与 Chrome extension 本次未现场实测。

## 非目标

- 不对比 Codex 与 Claude Code 的模型能力（那是 `ai-coding/choose-claude-code-or-codex.mdx` 的任务）。
- 不做 Codex 与其他 Agent 工具的价格对比。
- 不覆盖 Xcode / JetBrains 的编辑器专属细节，只在文中提及入口存在。

## 中心论点

选执行面看四件事：环境依赖（是否要本机文件、登录态、未提交状态）、反馈节奏（要不要边做边看）、权限风险（出错的影响半径）、是否需要异步交付（能不能离开等结果）。桌面 App 中的 Codex agent、IDE extension 与 CLI 继承同一套本地 agent 配置；ChatGPT web 的托管会话不读取本地 `config.toml`，Cloud 还需要单独配置仓库环境。不要把“同一品牌”误写成“所有入口共享同一模型、账号上下文和权限系统”。

## 需要的证据

- 官方文档对 CLI、IDE、桌面 App、Cloud、ChatGPT web 与 Chrome extension 关系的说明（2026-07-11 核对）。
- 本机 `codex --version` / `codex doctor` / `codex --help` 的真实输出，证明本地 CLI 现状。
- 至少三张真实任务卡，覆盖不同环境依赖、反馈节奏、权限风险、异步需求，套用路由规则并记录实际选择、失败和边界；不对模型能力排名，也不把未实测入口写成 Showcase 结论。

## 验收条件

- 底部“来源与延伸阅读”只保留一手官方文档链接和橙皮书作为二手主题地图，标注 CC BY-NC-SA 4.0。
- 正文不 import/渲染 `SourceCard`。
- `showcase_status: partial`，不写 `quality_score`，`review.md` 不写 PASS。
- 通过 `validate-golden-mdx.mjs` 和 `cd starlight && npm run build`。

## 目标文件

- `starlight/src/content/docs/codex/codex-form-factors.mdx`
- `research/articles/codex-form-factors/`
