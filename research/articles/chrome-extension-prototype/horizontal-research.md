# horizontal-research.md — 横向资料对照

验证日期：**2026-07-11**

## 资料对照表

| 资料 | 类型 | 它支持什么 | 它不能证明什么 |
| --- | --- | --- | --- |
| Claude Code Overview | 官方产品文档 | Claude Code 现在可在 terminal、IDE、desktop、browser 多入口运行；它能读代码、改文件、跑命令 | 不能证明某个具体 prompt 一定能一次写出正确扩展 |
| Claude Code Quickstart | 官方产品文档 | 当前推荐安装路径、首次登录入口、`claude` 交互式登录流程 | 不能证明最佳 prompt 模板，也不负责仓库内的工程约束 |
| Claude Code Permission modes / Permissions / Best practices | 官方产品文档 | 先 plan 后 implement、`acceptEdits` 与 `plan` 的边界、allow/deny 的优先级、要给模型具体文件和约束 | 不能证明哪种提示词最优；也不替代你写验收标准 |
| Chrome `activeTab` 文档 | 官方平台文档 | `activeTab` 只在用户调用扩展时授予当前页临时访问权，且不触发权限 warning | 不能证明所有页面都可注入；受限页面仍会失败 |
| Chrome `scripting` 文档 | 官方平台文档 | MV3 用 `chrome.scripting` 注入函数或脚本；搭配 `activeTab` 可避免常驻 host 权限 | 不能证明你设计的扩展结构最合适 |
| Chrome `tabs` 文档 | 官方平台文档 | `tabs` 权限只在读取 URL、title 等敏感字段时需要；并不自动等于“能操作 tabs API” | 不能替代页面内提取逻辑，也不证明你该申请这个权限 |
| Chrome `storage` 文档 | 官方平台文档 | `storage.local` 是扩展专用持久化方式，适合保存本地状态；不同于网页 `localStorage` | 不能决定你的数据结构是否合理 |
| Chrome popup / testing / debug 文档 | 官方平台文档 | popup 的触发方式、`action.openPopup()`、headless 新模式可加载扩展、popup 测试 override 思路、service worker 调试路径 | 不能保证自动化库一定无摩擦；测试框架仍要自己实现 |
| Chrome MV3 / security 文档 | 官方平台文档 | MV3 service worker 按需运行；扩展代码不能依赖远程托管 JS | 不能证明某个第三方教程依然最新 |
| `alchaincyf/claude-code-orange-book` | 二手主题地图 | 这个主题在中文语境里确实有读者需求，也提醒“先做最小目录和验收路径” | 不能证明 2026-07 的 Claude Code 安装方式、权限模式、Chrome API 细节或 MV3 行为 |

## 为什么这一题必须以官方资料为主

“Claude Code 做 Chrome 扩展”很容易掉进两个过时陷阱：

1. 还按早期教程把 npm 全局安装或某个旧模型名当成当前推荐路径。
2. 还按 Manifest V2 或“先申请 `<all_urls>` 再说”的思路做权限设计。

这两类错误都不是“文字表达差”，而是**直接改变原型结构**。所以正文里凡是涉及：

- 当前 CLI 安装 / 登录流程；
- `plan`、`acceptEdits` 等权限模式；
- MV3 service worker；
- `activeTab` 的临时授权边界；
- `storage.local` 与 popup / content script 的职责；

都必须回到官方资料，并在文章里给出验证日期。

## 选题地图与事实来源如何分层

橙皮书对这篇有两类帮助：

- 它说明“用 Claude Code 快速做一个浏览器扩展原型”是中文读者会关心的真实题目。
- 它提示了“从最小目录和验收路径出发”的写作方向。

但这篇不能把橙皮书当事实权威，原因有三：

1. Claude Code 文档在 2026 年仍持续迭代，安装和权限模式都有变化。
2. Chrome 扩展 API 文档会更新，`tabs`、`activeTab`、测试和 popup 也有新说明。
3. 本文的核心价值不是“转述原书”，而是**用一个实际 fixture 把工程 contract 讲清楚**。

所以最终策略是：

- **官方文档**负责证明当前行为；
- **真实 showcase**负责证明本文不是空谈；
- **橙皮书**只保留为中文题目地图与署名来源。
