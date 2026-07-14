| Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Agent Skills 规范要求 Skill 目录至少包含 `SKILL.md`，并可带 `scripts/`、`references/`、`assets/` | https://agentskills.io/specification | 官方规范 | 2026-07-12 | 高 | 规范不定义 HTTP contract |
| Agent Skills 规范把 Skill 设计成 metadata、instructions、resources 的渐进加载结构 | https://agentskills.io/specification | 官方规范 | 2026-07-12 | 高 | 不涉及具体产品 UI |
| Agent Skills skill-creator best practices 强调 Skill 要从真实经验出发，避免泛泛的“处理好错误”式描述 | https://agentskills.io/skill-creation/best-practices | 官方最佳实践 | 2026-07-12 | 高 | 不是强制产品规则 |
| skill-creator best practices 建议把大 Skill 拆进 `references/`，并告诉 Agent 何时加载 | https://agentskills.io/skill-creation/best-practices | 官方最佳实践 | 2026-07-12 | 高 | 只是推荐，不是 validator 约束 |
| OpenAI 当前文档把 Skill 描述成 instructions、resources、optional scripts 组成的可复用 workflow 容器 | https://learn.chatgpt.com/docs/build-skills | 官方产品文档 | 2026-07-12 | 高 | 只直接适用于 OpenAI surface |
| OpenAI 当前文档建议：除非需要确定性行为或外部工具，否则优先 instructions 而不是 scripts | https://learn.chatgpt.com/docs/build-skills | 官方产品文档 | 2026-07-12 | 高 | 具体脚本边界仍需按任务判断 |
| OpenAI 当前 Customization 文档把 Skills 定位为重复工作流，把 MCP 定位为外部系统连接层 | https://learn.chatgpt.com/docs/customization/overview | 官方产品文档 | 2026-07-12 | 高 | 不提供 API schema 或 retry 策略 |
| Claude Code 当前文档说明：当 instructions / checklist / multi-step procedure 被反复粘贴时，应抽成 Skill，且 body 只在使用时加载 | https://code.claude.com/docs/en/skills | 官方产品文档 | 2026-07-12 | 高 | 不证明 LearnPrompt 的 request contract |
| RFC 9110 把 `GET` 定义为检索目标资源当前表征的语义 | https://www.rfc-editor.org/rfc/rfc9110.html | IETF 标准 | 2026-07-12 | 高 | 标准不决定业务级只读边界 |
| RFC 6585 规定 `429 Too Many Requests` 可包含 `Retry-After`，告知客户端等待多久再发下一次请求 | https://www.rfc-editor.org/rfc/rfc6585.html | IETF 标准 | 2026-07-12 | 高 | 只定义语义，不规定客户端预算 |
| GitHub REST best practices 建议串行请求而不是并发请求，并对大量 `POST` / `PATCH` / `PUT` / `DELETE` 请求节流 | https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api | 官方 REST 最佳实践 | 2026-07-12 | 高 | 是 GitHub 的实践文档，不是通用强制标准 |
| GitHub REST pagination 文档说明：分页响应需要通过后续页机制继续请求，单页只返回结果子集 | https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api | 官方 REST 文档 | 2026-07-12 | 高 | 每家 API 的分页字段命名可能不同 |
| GitHub credential security 文档要求不要硬编码凭据，也不要把未加密 token / key 推入仓库 | https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure | 官方安全文档 | 2026-07-12 | 高 | 这里只借用通用原则，不讨论生产 secrets 管理平台 |
| Node.js 当前内建浏览器兼容的 `fetch` / `Request` / `Response` / `Headers`，可直接做本文 fixture 的 HTTP 客户端 | https://nodejs.org/api/globals.html#fetch | 官方运行时文档 | 2026-07-12 | 高 | 只证明运行时能力，不证明业务 schema |
| `release-feed-api` fixture repo 包含 `.agents/skills/release-feed-api/`、`SKILL.md`、`references/api-contract.md`、`scripts/fetch-releases.mjs`、`scripts/mock-release-api.mjs`、`assets/report-template.md` | `research/articles/api-integration-skill-design/showcase/release-feed-api/fixture/` | 仓内工件 | 2026-07-12 | 高 | 这是本文 Showcase contract，不是通用标准 |
| fixture tests 在同一 request contract 下通过 7/7，覆盖 `0 / 41 / 42 / 43 / 44` 语义与 loopback preflight | `showcase/release-feed-api/results/fixture-tests.txt` | 本地真实运行 | 2026-07-12 | 高 | 单元层成功场景使用同 contract 的 in-process transport |
| `missing credential` 在当前环境真实返回 `41`，且未写报告 | `showcase/release-feed-api/results/missing-credential.txt` | 本地真实运行 | 2026-07-12 | 高 | 不依赖 loopback server |
| `mutating method` 在当前环境真实返回 `44`，且在发请求前被拒绝 | `showcase/release-feed-api/results/mutating-method.txt` | 本地真实运行 | 2026-07-12 | 高 | 不依赖 loopback server |
| writer sandbox 的 loopback / nested 尝试被 `EPERM listen 127.0.0.1` 阻断，说明宿主限制必须与业务失败分开记录 | writer 原始控制记录；外层重跑前的 blocked evidence | 本地真实运行 | 2026-07-12 | 高 | blocked 只描述 writer 宿主；最终 results 已由外层成功重跑更新 |
| 外层真实 loopback replay 六个场景全部完成：success `0`、429 `0`、missing credential `41`、schema drift `42`、retry exhausted `43`、mutating method `44` | `showcase/release-feed-api/results/replay-result.txt`；各场景结果文件 | 本地真实运行 | 2026-07-12 | 高 | 使用隔离 loopback fixture，不代表公网 API 可用性 |
| 真实 nested Codex `gpt-5.5` 显式 `$release-feed-api` 成功写出 JSON / Markdown 报告，读取 3 个 release，测试 7/7 通过，只新增 `reports/` | `showcase/release-feed-api/results/live-run-summary.json`；`codex-last-message.json`；`live-releases.json`；`live-tests.txt` | 本地真实运行 | 2026-07-12 | 高 | 只验证冻结 fixture / prompt / schema |
| Agent Skills 橙皮书仓库作者为 Huashu，README 说明仅供个人和教育用途免费使用，未经许可不得商业再分发 | https://github.com/alchaincyf/agent-skills-orange-book | 二手主题地图 / 仓库 README | 2026-07-12 | 高 | 不能用来证明当前产品行为；也不授权复制其 PDF 正文或图片 |
