# Vertical research：从“失败了”到“下一轮的最小改动”

围绕中心问题——反馈层到底把环境信号变成了什么——从现象追到机制、失败模式与边界。标注哪里是一手事实、哪里是编辑综合。

## 现象：同样是失败，有的能立刻修，有的越改越乱
构建挂了、测试红了、用户说“不对”。差别不在失败本身，而在失败之后手里握着什么。只握着“失败了”三个字，下一步就只能整段重写或换个方向瞎猜；握着“文件 X 第 5 行，期望 hello-world，实际 Hello-World”，下一步就是一处最小改动。反馈层就是决定手里握着哪一种的那一层。

## 机制一：好反馈的四个属性（编辑综合，逐条有一手支撑）
把一手建议推到底，一条反馈信号有用与否，可以拆成四个能被检查的属性：

1. 可定位——信号指向具体文件、行号或配置，而不是泛泛的“有问题”。（对应官方“show evidence… the command it ran and what it returned”。）
2. 可判断——两个人看同一条信号会得出同一个 pass/fail。（对应 demystifying-evals：“two domain experts would independently reach the same pass/fail verdict”。）
3. 低延迟——从行动到拿到信号的时间越短，闭环越紧。（对应 best-practices：“The best results come from tight feedback loops”。）
4. 可执行——信号能直接翻译成下一步动作，而不是还要再解释一轮。（对应 best-practices：“give Claude something that produces a pass or fail, and the loop closes on its own”。）

编辑判断：四属性是 LearnPrompt 对官方“可验证信号”建议的操作化归纳，方便审计和教学，不是某家产品的官方术语。

## 机制二：为什么模糊信号会放大改动面
模型和人一样，拿不到定位就只能扩大搜索范围。best-practices 明说，没有可跑的检查时，“looks done”是唯一可用信号，人被迫成为验证回路——每个错误都要等人发现。反过来，官方给的“address root causes”对照例子里，好提示的差别正是把报错原文喂进去。Showcase 用最小仓库把这条落地：同一次失败，模糊通道只回“构建未通过”，可操作通道给出 file:line + expected/actual，只挂大小写一条，搜索范围因此从“重写函数”收窄到“小写化相关修复”。

## 机制三：缩短反馈延迟＝把最快的验收放进最内圈
反馈延迟不是玄学，是一条命令的耗时。全站构建几十秒、单元测试几十毫秒。best-practices 把 tight feedback loop 列为“最好的结果来源”，并给出层层加码的 gating：一条 prompt 内自查最快、`/goal` 每轮复检、Stop hook 作为确定性闸、第二意见最重。工程含义是：内圈用最快最精准的信号（针对性单测），外圈才用慢而全面的信号（全量构建、独立评审）。Showcase 里 `node --test` 内层用例不到 1ms、整个 runner 约 39ms，正是最内圈该放的东西。

编辑判断：“最快验收放最内圈”是对 tight-loop 建议的工程化表述。

## 机制四：从失败证据定位最小改动
可操作信号自带定位：断言给出期望值与实际值，测试名和行号缩小到具体用例。诊断动作因此变成“把期望与实际的差映射到相关代码区域”。Showcase 中，期望全小写、实际首字母大写，且只有大小写用例挂——证据将范围收窄到小写化问题；本文选择 trim 后加一步 toLowerCase 的一行候选补丁。demystifying-evals 的“grade what the agent produced, not the path”也提醒：验收只认输出，不规定唯一实现，所以 pass 只能证明候选满足当前用例。

## 机制五：何时停止、何时升级（一手事实密集）
停止和升级是反馈层最容易被漏掉的一半。

- 停止：全部验收通过就停，别在绿灯之后继续改。best-practices 的四档 gating 里，`/goal` 由独立 evaluator 每轮复检直到条件成立；long-running agents 用 sprint contract 事先定义 done。
- 升级：信号不再变化或撞上预算，就该换人或换层，而不是死循环。best-practices 给了两条具体线：Stop hook“Claude Code overrides the hook and ends the turn after 8 consecutive blocks”（确定性上限）；以及“If you've corrected Claude more than twice on the same issue… Run /clear and start fresh”（同一问题纠正超过两次就换策略）。long-running agents 里，sprint 失败会把“detailed feedback on what went wrong”交回生成者，而不是无限重试同一路径。

编辑判断：把“连续不变的信号”视为升级触发条件，是对上述一手线索的综合表述。

## 反馈层 vs 其余四层（编辑综合，边界清晰）
- state（状态）：状态存“下一轮要记住什么”（目标、上次失败证据）；反馈是这一轮从环境拿到的新信号。反馈流进状态，但不是状态本身。
- memory（记忆）：记忆是跨会话的偏好与事实；反馈是回路内、即时、会随每次行动刷新的信号。
- evaluation（评测）：评测是产出 pass/fail 判决的那套机制（graders、用例）；反馈层更宽，是拿到判决和报错后把它变成下一步最小动作。评测给判决，反馈层给动作。
- orchestration（编排）：编排决定谁跑、顺序、重试与停止；反馈是编排的停止条件所读取的内容。反馈是信号，编排是读信号后的控制流。

## 边界：什么时候不该靠反馈层解决
- 失败来自工具缺失/权限不足——那是能力层或约束层，信号再清楚也跑不动不存在的命令。
- 根本没有可跑的验收——先补一条能出 pass/fail 的检查，否则无信号可闭环。
- 同一问题反复纠正无效——是该升级、换层或换策略，而不是继续在同一回路里加轮次。
