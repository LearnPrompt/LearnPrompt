# LearnPrompt 全站黄金化生产计划

状态：Phase 0、Phase 1 已完成；Phase 2 Wave A 进行中，当前全站 12 verified / 29 待处理深度教程
基线日期：2026-07-10
仓库：`LearnPrompt/LearnPrompt`
站点目录：`starlight/src/content/docs/`

## 1. 已确认的编辑决策

1. 公开教程不再展示 `SourceCard`。
2. 每篇教程底部保留真实使用过的来源；一手资料、二手主题地图和现场实验必须分开标注。
3. 现有正文可作为待升级母稿，用来保留选题、URL 和已有可用段落；它不是事实权威，也不能跳过重新研究。
4. 如果正文仍引用、复述或改编橙皮书，底部必须保留对应来源与许可说明；不能用改写隐藏来源。
5. 橙皮书只负责提供主题地图。易变的产品能力、命令、价格、权限和工作流必须回到官方资料与现场验证。
6. 每篇深度教程至少包含一张承担教学作用的本地图片；图片必须有具体 alt、紧随其后的图注和 `asset-ledger.md`。封面、Logo、吉祥物或纯装饰 banner 不能单独完成门禁。
7. 橙皮书图片按单个仓库的实际许可使用，记录作者、原始链接、许可、修改方式和核验日期；不能从一本书的许可推断整个系列。
8. `research/` 中用于记录历史实验的 MDX 输出不是公开教程，不随站点教程机械改写，以免破坏证据链。

## 2. 当前基线

公开站点共有 47 篇 MDX：

| 类型 | 总数 | 已验证 | 待处理 |
| --- | ---: | ---: | ---: |
| 深度教程 | 41 | 3 | 38 |
| `start-here` 导航与入门页 | 5 | 0 | 5 |
| `sources` 来源索引页 | 1 | 0 | 1 |
| 合计 | 47 | 3 | 44 |

三篇已验证黄金样稿：

- `agent-engineering/what-is-harness.mdx`：92/100
- `ai-coding/choose-claude-code-or-codex.mdx`：92/100
- `loop-engineering/five-moves.mdx`：89/100

41 篇深度教程当前都使用了 `SourceCard`，但其中 36 篇还没有底部来源章节。因此不能先做一次机械删除；正确顺序是：补齐真实来源、移除 `SourceCard`、完成研究与 Showcase、通过评审。

## 3. 两类完成标准

### 3.1 深度教程 Definition of Done

一篇教程只有同时满足以下条件，才允许标记 `verified`：

- 正文不再 import 或渲染 `SourceCard`。
- 页面底部有“来源与延伸阅读”或同等章节。
- 核心事实至少有一手来源；易变事实记录验证日期。
- 如果使用橙皮书内容，明确标记它是主题地图、引用来源或改编来源，并保留适用许可。
- 至少有一张解释机制、决策、流程、对比或验证结果的教学图片；素材位于 `starlight/public/images/articles/<slug>/`，并有 alt、图注和许可闭环。
- 具备 `brief.md`、横向研究、纵向研究、证据台账、资产台账、Showcase 和 `review.md`。
- Showcase 保存真实输入、环境、命令或步骤、输出、失败和复现边界。
- 深度教程至少有 5,000 个正文字符、去除代码后的 1,800 个中文解释字符和 6 个 H2；这是拒绝占位稿的下限，不是统一篇幅目标。
- 独立审稿得分至少 85/100，且 blocker、major、minor 全部关闭。
- 单篇 validator 通过，Starlight 完整构建通过。
- 最终 frontmatter 使用 `showcase_status: verified` 和审稿确认的 `quality_score`。

目标不是让每篇长度相同，而是让每篇中心问题都有足够证据。概念文、操作文、比较文应采用不同结构。

### 3.2 导航与索引页 Definition of Done

导航页不强制制造 Showcase，也不套用深度教程字数门槛。它们需要：

- 准确描述当前栏目和学习路径。
- 链接只指向已存在页面，不把 `partial` 说成已完成。
- 清理过时入口、重复推荐和旧产品描述。
- 通过内部链接检查与 Starlight 完整构建。
- 由独立 reviewer 检查信息架构、读者路径和遗漏，但使用单独的导航页量表。

## 4. Phase 0：迁移内容契约

本阶段只建立新规则，不批量扩写 legacy 正文。

1. 修改 `.claude/skills/learnprompt-single-mdx/`：
   - 删除强制读取和渲染 `SourceCard` 的要求。
   - validator 改为拒绝公开教程中的 `SourceCard` import/usage。
   - 强制检查底部来源章节、一手来源、二手主题地图标签和许可说明。
   - 强制检查至少一张教学图片、具体 alt、紧随图注、真实本地文件和 `asset-ledger.md` 许可记录。
   - `source_repo`、`source_url` 不再代表唯一母稿；现有值在迁移期保留用于审计。
2. 先对三篇黄金样稿移除顶部 `SourceCard`，保留并复核底部来源。
3. 重跑三篇 validator、独立状态审计和 Starlight 构建。
4. 重新打包 `learnprompt-single-mdx.skill`。
5. Phase 0 完成前，不启动批量 Goal。

Phase 0 验收命令的最终目标：

```bash
rg -n 'SourceCard' \
  starlight/src/content/docs/agent-engineering/what-is-harness.mdx \
  starlight/src/content/docs/ai-coding/choose-claude-code-or-codex.mdx \
  starlight/src/content/docs/loop-engineering/five-moves.mdx

cd starlight && npm run build
```

第一条命令应无匹配，第二条命令必须成功。

Phase 0 最终结果：PASS（2026-07-10）。Skill、validator、三篇黄金样稿、负向校验、重新打包、49 页完整构建与独立只读复审均通过。Phase 1 也已于 2026-07-11 完成，三种母稿全部 verified；当前真实状态见 [`research/phase1-pilot/status.md`](./phase1-pilot/status.md)，Phase 2 可以按 Wave 启动。

## 5. Phase 1：三种母稿的试生产

先选择三篇差异最大的 legacy 稿，验证 Skill 能处理不同起点：

| 母稿 | 类型 | 要验证的问题 |
| --- | --- | --- |
| `ai-coding/project-checklist.mdx` | 41 行操作文 | 能否从极薄清单变成可运行教程 |
| `agent-skills/first-skill-md.mdx` | 156 行已有长稿 | 能否保留可用正文，同时补足研究、Showcase 和边界 |
| `codex/codex-form-factors.mdx` | 高时效产品文 | 能否只用当前官方资料重建事实层 |

三篇都通过后，才允许进入分波次生产。如果其中一种失败，先修 Skill 和 validator，不把同类错误复制到整个栏目。

最终状态（2026-07-11）：`project-checklist.mdx` verified 94/100、`first-skill-md.mdx` verified 93/100、`codex-form-factors.mdx` verified 93/100；三篇均为 0 blocker / 0 major / 0 minor，单篇 validator 与 49 页构建通过。Phase 1 gate PASS。

## 6. Phase 2：38 篇深度教程分波次生产

Phase 1 的三篇计入下列 38 篇总数，不重复生成。

### Wave A：工作方法与 Agent 工程基础（9 篇）

`ai-coding/`：

- [x] `minimum-agentic-coding-workflow.mdx`（Phase 2，verified 94/100）
- [x] `natural-language-to-mvp.mdx`（Phase 2，verified 96/100）
- [x] `plan-auto-approval-boundary.mdx`（Phase 2，verified 89/100）
- [x] `project-checklist.mdx`（Phase 1，verified 94/100）

`agent-engineering/`：

- [x] `instruction-layer.mdx`（Phase 2，verified 93/100）
- [x] `constraint-layer.mdx`（Phase 2，verified 95/100）
- [x] `feedback-loop.mdx`（Phase 2，verified 94/100）
- [ ] `memory-layer.mdx`
- [ ] `orchestration-layer.mdx`

Wave A 前三对已于 2026-07-11 完成：6 篇均完成独立只读终审并关闭全部 finding；12 篇 verified 全量 validator、验证器负例回归和主分支 49 页构建通过。生产记录见 [`research/phase2-wave-a-status.md`](./phase2-wave-a-status.md)。

### Wave B：Claude Code 与 Codex 当前工作流（14 篇）

`claude-code/`：

- [ ] `install-and-first-project.mdx`
- [ ] `minimum-claude-md.mdx`
- [ ] `control-style-with-claude-md.mdx`
- [ ] `advanced-conversation-patterns.mdx`
- [ ] `skills-hooks-mcp-roles.mdx`
- [ ] `multi-agent-collaboration.mdx`
- [ ] `chrome-extension-prototype.mdx`
- [ ] `content-automation-pipeline.mdx`

`codex/`：

- [ ] `codex-cli-workflow.mdx`
- [ ] `sandbox-and-permissions.mdx`
- [x] `codex-form-factors.mdx`（Phase 1，verified 93/100）
- [ ] `codex-cloud-task-fit.mdx`
- [ ] `auto-review-boundaries.mdx`
- [ ] `codex-claude-code-dual-track.mdx`

Wave B 在开始时和整波结束时都要重新核对官方文档。不能用橙皮书中的版本、价格、命令或产品形态替代现行资料。

### Wave C：Agent Skills（7 篇）

- [ ] `what-are-agent-skills.mdx`
- [x] `first-skill-md.mdx`（Phase 1，verified 93/100）
- [ ] `trigger-rules-and-structure.mdx`
- [ ] `checklist-skill-design.mdx`
- [ ] `pipeline-skill-design.mdx`
- [ ] `api-integration-skill-design.mdx`
- [ ] `thinking-distillation-boundary.mdx`

这一波必须避免七篇重复解释 `SKILL.md`。每篇只承担一个中心问题，并通过相互链接组成递进路径。

### Wave D：知识工作台与 Agent 框架（8 篇）

`obsidian-ai/`：

- [ ] `markdown-as-agent-memory.mdx`
- [ ] `vault-directory-for-ai.mdx`
- [ ] `claude-md-index-navigation.mdx`
- [ ] `ai-maintains-knowledge-base.mdx`
- [ ] `obsidian-git-workflow.mdx`

`agent-frameworks/`：

- [ ] `hermes-learning-loop.mdx`
- [ ] `openclaw-architecture-guide.mdx`
- [ ] `deployment-channels-cost.mdx`

涉及个人工作流的 Showcase 必须使用脱敏样例或可公开 mock，不得把本地隐私资料、账号、token 或真实聊天内容写进仓库。

## 7. Phase 3：导航与来源索引收口（6 篇）

深度教程稳定后再修改入口页，避免在生产过程中反复改链接：

- [ ] `start-here/index.mdx`
- [ ] `start-here/how-to-use-this-wiki.mdx`
- [ ] `start-here/ai-practice-map.mdx`
- [ ] `start-here/context-task-verification.mdx`
- [ ] `start-here/setup-safety-basics.mdx`
- [ ] `sources/source-index.mdx`

完成后运行全站链接检查、完整构建，并人工走一遍三条读者路径：第一次使用 AI 编程、已经使用 Claude Code/Codex、准备建设长期 Agent 工作流。

## 8. Phase 4：全站 SourceCard 清零与发布候选审计

当 38 篇教程全部完成后：

```bash
rg -n 'SourceCard' starlight/src/content/docs
rg --files-without-match '^## .*(来源|参考|延伸)' starlight/src/content/docs -g '*.mdx'
cd starlight && npm run build
git diff --check
```

验收要求：

- 第一条命令零匹配。
- 第二条只允许列出不需要来源章节的纯导航页，并由 reviewer 逐项确认。
- 所有教程均有研究目录和最终 `review.md`。
- 38 篇 legacy 教程全部进入 `verified`，不能用 `partial` 凑数。
- 不自动发布；先形成 release candidate 汇总。

确认 `SourceCard` 在公开站点零引用以后，再单独决定是否删除 `starlight/src/components/SourceCard.astro`。不要在还有引用时提前删组件。

## 9. Phase 5：新章节缺口审计

当前 44 篇收口解决的是“已有页面质量”，不代表新课程目录已经完整。

尤其是 Loop Engineering：橙皮书目前有 9 个 section、4 个部分，而站点只有一篇综合性的 `five-moves.mdx`。完成现有页面后，应将橙皮书作为主题地图，与 Addy Osmani、Anthropic、Stripe 和当前 Claude Code/Codex 官方资料横向比对，再决定哪些问题值得拆成独立文章。不要机械做成九篇书摘。

缺口审计的交付物是一个新章节 manifest，至少回答：

- 现有文章已经覆盖什么。
- 哪些问题需要独立教程而不是在旧文加一节。
- 每个新章节的读者任务和独立 Showcase 是什么。
- 哪些内容只是书中结构，不值得进入 LearnPrompt。

只有 manifest 经人工确认后，才进入新增 MDX 阶段。

## 10. `/goal` 编排规则

### 10.1 控制面

- Goal 读取本文件中的 checklist，并维护 `todo / in_progress / review / verified / blocked` 五种状态。
- 每个子任务只处理一个公开 MDX 和它自己的 `research/articles/<slug>/`。
- 每篇调用一次 `/learnprompt-single-mdx`；不能让一次 Skill 调用写多篇文章。
- 使用两个长期隔离 lane，最大并发 2；每个 lane 有独立 worktree 和自己的 `node_modules`，不复用主工作区的 Astro 缓存。
- 同一栏目相邻文章可以并行研究，但不能并发修改同一 MDX、同一研究目录、sidebar、content schema、Skill 或共享组件。
- 共享规则只能由控制面在 Phase 0 或波次边界修改。

### 10.2 单篇状态机

```text
todo
  -> research
  -> draft(partial)
  -> showcase verified
  -> independent review
  -> fixes
  -> validator + build
  -> verified
```

任一阶段失败时保留现场记录并进入 `blocked` 或退回上一状态。不得因为 Goal 需要继续运行而伪造 PASS。

### 10.3 合并边界

- Goal 可以显式授权“每篇一个本地 commit”，以便 worktree 收口和回滚。
- 每篇只在 reviewer PASS 后提交；commit 信息包含文章 slug 和最终分数。
- 每合并两篇，主工作区运行一次完整构建和 `git diff --check`。
- 每个 Wave 结束后做一次跨文章重复检查、术语一致性检查和栏目路径复核。
- 不 push、不部署、不发布，除非用户另行明确授权。

### 10.4 失败预算

- 同一篇最多自动重试两次。
- 第三次仍因资料缺失、工具不可用或 Showcase 无法复现而失败，标记 `blocked` 并继续下一个互不依赖的任务。
- 事实冲突不能靠多数表决解决；回到一手来源或降低结论强度。
- Reviewer 不得使用实现者原会话，也不得在审稿时直接修改正文。

## 11. 可直接用于启动的 Goal 提示词

```text
/goal

目标：按照 research/full-site-production-plan.md，把 LearnPrompt 当前剩余页面升级到黄金样稿标准。

先只执行 Phase 0。Phase 0 的 Skill、validator、三篇黄金样稿和完整构建全部通过后，再进入 Phase 1。不要跳过试生产直接批量生成。

执行规则：
1. 深度教程以现有正文为母稿，但重新核对事实、结构、来源和 Showcase。
2. 公开教程不允许出现 SourceCard import 或组件；底部必须保留真实来源和适用许可。
3. 每个子任务只调用一次 /learnprompt-single-mdx，只处理一篇 MDX 和自己的 research 目录。
4. 使用两个独立 worktree lane，最大并发 2，不共享 node_modules。
5. 允许每篇通过后创建一个本地 commit；不 push、不部署、不发布。
6. 每篇必须通过独立评审、单篇 validator 和 Starlight build，才可标记 verified。
7. reviewer 与 writer 使用独立会话；reviewer 只读，不能直接修正文。
8. 自动重试最多两次，仍失败则记录 blocked 并继续无依赖任务。
9. 每两篇合并后运行全站构建；每个 Wave 结束后检查重复、链接、术语和栏目递进。
10. 按 verified / review / partial / blocked 汇总真实状态，不得把草稿算成完成。

现在执行 Phase 0，并先回报：真实仓库路径、当前 git status、计划修改文件、验收命令和风险边界。
```

## 12. 最终交付清单

- 38 篇 legacy 深度教程升级为 `verified`。
- 5 篇 `start-here` 页面与 1 篇来源索引完成信息架构收口。
- 3 篇原黄金样稿迁移到无 `SourceCard` 的新内容契约。
- 每篇教程有底部来源和可审计研究目录。
- 单篇 Skill、validator 和打包文件与新契约一致。
- 公开站点 `SourceCard` 引用归零。
- 全站构建、链接、diff 和最终独立审计通过。
- 新章节缺口 manifest 单独交付，不与现有 44 篇的完成状态混算。
