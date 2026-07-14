# Card 3：异步云端任务（真实阻塞，不是失败伪装）

## 任务

尝试通过本机 `codex cloud` 子命令，把一个任务提交到 Codex Cloud，验证“需要异步交付、不依赖本机环境”的任务能否真的路由到云端执行面。

## 环境

- `codex-cli 0.142.2`，本机 macOS，已登录 ChatGPT 账号（`codex login status` 显示 `Logged in using ChatGPT`）。
- 仓库：`LearnPrompt/LearnPrompt`，当前分支 `codex/phase1-lane-a`。

## 命令与真实结果

完整记录：[attempt.log](./attempt.log)

```text
$ codex cloud list
No tasks found.

$ codex cloud
Error: Device not configured (os error 6)

$ codex cloud exec --env "" "test"
Error: environment id must not be empty

$ codex cloud exec --env "learnprompt-lane-a" "test task"
Error: no cloud environments are available for this workspace
```

## 结论

- `codex cloud list` 返回空任务列表；这只记录本次命令结果，不外推账号、网络或服务的整体状态。
- `codex cloud`（交互式浏览）在当前非交互终端下返回 `Device not configured (os error 6)`。没有进一步控制变量，因此不把原因确定为 TTY、账号或网络中的任何一种。
- `codex cloud exec --env <id>` 需要一个已经在 ChatGPT 网页端为该仓库配置好的云端环境 ID；这台机器和这个工作区目前没有配置过，因此无法进一步提交真实的云端任务。
- 这个结果被如实记录为**阻塞**，而不是被伪造成一次成功的云端执行。它恰好验证了本文的一个核心论点：选择 Codex Cloud 需要**提前**在 ChatGPT 网页端配置好该仓库的云端环境（依赖、密钥、启动脚本），不是临时从本地 CLI 就能零配置跳转过去的。这本身就是"环境依赖"维度里必须提前确认的一项前置条件。

## 对正文的影响

- 正文中关于 Codex Cloud 的描述，改为强调"需要预先配置云端环境"这一前置条件，并引用官方文档而非假设它能零配置使用。
- writer 阶段 `showcase_status` 保持 `partial`。这张卡的验收目标是检查 Cloud environment 前置条件；它没有证明 Cloud 任务执行成功，也不能替代未来在已配置环境中的端到端教程。
