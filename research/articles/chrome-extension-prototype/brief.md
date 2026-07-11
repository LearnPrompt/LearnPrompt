# brief.md — Claude Code Chrome 扩展原型

## 文章卡

- **目标 slug / URL**：`claude-code/chrome-extension-prototype`（保留现有 URL 与 `sidebar.order: 7`）。
- **目标读者**：已经会让 Claude Code 改代码、但还不会把“浏览器扩展需求”冻结成可加载、可验证、权限克制的最小交付的人。
- **一句话产出**：读者能先写出 Manifest V3 扩展的验收标准，再用 Claude Code 做出一个真实可加载的“当前页阅读卡”原型：从当前页抓标题、URL 与可选选中文本，存进 `chrome.storage.local`，并在 popup 里显示最近一次保存结果。
- **中心主张**：做 Chrome 扩展时，最容易浪费时间的不是“Claude Code 会不会写 JS”，而是没有先把权限边界、验证路径和失败模式写成 contract。先冻结验收标准，Claude Code 才知道该生成怎样的最小扩展，而你也才知道什么算完成。
- **必需证据**：
  - 官方 Chrome 扩展文档对 `activeTab`、`scripting`、`storage.local`、MV3 service worker 与 popup 的当前说明。
  - 官方 Claude Code 文档对 plan mode、权限模式、具体上下文约束的当前说明。
  - 一个真实可加载的扩展 fixture。
  - 一次基于 Chrome for Testing 150 的 `--load-extension` 机械 22-check 验证。
  - 一次对 official branded Chrome 150 的 `chrome://extensions -> Load unpacked` 人工验收边界说明。
  - 至少一个真实失败或越权负例。
- **构建命令**：`npm --prefix starlight run build`。

## 非目标

- 不讲 Chrome Web Store 上架流程、隐私政策填写、图标设计与正式品牌包装。
- 不引入远程 API、账号体系、同步存储、云数据库或后台抓取。
- 不把这篇写成“Claude Code 自动生成所有前端”的演示；重点是从验收标准到最小原型的控制面。
- 不把一次 prototype 的完成冒充成可直接发布的生产扩展。

## 与相邻文章的分工

- `install-and-first-project`：第一次把 Claude Code 跑通。
- `minimum-claude-md`：把重复约束沉到 `CLAUDE.md`。
- `advanced-conversation-patterns`：长任务怎么分段与 handoff。
- 本篇：把这些方法压缩到一个浏览器扩展原型里，重点讲 acceptance criteria、权限克制、浏览器验证与失败证据。

## 来源家族

- **一手官方资料（2026-07-11 核对）**：
  - Claude Code overview / quickstart / permission modes / permissions / best practices。
  - Chrome Extensions 的 MV3、`activeTab`、`scripting`、`tabs`、`storage`、popup、end-to-end testing、debugging 文档。
- **二手主题地图**：
  - `alchaincyf/claude-code-orange-book`，只用来确认“Chrome 扩展原型”这个题目与中文语境，不拿来证明当前权限、安装、CLI 或浏览器行为。

## 关键决策记录

- Showcase 不做“全站网页收藏器”，只做一个动作：抓当前页阅读卡。这样才能让权限、失败模式和验收都足够具体。
- 主扩展只申请 `activeTab`、`scripting`、`storage`。不申请 `tabs`、`host_permissions`、`unlimitedStorage`，因为本例不需要自动扫站点，也不需要读取 `tabs.Tab` 的敏感字段。
- 抓取入口最终收敛为快捷键，popup 只承担结果展示；抓取逻辑由 service worker 通过 `chrome.scripting.executeScript()` 从当前页读取标题、URL 和选区，不依赖远程代码或站外脚本。
- 浏览器验证分两层：Chrome for Testing 150 用 `--load-extension` 完成同一套源码的机械 22-check；official branded Chrome 150 因 Chrome 137+ 的命令行边界，只保留 `chrome://extensions -> Load unpacked` 的人工验收，不再把 branded Chrome 命令行加载写成必需证据。
- 本轮 writer 只交付 `showcase_status: partial`：会跑 showcase、validator、build 和 diff check，但不独立 review、不打分、不写 PASS。

## 验收标准（本文自身）

- 深度门槛：正文至少 5000 字符、去代码后至少 1800 个中文解释字符、至少 6 个 H2。
- 删除公开 `SourceCard`，底部改成真实来源与许可说明。
- 至少 1 张本地教学图，且 `asset-ledger.md` 完整。
- `research/articles/chrome-extension-prototype/showcase/` 内含 README、真实 extension 源码、fixture、确定性检查、失败或越权负例、脱敏冻结输出。
- 运行单篇 validator（保持 `partial`）与 `starlight` build；保存脱敏结果。
