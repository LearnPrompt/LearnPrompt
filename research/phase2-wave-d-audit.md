# Phase 2 Wave D 收官审计

日期：2026-07-12

范围：`obsidian-ai/` 5 篇、`agent-frameworks/` 3 篇

结论：PASS，8/8 verified，0 review、0 partial、0 blocked。

## 页面与教学边界

| 页面 | 中心问题 | Showcase 证明什么 | 终审 |
| --- | --- | --- | --- |
| `markdown-as-agent-memory` | 什么记录才可交给 fresh Agent | 五文件 handoff packet 的完整性、矛盾、敏感和文本边界 | 97/100 |
| `vault-directory-for-ai` | 一条资料该放在哪里 | role、canonical path 与 reject rail 的可审计分流 | 96/100 |
| `claude-md-index-navigation` | 如何控制读取范围 | `CLAUDE.md + index.md` 的路由预算，而非假装 index 自动加载 | 100/100 |
| `ai-maintains-knowledge-base` | AI 何时只能提出维护建议 | evidence-led proposal、人工审批与禁止直接改库 | 97/100 |
| `obsidian-git-workflow` | 如何隔离并验收批量改动 | candidate worktree、accepted diff、commit receipt 与丢弃边界 | 86/100 |
| `hermes-learning-loop` | “学习”如何落到可观察写入 | memory / Skill 分流、approval 和 Curator 边界 | 100/100 |
| `openclaw-architecture-guide` | 谁拥有状态，一条消息怎样通过门禁 | Gateway 控制面、channel/node 路由、暴露面与全目录写边界 | 98/100 |
| `deployment-channels-cost` | 如何同时选择拓扑、渠道和预算 | availability、persistence、health、变量成本、cap/fallback/kill | 100/100 |

八篇没有复用同一个中心问题或同一个 Showcase。栏目递进从“记录与放置”，进入“导航与维护”，再进入“变更控制、学习写入、运行架构与上线预算”；相邻文章中的 `memory`、`index`、`approval`、`Gateway`、`health` 和 `cost` 均按各自层级使用，没有把模型上下文、持久记录、模型权重或配置存在混为一谈。

## 图片、来源与许可

- 8/8 至少引用一张本地教学图，均有具体 alt、紧随图注和 `asset-ledger.md`；终审视觉结论全部 PASS。
- 公开 MDX 中 `SourceCard` 为 0；每篇底部保留实际使用的一手资料、现场实验边界和 Orange Book 主题地图署名。
- Orange Book 仓库只作为二手主题地图。没有复制 PDF 正文、截图或图片；对未提供标准 LICENSE 的仓库明确记录非标准许可边界。
- 易变能力回到 Anthropic、OpenAI、Obsidian、Git、Nous/Hermes 与 OpenClaw 官方资料；OpenClaw 版本事实冻结到文章记录的核验日期。

## 外链审计

从 8 篇公开 MDX 抽取 54 个唯一 HTTP(S) URL，并于 2026-07-12 使用重定向跟随和 20 秒超时并发检查：

- 51 个返回 `200`。
- `https://openai.com/index/introducing-codex/` 对自动请求返回 `403`，属于站点防自动访问结果，不能据此判定页面失效；发布前需浏览器人工复核。
- 两个指向 `github.com/LearnPrompt/LearnPrompt/tree/main/research/...` 的证据链接返回 `404`，因为对应 research 目录尚未 push 到公开 `main`。它们不是当前发布候选的通过项；Phase 4 必须在目标提交进入远端分支后复核，或在发布前改成稳定公开链接。

## 机械门禁

- 8 套 Showcase 在包含中文的真实主仓库路径重放通过；有效场景、负例、privacy、protected files 和写边界均 PASS。
- 41/41 `showcase_status: verified` 页面逐篇通过 `validate-golden-mdx.mjs`。
- Validator 回归通过：1 positive、3 depth negatives、11 privacy negatives、11 visual negatives、7 review negatives。
- `npm run build`：49 pages PASS。
- `rg -n 'SourceCard' starlight/src/content/docs -g '*.mdx'`：零匹配。
- 审计前主仓库 clean；审计只修改控制面文档，不改已终审正文。

## 发布边界

Wave D 可以结束并进入 Phase 3。尚未 push、部署或发布；两个 research 深链接和 OpenAI 403 必须在 Phase 4 发布候选审计中保留为显式复核项。
