| Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Agent Skills 规范要求 Skill 目录至少有 `SKILL.md`，并可包含 `scripts/`、`references/`、`assets/` | https://agentskills.io/specification | 官方规范 | 2026-07-12 | 高 | 规范层，不规定恢复机制 |
| 开放规范把 Skill 分成 metadata、body 和按需资源三层渐进加载 | https://agentskills.io/specification | 官方规范 | 2026-07-12 | 高 | 客户端体验仍可能不同 |
| OpenAI 当前文档把 repo Skill 放在 `.agents/skills`，并建议需要确定性行为时再下沉脚本 | https://learn.chatgpt.com/docs/build-skills | 官方产品文档 | 2026-07-12 | 高 | 只适用于 OpenAI surface |
| OpenAI 当前文档把 `AGENTS.md` 作为持久项目指导，把 Skills 作为重复流程容器，把 MCP 作为外部系统连接层 | https://learn.chatgpt.com/docs/customization/overview | 官方产品文档 | 2026-07-12 | 高 | 不提供恢复协议字段 |
| Claude Code 官方文档明确建议：当一套 instructions、checklist 或 multi-step procedure 被反复粘贴时，应抽成 Skill；Skill body 只在使用时加载 | https://code.claude.com/docs/en/skills | 官方产品文档 | 2026-07-12 | 高 | 该结论用于解释“为何抽 Skill”，不是恢复 contract 标准 |
| Node.js 官方文档提供 `crypto.createHash()` 与文件系统 API，可支撑本文的输入/输出哈希与确定性文件枚举实现 | https://nodejs.org/api/crypto.html ; https://nodejs.org/api/fs.html | 官方运行时文档 | 2026-07-12 | 高 | Node API 只提供能力，不定义业务语义 |
| 橙皮书 README 只说明本书免费供个人学习使用，未提供标准开源许可 | `$TMPDIR/agent-skills-orange-book/README_zh.md` | 本地主题地图 | 2026-07-12 | 高 | 只能说明使用边界，不能支撑现行产品事实 |
| `docs-migration-pipeline` fixture repo 至少包含 `SKILL.md`、`references/stage-contract.md`、`scripts/run-pipeline.mjs`、`scripts/verify-receipts.mjs`、`assets/receipt-template.md` | `showcase/docs-migration-pipeline/fixture/.agents/skills/docs-migration-pipeline/` | 仓内工件 | 2026-07-12 | 高 | 这是本文 Showcase contract，不是通用模板 |
| offline replay 冻结了 fresh success `0`、crash-after-transform `30`、resume `0`、stale resume `32`、receipt issue `33`、rerun stability `0`、privacy `0` | `showcase/docs-migration-pipeline/results/replay-result.txt` | 本地真实运行 | 2026-07-12 | 高 | 只证明这套 fixture 与 runner |
| crash 后 resume 会复用 `inventory`、`normalize`、`transform` 的 receipts，而不是重新跑前三阶段 | `showcase/docs-migration-pipeline/results/resume-summary.json`；`resume-verify.json` | 本地真实运行 | 2026-07-12 | 高 | 只覆盖本文冻结场景 |
| 输入被篡改后，旧 receipt 会因 `input_sha` 不匹配而失效，并返回 exit `32` | `showcase/docs-migration-pipeline/results/stale-resume.txt` | 本地真实运行 | 2026-07-12 | 高 | 只验证了一类篡改方式 |
| receipt 缺失或损坏时，resume 会因证据不可验证而返回 exit `33` | `showcase/docs-migration-pipeline/results/receipt-issue.txt` | 本地真实运行 | 2026-07-12 | 高 | 只覆盖 transform receipt 损坏这一例 |
| 两次完整 fresh run 的 candidate hash 一致，说明输出可重放 | `showcase/docs-migration-pipeline/results/rerun-stability.txt` | 本地真实运行 | 2026-07-12 | 高 | 只证明当前 fixture 和实现无显式随机性 |
| writer 隔离层首次真实调用被宿主权限阻断；外层主控把 schema 已有的 `notes` 属性补入 `required` 后，用同一冻结任务与 gpt-5.5 补跑成功，完成 crash `30` -> resume `0` -> verify `0` | `showcase/docs-migration-pipeline/results/live-run-summary.json`；`codex-stderr-summary.txt`；`codex-last-message.json` | 本地真实运行 | 2026-07-12 | 高 | 首次失败与补跑成功都受各自宿主环境影响；只证明本文 fixture |
