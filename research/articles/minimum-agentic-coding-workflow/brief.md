# Brief：Agentic Coding 的最小工作流

## 目标读者

已经会用编码 Agent（Claude Code、Codex 等）改代码，但每次都是一把梭、失败了不知道怎么复盘的初学者。
读者会写提示词，但还没把「一次任务」当成一个有产出、有验收、有回写的闭环来跑。

## 问题

同一个模型，给它一个切好片、能跑验收的小任务就稳；丢一句「帮我把这个做好」就反复翻车。
多数失败不是模型不够聪明，而是把四件事糊在了一起：没先规划就大改、一次 diff 藏了好几个决定、
只问模型「完成没」而不跑客观检查、失败后不把教训写回项目规则于是同一个坑反复踩。
旧稿只有 41 行、一份抽象的四步清单，没有机制、没有可复现证据，还在渲染 SourceCard，
并把 Plan→Patch→Verify→Learn 隐性当成通用做法。

## 中心主张

Plan → Patch → Verify → Learn 是 LearnPrompt 归纳的**操作模型，不是行业标准**。
它的价值不在四个词本身，而在四步各自对应一项可核验的一手能力：
Plan 对应 Claude Code 的 plan mode（只读提计划），Patch 对应可审查的 git diff 切片，
Verify 对应 AGENTS.md 强调的可执行程序化检查，Learn 对应把规则写回 CLAUDE.md/AGENTS.md 这类持久指令。
把这四步跑成一个闭环，能把失败从运行时提前暴露，并且让每次失败都变成下次的规则。

## 学习目标（读完能做什么）

1. 用四步跑完一次真实小任务：写计划、切一个可读 diff、跑最快检查、把教训写回项目规则。
2. 说清每一步锚定哪项一手能力，以及缺这一步会退化成什么。
3. 判断这套循环适合什么任务、什么时候不该用（一次性零风险实验、无法定义验收的需求）。

## 非目标

- 不重复相邻文章：工具选型见《Claude Code 与 Codex 怎么选》；开工前的一次性六格清单见《AI 编程项目的开工与验收清单》；五组件抽象审计模型见《Harness 的五个组件》。本文只聚焦「一次任务内的执行循环」。
- 不做模型跑分，不给工具排名。
- 不把四步说成任何厂商或标准组织的官方流程。

## 需要的证据

- plan mode、AGENTS.md 可执行检查、CLAUDE.md 上下文非强制、git revert/diff 的一手资料。
- 一个可复现 Showcase：在一个最小受控任务（splitEvenly 账单拆分）上跑完整四步，保存计划、真实 patch、最快检查输出、一次故意的边界失败、复盘写回 AGENTS.md 的 before/after。
- 一张原创教学图：四步循环各自的产出、拦截的失败与一手锚点。

## 验收条件

- `cd starlight && npm run build` 退出码 0。
- 确定性校验脚本 `node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs` 通过。
- Showcase 真实运行、脱敏冻结，原始日志只留在仓库外。
- 保持 `showcase_status: partial`，不自评 quality_score，不给自己 PASS，等独立审稿。

## 已记录的假设（无人值守下的最小安全假设）

- 保留 legacy `source_repo`/`source_url` 指向 harness-engineering-orange-book，仅作迁移元数据与主题地图；该仓库无标准开放许可，不复制或改编其图片，产品与工程事实一律回到官方一手资料。
- 四步骨架沿用旧稿命名（Plan/Patch/Verify/Learn），因为它与一手能力能一一对应；但明确标注为 LearnPrompt 操作模型而非标准。
- Showcase 选一个纯本地、无第三方依赖、结果确定的任务（整数分账单拆分），以保证任何读者可复现。
