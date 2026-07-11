# 纵向研究

## 中心问题

新手怎样把 Codex CLI 从“一次聊天”改造成“检查目录与工作树 -> 冻结 task contract -> 执行最小修改 -> 测试 -> 检查 diff -> 结构化汇报”的闭环，并知道何时该用交互式 `codex`，何时该用自动化 `codex exec`？

## 1. 先分清交互式 `codex` 与自动化 `codex exec`

交互式 `codex` 解决的是“需求还没冻结”的问题：你可以一边读仓库、一边追问、一边调权限。自动化 `codex exec` 解决的是“需求已经冻结，想把它塞进脚本、CI 或一条可重放命令”的问题。两者不是强弱关系，而是任务成熟度不同：

- **交互式**：适合不确定要改哪些文件、需要人及时纠偏、要临场回答“这条路要不要继续”。
- **自动化**：适合目标、允许范围、禁止范围、验收命令已经写成 contract，结果要落成 patch、测试、diff 和结构化报告。

编辑部综合判断：真正让 `codex exec` 稳定的不是“prompt 更长”，而是 contract 更硬。

## 2. 闭环第一步不是写 prompt，而是检查目录与工作树

官方把 `codex exec` 放在脚本与 CI 语境里，还强调默认要求 Git 仓库。这不是官样文章，而是自动化里第一个防错面：

- 目录不对，读到的就是错仓库。
- 工作树不干净，你就不知道 patch 是这次 run 造成的，还是原本就带着脏改动。
- 非 Git 目录里看不到 `diff`，也就没有机械验收的基础。

因此 Showcase 的 prompt 第一件事不是“请直接修 bug”，而是强制 `pwd`、`git status --short`、读取 `task-contract.json`。这一步不是浪费 token，而是在把“执行对象”冻结下来。

## 3. contract 冻结的核心，不是任务描述，而是禁止范围

很多新手会给 Agent 一个目标，却不给边界，例如“把收据号规范化修好”。这还不够，因为真实风险来自越界：

- README 被顺手改了；
- 测试为迎合实现被修改；
- package 或配置被无端碰到；
- 最终结果只有“我修好了”，没有文件范围与验证证据。

所以本文的 `task-contract.json` 不是附属品，而是闭环中心。它至少冻结四类信息：

1. **Goal**：究竟修什么行为。
2. **Allowed paths**：只允许哪一个实现文件改动。
3. **Forbidden paths**：哪些文件就算“改对了”也算违规。
4. **Required checks**：至少要跑什么验证命令与 diff 检查。

这也是 deterministic gate 后面能不调用模型、只读 patch 就拒绝 bad patch 的原因。

## 4. `codex exec` 的关键不是“自动”，而是“输出可以被脚本消费”

官方 Non-interactive mode 文档真正关键的两句，不是“可以脚本化”，而是：

- 默认进度在 `stderr`，最终消息在 `stdout`；
- 打开 `--json` 后，`stdout` 变成 JSONL 事件流。

这意味着自动化脚本不该把整段终端输出当自然语言日志来猜，而应显式决定：

- 要不要解析 JSONL；
- 要不要另存最后消息；
- 最终消息是不是还要再受 `--output-schema` 约束。

Showcase 里三层工件各管一件事：

- raw `stdout.jsonl`：保存事件流和工具调用痕迹；
- raw `stderr.log`：保存启动/环境警告，不拿它当结果；
- `final-report.json`：用 `--output-last-message` 和 `--output-schema` 冻结最终结构化结论。

这让“模型说了什么”和“脚本该相信什么”第一次被分层。

## 5. 权限设置要显式，不要继承本机默认高权限

`codex doctor` 直接暴露了一个现实问题：本机默认 config 已经是高权限环境。如果自动化直接继承它，那么你以为自己在写“最小化可复现教程”，其实是在把个人机器的历史偏好、插件、技能扫描和权限边界一起带进去。

因此 Showcase 显式加了：

- `--ignore-user-config`
- `--ignore-rules`
- `--sandbox workspace-write`
- 全局 `-a never`
- `--ephemeral`

其中最值得新手记住的不是 flag 本身，而是它们对应的四个目的：

- **不继承用户级偏好**
- **不继承本地规则文件**
- **只允许工作区写入**
- **把 raw 结果留在工作树外，不污染 repo**

## 6. “固定模型”也需要版本兼容校验

本轮真实实验先尝试了 `gpt-5.6-sol`，但 `codex-cli 0.142.2` 收到 400 错误：模型需要更新的 CLI。这个失败很关键，因为它证明了一个常被忽略的点：

- 文档里有模型，不等于你当前 CLI 版本能用；
- doctor 里显示的默认模型，不等于 non-interactive run 一定兼容；
- 自动化脚本里“固定模型”必须是**本机可用模型**，而不是“看起来最新的模型名”。

所以最终 Showcase 固定在同仓库同日已实际跑过的 `gpt-5.5`，并把这次 preflight 失败写进环境边界，而不是静默抹掉。

## 7. 真正可复现的不是模型，而是 patch + gate

如果文章只停在“模型成功修了一次”，它仍然是一次聊天记录，不是工程闭环。闭环的关键转折是把模型 run 产出的东西重新拆开：

- patch
- test output
- final report
- file-scope rule
- deterministic gate

随后用一个零模型 gate 去回答两个问题：

1. good patch 是否真的只改允许文件，而且重新跑测试仍过？
2. bad patch 即使内容很小，只要碰了 README 这种 forbidden path，能不能稳定拒绝？

这一步让 `codex exec` 的价值从“它替你写代码”变成“它给你生成了一个后续可以机械验收的候选结果”。

## 8. 为什么不能把 `--ephemeral` 和 `resume` 混为一谈

`codex exec resume --last` 明确依赖“最近一次已记录 session”。而 `--ephemeral` 的定义是不把 session rollout files 持久化到磁盘。两条文档拼在一起的实际含义是：

- 想做流水线、一次性自动化、工作树外 raw capture，用 `--ephemeral`。
- 想在多阶段 pipeline 里继续上一次 recorded run，用普通持久化 exec，再配 `resume`。

这不是 CLI 的矛盾，而是两个不同目标：**可续接** 与 **不落地** 本来就不能同时最大化。本文把它当成 workflow 设计问题，而不是“哪个 flag 更高级”。

## 9. 什么时候不要用 `codex exec`

如果你还答不出下面任意两个问题，先别自动化：

- 允许改哪几个文件？
- 什么命令算通过？
- 什么文件算绝对不能碰？
- 失败后由谁接手？
- 结果给人看，还是给脚本吃？

这时回到交互式 `codex` 更合适。先用会话把 contract 问清楚，再把冻结后的任务交给 `codex exec`。也就是说，自动化不是交互式的替代品，而是它的后继步骤。

## 编辑部综合

本文的机制结论不是官方原话，而是对官方文档、本机帮助和真实 Showcase 的综合：**把 Codex CLI 用稳，核心不是 prompt，而是 contract、patch、测试、diff 和报告之间是否形成了可审计接口。**
