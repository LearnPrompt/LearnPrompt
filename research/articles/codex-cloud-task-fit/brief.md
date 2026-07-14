# Brief：Codex Cloud 适合什么任务

## 问题

旧稿只列了四条“适合云端 / 不适合云端”清单，缺少真正能指导 handoff 的机制：

1. 没有解释 Cloud 任务的真实运行形态，只是抽象地说“异步 Agent”。
2. 没有把“适合上云”拆成可以在提交前机械检查的门槛。
3. 没有一个具体 bug 展示：什么叫 repo-contained、deterministic、clean-checkout、acceptance-command。
4. 没有区分本地预演和真实 Codex Cloud 运行，容易把 dry run 冒充成“已经在云端跑过”。

## 目标读者

已经知道 Codex 有 Cloud 入口、也会写基本测试命令，但还拿不准“哪些任务可以放心委派到 Cloud，哪些仍应留在本机或先做 discovery”的工程师、技术 PM 或内容作者。

## 学习目标

读完后读者能：

1. 用 2026-07-11 的官方文档，准确描述 Codex Cloud 的 container checkout、setup / maintenance、agent phase、diff / PR / follow-up、缓存与网络边界。
2. 用四条条件判断一个任务是否适合进入 offline-first、无人值守 handoff lane：repo-contained、deterministic、clean-checkout、acceptance-command；不把它误写成 Cloud 的能力上限。
3. 重跑 `cloud-handoff-lab`：先跑 `cloud-fit-gate`，再在干净临时 HOME 里应用 fix 并通过测试；同时看到四类稳定拒绝。
4. 讲清 env var 与 secret 生命周期差异，不把本机 keychain、浏览器登录态、未提交文件误写成“Cloud 也能顺手拿到”。

## 中心论点

对可预测、无人值守的 Codex Cloud handoff，重点不是任务大不大，而是它能否在隔离 container 的假设里成立。本文四条 gate 是保守的 offline-first 路由，不排除 Cloud 用于探索、follow-up 或经最小 allowlist 配置后的联网任务。对实操者最重要的不是背概念，而是在提交前先过四个问题：

- 任务是否 **repo-contained**，不依赖本机私有文件、浏览器登录态或本地 App。
- 任务是否 **deterministic**，目标和允许路径已经冻结，而不是边看边决定。
- 任务是否可从 **clean checkout** 重新开始，不吃 warm cache 或本机 HOME 状态。
- 任务是否有明确 **acceptance command**，让 diff 和测试可以机械验收。

## 非目标

- 不创建真实 Cloud task，不声称本篇 Showcase 已经在 OpenAI 托管 container 内执行。
- 不比较 Cloud 与 CLI / IDE / 桌面 App 的模型能力排名。
- 不展开企业级环境治理细节，例如 workspace 管理员如何统一缓存和 secret 生命周期。

## Showcase 问题

构造一个最小 Node 仓库 `cloud-handoff-lab`，故意留下一个 timezone rollup bug：函数按 UTC 日期分桶，导致夜间事件落到错误的本地自然日。然后：

1. 冻结 task contract 与 environment contract。
2. 用 `cloud-fit-gate` 判定这是否适合交给 Codex Cloud。
3. 在 clean temp HOME、无 agent 网络、无 secret、无本机文件的预演环境里应用唯一 patch 并跑测试。
4. 分别让 `~/Library/Keychains`、浏览器登录态、缺验收命令、任务方向不明确的场景被 gate 稳定拒绝。

## 需要的证据

- 官方一手文档：
  - `https://learn.chatgpt.com/docs/environments/cloud-environment`
  - `https://learn.chatgpt.com/docs/cloud/internet-access`
  - `https://learn.chatgpt.com/docs/prompting`
- 本机 `codex-cli 0.142.2` 的 `codex cloud --help` / `codex cloud exec --help` 摘录。
- `cloud-handoff-lab` 的 task contract、environment contract、gate、patch、结果摘要和 privacy scan。
- 一张原创教学图，解释从任务卡到 gate 决策再到 clean-room replay 的链路。

## 需要回答的关键问题

1. 为什么“有测试”还不够，仍要加 repo-contained / deterministic / clean-checkout 三条？
2. 官方文档里的 setup script、maintenance script、cache、env vars、secrets 各自影响哪一步？
3. 什么时候应该先在本地 `/plan` 或交互会话里收敛任务，再考虑 Cloud？
4. 为什么 PR、diff 和 follow-up 属于 Cloud 输出面，但不等于任务天然适合上云？

## 验收条件

- 公开页删除旧的来源卡片组件，只在底部来源区保留真实官方资料和橙皮书题图来源说明。
- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`，不自评 PASS。
- 正文至少 8000 正文字符、至少 2500 中文解释字符、至少 6 个 H2。
- 至少一个本地原创教学 SVG，并在 `asset-ledger.md` 完整记录用途、来源、许可和验证日期。
- 重跑 `node research/articles/codex-cloud-task-fit/showcase/cloud-handoff-lab/scripts/verify-showcase.mjs`、partial validator、49 页构建和 staged diff check。

## 目标文件

- `starlight/src/content/docs/codex/codex-cloud-task-fit.mdx`
- `research/articles/codex-cloud-task-fit/`
- `starlight/public/images/articles/codex-cloud-task-fit/`
