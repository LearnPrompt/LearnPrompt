# Evidence ledger：checklist-skill-design

验证日期：2026-07-12

| 正文主张 | 证据 | 证据类型 | 验证日期 | 置信度 | 限定 |
| --- | --- | --- | --- | --- | --- |
| Agent Skills 规范要求 skill 目录至少有 `SKILL.md`，可选 `scripts/ references/ assets/` | [Agent Skills Specification](https://agentskills.io/specification) 的 Directory structure 与 Optional directories | 一手规范 | 2026-07-12 | 高 | 规范不定义 LearnPrompt 的 gate 字段 |
| Codex 会从 `.agents/skills` 发现 repo skills，支持显式 `$skill` 与按 description 隐式匹配 | [Build skills | ChatGPT Learn](https://learn.chatgpt.com/docs/build-skills) 与 [Customization | ChatGPT Learn](https://learn.chatgpt.com/docs/customization/overview) | OpenAI 官方文档 | 2026-07-12 | 高 | 具体 CLI 参数仍以本机 `codex exec --help` 为准 |
| Claude / Agent Skills 的 progressive disclosure 都是 metadata -> instructions -> resources | [Claude Platform Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) 与 [Customization | ChatGPT Learn](https://learn.chatgpt.com/docs/customization/overview) | 官方文档交叉核对 | 2026-07-12 | 高 | 不同客户端对前端字段支持不同 |
| `npm pack --dry-run` 只报告会做什么，不进行本地修改 | [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/) | npm 官方文档 | 2026-07-12 | 高 | 网络相关命令不一定 honor dry-run |
| `bin` 字段决定 CLI 如何暴露为可执行命令 | [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) | npm 官方文档 | 2026-07-12 | 高 | 本文只用它解释 smoke command 验证 |
| `release-readiness-checklist` fixture 的 deterministic replay 退出码冻结为 `0 / 21 / 22 / 23 / 24 / privacy 0` | `showcase/release-readiness-checklist/scripts/verify-showcase.mjs` 与 `results/verify-showcase.txt` | 本地可重跑实验证据 | 2026-07-12 | 高 | 这些 exit code 是 LearnPrompt 操作化 gate，不是 npm 官方标准 |
| ready 场景要求每个 row 都带 `id / question / evidence / pass_rule / severity / not_applicable_policy / result` | `showcase/release-readiness-checklist/scripts/validate-report.mjs` 和 ready 报告 JSON | 本地 deterministic validator | 2026-07-12 | 高 | validator 只机械检查结构与 N/A 规则，语义充分性仍需 reviewer |
| writer 隔离层首次真实调用被宿主权限阻断；外层主控用同一冻结 fixture / prompt / schema 与 gpt-5.5 补跑后成功生成两份报告，tests `2/2`，且只改 `reports/` | `showcase/release-readiness-checklist/results/live-run-summary.json`；`codex-last-message.json`；`codex-stderr-summary.txt` | 本地真实运行 | 2026-07-12 | 高 | 首次失败与补跑成功都受各自宿主环境影响；只证明本文 fixture |
