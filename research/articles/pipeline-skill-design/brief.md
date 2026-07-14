# Brief：流水线型 Skill 设计

## 问题

旧稿只停在“把重复工作拆成多个步骤”，但读者真正卡住的是另一层工程问题：

1. 为什么“把 5 个步骤写进一个大 prompt”不够？
2. 一条可恢复流水线到底要靠什么保存失败位置、判断能不能 resume、以及什么时候必须作废旧 checkpoint？
3. `checkpoint`、`receipt`、`resume`、`invalidation`、`idempotency` 这些词应该落到什么 artifact，而不是停在抽象方法论？

## 目标读者

已经会写基础 Skill，也知道 `SKILL.md`、`references/`、`scripts/` 这些目录概念，但还没把多阶段失败恢复做成可审计骨架的工程师、技术写作者和自动化维护者。

## 学习目标

读完后读者能：

1. 用一手官方资料说明 Skill 目录、渐进加载、持久指令与脚本边界。
2. 说清为什么多阶段任务更适合 stage contract，而不是一个巨大 prompt。
3. 看懂 `docs-migration-pipeline` Showcase 里的五阶段 receipt 链，理解 checkpoint、resume、invalidation 和 idempotency 分别落在哪个工件。
4. 判断什么时候该中止 resume、什么时候该复用旧 receipt、什么时候应该完整重跑。

## 中心论点

流水线型 Skill 的关键不是“把步骤列出来”，而是把每个阶段变成**可验证 contract**：输入哈希、输出哈希、命令、退出码、稳定时序字段、checkpoint 路径和失效条件都写进 receipt。这样失败时恢复的是“上次已证明完成的阶段”，而不是让模型重新猜自己做到哪一步。

## 非目标

- 不重复 [`content-automation-pipeline`](../../content-automation-pipeline/) 已讲过的周报生产与人工发布边界。
- 不重复 `first-skill-md` 已讲过的 frontmatter 字段教程。
- 不把 checkpoint / receipt / invalidation 冒充成某个官方 Skill 规范；这些是 LearnPrompt 在本篇中的操作化设计。
- 不碰真实用户文档；Showcase 只在隔离临时 Git repo 中迁移 3 个 fixture Markdown 文档。

## Showcase 问题

冻结 `docs-migration-pipeline`：

- 输入：3 个 legacy Markdown 文档。
- 输出：只生成 Starlight-compatible migration candidate，不覆盖 source，不发布。
- Skill 位置：`.agents/skills/docs-migration-pipeline/`
- 阶段：`inventory -> normalize -> transform -> validate -> package-candidate`

Showcase 必须回答：

1. fresh success 是否稳定 exit `0`？
2. transform 后模拟 crash 是否稳定 exit `30` 并留下 checkpoint？
3. resume 是否稳定 exit `0`，且真的复用已完成 receipts？
4. 输入被篡改后 stale resume 是否稳定 exit `32`？
5. receipt 缺失或损坏后 resume 是否稳定 exit `33`？
6. 两次完整重跑的 candidate hash 是否一致？
7. 公开 research pack 是否通过 privacy scan？
8. nested Codex 显式 `$docs-migration-pipeline` 调用在 writer sandbox 中是否可用？若不可用，是否留下真实 blocked 记录而非伪造成功？

## 需要的证据

- 一手资料：
  - `https://agentskills.io/specification`
  - `https://learn.chatgpt.com/docs/build-skills`
  - `https://learn.chatgpt.com/docs/customization/overview`
  - `https://code.claude.com/docs/en/skills`
  - `https://nodejs.org/api/crypto.html`
  - `https://nodejs.org/api/fs.html`
- 二手主题地图：
  - `$TMPDIR/agent-skills-orange-book/README_zh.md`
  - `$TMPDIR/agent-skills-orange-book-zh.txt`
- 冻结 Showcase：
  - `research/articles/pipeline-skill-design/showcase/docs-migration-pipeline/`
  - 其中的 fixture repo、Skill、runner、offline replay、privacy scan、一次真实 nested Codex 尝试结果

## 关键问题

1. 为什么“把步骤写进 prompt”无法提供失败恢复证据？
2. stage contract 里哪些字段必须机械校验，哪些字段只是说明？
3. 为什么 resume 不能只看“有没有 checkpoint 文件”，还要重新核对 input hash 和 receipt 完整性？
4. 为什么 idempotency 要靠确定性输出 hash，而不是靠“这次看起来也没问题”？

## 验收条件

- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`。
- 删除 `SourceCard`，底部只保留真实来源和橙皮书限制说明。
- 研究包至少包含 `brief.md`、`horizontal-research.md`、`vertical-research.md`、`evidence-ledger.md`、`asset-ledger.md`、`control-verification.md`、`review.md`、`release-gate-result.txt` 与可重跑 `showcase/`。
- 跑 `verify-showcase.mjs`、一次真实 nested Codex 调用尝试、privacy scan、partial validator、49 页 build、`git diff --check`。
- `review.md` 保持 `PENDING`，等待外层独立 reviewer。

## 目标文件

- `starlight/src/content/docs/agent-skills/pipeline-skill-design.mdx`
- `research/articles/pipeline-skill-design/`
- `starlight/public/images/articles/pipeline-skill-design/`
