# 纵向研究：从“选入口”到“选执行环境”

## 表面现象

用户看到 CLI、IDE extension、桌面 App、ChatGPT web、Codex Cloud 和 Chrome extension，容易把它们当成互斥产品：“哪个最强？”

## 先拆层级

官方文档里的名词并不都处在同一层：

1. **本地 agent surface**：CLI、IDE extension、桌面 App 中的 Codex agent。它们可以作用于本地项目；官方明确说明这三者继承同一套本地 agent 配置。
2. **远程执行环境**：Codex Cloud。它在为仓库预先配置的隔离环境中运行，交付摘要与 diff。
3. **访问和审查界面**：ChatGPT web。它可发起和审查 Cloud 工作，但托管 Work 会话不读取本地 `config.toml`。
4. **能力插件**：Chrome extension。它由桌面 App 的 Plugins 安装，用于需要已登录浏览器状态的任务；它不是消失的旧产品，也不是与 CLI、Cloud 同层的执行环境。

这四层是本文根据官方文档做的**编辑部综合分类**，不是 OpenAI 发布的正式 taxonomy。

## 为什么仍聚焦四个执行面

本文需要回答的是开发任务在何处执行和如何验收，因此聚焦 CLI、IDE、桌面 App 的 Codex 模式、Cloud：

- CLI：本机终端，适合脚本化、明确命令和即时反馈。
- IDE：贴近已打开代码，可本地迭代，也可把较长任务交给 Cloud。
- 桌面 App：本地项目的任务工作台，可结合文件、浏览器、computer use 与插件。
- Cloud：预先配置的远程环境，适合后台和并行任务，结果以摘要与 diff 供审查。

ChatGPT web 主要作为 Cloud 的发起和审查界面出现；Chrome extension 作为桌面 App 可调用的浏览器能力出现。这样不会再次把执行面、界面和插件混成一张排行榜。

## 真正稳定的四个判断维度

1. **环境依赖**：任务是否需要本地未提交状态、已登录浏览器、特定工具或远程预配置？
2. **反馈节奏**：需要边做边看，还是可以在交付摘要和 diff 后再验收？
3. **权限风险**：sandbox、审批策略、网站授权与 secrets 分别如何限制影响半径？
4. **异步需求**：任务能否离场运行，谁负责回来检查完成条件？

## 失败模式

- 只看命令名，不核对实际 sandbox。Showcase Card 2 运行 `codex review` 时继承了 `danger-full-access`，说明“review”不自动等于只读隔离。
- 把 `--uncommitted` 当成读取范围限制。它指出评审对象，但一次现场运行仍探索了大量无关路径。
- 把 Cloud 当成零配置远程 CLI。Card 3 在 workspace 没有可用 environment 时直接阻塞，任务并未提交。
- 把 Chrome extension 写成过时入口。官方当前仍提供该插件，只是它解决的是已登录浏览器状态，不是代码运行位置。
- 把本地配置共享外推到所有入口。官方只明确说明桌面 App 中的 Codex agent、IDE extension 与 CLI 共用本地 agent 配置；ChatGPT web 与 Cloud environment 有各自边界。

## 适用边界

- 本文不比较模型能力或价格。
- IDE 委派、桌面 App computer use 和 Chrome extension 本次没有现场运行，只引用官方文档。
- Showcase 验证的是路由规则能否暴露权限和环境前置条件，不是四个执行面的功能覆盖测试。
- Cloud environment 的具体配置步骤属于另一篇操作教程。

## 什么时候需要重做这套分类

只要官方改变 surface、配置继承或 Cloud environment 机制，就要重新核对。本文保留验证日期，并把“官方直述”“现场实验”“编辑部综合分类”分开，避免把一次版本快照冒充永久标准。
