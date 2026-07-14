# Vertical research：从“要不要多 Agent”到“一台明确的状态机”

围绕中心问题——编排层到底在决定什么——从现象追到机制、失败模式与边界。标注哪里是一手事实、哪里是编辑综合。

## 现象：一遇到复杂任务，就想上多 Agent
很多人把编排理解成“单 Agent / 多 Agent / 流水线”三选一，并默认多 Agent 更高级。于是任务一复杂，就先拆成好几个 Agent 并行，最后拿到的是更多文本，不是更稳的结果。真正的问题不在 Agent 数量，而在控制流没定义：谁按什么顺序做、谁判对错、判定路由到哪、失败重试几次、预算多少、何时停、何时升级。编排层就是回答这七个问题的那一层。

## 机制一：编排是一台状态机，不是一堆 Agent（编辑综合，逐条有一手支撑）
把一次任务的控制流拆开，编排层要定死七个决定：

1. 顺序（order）——先做什么后做什么。对应官方四阶段 “Explore first, then plan, then code”：探索→规划→实现→提交；且 scope 清楚时可跳过规划，说明顺序是可裁剪的。
2. 角色（role）——谁执行、谁判分。对应 harness-design：“Separating the agent doing the work from the agent judging it proves to be a strong lever.”
3. 路由（routing）——判定结果决定去哪一步。对应 `/goal`：“A separate evaluator re-checks it after every turn and Claude keeps working until it holds.”
4. 重试（retry）——失败后回哪一步、重试几次。对应 sprint 失败把“detailed feedback on what went wrong”交回生成者去改。
5. 预算（budget）——重试/回合的硬上限。对应 Stop hook：“Claude Code overrides the hook and ends the turn after 8 consecutive blocks.”
6. 停止（stop）——什么算 done。对应 sprint contract：动工前先“agreeing on what 'done' looked like … before any code was written.”
7. 升级（escalate）——不再原地转时换人/换层。对应 “After two failed corrections, `/clear` and start fresh.”

编辑判断：把编排拆成这七个决定，是 LearnPrompt 对官方多条一手线索的操作化归纳，方便审计和教学，不是某家产品的官方术语。

## 机制二：为什么“做事的”和“判分的”必须分开
harness-design 说得很直接：分离执行与判定是强杠杆，因为自评的 LLM 会偏向自己的产物。它还给了一个更细的理由——evaluator 本身也是 LLM、也偏心，但“把一个独立 evaluator 调skeptical，比让生成者自我批判可行得多”。落到 Claude Code 就是 Writer/Reviewer 模式与对抗式 subagent：reviewer 用全新上下文只看 diff 和验收标准，不看产生它的推理，因此不会被“刚写完的代码”带偏。编排层的核心动作，就是保证 VERIFY 这一步不由 IMPLEMENT 的那个角色自己盖章。

## 机制三：路由 = 读判定后决定去哪一步
编排不产生判定，它读判定。demystifying-evals 提醒验收信号要无歧义：“two domain experts would independently reach the same pass/fail verdict”，否则路由本身就会在“到底算不算过”上打转。四档 gating 正是路由强度从弱到强的排列：一条 prompt 内自查最弱、`/goal` 每轮复检、Stop hook 确定性闸、第二意见 subagent 最强。工程含义：路由读的是产物对不对（“grade what the agent produced, not the path it took”），不规定 worker 的实现路线。

## 机制四：重试与预算——把“回哪一步”和“最多几次”分开写死
重试回答“失败后回哪一步”，预算回答“最多几次”。两者都要显式，否则就是无限循环。sprint 失败时，系统把详细反馈交回生成者去改，而不是无脑重跑同一路径——这是“带反馈的重试”。预算则是硬上限：Stop hook 连续 8 次阻塞后被覆盖并结束回合，是一个确定性的次数上限。Showcase 里 `retry_budget` 就是这个整数：用尽后不再回 IMPLEMENT，而是换出口。

编辑判断：把重试与预算拆成两个独立参数，是对上述一手线索的工程化表述。

## 机制五：停止与升级——回路的两个出口
- 停止（done）：什么算完成要事先约定。sprint contract 在动工前就定义 done，任一硬指标没达到即算失败。落到日常就是全部验收通过才收工，别在绿灯之后继续改。
- 升级（escalate）：信号不再变化或撞上预算，就换人/换层，而不是死循环。官方两条具体线：Stop hook 8 次阻塞上限；以及同一问题纠正超过两次就 `/clear` 重来。Showcase 场景 B 把升级做成真实分支：预算用尽后 `handoff=human`、退出码 1，而不是继续重试。

编辑判断：把“连续失败/撞预算”视为升级触发条件，是对上述一手线索的综合表述。

## 机制六：先简单，后复杂——多 Agent 不是默认起点
harness-design 提醒：每加一个编排组件，都是在假设模型自己做不到，这个假设值得反复质疑。Claude Code 也把多会话、agent teams、fan out 放在“automate and scale”一节，作为放大手段，而不是默认起点。所以正确的顺序是：先让单 worker 在清楚边界里、由独立 evaluator 验收、跑一台明确状态机，可靠完成一个小任务；再按需要加并行、路由和长期记忆。多 Agent 只是角色拓扑的一种，不是更高级的代名词。

## 编排层 vs 其余五层（编辑综合，边界清晰）
- 指令（instruction）：指令告诉每个角色“应该怎么做”；编排决定“谁按什么顺序做、谁验收”。指令是内容，编排是控制流。
- 能力（capability）：能力决定角色“能调用什么”；编排决定“在状态机的哪一步允许调用”。
- 约束（constraint）：约束是动作发生前的硬边界（deny/sandbox/审批）；编排的升级出口在约束拦不住、需要人接手时才触发。
- 状态（state）：状态存“下一轮要记住什么”；编排是读状态、写状态、并决定下一步的那台机器。状态是数据，编排是控制流。
- 反馈/评测（feedback / evaluation）：评测产出 pass/fail 判决，反馈把判决翻成下一步动作；编排是读这个信号后决定路由/重试/停止/升级的控制流。评测给判决，反馈给动作，编排给控制流。

## 边界：什么时候不该靠“更多 Agent”解决
- 任务短、边界清楚、单文件——单 worker + 一条验收就够，多 Agent 只增加协调成本。
- 失败来自工具缺失或权限不足——那是能力层或约束层，加 Agent 不会让不存在的命令跑起来。
- 没有能出 pass/fail 的验收——先补一条确定性检查，否则任何编排的停止条件都无信号可读。
- 汇总没有标准——多个 Agent 并行探索，若没有一个能判对错的 evaluator 收口，得到的是更多文本而非更稳结果。
