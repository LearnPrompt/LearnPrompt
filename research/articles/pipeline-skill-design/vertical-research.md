# Vertical Research：为什么流水线型 Skill 需要 receipt、checkpoint 和 invalidation

核验日期：2026-07-12。

## 真实问题

“把步骤拆开”只是开始。真正困难的是：**失败以后，你凭什么相信某些阶段已经完成，另一些阶段必须重跑？**

如果答案只能靠模型回忆“我刚刚做到 transform 了”，那还不是工程化流水线，只是更长的对话。

## 编辑部综合：stage contract 的六个部件

以下六个词是 LearnPrompt 在本篇采用的操作模型，不是官方 Agent Skill 规范：

1. `stage contract`
2. `receipt`
3. `checkpoint`
4. `resume`
5. `invalidation`
6. `idempotency`

### 1. stage contract：每个阶段先定义“什么算完成”

如果阶段没有明确输入、输出和退出语义，resume 就只能靠猜。一个最小 stage contract 至少要说清：

- 这一步读什么；
- 这一步写什么；
- 哪条命令负责执行；
- 成功退出码是什么；
- 失败时是否还能保留 checkpoint；
- 下一阶段依赖哪个 output hash。

## receipt：把“做过”变成可审计证据

在本文 Showcase 中，每个阶段都会写一张 receipt，至少包含：

- `stage`
- `input_sha`
- `output_sha`
- `command`
- `exit_code`
- `status`
- `started_seq`
- `finished_seq`

这里刻意不用墙钟时间作为重放判断依据。原因不是时间没用，而是 wall clock 不稳定，写进可重放哈希会让“同样输入、同样输出”在第二次运行时也得出不同结果。

## checkpoint：保存下一轮真正需要复用的状态

checkpoint 不是“任何中间文件都算”。只有当一个阶段的 output 已经与 receipt 绑定，并且下次还能重新验证 `input_sha == current_input_sha`、`output_sha == current_output_sha`，它才值得被 resume。

换句话说，checkpoint 的价值不在“文件还在”，而在“旧证据现在仍然成立”。

## resume：复用的是 receipt 通过验证的阶段，不是复用文件名

resume 的常见误区是：看到目录里有 `transform/` 输出，就直接跳过 transform。这样一旦输入被篡改，旧产物就会悄悄污染后续阶段。

所以本篇 Showcase 把 resume 条件收窄成两步：

1. receipt 能被解析、字段齐全、输出文件存在；
2. 重新计算当前输入后，`input_sha` 仍与 receipt 一致。

只要任一条件不成立，就不能复用。

## invalidation：旧 receipt 在什么条件下必须作废

本文冻结两类失效：

### stale resume

上一次 crash 之后，输入被篡改。此时旧 receipt 不是“部分可信”，而是必须整体拒绝，因为后续阶段依赖的前置输入已经变了。

### missing or corrupt receipt

如果 receipt 丢失、截断或字段损坏，系统连“旧 checkpoint 来自哪次输入”都无法证明，也必须拒绝 resume。

这两类失败分别映射到 exit `32` 和 `33`，目的是让调用方明确区分“输入已变”和“证据损坏”。

## idempotency：完整重跑后，输出 hash 应该稳定

如果 fresh success 跑一遍，完整重跑又跑一遍，在输入完全相同的前提下，最终 candidate hash 还会变化，那就说明流水线里仍有非确定性因素：

- 目录遍历顺序不稳定；
- receipt 混入 wall clock；
- transform 中包含随机值或宿主路径；
- package 阶段把环境噪音写进产物。

因此本文把“完整重跑 output hash 相同”当成 release gate，而不只是“看起来内容差不多”。

## docs-migration-pipeline 为什么适合做教学 Showcase

它具备四个优点：

1. 输入小而固定：只有 3 个 legacy Markdown 文档。
2. 阶段边界清楚：`inventory -> normalize -> transform -> validate -> package-candidate`
3. 失败可冻结：可以稳定模拟 transform 后 crash、输入篡改和 receipt 损坏。
4. 风险可控：只写 migration candidate，不覆盖 source，也不碰真实用户文档。

## 风险与边界

### 这不是官方通用标准

`checkpoint`、`receipt`、`invalidation` 的字段选择是本文为了教学与恢复性设计出的 contract，不应被说成“所有 Agent Skill 都必须这样写”。

### 这也不等于生产发布系统

本文 Showcase 只覆盖本地隔离 repo 中的文档迁移 candidate，不讨论人工审批、发布窗口、外部 CMS、通知系统或真实权限模型。

### resume 不是越多越好

如果输入经常变化、阶段边界本身不稳定，强行 resume 反而比整条重跑更危险。能否恢复，必须服从 contract，而不是服从“省时间”的愿望。
