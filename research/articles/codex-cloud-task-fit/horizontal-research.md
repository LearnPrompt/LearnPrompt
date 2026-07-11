# Horizontal research：Cloud task fit

验证日期：2026-07-11。本文把事实层、教学层和主题地图拆开，避免二手资料冒充当前产品行为。

## 1. 官方一手文档：Cloud environment

来源：[Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment)

支持什么：

- Cloud task 的顺序：container checkout -> setup / maintenance -> internet access policy -> agent loop -> answer + diff -> PR / follow-up。
- 默认 container image `universal` 的存在，以及 package versions、setup script、maintenance script、cache invalidation 的边界。
- env vars 与 secrets 生命周期差异：env vars 在整个 task 期间有效；secrets 只在 setup scripts 有效，agent phase 开始前会被移除。

不能证明什么：

- 不能替代真实 task 运行结果。
- 不能证明某个具体仓库已经配置好环境、脚本和依赖。
- 不能证明某个 CLI 版本的本机命令面长什么样。

## 2. 官方一手文档：Agent internet access

来源：[Agent internet access](https://learn.chatgpt.com/docs/cloud/internet-access)

支持什么：

- agent phase 默认无网络，setup scripts 仍可联网装依赖。
- 开启 agent internet access 的主要风险：prompt injection、代码或 secret 外泄、恶意依赖、许可污染。
- 官方建议只开放需要的域名和 HTTP 方法，并复核输出与 work log。

不能证明什么：

- 不能替代我们自己的 repo-contained 判断。
- 不能把“setup 能联网”误解成“agent 默认也能联网”。

## 3. 官方一手文档：Prompting

来源：[Prompting](https://learn.chatgpt.com/docs/prompting)

支持什么：

- Work / Codex 任务应当明确结果、来源、受众、约束和 review 方式。
- 对 Codex，prompt 要点名目标行为、相关代码或复现步骤、保留哪些约束、如何验证变更。
- 多步骤任务需要先计划时，可以先让 Codex 提案，再进入更持久的目标模式。

不能证明什么：

- 不能证明某篇文章的 Showcase 足够好。
- 不能替代 task contract 和 acceptance command 的冻结。

## 4. 本机命令面证据：`codex cloud --help`

来源：`research/articles/codex-cloud-task-fit/showcase/cloud-handoff-lab/results/local-cloud-help.txt`

支持什么：

- 本机 `codex-cli 0.142.2` 确实提供 `cloud`、`cloud exec`、`cloud status`、`cloud diff`、`cloud apply`。
- `cloud exec` 要求 `--env <ENV_ID>`，支持 `--attempts` 和 `--branch`。

不能证明什么：

- 这不是实际 Cloud run。
- 这不能证明当前 workspace 已存在可用 Cloud environment。

## 5. 相邻黄金样稿：`codex-cli-workflow`

来源：仓库内相邻教程 [`starlight/src/content/docs/codex/codex-cli-workflow.mdx`](../../../starlight/src/content/docs/codex/codex-cli-workflow.mdx)

支持什么：

- 教学结构：用真实 fixture、冻结 contract、保留最小证据、把 deterministic gate 放在模型 run 之后。
- 文章节奏：先讲机制，再给 Showcase，再讲边界和练习。

不能证明什么：

- 它是本地 CLI workflow，不是 Cloud behavior。
- 不能直接拿它的 sandbox / exec 结论套到 Cloud。

## 6. 二手主题地图：Codex Orange Book

来源：[alchaincyf/codex-orange-book](https://github.com/alchaincyf/codex-orange-book)

支持什么：

- 作为中文选题地图，提醒“Cloud 适合什么任务”值得单独写，而不是塞进 form factor 总表。
- 仓库 README 明确给出 `CC BY-NC-SA 4.0` 许可，底部可以保留署名与许可说明。

不能证明什么：

- 不能作为 2026-07-11 当前产品行为的一手事实。
- 不能证明 Cloud 的 env var、secret、cache、network 或 follow-up 细节。

## 编辑结论

- 事实层必须以三篇官方文档为主，所有“Cloud 真怎么跑”的句子都要挂一手来源和核验日期。
- 本机命令面只说明 `codex-cli 0.142.2` 的本地入口形状，不冒充实际 Cloud 结果。
- Showcase 的职责不是“替 Cloud 跑一次”，而是证明一个任务已经满足本文 offline-first 无人值守 handoff lane 的四条条件；它不定义 Cloud 的全部适用范围。
