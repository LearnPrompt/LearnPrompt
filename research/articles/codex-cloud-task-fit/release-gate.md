# Release gate：什么才算 Cloud-fit

`cloud-fit-gate.mjs` 不是官方产品的一部分，而是本教程为了教学与 replay 设计的保守 handoff preflight。它只回答一个问题：**这个任务是否已具备进入 offline-first、无人值守执行 lane 的条件。** 它不代表 Codex Cloud 的能力上限；需要探索、follow-up 或有限 agent 网络的任务应进入另一条配置更明确的 lane。

## 本文保守 lane 的四条条件

1. `repo-contained`
   - 不依赖本机文件
   - 不依赖浏览器登录态
   - 不依赖本地 App
   - 不要求 agent phase 持有 secret 或联网拉临时信息
2. `deterministic`
   - 目标行为和预期修复已经冻结
   - allowed paths 明确
   - 不需要 Agent 自己决定“到底哪里有问题”
3. `clean-checkout`
   - 允许从干净 checkout 和干净 HOME 开始
   - 不依赖暖缓存才成立
4. `acceptance-command`
   - 有明确命令和稳定退出码
   - 输出可以被脚本归一化

## 稳定退出码

| 退出码 | 含义 | 示例 |
| --- | --- | --- |
| `0` | 适合进入 Cloud handoff | `positive-clean-room` |
| `21` | 依赖 host-only local file | `~/Library/Keychains/login.keychain-db` |
| `22` | 依赖浏览器登录态 | 需要沿用已登录 dashboard |
| `23` | 缺验收命令 | 只能说“修到看起来对” |
| `24` | 任务方向不明确 | “你先看看哪里不对再修” |

## 为什么不把缓存命中也当通过条件

官方文档允许 cache 加速 setup，但 cache 本身不应成为 handoff 是否成立的前提。对读者更有价值的检验是：

- cold replay 能不能通过；
- warm cache 只会不会更快，而不会改变 correctness；
- maintenance script 只是恢复缓存后的补偿，不是遗漏 setup 的借口。

## 本文的结论边界

- 这个 gate 可以证明某个任务“已适合进入本文的保守 Cloud handoff lane”，不能证明它“在真实 Cloud task 中一定一次成功”，也不能据此否定其他探索或联网 lane。
- 真实提交时，仍然需要用户在产品里选择 environment、branch、review 方式，以及是否开 PR / follow-up。

最终状态：verified 100/100。Showcase replay、privacy scan、validator、49 页 build、diff-check 与独立只读终审均通过。
