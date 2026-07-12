# Phase 4 全站发布候选审计

日期：2026-07-12

候选分支：`codex/full-site-goldenization`

结论：内容与机械门禁 PASS；形成可提交远端复核的 release candidate，但本任务不 push、不部署、不发布。

## 组成

- 47 个公开 MDX：41 篇 verified 深度教程 + 6 个导航/来源页面。
- 41 个本地教学图片文件；每篇深度教程至少引用一张，并由 validator 检查 alt、图注、文件存在和 asset ledger。
- 41/41 深度教程有非空 `brief.md`、`horizontal-research.md`、`vertical-research.md`、`evidence-ledger.md`、`asset-ledger.md`、`review.md`。
- 41/41 `review.md` 有最终 PASS；0 review、0 partial、0 blocked 深度教程。

## SourceCard 与来源章节

- `rg -n 'SourceCard' starlight/src/content/docs -g '*.mdx'`：零匹配。
- 47 个公开 MDX 中，只有 `start-here/ai-practice-map.mdx` 和 `sources/source-index.mdx` 不含“来源 / 参考 / 延伸”型 H2。前者是纯导航地图；后者整页就是来源与许可索引。两项均经独立 reviewer 确认，不是漏写来源的深度教程。
- 旧组件 `starlight/src/components/SourceCard.astro` 暂时保留。公开内容已经零引用，是否删除组件应作为单独代码清理决定，不与文章收口混做。

## 链接审计

全站内部 Markdown 路由检查：缺失 0。

从公开 MDX 抽取 191 个唯一 HTTP(S) 字符串并分类：

| 类别 | 数量 | 结论 |
| --- | ---: | --- |
| 非 fixture 外链直接返回 2xx | 153 | PASS |
| OpenAI 页面返回浏览器挑战 / 自动请求 403 | 2 | URL 为官方来源；自动检查无法给出 PASS，发布时浏览器人工复核 |
| 指向本仓库未来 `main/research/...` | 31 | 当前远端 404，但 31/31 本地目标存在；本任务禁止 push，进入远端后必须复核 |
| `example.com` 合成 fixture | 4 | 教程代码块里的刻意样例：根路径返回 200，`/a`、`/b`、`/e` 返回 404；均不是读者外链 |
| `127.0.0.1:<PORT>` | 1 | Showcase 输出中的本地端口占位，不是公网链接 |

31 个 research 深链接没有被悄悄改成“已在线”；release 后置门禁是：目标提交进入远端后重跑这 31 个 URL，任何仍为 404 的链接必须修复后才能发布。

## 全站门禁

- 41/41 单篇 `validate-golden-mdx.mjs`：PASS。
- Validator 回归：1 positive、3 depth negatives、11 privacy negatives、11 visual negatives、7 review negatives，全部 PASS。
- 49 pages Starlight build：PASS。
- 41 套 research contract 与独立 final review：PASS。
- 公开 SourceCard：0。
- 内部路由缺失：0。
- `git diff --check`：PASS。

## 发布边界

本审计证明当前本地候选内容可进入远端与预览复核，不证明 production 已发布。后续必须分开记录 branch/commit、remote head、preview、浏览器链接复核、production deployment 和 live page；本任务没有执行其中任何外部状态变更。
