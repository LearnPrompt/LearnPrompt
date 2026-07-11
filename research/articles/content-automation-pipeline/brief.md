# Brief — content-automation-pipeline

## 主题

把“一次性抓取 + 总结 + 发布”的模糊需求，改写成 Claude Code 可维护的七阶段内容流水线：可恢复、可追溯、默认只产草稿、人工批准后才进入发布候选。

## 目标读者

已经会用 Claude Code 改文件、跑命令、写简单脚本，但还没有把“抓两份源、帮我出周报草稿”这类临时需求沉淀成可回放工作流的中级用户。

## 一句话成果

读者能把一次性抓取总结任务拆成带状态、带证据、带失败分支的七阶段内容流水线，并知道为什么 `draft`、`verify` 与 `publish-candidate` 必须是三个不同状态。

## 目标文章

- 目标 MDX：`starlight/src/content/docs/claude-code/content-automation-pipeline.mdx`
- research 目录：`research/articles/content-automation-pipeline/`
- 图片目录：`starlight/public/images/articles/content-automation-pipeline/`

## 中心主张

不要让 Claude Code 直接承接“抓取 + 总结 + 发布”的一口气命令。先把任务拆成冻结快照、字段校验、去重、打分、草稿、验证、人工批准这七层可审计状态；模型摘要只能是中间可替换边界，不能吞掉数据质量错误，也不能绕过发布门禁。

## 关键假设

- `snapshot / normalize / dedupe / score / draft / verify / approve` 应统一按七阶段处理，不能再把 `verify` 和 `approve` 合并计数。
- Showcase 不连接真实外部源，也不发起真实发布；它只回放两份固定快照与一份固定批准工件。
- `verify-failed` 负例必须来自真实脚本内的 post-draft contract 破坏，不能靠文案假设。

## 非目标

- 不比较模型谁更聪明。
- 不伪造外部平台已发布。
- 不把 Hook 或权限配置写成完整企业方案。
- 不做实时新闻产品，而是做“如何设计成可恢复流水线”的教学样稿。

## Source families

1. Claude Code 官方文档：`common-workflows`、`hooks-guide`、`hooks`、`permissions`、`features-overview`、`how-claude-code-works`、`skills`
2. `alchaincyf/claude-code-orange-book`：只作为中文主题地图与许可保留
3. 本地 Showcase：`research/articles/content-automation-pipeline/showcase/weekly-brief-pipeline/`
4. 站内相近黄金样稿：`skills-hooks-mcp-roles`、`control-style-with-claude-md`、`multi-agent-collaboration`

## Showcase question

如果输入是两份固定离线快照，怎样让 Claude Code 只产出带 `source_url` 与筛选理由的 Markdown 草稿；在来源字段缺失时明确报数据质量错误；在草稿 contract 被下游改坏时卡在 `verify`；在没有人工批准时停在草稿而不进入发布候选？

## 验收标准

- 正文至少 5,000 个正文字符，去代码后的中文解释至少 1,800 字符，至少 6 个 H2。
- 删除公开 `SourceCard`，底部来源区保留真实来源与橙皮书许可说明。
- 至少一张原创教学图，解释七阶段状态、证据链、三个失败分支与人工门禁。
- Showcase 真实运行一键脚本和四个场景，留下 `0/21/23/31`、退出码与冻结工件。
- `showcase_status: partial`，不得自评分、不得写 PASS、不得设 `quality_score`。
- 跑单篇 validator(partial)、`cd starlight && npm run build`、diff check，并保存脱敏证据。

## 构建命令

```bash
cd starlight && npm run build
```
