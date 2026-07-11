| Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Agent Skills 规范要求目录里至少有 `SKILL.md`，并可包含 `scripts/`、`references/`、`assets/` | https://agentskills.io/specification | 官方规范 | 2026-07-12 | 高 | 规范层，不等于每个客户端都同样显式调用 |
| `name` / `description` 是必填字段，`description` 需要同时描述做什么和何时使用 | https://agentskills.io/specification | 官方规范 | 2026-07-12 | 高 | 只是字段规范，不保证触发效果一定理想 |
| Skill 按 metadata / instructions / resources 渐进加载 | https://agentskills.io/specification | 官方规范 | 2026-07-12 | 高 | 这是开放标准描述，具体 UI/调用入口因客户端而异 |
| Codex 把 Skill 定义为可复用 workflow 格式，默认优先 instructions，只有在需要确定性行为或外部工具时再用脚本 | https://learn.chatgpt.com/docs/build-skills | 官方产品文档 | 2026-07-12 | 高 | 这是 OpenAI surface 的最佳实践 |
| Codex repo Skill 当前扫描 `.agents/skills` | https://learn.chatgpt.com/docs/build-skills | 官方产品文档 | 2026-07-12 | 高 | 不适用于 Claude Code 项目 Skill |
| Codex 文档说明 `AGENTS.md` 提供持久项目指导，Skills 打包重复流程，MCP 连接本地工作区外部系统 | https://learn.chatgpt.com/docs/customization/overview | 官方产品文档 | 2026-07-12 | 高 | 是 Codex 的层次说明，不是开放规范字段 |
| Claude Code 中 Skill 可按需加载，也可用 `/skill-name` 显式调用；如果 CLAUDE.md 某段已经长成 procedure，就该抽成 Skill | https://code.claude.com/docs/en/slash-commands | 官方产品文档 | 2026-07-12 | 高 | 显式调用语法是 Claude 专属，不适用于 Codex |
| Claude Code 的扩展层里，`CLAUDE.md` 是 persistent context，Skills 是 reusable knowledge/workflows，MCP 连接外部服务，plugins 是 packaging layer | https://code.claude.com/docs/en/features-overview | 官方产品文档 | 2026-07-12 | 高 | 说明的是 Claude Code 的扩展分层 |
| Claude Platform 说明 Skills 不会自动跨 surface 同步；Claude Code skill 是 filesystem-based，Claude API/claude.ai 的共享范围也不同 | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | 官方平台文档 | 2026-07-12 | 高 | 只说明 Claude 生态，不覆盖 OpenAI surface |
| 橙皮书概念篇可作为中文主题地图，但不能冒充当前路径/字段/调用事实权威 | 本地临时镜像 `agent-skills-orange-book-zh.txt`；本地临时镜像 `agent-skills-orange-book/README_zh.md` | 本地二手主题地图 | 2026-07-12 | 中 | 该资料无标准开源许可，且本文不复制其原文/图片 |
| `receipt-renamer-skill` 的确定性 replay 为 normal `0`、missing currency `21`、conflict `23`、privacy scan `0` | `showcase/receipt-renamer-skill/results/replay-result.txt` | 本地真实运行 | 2026-07-12 | 高 | 只证明这套 fixture 与脚本，不代表所有收据命名场景 |
| 主控外层用同一冻结契约真实调用 Codex，最终返回 `skill_invocation=$receipt-renamer`、`exec_exit_code=0` | `showcase/receipt-renamer-skill/results/live-run-summary.json`；`codex-last-message.json` | 本地真实运行 | 2026-07-12 | 高 | 固定模型为本机可用的 `gpt-5.5`；只证明本次显式调用 |
| live run 只新增 `reports/`，写出 JSON 与 Markdown 计划，源 PDF 未改名，随后 `npm test` 为 4/4 | `showcase/receipt-renamer-skill/results/live-normal-plan.json`；`live-normal-plan.md`；`live-tests.txt` | 本地真实运行 | 2026-07-12 | 高 | dry run 只覆盖正常批次；负例由确定性 replay 覆盖 |
