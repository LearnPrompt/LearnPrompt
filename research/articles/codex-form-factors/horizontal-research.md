# 横向研究：执行面、访问入口与能力插件

验证日期：2026-07-11。官方链接从 `developers.openai.com/codex/*` 打开后会跳转到 ChatGPT Learn。以下只记录页面能直接支撑的事实，不用“同一品牌”推导共享账号、模型或权限。

## 官方文档：Codex CLI

来源：[Codex CLI](https://developers.openai.com/codex/cli)。

支撑什么：CLI 在本机仓库中检查、编辑和运行代码；既可交互使用，也可用 `codex exec` 进入脚本与 CI；用户可以选择模型、推理强度、权限和命令。

不能证明什么：CLI 页面不能证明 IDE、桌面 App 和 Cloud 使用相同模型，也不能证明四处任务自动同步。

## 官方文档：Codex IDE extension

来源：[Codex IDE extension](https://developers.openai.com/codex/ide)。

支撑什么：VS Code、Cursor、Windsurf 使用 Codex extension，Xcode 与 JetBrains 有各自集成；IDE 适合利用当前打开的文件和选区做本地迭代；较长任务可以从 IDE 交给 Cloud，之后回来审查结果。

不能证明什么：IDE 页面本身没有把“所有入口共享同一个账号上下文”或“Cloud 读取本地未提交状态”写成保证。

## 官方文档：ChatGPT desktop app 与本地配置

来源：[ChatGPT desktop app](https://developers.openai.com/codex/app)、[Developer settings](https://learn.chatgpt.com/docs/developer-settings?surface=ide)。

支撑什么：桌面 App 可选择 Chat、Work 或 Codex，能处理项目、文件、浏览器、桌面应用和插件；同一项目中，桌面 App 与 IDE extension 可以共享当前任务和编辑器上下文。桌面 App 中的 Codex agent 继承 IDE extension 与 CLI 的 agent 配置，MCP 配置也因为位于 `config.toml` 而适用于这三个本地 surface。

不能证明什么：Developer settings 明确说 ChatGPT web 的 Work 会话运行在托管环境中，不读取本地 Codex 配置。因此不能把 `config.toml` 的共享范围外推到 ChatGPT web 或 Cloud environment。

## 官方文档：Chrome extension 仍然存在

来源：[Chrome extension](https://learn.chatgpt.com/docs/chrome-extension)。

支撑什么：Chrome extension 通过桌面 App 的 Plugins 安装，可从 ChatGPT Work 或 Codex 调用，适合需要已登录浏览器状态的任务；localhost、文件预览和无需登录的公开页面优先使用内置浏览器。Chrome 是当前能力插件，不是已经消失的旧入口。

不能证明什么：Chrome extension 的存在不等于它是一套与 CLI 或 Cloud 同层的代码执行环境。

## 官方文档：Windows 本地运行方式

来源：[ChatGPT desktop app for Windows](https://learn.chatgpt.com/docs/windows/windows-app)、[WSL](https://learn.chatgpt.com/docs/windows/wsl)。

支撑什么：Windows 桌面 App 可以原生使用 PowerShell 与 Windows sandbox，也可以配置到 WSL2；进入 WSL2 后使用 Linux 环境和 Linux sandbox。

不能证明什么：这些是 Windows 平台的本地运行选项，不代表 macOS 或 Cloud 使用相同 sandbox。

## 官方文档：Codex Cloud

来源：[Codex cloud](https://developers.openai.com/codex/cloud)。

支撑什么：Cloud 在隔离远程环境中并行执行较长任务。首次使用要连接 GitHub、为仓库创建 environment，并配置依赖、工具、环境变量或 secrets。任务完成后审查摘要和 diff，可追问或创建 PR。Cloud 可以从 ChatGPT web、CLI、IDE、GitHub、Linear 或 Slack 发起。

不能证明什么：Cloud 页面不会证明某个具体账号或仓库已经有 environment；这需要现场检查。

## 本机验证：Codex CLI 0.142.2

来源：2026-07-11 的 `codex --version`、`codex --help`、`codex cloud --help` 与三张 Showcase 任务卡。

支撑什么：本机版本提供 `exec`、`review`、`cloud`、`app`、`sandbox` 等子命令；`cloud` 可提交、查看、列出、应用和获取 diff。本地实验还验证了 read-only / workspace-write 的不同结果、一次未隔离 review 的失败，以及当前 workspace 缺少 Cloud environment。

不能证明什么：这些结果只代表这一版本、这一机器和当前 workspace，不能作为所有用户的默认状态。

## 二手主题地图：Codex 橙皮书

来源：[alchaincyf/codex-orange-book](https://github.com/alchaincyf/codex-orange-book)，CC BY-NC-SA 4.0。

支撑什么：提供了“不要用一个入口解决所有问题”的选题角度。

不能证明什么：橙皮书把 CLI、IDE、Chrome、桌面并列，混合了执行面和能力插件。本文保留来源与许可，但用当前官方资料重新划分层级，不把它当现行产品事实来源。

## 教学参考

本文沿用同栏目 `ai-coding/choose-claude-code-or-codex.mdx` 的方法：先问工作方式，再选工具。这里进一步要求把官方文档直述、现场实验与编辑部分类明确分开。
