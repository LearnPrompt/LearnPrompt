# 纵向研究：从「为什么并行会翻车」追到机制、失败模式与边界

中心问题：多 Agent 协作到底解决什么，什么时候值得拆、怎么拆才不会互相覆盖，合并时靠什么验收。

## 表层现象

任务一变大，人就本能地开第二个、第三个 Agent，期待线性提速。结果常见三种翻车：
两个 Agent 改了同一批文件，后写的覆盖先写的；接口还没定，两侧各写各的，合并时字段对不上；
下一步明明依赖上一步的结论，却被强行并行，跑出一堆要返工的半成品。表面看是「模型不行」，
实际是并行的前置条件没满足。

## 往下一层：并行的收益从哪来

官方 agent-teams 文档把话说得很直接：agent team「add coordination overhead and use significantly
more tokens than a single session」，只有当 teammates「can operate independently」时才划算；
「For sequential tasks, same-file edits, or work with many dependencies, a single session or subagents
are more effective.」换句话说，并行的收益不来自 Agent 数量，来自任务之间的**独立性**。
如果两个任务共享大量状态、或后者依赖前者的结论，拆开只会把协调成本叠上去，还不如一个会话顺着做。

## 为什么必须先冻结接口、分配不重叠所有权

同一份文档给出最硬的一条约束：「Two teammates editing the same file leads to overwrites.
Break the work so each teammate owns a different set of files.」这不是建议，是机制层面的后果——
两个独立会话/进程各写各的磁盘，谁最后写谁赢。于是安全并行的前提被逼出来：

1. **画依赖图**：哪些任务真的互不依赖，哪些必须串行。依赖未满足的任务不能并行。
2. **冻结接口**：并行的两侧必须先约定一个不变的 contract（字段、格式、schema），
   否则各写各的、合并时对不上。接口一旦冻结，任何一方想改都要先解冻并通知另一方。
3. **分配不重叠的文件所有权**：每个 worker 只拥有一组文件，write set 两两不重叠，
   从源头消除「同文件覆盖」。

这三步做完，并行才从「赌一把」变成「可验证」。

## 为什么需要合并门禁

即使前三步都做了，人也会犯错：某个任务卡里悄悄把 contract 列进了 write set，或者声明的
接口版本和磁盘上的不一致。所以要有一个**合并前**的机械门禁，在应用改动之前检查：
write set 是否两两不重叠、有没有任务触碰冻结 contract、每个任务声明的 contract 校验和是否与磁盘一致、
接口是否都已冻结、依赖是否都已满足。任一条不满足就以明确退出码拒绝，绝不写盘。
门禁之后再跑端到端测试，证明合并后的结果真的对——门禁挡冲突，端到端证结果，两者分工不同。

但“任务卡写着两个 worker”仍不等于它们真的隔离执行。本文因此增加 worker 级证据：协调器同时启动
两个 Node 子进程，把它们的输出根目录分开；每个进程只能产出任务卡里唯一的 owned file，并报告
文件列表、自测结果和输出 SHA。最终集成直接从两份临时目录加载模块。这样证据链才从“计划可并行”
延伸到“两个独立进程确实分别产出、协调器确实消费这些产物”。

## 四种形态怎么选（编辑综合，基于官方能力）

- **单 Agent**：任务短、强依赖、共享状态高。官方反模式提醒别一上来就造复杂多 Agent 系统。
- **subagent**：侧任务（探索、检索、review）会用大量文件读写污染主上下文，但你只需要它回报总结/证据。
  官方：subagent 有独立上下文/工具/权限，只回报主会话，token 成本较低。
- **agent team**：多个独立会话之间需要真正协作——共享任务列表、互发消息、可直接与某个 teammate 对话。
  官方明确当前 experimental、token 与协调成本显著更高，适合 research/review/新模块这类可独立推进的活。
- **worktree session**：需要真正隔离写入与分支。每个 worktree 是独立分支的独立 checkout，
  edits 不相撞，但合并仍是手工/常规 git 流程，不自动。
- **独立 reviewer**：不让 writer 自评。用新上下文只读 diff 与验收标准，官方指出 fresh context
  能减少「偏袒自己刚写的代码」的偏差。

## 失败模式与何时不该并行

- 接口未冻结就并行：合并时字段对不上，返工。→ 规划闸门应判 sequential。
- 依赖未满足就并行：下游拿不到上游结论，白跑。→ 规划闸门应判 sequential。
- 多个 Agent 改同一批文件：后写覆盖先写。→ write set 必须不重叠，门禁应拒绝。
- 为并行而并行：任务本身强依赖或共享状态高，拆开只加协调成本。→ 用单 Agent。
- 让 writer 自评：容易漏掉自己的盲区。→ 用独立 reviewer。

## 编辑综合（非官方结论，需标注）

- 「依赖图 → 冻结接口 → 不重叠所有权 → 合并门禁」这条顺序，是 LearnPrompt 对官方零散约束
  （same-file overwrites、independent operation、fresh-context review）的操作化归纳，不是官方分类，也不是行业标准。
- 合并门禁的四条判据与退出码（0/3/4）是本文 Showcase 的约定，用于把抽象原则变成可机械检查的骨架，
  不代表 Claude Code 产品内置这样一个门禁。
- 本地确定性 Showcase 只证明流程结构，不证明任何模型或 Agent Teams 产品的速度与质量。
