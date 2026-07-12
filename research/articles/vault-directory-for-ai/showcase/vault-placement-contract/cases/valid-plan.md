# Placement plan reference

12/12 accounted for; 11 items placed; 1 sensitive-marker item rejected.

| source item | action | destination | role | reason | canonical | sensitivity |
| --- | --- | --- | --- | --- | --- | --- |
| `00_收件箱/项目A-发布决策.md` | place | `10_项目/Apollo 发布会/决策/2026-07-产品发布决策.md` | project | 当前项目决策进入 active project 区。 | `true` | `public-ok` |
| `00_收件箱/项目A-下周任务清单.md` | place | `10_项目/Apollo 发布会/任务/下周执行清单.md` | project | 当前项目任务列表不进入长期知识库。 | `true` | `public-ok` |
| `00_收件箱/Obsidian-Agent-访谈综合.md` | place | `20_知识库/Agent 协作/obsidian-agent-访谈综合.md` | knowledge | 多来源合成后的可复用结论。 | `true` | `public-ok` |
| `00_收件箱/案例-中文路径-角色判定.md` | place | `20_知识库/案例库/中文路径-角色判定.md` | knowledge | 中文路径案例进入知识库，保留 Unicode。 | `true` | `public-ok` |
| `00_收件箱/博客草稿-放置contract.mdx` | place | `30_输出/博客/obsidian-vault-placement-contract.mdx` | output | 准备发布的文章草稿属于 deliverable。 | `true` | `public-review-before-publish` |
| `00_收件箱/演讲提纲-知识库整理.md` | place | `30_输出/分享/知识库整理演讲提纲.md` | output | 对外分享提纲应进入输出区。 | `true` | `public-review-before-publish` |
| `00_收件箱/OpenAI-AGENTS-页面快照.md` | place | `50_资源/OpenAI/agents-page-snapshot.md` | resource | 外部来源快照保留在资源区。 | `true` | `retain-source-boundary` |
| `00_收件箱/Obsidian-help-目录摘录.md` | place | `50_资源/Obsidian/vault-help-目录摘录.md` | resource | 官方帮助页摘录属于外部资源。 | `true` | `retain-source-boundary` |
| `00_收件箱/vault-audit-runbook.md` | place | `99_系统/runbooks/vault-audit-runbook.md` | system | 审计流程说明属于 runbook。 | `true` | `public-ok` |
| `00_收件箱/project-note-template.md` | place | `99_系统/templates/project-note-template.md` | system | 模板归系统层复用资产。 | `true` | `public-ok` |
| `00_收件箱/placement-contract-review-checklist.md` | place | `20_知识库/流程设计/placement-contract-review-checklist.md` | knowledge | 跨项目复用的审稿检查表进入知识库。 | `true` | `public-ok` |
| `00_收件箱/SENSITIVE-marker-credential.txt` | reject | `null` | reject | 合成敏感标记必须拒收。 | `false` | `reject-sensitive` |
