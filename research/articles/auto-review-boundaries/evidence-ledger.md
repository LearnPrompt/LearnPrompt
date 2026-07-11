# Evidence ledger

核验日期：2026-07-11。

| Claim ID | Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | GitHub Codex code review 可以用 `@codex review` 在 pull request comment 中触发 | [Codex code review in GitHub](https://learn.chatgpt.com/docs/third-party/github) | 官方一手文档 | 2026-07-11 | 高 | 本页描述 GitHub 托管流程，不等于本地 CLI 行为 |
| C2 | GitHub 还支持 Automatic reviews，在新 PR 打开时自动发起 review | 同上 | 官方一手文档 | 2026-07-11 | 高 | 只适用于已启用该设置的仓库 |
| C3 | GitHub review surface 只标 P0/P1 问题 | 同上 | 官方一手文档 | 2026-07-11 | 高 | 不能外推到本地 structured review 的 severity taxonomy |
| C4 | GitHub review surface 会按 changed file 应用 closest `AGENTS.md` review guidance | 同上 | 官方一手文档 | 2026-07-11 | 高 | 文档写的是 GitHub code review；本地 structured review 只能手工复现类似合同 |
| C5 | `approvals_reviewer` 决定的是谁来 review eligible approval prompts | [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference) | 官方一手文档 | 2026-07-11 | 高 | 它不描述 PR code review |
| C6 | `approvals_reviewer = "auto_review"` 不改变 sandbox，也不改变 sandbox 内已允许动作 | Configuration Reference + [Sandbox](https://learn.chatgpt.com/docs/sandboxing) | 官方一手文档 | 2026-07-11 | 高 | 不代表 reviewer subagent 没有别的策略页面；这里只核对当前三份官方资料 |
| C7 | “Approve for me for eligible approval requests” 是审批 reviewer surface，不是 GitHub PR review surface | Sandbox | 官方一手文档 | 2026-07-11 | 高 | UI 命名可能后续变化，需要重新核验 |
| C8 | 本文 Showcase 的 fixture diff 会引入“未来 deliveredAt 仍被判断为可退款”的真实行为漏洞 | `showcase/refund-window-review/fixture/staged.diff` + staged repo 本地复现输出 | 真实实验 + fixture | 2026-07-11 | 高 | 只说明这个示例仓库存在该行为，不外推真实业务系统 |
| C9 | 本机 `codex-cli 0.142.2`、`gpt-5.5` 的 read-only `codex exec` 对该 diff 返回了 anchored finding | `showcase/refund-window-review/results/real-finding.json` | 真实本地模型运行的脱敏最小工件 | 2026-07-11 | 高 | 原始 JSONL/stderr 保存在工作树外，不入库 |
| C10 | deterministic gate 能机械验证真实 finding 命中 changed file/right-side changed line，且 fabricated out-of-diff finding 稳定失败 | `showcase/refund-window-review/scripts/verify-review-finding.mjs` + gate 结果文件 | 确定性脚本 + 真实运行结果 | 2026-07-11 | 高 | gate 只验证锚点、术语与必填字段，不评估 finding 的教学质量 |
| C11 | Orange Book 只作为中文二手主题地图保留署名许可，不能当 2026-07-11 的当前行为权威 | GitHub repo 页面 + raw README `License` 段落 + 本轮官方对照 | 二手来源 + 编辑综合判断 | 2026-07-11 | 高 | 许可与仓库内容未来可能更新 |
