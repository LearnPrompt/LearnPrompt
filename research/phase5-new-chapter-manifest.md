# Phase 5 新章节缺口 Manifest

日期：2026-07-12

状态：manifest complete；未创建新 MDX，等待人工确认。

## 审计结论

Loop Engineering 橙皮书的 9 个 section 不应机械变成 9 篇书摘。现有 `five-moves.mdx` 已覆盖定义、Harness 与 Loop 的层级关系、发现 / 交接 / 验证 / 持久化 / 调度五动作和第一个最小循环；其他 40 篇已经覆盖大量零件层内容。

去重后仍有 4 个读者任务值得独立成篇：上线前 readiness、跨轮状态与恢复、独立 evaluator、无人值守运行治理。它们不是给 `five-moves.mdx` 各加一节能解决的问题，因为每个都需要自己的失败矩阵、Showcase 和验收合同。

## 横向研究边界

| 来源 | 本次吸收的可验证问题 | 不直接照搬的部分 |
| --- | --- | --- |
| Loop Engineering 橙皮书 v260615 | 9 section 主题地图、动作与零件区分、验证债/理解腐烂/token 失控 | 不复制 PDF 正文、截图和章节结构；产品事实回官方 |
| Addy Osmani：Loop Engineering | Loop 位于 Harness 上层；automation、worktree、Skill、connector、subagent、外部 memory；验证与理解债 | 文章里的产品映射只作线索，按当前官方文档重核 |
| Anthropic：long-running agents | initializer、feature list、增量进度、git + progress file、端到端测试、fresh context handoff | Claude.ai clone 是实验，不泛化成所有 Loop 的固定架构 |
| Anthropic：generator / evaluator harness | planner / generator / evaluator 分工；独立 evaluator 仍需校准；模型变强后应重新做 harness ablation | 不把 evaluator 当永久必需，也不把主观评分伪装成确定性测试 |
| Stripe Minions | 隔离 devbox、确定性本地检查、CI feedback、最多两轮 CI、人工 review PR | Stripe 内部基础设施与规模不是普通项目模板；不复制“千 PR”宣传为普遍收益 |
| Codex Scheduled tasks / subagents | 手动测试 prompt、最小沙箱、worktree 隔离、review first runs、并行上下文与 token 成本 | Scheduled、local、worktree 与 Cloud 能力按当前 surface 区分 |
| Claude Code scheduled tasks / subagents | `/loop` 的 session/expiry/stop 边界、Cloud/Desktop/GitHub Actions 选择、子 Agent 权限与 worktree | 不把 `/loop`、`/goal` 或 subagent 当成 Loop 设计本身 |

橙皮书当前仓库为 MIT；本 manifest 只使用目录作为主题地图，并以一手来源重新组织判断。

## 九个 section 与现有覆盖

| 橙皮书 section | LearnPrompt 当前覆盖 | 决定 |
| --- | --- | --- |
| §01 Loop 是什么 | `five-moves`、`what-is-harness` | 已覆盖，不新增定义篇 |
| §02 Prompt → Context → Harness → Loop | `five-moves`、Harness 五层、长会话与记忆层 | 做成导航对照，不独立成篇 |
| §03 五个动作 | `five-moves` 的主体与可重放 Showcase | 已覆盖 |
| §04 六个零件 | automations 尚浅；worktree、Skills、connector、subagent、memory 已散布多篇 | 只在 Loop 路径页做索引，不重写六篇 |
| §05 生成器与评判器 | `orchestration-layer` 讲角色分离，但没有教 evaluator 怎样校准、拒绝和证明价值 | **新增 evaluator 教程** |
| §06 三个真实 Loop | 内容自动化、Cloud fit、OpenClaw 已提供不同案例 | 案例进入新篇 Showcase，不单做案例集 |
| §07 验证债、理解腐烂、token 失控 | `feedback-loop`、deployment cost 各覆盖一部分，缺少 Loop 级预算/无进展/kill | **拆入 readiness 与 operations 两篇** |
| §08 当工程师 | 安全底线、审批边界、独立 review 已覆盖原则 | 不做价值观文章；落到操作 gate |
| §09 第一个 Loop | `five-moves` 已有练习和最小可运行循环 | 已覆盖，不重复入门 |

## 建议新增的 4 篇深度教程

### 1. `loop-readiness-gate.mdx`

**读者任务**：在加定时器或 `/loop` 前，判断一个任务是否真的适合循环化，并给出“可上线 / 先补合同 / 保持人工”的结论。

**独立于现有文章的原因**：`five-moves` 教一圈怎样转，`plan-auto-approval-boundary` 教单次动作权限；都没有把重复性、输入水位、确定性验证、可逆副作用、预算和人工升级组合成上线前 gate。

**Showcase：`loop-readiness-gate`**

- 12 个合成候选任务，覆盖 CI 分诊、内容草稿、数据库迁移、生产发布和用户消息。
- 有效 receipt 必须给出 trigger、input watermark、idempotency key、verifier、side-effect class、cost cap、stop/escalate。
- 建议负例退出码：`121` 不可重复发现、`122` 无可靠 verifier、`123` 副作用不可逆、`124` 无幂等键、`125` 无预算、`126` 无人工升级。
- 教学图：任务从 manual → assisted → unattended 的 readiness funnel，不使用产品截图。

### 2. `durable-loop-state-and-resume.mdx`

**读者任务**：设计一份能跨进程、跨会话恢复的 run ledger，让 crash、重复触发和 stale worker 不会重复产生副作用。

**独立于现有文章的原因**：`memory-layer` 讲信息生命周期，`markdown-as-agent-memory` 讲人/Agent 交接，`pipeline-skill-design` 讲单条 Skill 流水线恢复；本篇专门处理循环的 cycle id、watermark、lease、attempt、artifact hash、next action 与幂等。

**Showcase：`loop-run-ledger`**

- 合成三轮 triage，第二轮在副作用前后分别模拟 crash。
- 同一个 trigger 重放两次，只允许一个 accepted side effect。
- 建议负例退出码：`131` ledger schema 缺失、`132` 重复副作用、`133` stale lease、`134` checkpoint 损坏、`135` 无界重试。
- 输出完整 replay receipt，并验证两次 clean replay 的最终 state hash 一致。

### 3. `evaluator-that-can-say-no.mdx`

**读者任务**：把“再找一个 Agent 看看”升级成可校准 evaluator：有冻结 rubric、证据引用、假阳性/假阴性样例和人工升级条件。

**独立于现有文章的原因**：`orchestration-layer` 已证明 maker/checker 应分开，`auto-review-boundaries` 已区分 review surfaces；缺的是 evaluator 本身怎样设计、何时值得成本、怎样证明它不是另一个会点头的模型。

**Showcase：`maker-checker-calibration-lab`**

- maker 产出一组含真实缺陷和诱导性“看似正确”样本。
- 确定性测试先给硬信号，独立 evaluator 只判断机器未覆盖的 rubric。
- holdout 统计假阳性/假阴性；超过阈值不得进入 unattended loop。
- 建议负例退出码：`141` self-review、`142` rubric 无证据、`143` 假阳性超阈值、`144` 假阴性超阈值、`145` 无人工升级。

### 4. `operate-unattended-loops.mdx`

**读者任务**：把已经通过 readiness 的循环放到 session、desktop、cloud 或 CI 中运行，并设置 observability、backoff、预算、no-progress、kill 与人工收件箱。

**独立于现有文章的原因**：`deployment-channels-cost` 面向 OpenClaw，`codex-cloud-task-fit` 判断单个任务是否适合 Cloud；本篇处理跨产品的循环运营合同和持续成本，不教某个按钮。

**Showcase：`bounded-loop-operator`**

- 合成 scheduled triage，包含成功、暂时失败、确定性失败、无进展和预算触顶。
- 采用“先本地快检、最多两轮昂贵检查”的可配置策略；数字是教学 fixture，不冒充 Stripe 默认值。
- receipt 必须含 run id、cadence、permission profile、attempts、token/compute budget、last progress、kill state、human inbox。
- 建议负例退出码：`151` 未 dry-run、`152` 权限过宽、`153` 无预算/退避、`154` 无进展仍继续、`155` 缺 kill、`156` 只报进程存活。

## 不建议独立成篇的内容

- **“Loop Engineering 是什么”**：`five-moves` 已完成，新增只会重复造词史。
- **“六个零件逐个介绍”**：worktree、Skill、MCP、subagent、memory 已有更深教程；需要的是路径索引。
- **“三个大厂案例盘点”**：容易变成品牌故事，案例应服务于 readiness、evaluator、state 或 operations 的具体判定。
- **“工程师不要放弃思考”**：原则正确但不可验收，应落到人工 review、理解抽样和 escalation gate。
- **单独 token 成本篇**：成本只有和 cadence、retry、evaluator、no-progress、fallback 一起才可操作，放入 operations。
- **单独 first loop 篇**：与 `five-moves` 的练习重复。

## 建议生产顺序

若用户批准，按两对进入新的 Phase 6，而不是直接生成 4 篇：

1. Pair A：`loop-readiness-gate` + `durable-loop-state-and-resume`。
2. Pair B：`evaluator-that-can-say-no` + `operate-unattended-loops`。
3. 四篇均 verified 后，再决定是否新增 `loop-engineering/index.mdx` 路径页。

仍沿用两条独立 worktree lane、每篇只调用一次单篇 Skill、独立 reviewer、每两篇完整构建和每 Wave 交叉审计。manifest 获得人工确认前，不创建上述 MDX。

## 一手来源

- [Addy Osmani：Loop Engineering](https://addyosmani.com/blog/loop-engineering/)
- [Anthropic：Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic：Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Stripe：Minions, part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- [Codex Scheduled tasks](https://learn.chatgpt.com/docs/automations?surface=app)
- [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Claude Code scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)
- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents)
- [Loop Engineering 橙皮书](https://github.com/alchaincyf/loop-engineering-orange-book)（MIT；二手主题地图）
