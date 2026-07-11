# Phase 2 Wave C 生产状态

更新时间：2026-07-12

## 第一对结果

| 文章 | Showcase | 独立终审 | 最终状态 |
| --- | --- | --- | --- |
| `agent-skills/what-are-agent-skills.mdx` | `receipt-renamer-skill`：真实 `$receipt-renamer` 显式调用成功；dry-run 报告写出；fixture tests 4/4；deterministic gate 为 0/21/23；privacy 0 | Codex Spark 独立只读终审，blocker/major/minor = 0/0/0，96/100 | verified |
| `agent-skills/trigger-rules-and-structure.mdx` | `skill-router-lab`：broad / bounded 各 4 个 fresh implicit runs，另有 1 个 bounded explicit control；两版均为 TP2/FP0/FN0/TN2，显式 loaded=true；malformed result 被拒绝 | 初次报告内容 0/0/0 但算术文字与视觉字段不自洽，未采纳；新的独立只读 follow-up 终审 0/0/0，93/100 | verified |

## 第二对结果

| 文章 | Showcase | 独立终审 | 最终状态 |
| --- | --- | --- | --- |
| `agent-skills/checklist-skill-design.mdx` | `release-readiness-checklist`：真实 gpt-5.5 显式 `$release-readiness-checklist` 调用写出 JSON / Markdown 报告，tests 2/2；离线 gate 为 0/21/22/23/24；privacy 0 | Codex Spark 独立只读终审 0/0/0，97/100；EOF 与 duration 两次窄审均 PASS，分数不变 | verified |
| `agent-skills/pipeline-skill-design.mdx` | `docs-migration-pipeline`：五阶段 receipt；crash 30、resume 0、stale 32、receipt issue 33；candidate hash 稳定；真实 gpt-5.5 调用如实保留 `work/` 中间态 | Codex Spark 独立只读终审 0/0/0，98/100；EOF 窄审 PASS，分数不变 | verified |

## 关键研究结论

- `what-are-agent-skills` 不重复 `first-skill-md` 的字段红线和最小模板；中心问题是“什么时候值得把重复 prompt 升级成按需加载的工作包”。
- `trigger-rules-and-structure` 把 broad / bounded 视为待验证设计，而不是先写好答案。两版必须共享同一 ground truth；否则 broad 的预测误触发会被错误算成 TP。
- 本轮真实路由实验没有复现 broad 的额外 FP。正文与教学图均保留该负结果，没有为追求故事性重跑到出现预设结论。
- `checklist-skill-design` 的中心问题不是“再列一份清单”，而是让每行都带 evidence、pass rule、severity、N/A policy 与稳定结果；本文退出码是 LearnPrompt contract，不冒充 npm 标准。
- `pipeline-skill-design` 把 resume 定义为“重新验证 receipt 后复用已证明阶段”，而不是性能开关；`work/` checkpoint / intermediate 也会创建，正文没有美化变更范围。
- OpenAI `.agents/skills` / `$skill` 与 Claude Code `.claude/skills` / `/skill-name` 分开说明；客户端扩展没有冒充开放规范字段。
- 橙皮书只作中文主题地图。仓库没有标准开放许可，正文未复制 PDF 原文、截图或图片；底部保留链接、作者、用途与限制。

## Writer、补跑与评审隔离

- 两个 Codex GPT-5.4 writer 各完整读取并使用一次 `learnprompt-single-mdx` Skill；每个 writer 只处理一篇 MDX 与自己的 research 目录。
- 两个 writer 都在独立 worktree 和独立 `node_modules` 中工作，最大并发 2。
- 第二对同样由两个独立 writer lane 完成，每篇各读取一次单篇 Skill；没有跨篇共享 research 目录或 `node_modules`。
- writer sandbox 的 nested Codex 调用受只读状态库、app-server 权限或 DNS 约束；主控保留同一 fixture / prompt / schema / evaluator，从外层补跑，没有伪造成功。
- reviewer 使用新的 Codex Spark `read-only` 会话；原始输出先写工作树外，writer 未参与打分或修改 verdict。
- 四篇均未消耗文章重写重试预算；第二对只发生控制面 EOF / duration 机械修正，并分别经过新的只读窄审。

## 图片与视觉门禁

- `skill-load-chain.svg`：1400×900 原创教学图。第一次实渲染发现五张步骤卡末行越框，扩大卡片并重排 Output 后 PASS。
- `skill-routing-progressive-disclosure.svg`：1400×900 原创教学图。第一次实渲染发现排错区与底部状态卡越界，随后压缩布局并改成真实矩阵后 PASS。
- `release-readiness-gate.svg`：1400×900 原创教学图。实渲染后重排标题、row contract 和退出码标签，消除溢出后 PASS。
- `docs-migration-pipeline.svg`：1400×900 原创教学图。实渲染后重排 invalidation 文本与 resume 说明，消除溢出后 PASS。
- 四张图均有正文 alt、紧随图注、asset ledger 与 CC BY-NC-SA 4.0 许可记录，不是装饰性封面。

## 合并后机械门禁

- 四个 Showcase 均从含中文的真实主仓库路径重放 PASS。
- `receipt-renamer-skill` 初次主仓库重放暴露 Node test duration 导致 tracked diff；测试输出改为 duration 占位符后连续两次哈希一致。
- `skill-router-lab` final verifier 现在要求完整矩阵；缺任一 implicit / explicit 结果会失败，不再以 incomplete 状态放行。
- `release-readiness-checklist` 初次主仓库重放暴露 Node test duration 导致 tracked diff；归一化两类 wall-clock 字段后连续两次完整 replay 的 results 目录哈希一致。
- `docs-migration-pipeline` 主仓库重放保持 source unchanged，candidate hash 稳定为 `cdc8bf70d44838e2239ff00052b092cb0ce7d198b77ec5b581e17f799e8dc892`。
- 31 篇 verified 全量 validator：PASS。
- Validator 回归：1 positive / 3 depth negatives / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- Starlight 完整构建：49 pages PASS。
- 当前全站计数：31 verified / 10 个仍含 SourceCard 的待处理深度教程。

## 本地提交

- `b125ead docs(agent-skills): explain reusable skills (96)`
- `bf8e70c docs(agent-skills): test trigger boundaries (93)`
- `f146f83 docs(agent-skills): build release checklist gate (97)`
- `56159f2 docs(agent-skills): teach recoverable pipelines (98)`
- 本状态提交同时收口第二对 merged-path replay stability 与 Wave C 控制面记录。

## Wave C 剩余队列

- `api-integration-skill-design.mdx`
- `thinking-distillation-boundary.mdx`

没有 push、部署或发布。
