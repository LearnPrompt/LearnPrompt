# Brief：编排层（orchestration-layer）

## 目标文章
- 路径：`starlight/src/content/docs/agent-engineering/orchestration-layer.mdx`
- 章节顺序：agent-engineering / order 6（记忆层之后，作为分层叙事的收口）
- 类型：Agent 工程深度教程（重写旧占位稿）

## 问题
旧占位稿把编排简化成“单 Agent / 多 Agent / 流水线”三选一，并暗示多 Agent 是更高级的方案。真实的工程问题不是“要不要多 Agent”，而是：谁按什么顺序做、谁判对错、判定结果路由到哪一步、失败重试几次、预算多少、什么时候停、什么时候升级给人。占位稿只有四条操作步骤，没有讲清这套控制流，也没有可复现证据。

## 目标读者
已经在用 Claude Code / Codex 等 Agent、开始尝试把多个步骤或多个角色串起来的工程师与进阶用户；尤其是那些一遇到复杂任务就想上多 Agent 的人。

## 一句话产出
读完能把编排层看成一台明确的状态机：先从单 worker + 独立 evaluator + 清晰状态机起步，讲清顺序、角色、路由、重试、预算、停止与升级七个决定，并知道什么时候不该上多 Agent。

## 中心主张
编排层的工作不是“调度多个模型”，而是决定一次任务的控制流：顺序、角色分工、路由、重试预算、停止条件与升级条件。多 Agent 只是其中一种角色拓扑，不是必然更高级的方案；绝大多数任务先用单 worker + 独立 evaluator + 明确状态机就够了。做事的和判分的必须分开，停止和升级必须显式写死，否则就是无限重试或自评放行。

## 非目标
- 不做模型能力排名（Showcase 的 worker 是确定性桩，不跑在线模型）。
- 不替代 feedback / evaluation 专题：本文只讲编排层怎么读验收信号来决定控制流，不深入信号颗粒度（那是反馈层）与 grader 设计（那是评测层）。
- 不深入具体多 Agent 框架 / 消息总线实现细节，那是工程选型，不是本文机制。

## 需要的证据
- 一手来源支撑“探索→规划→实现→提交的顺序”“独立 evaluator 每轮复检”“Stop hook 确定性闸 + 连续 8 次阻塞结束回合”“第二意见 subagent”“分离做事与判分是强杠杆”“sprint contract 事先定义 done”“纠正超过两次就重来”“保持 harness 简单”。
- 一个可复现 Showcase：同一任务经历 inspect/implement/verify/retry/stop，保存状态转换、一次失败、修正后通过、重试预算和升级条件。
- 至少一张教学图，解释状态机 + 角色分工 + 停止/升级条件。

## 验收清单
- 正文 ≥ 5000 字符，去代码后中文 ≥ 1800，H2 ≥ 6。
- 删除 SourceCard，底部保留真实一手来源 + 橙皮书二手主题地图署名。
- 通过 partial validator；`cd starlight && npm run build` 49 页成功。
- writer 阶段保持 `showcase_status: partial`，不写 quality_score / PASS。

## 记录的假设（无人值守下的最小安全假设）
- 沿用 what-is-harness / feedback-loop 的分层叙事、失败开场、Showcase 结构与橙皮书署名方式，本文聚焦“编排层”与其余五层（指令、能力、约束、状态、反馈/评测）的分工。
- Showcase 用 Node 原生模块与确定性 worker 桩实现状态机，避免引入第三方依赖，也避免伪装成真实在线多模型协作。
- 记忆层与反馈/评测层在本系列里是独立主题；本文把“状态/记忆/反馈/评测”都归到“编排读取或依赖的输入”，只划边界不展开。
