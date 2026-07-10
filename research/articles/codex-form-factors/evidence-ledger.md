# 证据台账

| 编号 | claim（正文中的事实主张） | evidence（证据） | evidence type | 验证日期 | 置信度 | limitation |
| --- | --- | --- | --- | --- | --- | --- |
| E1 | 官方将 ChatGPT desktop app、ChatGPT web、Codex CLI、Codex IDE extension、Codex cloud 分列为可用入口 | [Codex CLI](https://developers.openai.com/codex/cli) 页面导航的 Available on | 一手官方文档 | 2026-07-11 | 高 | “本文聚焦四个执行面”是编辑部范围选择，不是官方四分法 |
| E2 | Chrome extension 当前仍存在，并通过桌面 App 的 Plugins 安装；适合需要已登录浏览器状态的任务 | [Chrome extension](https://learn.chatgpt.com/docs/chrome-extension) | 一手官方文档 | 2026-07-11 | 高 | 它是能力插件，不等于独立代码执行环境 |
| E3 | IDE extension 可在本地工作，也可把较长任务交给 Cloud | [Codex IDE extension](https://developers.openai.com/codex/ide) | 一手官方文档 | 2026-07-11 | 高 | 本次未在图形化 IDE 中现场运行 |
| E4 | 同一项目中，桌面 App 与 IDE 可共享任务和编辑器上下文；桌面 App 中的 Codex agent、IDE 与 CLI 继承同一套本地 agent 配置 | [Developer settings](https://learn.chatgpt.com/docs/developer-settings?surface=ide) | 一手官方文档 | 2026-07-11 | 高 | 文档同时明确 ChatGPT web 的托管 Work 会话不读取本地 Codex 配置，不能外推到 web/Cloud |
| E5 | Windows 桌面 App 可原生使用 PowerShell 与 Windows sandbox，也可配置到 WSL2 | [Windows desktop app](https://learn.chatgpt.com/docs/windows/windows-app)、[WSL](https://learn.chatgpt.com/docs/windows/wsl) | 一手官方文档 | 2026-07-11 | 高 | 只描述 Windows 本地运行方式 |
| E6 | Cloud 在隔离远程环境中运行；首次使用要连接 GitHub、创建 repository environment，并配置依赖、工具、环境变量或 secrets | [Codex cloud](https://developers.openai.com/codex/cloud) | 一手官方文档 | 2026-07-11 | 高 | 不证明当前账号或 workspace 已经完成配置 |
| E7 | Cloud 可从 ChatGPT web、CLI、IDE、GitHub、Linear 或 Slack 发起，完成后审查摘要与 diff | [Codex cloud](https://developers.openai.com/codex/cloud)、[Codex IDE extension](https://developers.openai.com/codex/ide) | 一手官方文档 | 2026-07-11 | 高 | 各入口的管理员权限与可用性可能不同 |
| E8 | 本机 `codex-cli 0.142.2` 提供 `exec`、`review`、`cloud`、`app`、`sandbox` 等子命令 | 本机 `codex --help`、`codex cloud --help`、`codex --version` | 现场实验 | 2026-07-11 | 高 | 仅代表这一台机器和这一版本 |
| E9 | `read-only` + `approval_policy=never` 拒绝写入；CLI 进程仍可能退出 0，所以退出码不等于任务成功 | `showcase/card-1-local-sandbox/attempt-1-readonly.log` 与文件不存在检查 | 现场实验（已脱敏） | 2026-07-11 | 高 | 只验证这一种参数组合 |
| E10 | `workspace-write` 允许本次任务写入指定 probe，实际 diff 只有一行新文件 | `showcase/card-1-local-sandbox/attempt-2-workspace-write.log`、`probe.txt` | 现场实验（已脱敏） | 2026-07-11 | 高 | 单次最小任务不能证明所有 workspace-write 行为 |
| E11 | 一次直接 `codex review --uncommitted` 调用继承了 `danger-full-access`、探索了无关路径，且没有输出预期的结构化漏洞结论 | `showcase/card-2-independent-review/review-output.log` | 现场实验（已脱敏） | 2026-07-11 | 高 | 只说明这次未隔离调用失败；不代表显式 read-only 的独立 review 也会如此 |
| E12 | 当前 workspace 没有可用 Cloud environment，`codex cloud exec` 没有提交任务 | `showcase/card-3-cloud-async/attempt.log` | 现场实验 | 2026-07-11 | 高 | 只反映当前 workspace，不代表 Cloud 服务不可用 |
| E13 | 橙皮书提供“不要用一个入口解决所有问题”的选题角度，但其并列结构混合了执行面与能力插件 | [alchaincyf/codex-orange-book](https://github.com/alchaincyf/codex-orange-book)（CC BY-NC-SA 4.0）与 E1-E7 对照 | 二手主题地图 + 一手文档对照 | 2026-07-11 | 高 | 橙皮书不作为当前产品行为的事实权威 |
