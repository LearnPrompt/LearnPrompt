# Vertical research

验证日期：2026-07-12。

## 中心问题

当一个开发者同时保留 Claude Code 与 Codex 两条通道时，什么才是稳定的交接单位？

## 从“聊天接力”退回到 Git 工件

如果你把交接理解成“把上一段对话摘要给下一个工具”，会立刻踩三个坑：

1. 摘要不包含写集约束，两个工具很容易覆盖同一文件。
2. 摘要不包含基线 commit，后手不知道自己接的是哪棵树。
3. 摘要不包含失败状态，某条 lane 探针失败后，后手仍可能误以为前手已经完成诊断。

因此，本篇把交接单位收敛成 Git 附近的四类工件：

- `contract`：目标、allowed paths、forbidden paths、验收命令、升级条件。
- `receipt`：某条 lane 真实做了什么、没做成什么、用了哪份 baseline 与 contract。
- `patch`：可应用、可 diff、可重放的最小改动。
- `gate`：不调用模型，只验证 SHA、写集、tests、receipt 完整性与状态声明。

## 为什么先做 Claude 健康检查

很多双线流程的隐性假设是：“先让一个工具探路，另一个实现。”真正的问题不在谁先谁后，而在**第一条 lane 有没有真的拿到模型结果**。

如果 Claude lane 连最小探针都没有返回 model result，那么外层 harness 至多只能说：

- 这条 lane 在此刻不可用；
- 你不能伪造 diagnosis receipt；
- 你若继续走 Codex lane，只能进入 `degraded_single_lane`；
- 最终 gate 必须把 “无 Claude completion receipt 但声称 dual_track_complete” 判为失败。

这也是为什么本文把 health receipt 和 diagnosis receipt 分开。前者证明“这条 lane 是否活着”，后者才证明“这条 lane 读过 fixture 并交出可交接结论”。

## 为什么实现 lane 必须进隔离 worktree

让 Codex 在主 checkout 直接修，技术上也许能成，但你会失去两层边界：

1. 无法把实现过程与原始工作区状态彻底隔开。
2. 无法在 integrator 阶段重放“从 baseline 到 patch”的完整路径。

Git worktree 让你拥有：

- 与主 checkout 共享历史，但文件树独立；
- 可以用同一 baseline 冻结多个 lane；
- patch、changed files、tests 都能在独立目录里重验。

这也是官方 worktree 文档的共同底层：无论是 Claude 的 CLI worktree，还是 Codex 桌面 App 的 worktree/Handoff，本质都是把并行或切换放在 Git checkout 这一层，而不是靠脑内记忆。

## 为什么 gate 要同时核对 baseline SHA 和 contract SHA

只核对 baseline SHA 不够，因为任务边界可能在中途漂移；只核对 contract SHA 也不够，因为你可能把 patch 应到错误的代码基线。

因此 gate 至少检查：

1. fresh temp repo 的 baseline commit 是否等于冻结 SHA；
2. Codex receipt 报告的 `contract_sha` 是否等于磁盘上的冻结 contract；
3. patch 改到的文件是否只在 `allowed_paths` 内；
4. 应用 patch 后 `npm test` 是否通过；
5. changed files 与 receipt 是否一致；
6. 如果声称 `dual_track_complete`，是否真的存在 Claude diagnosis receipt。

## 双线什么时候不值得保留

双线不是免费的。它会引入更多 receipt、更多 gate、更多 replay 工件。如果任务满足下面任一条件，保留双线通常不划算：

- discovery 和 implementation 都是 5 分钟以内的单文件小改；
- 没有可执行测试或构建命令，只能凭肉眼判断；
- 你还无法写出 allowed paths 与 forbidden actions；
- 两个工具最终还是会改同一文件，但你没有额外的 reviewer/gate；
- 一条 lane 的失败不会改变任何执行策略，只会让你多收一份无用日志。

## 编辑部综合结论

双工具协作真正可迁移的不是“Claude 做思考，Codex 做执行”这句口号，而是下面这条更硬的流程：

`health check -> diagnosis receipt or degraded flag -> frozen contract -> isolated implementation -> deterministic gate -> independent review`

只要这条链成立，Claude 与 Codex 的角色就可以互换；只要这条链断裂，哪怕两个工具名字没换，流程也不稳定。
