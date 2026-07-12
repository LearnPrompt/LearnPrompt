# Brief：Obsidian Vault 目录怎样才对 Agent 有用

## 问题

旧稿只有 43 行，把 `00_收件箱 / 10_项目 / 20_知识库 / 30_输出 / 50_资源 / 99_系统` 列成了“推荐结构”，但没有回答真正困难的部分：

1. 这些目录怎么从“看起来整齐”的分类树，升级成 **人和 Agent 都按同一规则解释** 的放置 contract？
2. 当 Claude Code 或 Codex 看到一条新材料时，什么叫项目资料、什么叫可复用知识、什么叫外部快照、什么又应该直接拒收？
3. 为什么“编号目录”本身不够，还需要 canonical path、reject/quarantine 边界和 audit plan？

更大的风险是：读者会误以为 `00/10/20/30/50/99` 是 Obsidian 官方标准，或以为只要把目录排得漂亮，Agent 就会自动理解。

## 目标读者

已经在用 Obsidian 管项目资料，也开始让 Claude Code、Codex 或类似 agent 整理公共/合成材料，但不想让它们在整个个人 vault 里递归猜文件该放哪的用户。难度介于入门到进阶之间，更偏工程化整理者。

## 一句话结果

读完后，读者可以把 vault 目录树写成一个可执行的 placement contract：明确 folder roles、canonical path 模板、placement decision、reject/quarantine 边界，以及最小 audit plan。

## 核心主张

对 Agent 来说，目录树不是审美问题，而是**放置协议**。稳定的协议至少要回答五件事：

1. 哪些根目录分别承担什么角色。
2. 什么样的材料会进入哪类根目录。
3. 每类材料的 canonical path 模板是什么。
4. 哪些材料必须 reject，而不是“先随便放一个地方”。
5. 之后如何审计 orphan、role mismatch、unknown root、sensitive placement、duplicate canonical destination。

Obsidian 官方只保证 vault 是文件夹、笔记是 Markdown 明文、外部改动会刷新、`.obsidian` 在根目录、并且不建议 nested vault。本文关于 `00/10/20/30/50/99` 的角色、placement gates、canonical path 和审计步骤，都是 LearnPrompt 的编辑综合，不是官方规范。

## 非目标

- 不宣称 `00/10/20/30/50/99` 是 Obsidian 官方标准或唯一好结构。
- 不重复 `markdown-as-agent-memory.mdx` 对 Markdown 记录语义的展开。
- 不重复 `claude-md-index-navigation.mdx` 对 `CLAUDE.md` / `index.md` 导航法的介绍。
- 不重复 `ai-maintains-knowledge-base.mdx` 的 AI 维护知识库 workflow。
- 不重复 `obsidian-git-workflow.mdx` 的版本控制与回滚工作流。
- 不把 Johnny.Decimal、Orange Book、AGENTS.md、CLAUDE.md 任何一个冒充成 vault placement 标准。

## 来源家族

- 一手产品资料：
  - Obsidian Help：How Obsidian stores data / Manage vaults / Properties
  - OpenAI：Introducing Codex
  - Claude Code Docs：How Claude remembers your project
- 教学参考：
  - Johnny.Decimal 官方站点，用来说明“浅层、可预测结构”为什么有教学价值
- 二手主题地图：
  - `alchaincyf/obsidian-ai-orange-book`

## Frozen Showcase 问题

冻结 `vault-placement-contract`：

- synthetic vault 只有 12 个 inbox items
- 冻结 `inbox-manifest.json` 与 `vault-policy.json`
- deterministic validator 要证明 exit `0/51/52/53/54/55`
- privacy scan 要证明无凭证、runtime id、绝对本地路径泄漏
- writer 只做一次 nested `codex exec` live attempt；如果 sandbox 阻断，则诚实保留历史证据，外层控制器可对同一冻结合同补跑，但不得把首次失败改写成成功

## 需要的证据

- Obsidian 官方页面证明：
  - vault 是本地文件系统文件夹
  - notes 是 Markdown-formatted plain text
  - 外部编辑和文件管理器改动会被 Obsidian refresh
  - `.obsidian` 在 vault 根目录
  - 官方建议不要创建 nested vaults
  - properties 适合小而原子的 human- and machine-readable values
- Codex / Claude Code 官方页面只证明：
  - repo instruction surfaces 会进入 agent context
  - `AGENTS.md` / `CLAUDE.md` 是指导面，不是 vault 目录标准
- Showcase 证明：
  - reference valid plan 为 12/12 accounted、11 placed、1 rejected
  - deterministic exits 完整覆盖
  - Unicode 路径存在并可通过 validator
  - manifest unchanged、no actual moves
  - nested `codex exec` 的 writer run 与外层补跑分层记录；当前补跑须证明只写两份 plan、validator 通过、fixture 未改变

## 验收条件

- 正文至少 6 个 H2、5000 正文字符、1800 去代码中文解释字符。
- 删除 `SourceCard` import / render。
- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`。
- 底部来源保留 Obsidian 官方链接、Johnny.Decimal、Codex/Claude docs、Orange Book 署名与边界说明。
- 一张原创 1400x900 SVG 教学图，解释 inbox -> role decision -> canonical path or reject 和 `51/52/53/54/55` gates。
- 跑 `verify-showcase.mjs`、`privacy-scan.mjs`、partial validator、`npm --prefix starlight run build`、`git diff --check`。
- `review.md` 保持 PENDING，不自评分。

## 目标文件

- `starlight/src/content/docs/obsidian-ai/vault-directory-for-ai.mdx`
- `research/articles/vault-directory-for-ai/`
- `research/articles/vault-directory-for-ai/showcase/vault-placement-contract/`
- `starlight/public/images/articles/vault-directory-for-ai/vault-placement-contract.svg`
