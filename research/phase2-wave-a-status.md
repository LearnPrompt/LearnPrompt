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

## 门禁结果

- 两篇最终 `showcase_status: verified`，分数分别为 94 和 96。
- 两张教学 SVG 均通过语义教学价值和 CC BY-NC-SA 4.0 许可审查。
- 两篇单独 validator：PASS。
- 两条 lane 的 49 页完整构建：PASS。
- 合并后 8 篇 verified 全量 validator：PASS。
- Validator 回归：1 positive / 3 depth negatives / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- 主分支完整构建：49 页 PASS。
- 当前全站计数：8 verified / 33 个仍含 SourceCard 的待处理深度教程。

## 深度门禁加固

- 深度教程确定性下限收紧为：正文至少 5,000 字符、去除 fenced/inline code 后至少 1,800 个中文解释字符、至少 6 个 H2。
- 三项只用于拒绝短占位稿；是否有足够机制、证据、权衡、失败模式和教学递进仍由独立 reviewer 判断。
- 当前 8 篇 verified 教程全部重新通过新门禁。
- Skill 已重新打包为 `.claude/packages/learnprompt-single-mdx.skill`，SHA-256 `b54196deb98a2d449170a3f43571df7b842b50c33023dd6fbde50764d01d4bc4`，压缩包完整性检查通过。

## 本地提交

- `9fc4a01 docs(ai-coding): goldenize minimum agentic workflow (94)`
- `95d35a0 docs(ai-coding): goldenize natural language MVP (96)`

没有 push、部署或发布。
