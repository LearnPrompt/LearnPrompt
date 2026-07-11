# Vertical research：为什么 Cloud task fit 需要四条门槛

验证日期：2026-07-11。

## 1. 表面问题：为什么“有测试”还不够

很多团队第一次把任务交给 Codex Cloud 时，往往只问一个问题：有没有测试命令。这个问题太窄，因为通过 `npm test` 只能说明补丁在某个 checkout 下成立，不能说明任务本身真的适合隔离 container。

真正常见的失败来自四类隐式依赖：

1. 需要本机文件，例如 `~/Library/Keychains`、下载目录里的私有 CSV、桌面 App 的缓存。
2. 需要浏览器登录态或已经打开的页面。
3. 目标方向没冻结，Agent 只能“先看看哪里不对”。
4. 代码即使改对了，也没有明确 acceptance command，最后只能靠肉眼判断。

## 2. 官方机制如何逼出这些边界

官方 Cloud environment 文档把 task 生命周期拆得很清楚：

- 先创建 container，并 checkout 选定分支或 commit。
- 跑 setup script；若恢复 cached container，再跑 maintenance script。
- 再应用 internet access policy，其中 agent phase 默认无网络。
- 最后 agent 才进入“编辑、跑检查、验证”的循环，并在结束时展示 answer 与 diff。

这条链路有两个直接推论：

1. 如果任务依赖本机状态，它根本进不到 container 内。
2. 如果任务依赖 warm cache 才能成立，它就不满足 clean replay。

## 3. `repo-contained` 的真正含义

`repo-contained` 不是“仓库里有代码”这么简单，而是：**Agent 需要读取和写入的一切关键输入，都已经在 repo、环境配置或明确声明的外部接口里。**

它排除的不是所有外部系统，而是那些没有被 contract 化、也不在 Cloud 假设里的状态。例如：

- `~/Library/Keychains/login.keychain-db`
- 本机浏览器里早就登录好的管理后台
- 本地 Finder 里的临时素材文件
- 只在你个人 shell profile 里存在的 token

如果这些状态是任务成功的必要条件，那么它更适合本地执行，或者先把依赖外显成环境变量、secret、fixture、API mock、测试输入。

## 4. `deterministic` 为什么要单列

很多“Cloud 不适合”的例子，其实不是权限问题，而是任务方向问题。

示例一：

- 好任务：把 UTC 分桶改成 reporter day，只准改 `src/rollupByReporterDay.js`，最后跑 `npm test -- --test-reporter tap`。
- 坏任务：你先看看日报统计哪里怪，再顺手修一下。

前者的目标、允许路径、验收方式都被冻结；后者仍处于 discovery 阶段。后者不适合进入本文的无人值守执行 lane，因为 Agent 需要一边探索一边决定方向，产出很难在单轮里机械验收；但它仍可以作为需要 follow-up 的 Cloud 探索任务，或先在本地收敛。

这也是 prompting 文档强调“描述结果、提供来源、讲清 constraints 和 how to verify”的原因。本文关注的是冻结边界后的可预测执行，不把这一建议外推成“Cloud 不能探索”。

## 5. `clean-checkout` 为什么能拦住缓存幻觉

官方文档允许 container cache 存活至多 12 小时，并在恢复时只 checkout 当前分支、可选执行 maintenance script。缓存可以加速，但它不能成为 correctness 的前提。

这意味着：

- 你的任务如果只有在 warm cache 命中时才通过，就不是合格 handoff。
- 你的 maintenance script 只能负责“旧缓存上的补依赖 / 更新”，不能偷偷承担冷启动缺失的关键步骤。
- 你的教程不能把“缓存命中过一次”写成“Cloud 一定没问题”。

`cloud-handoff-lab` 的做法是反过来验证：先要求它在 cold clean replay 中通过，再把 cache 解释成优化层，而不是正确性来源。

## 6. `acceptance-command` 是什么层级的 contract

验收命令至少要满足三个条件：

1. 可以从仓库根直接运行。
2. 有稳定退出码。
3. 和目标行为直接对应，而不是泛泛地“跑一遍全部流水线看运气”。

对这个 fixture 来说，`npm test -- --test-reporter tap` 足够好，因为：

- 它只依赖 Node 标准库。
- TAP 输出能被脚本稳定归一化成 `tests / pass / fail`。
- 它直接覆盖 timezone bucket 的核心行为。

缺失 acceptance command 的任务，哪怕代码看起来不复杂，也应该被 gate 以非零退出码拒绝。

## 7. env vars 与 secrets 为什么经常被混淆

Cloud 文档里最容易被忽略的一句，是 env vars 与 secrets 生命周期不同：

- env vars：setup script 和 agent phase 全程可见。
- secrets：只在 setup scripts 解密可用，agent phase 开始前移除。

这件事直接改变 task 设计：

- 如果你的测试本身需要一个值，并且要在 agent phase 使用，它应当是环境变量，而不是只存在 setup 的 secret。
- 如果某个 secret 只是为 setup 装依赖或拉私有包，它可以只放在 setup 侧，不应默认暴露给 agent phase。
- 如果你以为 Agent 能顺手读你本机 token，那不是 env var / secret 生命周期问题，而是 repo-contained 已经失败。

## 8. `AGENTS.md` 在 Cloud 里的角色

官方文档明确写到：如果仓库里有 `AGENTS.md`，agent 会用它寻找项目特定的 lint / test commands。

这不等于：

- `AGENTS.md` 能替代 task contract。
- `AGENTS.md` 能让模糊目标自动变清楚。
- `AGENTS.md` 能把本机依赖变成 Cloud 可得资源。

它真正有用的地方是，把“跑哪个命令、只改哪些路径、什么不该碰”提前内化进仓库。`cloud-handoff-lab/fixture/AGENTS.md` 只做四件事：点名目标文件、限定 allowed path、写明验收命令、禁止本机依赖。

## 9. 负面场景为什么要单独归档退出码

如果教程只给正例，读者很容易把“成功运行一次”误解成“任何类似任务都能上云”。所以这次 Showcase 把四种拒绝单列成稳定退出码：

- `21`：`~/Library/Keychains` 这类 host-only local file dependency
- `22`：浏览器登录态依赖
- `23`：缺 acceptance command
- `24`：任务方向不明确

这让读者学到的不是“某个脚本真会返回什么神奇数字”，而是**上云失败应该在提交前被机械拒绝，而不是在真正 Cloud run 里才靠人工猜测失败原因。**

## 10. 编辑部综合

本文的中心机制可以浓缩成一句话：

> Cloud task fit 不是“这个任务值不值得异步跑”，而是“这个任务是否已经能在隔离 container 的假设里被完整描述、独立执行并机械验收”。

这也是为什么 Showcase 采用“本地预演 + 明确免责声明”的方式：我们展示的是 handoff readiness，而不是伪造一条不存在的 Cloud 运行记录。
