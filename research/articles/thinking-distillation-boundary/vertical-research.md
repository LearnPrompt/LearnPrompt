# Vertical Research：thinking-distillation-boundary

## 中心问题

什么时候“把专家判断沉淀成 Skill”是在做可审计的方法复用，什么时候却在索取或误用隐藏思维链？

## 1. “蒸馏”要先从输入边界讲起

OpenAI 当前 reasoning 文档把边界说得很清楚：API 不直接暴露 raw reasoning tokens；能拿到的是显式 opt-in 的 reasoning summary。这个产品边界有两个直接后果：

1. raw chain-of-thought 不是默认可见工件，更不是团队应当公开归档的工作物；
2. 如果作者想沉淀方法，应该优先看**可观察证据**：输入、补丁、纠正、validator、结果，而不是幻想“还原真实脑内推理”。

所以本文所谓 distillation，不是恢复隐藏链路，而是把外显工作证据里的重复规则压缩出来。

## 2. 为什么 receipts 比 transcript 更适合作为 distillation 输入

一份合格 receipt 至少同时回答五个问题：

- 原始输入长什么样？
- 最终接受了什么 patch？
- 用户明确纠正了什么误判？
- validator 用什么命令验证、返回了什么结果？
- 这条规则目前的已知限制是什么？

这五层都来自可观察行为。它们的优点不是“更完整”，而是**更容易留边界**：

- 可以做 privacy scan；
- 可以保留最小必要证据；
- 可以做 holdout；
- 可以稳定比较 candidate 与 baseline；
- 可以直接接 deterministic helper。

而原始 transcript 往往混着三类污染：

1. 隐私与密钥：身份、路径、会话、账号、临时目录、粘贴出来的 token；
2. 旁支对话：调侃、上下文探索、无关需求切换；
3. prompt injection / 越权指令：这些是现场噪音，不是可发布方法论。

因此 transcript 不是“更原始所以更好”，而是“更原始所以更危险”。默认不适合作为公开 Skill 素材。

## 3. reasoning summary、rationale、decision record 不是同一种东西

这篇最容易被写糊涂的地方，是把三种不同层级混成“思维链”：

- reasoning summary：产品允许公开给调用方的高层摘要；
- rationale / decision record：团队自己写的决策记录，重点是“为什么这个 patch 被接受”；
- raw chain-of-thought：模型在推理过程里产生但不直接暴露的内部 token。

前两种都可以进入 research pack，只要它们不伪装成“模型完整内部推理”。第三种则不能默认索取，更不能拿来当 distillation 训练语料。

## 4. candidate 不是 release

Skill authoring 文档与 eval 文档共同指向一个更严格的工程结论：**有了重复 evidence，也只能先生成 candidate。**

原因有三层：

1. 训练 receipts 证明的是“这些规则在历史案例里解释得通”，不是“这些规则对未来所有文件都成立”。
2. holdout 才能回答泛化问题。没有留出集，任何“提炼成功”都只是单次回放。
3. 即使 holdout 4/4，也只能说明这组可观察规则在当前 synthetic contract 上成立，不等于自动覆盖团队现有 Skill。

所以这篇 Showcase 才把产物固定成 `.agents/skills/frontmatter-repair/` candidate，并明确要求人工批准边界。

## 5. 为什么要把拒绝码显式冻结

如果不把拒绝原因编码，distillation 很容易变成一句空话：“这个材料不适合。”

冻结退出码的价值在于：

- `51`：证据不够，缺 observable chain，不是“模型太弱”；
- `52`：材料里有 sensitive marker，先拒绝再说；
- `53`：请求已经越界到 private transcript / hidden CoT；
- `54`：candidate 写出来了，但没通过 holdout。

这让“拒绝”本身也变成可审计工件，而不是作者临场判断。

## 6. 为什么要同时保留 writer blocked 与外层 success

本文的 offline replay 已经证明 distillation contract 能在 synthetic fixture 上稳定给出 `0 / 51 / 52 / 53 / 54 / privacy 0`，并在 normal 场景拿到 holdout `4/4`。

writer 侧真实 `gpt-5.5` 显式 `$observable-receipt-distiller` 调用最终 blocked：`codex exec` 退出码 `1`，stderr 冻结的是多次 `stream disconnected` retry，candidate 没有被写出来，因此后续 `npm test` 也失败。

外层主控随后用同一冻结 fixture、prompt 与 schema 补跑成功：candidate 真实生成，source receipts unchanged，holdout `4/4`，`npm test` 通过，只新增 `.agents/skills/frontmatter-repair/` 与 `reports/`。这层成功没有覆盖 writer blocked，而是证明失败发生在宿主执行面，不在 distillation contract。

这说明：

1. offline replay 与 live model invocation 不是同一层 gate；
2. blocked 证据必须保留，而不是被后续成功覆盖；
3. live success 也不能自动把 candidate 升级成团队默认 Skill，人工批准仍是最后边界。

这正好反证本文中心结论：**不要把单次好结果或单次坏结果都写成“方法已经成立”。**
