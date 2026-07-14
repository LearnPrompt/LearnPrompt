# 资产台账

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| /images/articles/memory-layer/memory-lifecycle-and-buckets.svg | 用两栏结构说明并展示记忆层的两个机制：左栏按生命周期把信息分成当前上下文、任务状态、持久项目指令、自动记忆、原始证据五个桶，标注记忆层只管跨会话的后三桶；右栏演示跨会话记忆的写入→召回→淘汰生命周期，解释相关性门控、过期/污染/隐私淘汰，并标出「不召回则零作用（记忆≠自动记住）」 | 依据本仓 research/articles/memory-layer/vertical-research.md 的五桶模型与三段纪律、evidence-ledger.md 条 1–15、showcase/memory-recall/result.txt 的真实结果绘制 | LearnPrompt 编辑部 | CC BY-NC-SA 4.0 | 根据本文教学框架原创绘制 SVG；未复制任何外部视觉资产（none） | 2026-07-11 |

## 说明

- 本文只渲染这一张本地教学图，为原创 SVG，可再分发条款采用 LearnPrompt 仓库的 CC BY-NC-SA 4.0。

- 该图为原创示意图，未使用任何橙皮书或第三方截图。橙皮书（harness-engineering）许可为教育性分享、无标准开源许可，本文一律不复制其图片或成段文字。
- 图中的产品事实（CLAUDE.md 载入、Claude Code auto memory 的 MEMORY.md 索引载入）以 evidence-ledger.md 登记的官方一手文档与本地 CLI 实测为依据；五桶分类及「写入→召回→淘汰」流程是 LearnPrompt 为本文设计的操作模型，并非对任一产品内部实现的复刻。核验日期 2026-07-11。
- 配色为单强调色（teal）+ 暖色副色（amber），扁平、1px 边框，不使用蓝紫渐变。
