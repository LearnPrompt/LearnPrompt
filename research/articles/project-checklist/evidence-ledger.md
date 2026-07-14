# Evidence Ledger

每个核心事实与每处“实际运行”都对应来源、类型、核验日期、置信度与局限。

| Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| AGENTS.md 是给 Agent 的“README”，建议写构建/测试命令、代码风格、安全项 | https://agents.md | 一手标准文档 | 2026-07-11 | 高 | 标准本身刻意灵活，不规定固定字段 |
| Agent 会尝试执行程序化检查并在完成前修复失败（验收要可执行） | https://agents.md | 一手标准文档 | 2026-07-11 | 高 | 不同工具执行程度不一 |
| Claude Code 读 CLAUDE.md 不读 AGENTS.md，可 `@AGENTS.md` 导入或 symlink 复用 | https://code.claude.com/docs/en/memory | 一手官方文档 | 2026-07-11 | 高 | 仅 Claude Code 行为，非通用 |
| CLAUDE.md 是 context 不是 enforced configuration，硬拦截需 hook | https://code.claude.com/docs/en/memory | 一手官方文档 | 2026-07-11 | 高 | 会随产品迭代变化 |
| 指令要具体可验证：`npm test` 优于“测试你的改动” | https://code.claude.com/docs/en/memory ; https://agents.md | 一手官方文档 | 2026-07-11 | 高 | 无 |
| CLAUDE.md 建议单文件控制在约 200 行内 | https://code.claude.com/docs/en/memory | 一手官方文档 | 2026-07-11 | 高 | 为经验建议非硬性 |
| 权限规则由 Claude Code 强制而非模型；deny 优先，可对文件/命令写 deny | https://code.claude.com/docs/en/permissions | 一手官方文档 | 2026-07-11 | 高 | 仅 Claude Code；语法会更新 |
| `Read(.env)`、`Bash(git push *)` 是有效 deny 写法，Read/Edit 遵循 gitignore 语义 | https://code.claude.com/docs/en/permissions | 一手官方文档 | 2026-07-11 | 高 | 语法版本相关 |
| git revert 通过新建反向提交安全撤销已提交改动、保留历史；reset --hard 丢弃未提交改动 | https://git-scm.com/docs/git-revert | 一手官方文档 | 2026-07-11 | 高 | 无 |
| Harness 五组件（指令/能力/约束/状态/编排）用于审计 Agent 系统 | starlight/src/content/docs/agent-engineering/what-is-harness.mdx | 本仓库黄金样稿（编辑综合，非行业标准） | 2026-07-11 | 中 | 是操作性综合，非唯一标准 |
| harness-engineering 橙皮书声明教育性分享需署名、无标准开放许可 | starlight 视觉资产契约 references/visual-assets.md；仓库 README | 项目内一手记录 | 2026-07-11 | 高 | 未获项目所有者授权，不复制其图片 |
| Showcase：完整项目卡校验退出码 0，不完整卡退出码 1 并指名缺项 | research/articles/project-checklist/showcase/results/verify-output.txt | 实际运行（Node v24.11.0，2026-07-11） | 2026-07-11 | 高 | 只校验结构完整度，不校验内容正确性 |
| 站点构建 `cd starlight && npm run build` 通过 | 见 evidence-ledger 底部构建记录 / review.md | 实际运行 | 2026-07-11 | 高 | 结果随内容与依赖变化 |

## 事实 / 推断 / 经验分界

- 事实：上表带一手来源与日期的行。
- 推断：六格字段到具体失败模式的映射（vertical-research 综合，标注为编辑判断）。
- 经验：清单太短/太长的权衡，来自项目经验与 CLAUDE.md 的 200 行建议。
