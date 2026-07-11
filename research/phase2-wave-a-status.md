# Phase 2 Wave A 生产状态

更新时间：2026-07-11

## 第一对结果

| 文章 | 初审 | 修订后终审 | 最终状态 |
| --- | --- | --- | --- |
| `ai-coding/minimum-agentic-coding-workflow.mdx` | FAIL 72/100；1 blocker / 2 major / 1 minor | PASS 94/100；0 blocker / 0 major / 0 minor | verified |
| `ai-coding/natural-language-to-mvp.mdx` | FAIL 81/100；1 blocker / 1 major / 0 minor | PASS 96/100；0 blocker / 0 major / 0 minor | verified |

## 关闭的问题

`minimum-agentic-coding-workflow`：

- 区分显式规则写回与 Claude Code auto memory，删除跨会话记忆的绝对表述。
- 将第二个 patch 修正为从切片一到切片二的连续增量 diff。
- 补齐正文承诺的研究包链接。
- 将四步循环改为按风险缩放的护栏模型。

`natural-language-to-mvp`：

- `verify.mjs` 改为从脚本自身位置解析文件，可从仓库根目录运行。
- 零命中验收改用静态 fixture，复审过程不写工作树。
- 四维需求冻结法在公开正文中明确标为 LearnPrompt 的编辑综合。

## 第二对结果

| 文章 | 审稿链路 | 最终状态 |
| --- | --- | --- |
| `ai-coding/plan-auto-approval-boundary.mdx` | 初审 FAIL 78/100（2 major / 1 minor）→ follow-up FAIL 86/100（1 major / 1 minor）→ PASS 89/100（0/0/0） | verified |
| `agent-engineering/instruction-layer.mdx` | 初审 100/100 被控制面判定为分数偏松 → 严格校准与修订 → PASS 93/100（0/0/0） | verified |

### 第二对关闭的问题

`plan-auto-approval-boundary`：

- 不再把 Codex `on-request` 或 `untrusted` 包装成确定性的高风险人工批准原语；高风险动作由任务外人类 gate 显式重新授权。
- 将 approval policy 与 sandbox mode 的本机 CLI 证据分别锚定到实际暴露对应参数的帮助命令。
- 删除未核验的 Linux 沙箱实现断言，只保留 macOS Seatbelt 实测与其他平台未核验。
- 将没有实测的 read-only 网络格明确改为“本次未测”。
- 增加控制面复现与构建记录。

`instruction-layer`：

- 将 Codex 32 KiB 行为改为“达到上限后停止继续加入后续文件”，不再写成整体丢弃。
- 为五维审计练习补充可观察完成标准。
- 增加控制面 0/5→5/5、测试失败→通过与构建记录。
- 对初审 100 分主动追加严格校准，最终采用 93 分，避免评分膨胀。

## 第三对结果

| 文章 | 审稿链路 | 最终状态 |
| --- | --- | --- |
| `agent-engineering/constraint-layer.mdx` | 初审 FAIL 87/100（1 major / 1 minor）→ PASS 95/100（0/0/0） | verified |
| `agent-engineering/feedback-loop.mdx` | 初审 FAIL 84/100（1 major）→ PASS 94/100（0/0/0） | verified |

### 第三对关闭的问题

`constraint-layer`：

- 补齐 Codex `approval_policy` 的 granular 对象形态与当前五类提示控制，不再把三个字符串写成完整枚举。
- 更新 Claude Code 当前权限模式，加入 `auto`、`dontAsk` 与 `manual` alias 边界。
- 明确软提醒阶段只是直接 shell 写入，不包装成在线 Agent 违背指令实测；policy gate 只作为教学模型。
- 控制面复现软提醒、2/5 allow gate、read-only 沙箱写拒绝/读通过。

`feedback-loop`：

- 删除“一次失败唯一推出两行补丁”的过度结论，明确反馈只能缩小搜索空间。
- 候选 patch 收敛为只新增 `.toLowerCase()` 一行，并重新复现 fail→pass 与真实单行 diff。
- 正文、Showcase、result、research ledger、asset ledger 和 SVG 统一为“候选修复，不证明唯一实现”。

## 门禁结果

- Phase 2 当前 6 篇最终 `showcase_status: verified`，分数为 94、96、89、93、95、94。
- 6 张教学 SVG 均通过语义教学价值和 CC BY-NC-SA 4.0 许可审查。
- 6 篇单独 validator：PASS。
- 两条 lane 的 49 页完整构建：PASS。
- 合并后 12 篇 verified 全量 validator：PASS。
- Validator 回归：1 positive / 3 depth negatives / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- 主分支完整构建：49 页 PASS。
- 当前全站计数：12 verified / 29 个仍含 SourceCard 的待处理深度教程。

## 深度门禁加固

- 深度教程确定性下限收紧为：正文至少 5,000 字符、去除 fenced/inline code 后至少 1,800 个中文解释字符、至少 6 个 H2。
- 三项只用于拒绝短占位稿；是否有足够机制、证据、权衡、失败模式和教学递进仍由独立 reviewer 判断。
- 当前 12 篇 verified 教程全部重新通过新门禁。
- Skill 已重新打包为 `.claude/packages/learnprompt-single-mdx.skill`，SHA-256 `b54196deb98a2d449170a3f43571df7b842b50c33023dd6fbde50764d01d4bc4`，压缩包完整性检查通过。

## 本地提交

- `9fc4a01 docs(ai-coding): goldenize minimum agentic workflow (94)`
- `95d35a0 docs(ai-coding): goldenize natural language MVP (96)`
- `37fd2ac docs(ai-coding): goldenize approval boundaries (89)`
- `e761f2d docs(agent-engineering): goldenize instruction layer (93)`
- `8884f0e docs(agent-engineering): goldenize constraint layer (95)`
- `f655107 docs(agent-engineering): goldenize feedback loop (94)`

没有 push、部署或发布。
