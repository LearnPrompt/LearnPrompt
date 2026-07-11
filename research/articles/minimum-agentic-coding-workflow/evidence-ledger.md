# Evidence Ledger

每个核心事实与每处「实际运行」都对应来源、类型、核验日期、置信度与局限。

| Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Plan mode：Claude 只读文件并提出计划，批准前不落盘；`claude --permission-mode plan` 或 Shift+Tab 进入 | https://code.claude.com/docs/en/common-workflows | 一手官方文档 | 2026-07-11 | 高 | 仅 Claude Code 行为，会随产品迭代 |
| AGENTS.md 是给 Agent 的「README」，被 60k+ 项目使用，由 Agentic AI Foundation（Linux 基金会）托管 | https://agents.md | 一手标准文档 | 2026-07-11 | 高 | 标准刻意灵活，不规定固定字段 |
| Agent 会尝试执行 AGENTS.md 列出的程序化检查并在完成前修复失败（验收要可执行） | https://agents.md （FAQ） | 一手标准文档 | 2026-07-11 | 高 | 是否执行取决于具体工具与配置 |
| CLAUDE.md 是 context 不是 enforced configuration；硬拦截需 PreToolUse hook | https://code.claude.com/docs/en/memory | 一手官方文档 | 2026-07-11 | 高 | 仅 Claude Code；会随产品迭代 |
| Claude Code 还有 auto memory，会根据用户纠正自动记录笔记，并按仓库跨会话共享 | https://code.claude.com/docs/en/memory | 一手官方文档 | 2026-07-11 | 高 | 自动记录不等于每条聊天经验都会保留；本文 Showcase 选择可审计的显式写回 |
| 指令要具体可验证：`Run npm test before committing` 优于 `Test your changes`；单文件建议 < 200 行 | https://code.claude.com/docs/en/memory | 一手官方文档 | 2026-07-11 | 高 | 为经验建议非硬性 |
| Claude Code 读 CLAUDE.md 不读 AGENTS.md，可 `@AGENTS.md` 导入或 symlink 复用 | https://code.claude.com/docs/en/memory | 一手官方文档 | 2026-07-11 | 高 | 仅 Claude Code 行为 |
| git revert 通过新建反向提交安全撤销已提交改动、保留历史；未提交用 restore/reset 退回 | https://git-scm.com/docs/git-revert （手册 2.54.0） | 一手官方文档 | 2026-07-11 | 高 | 无 |
| git diff 显示逐行差异，是「读完这次改动」的具体动作 | https://git-scm.com/docs/git-diff | 一手官方文档 | 2026-07-11 | 高 | 无 |
| Plan→Patch→Verify→Learn 是把四项一手能力串成一次任务闭环的操作模型，非行业标准 | horizontal-research.md + vertical-research.md（编辑综合） | 本仓库编辑综合 | 2026-07-11 | 中 | 操作性综合，非唯一或官方流程 |
| harness-engineering 橙皮书声明教育性分享需署名、无标准开放许可 | .claude/skills/learnprompt-single-mdx/references/visual-assets.md；橙皮书仓库 README | 项目内一手记录 | 2026-07-11 | 高 | 未获项目所有者授权，不复制其图片 |
| Showcase 切片一（未处理余数）跑 `node --test` 退出码 1，断言打印 sum 9999≠10000 | showcase/results/result-verify-01-fail.txt | 实际运行（Node v24.11.0，2026-07-11） | 2026-07-11 | 高 | 结果由确定性任务保证，与机器无关 |
| Showcase 保存两次连续 patch：切片一从 TODO 到朴素均分，切片二从朴素均分增量修复为余数守恒 | showcase/patch-01-slice.diff；showcase/patch-02-fix.diff | 冻结 diff 证据 | 2026-07-11 | 高 | 第二份 diff 的删除端与切片一实现一致，不是两个版本各自对同一基线 |
| Showcase 切片二（补余数）跑 `node --test` 退出码 0，3 个测试全绿 | showcase/results/result-verify-02-pass.txt | 实际运行（Node v24.11.0，2026-07-11） | 2026-07-11 | 高 | 同上 |
| Learn 步把「先写守恒断言」规则写回 AGENTS.md，有 before/after diff | showcase/learn-agents.diff（AGENTS.before/after.md） | 实际运行 | 2026-07-11 | 高 | 规则内容是本任务经验，非通用定律 |
| 站点构建 `cd starlight && npm run build` 通过 | review.md 构建记录 | 实际运行 | 2026-07-11 | 高 | 结果随内容与依赖变化 |

## 事实 / 推断 / 经验分界

- 事实：上表带一手来源与日期的行；Showcase 的退出码与 diff 是可复现的实际运行。
- 推断：四步到失败模式的映射（vertical-research 综合，标为编辑判断）。
- 经验：步子按风险缩放的权衡，来自项目经验与 CLAUDE.md 的 < 200 行建议。
