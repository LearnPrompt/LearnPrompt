# Review：Instruction Layer

## 评审元数据

- Reviewer：Codex CLI / gpt-5.4，独立只读初审、校准与最终 reviewer。
- 审稿模式：read-only，只读取目标 MDX、研究包、Showcase 与教学资产。
- 隔离声明：reviewer 使用独立只读会话，writer 未参与打分或修改评审结果。
- 原始评审输出保存在仓库外的控制面日志中，未将机器本地路径或运行标识纳入研究包。

## 审稿与修订链路

初审给出 PASS（100/100）且 0 finding，但控制面认为分数相对既有 89–96 分黄金样稿尺度偏松，因此追加严格校准，不直接采用满分。

校准审稿指出一个实质 minor 与两个流程闭环项：

- 将“Codex 超过 32 KiB 整体丢弃”修正为达到 `project_doc_max_bytes` 后停止继续加入后续文件。
- 为五维审计练习补充可观察完成标准。
- 新增 `control-verification.md`，记录 writer 之外的 0/5→5/5、测试失败→通过、深度指标、partial validator 与 49 页构建。

最终 reviewer 确认五维模型与优先级阶梯已标为 LearnPrompt 编辑综合，作者手写候选实现披露充分，所有实质与流程问题均关闭。

## 视觉与内容终审结论：PASS（93/100）

未关闭问题：blocker 0 / major 0 / minor 0

| 维度 | 得分 | 结论 |
| --- | ---: | --- |
| 事实与证据 | 24/25 | CLAUDE.md、AGENTS.md 与 32 KiB 行为有一手锚点，编辑综合和实测边界分开。 |
| 解释深度 | 19/20 | 五维机制、冲突阶梯及与其余 Harness 层的分工完整。 |
| Showcase | 19/20 | 0/5→5/5、失败→通过均可复现，手写候选实现没有冒充模型实测。 |
| 教学设计 | 13/15 | 问题、机制、前后对照、失败边界和带完成标准的练习形成递进。 |
| 时效性 | 10/10 | 当前官方资料按 2026-07-11 核验，限制表述已校正。 |
| 编辑质量 | 8/10 | 中文自然、结构可扫读，无未关闭编辑问题。 |

Visual assessment: PASS
Asset: /images/articles/instruction-layer/instruction-map-and-conflict.svg
Teaching role: 把五个可执行维度与冲突优先级阶梯可视化，直接支撑正文核心机制与练习迁移。
Decorative-only: no
Rights: CC BY-NC-SA 4.0
Issues: none

最终状态：PASS
