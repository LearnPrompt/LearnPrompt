# Brief：API 集成型 Skill 设计

## 要解决的问题

很多“API Skill 教程”只教你把 `fetch()` 跑通，却没有把真正会出事故的部分写成 contract：

1. credential 从哪儿来，能不能进仓库或日志？
2. 读接口时为什么要先限制成 `GET`，而不是把 method 交给 Agent 临场决定？
3. 分页、`429`、`5xx`、schema drift、空 payload 应该怎样分开处理？
4. 为什么“这次没报错”不等于“这次调用可审计、可重放、可交给别人复跑”？

本文要把问题收束成一句话：**当 Skill 要接 REST API 时，应该把一次调用写成 request contract，而不是把 token、重试、schema 和副作用全交给 Agent 猜。**

## 目标读者

已经会写基础 Skill、知道 `SKILL.md` / `references/` / `scripts/` 分层，但准备在 Claude Code 或 Codex 里接一个只读 REST API 的开发者、自动化维护者和技术写作者。

## 学习目标

读完后，读者能够：

1. 用当前一手资料说明 Agent Skills / Codex / Claude 的 Skill 容器边界，以及为什么这里适合把 API 工作流封装成 Skill。
2. 画出一条最小 request contract：credential 来源、request envelope、`GET`/分页、`429`/`5xx` 策略、schema validation、report。
3. 用 `release-feed-api` fixture 识别四种必须先拒绝或显式失败的情况：缺 credential、schema drift、`5xx` 重试耗尽、配置要求变更型 method。
4. 区分 writer sandbox 的 blocked 证据与外层真实 loopback / nested Codex 成功证据，不用后一层覆盖前一层。

## 中心结论

API 集成型 Skill 的关键，不是“发出一个 HTTP 请求”，而是让调用前后都可审计：**credential 只能从环境变量注入；method、分页和重试规则要先冻结；响应必须做结构校验；失败码要先于自然语言；证据只保留可重放所需的最小脱敏面。**

## 明确不做

- 不讨论 MCP、connector 或平台选型。
- 不调用任何公网、收费或私有 API。
- 不比较模型能力。
- 不覆盖真实 GitHub 仓库写操作。
- 不把 LearnPrompt 的退出码 contract 冒充成 HTTP 或厂商标准。

## Frozen showcase

- 名称：`release-feed-api`
- 位置：`research/articles/api-integration-skill-design/showcase/release-feed-api/`
- fixture repo：隔离临时 Git repo，Skill 位于 `.agents/skills/release-feed-api/`
- 任务：显式 `$release-feed-api` 读取一个只读 release feed，生成 `reports/releases.json` 与 `reports/releases.md`
- 冻结退出码：
  - `two-page success = 0`
  - `429 once then success = 0`
  - `missing credential = 41`
  - `schema drift = 42`
  - `503 retry exhausted = 43`
  - `mutating method rejected before network = 44`
  - `privacy scan = 0`

## 当前真实状态

- fixture tests 已通过：7/7。
- writer sandbox 的首次 loopback / nested 尝试被 `EPERM listen 127.0.0.1` 阻断，证据保留。
- 外层主控修复同步子进程锁死 server 事件循环、以及测试继承 token 两个问题后，六个场景全部命中冻结退出码，privacy 为 `0`。
- 真实 nested Codex `gpt-5.5` 显式 `$release-feed-api` 已成功：写出两份报告、读取 3 个 release、测试 7/7 通过，只修改 `reports/`。

## 需要的证据

- 一手规范 / 产品文档：
  - `https://agentskills.io/specification`
  - `https://agentskills.io/skill-creation/best-practices`
  - `https://learn.chatgpt.com/docs/build-skills`
  - `https://learn.chatgpt.com/docs/customization/overview`
  - `https://code.claude.com/docs/en/skills`
  - `https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api`
  - `https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api`
  - `https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure`
  - `https://www.rfc-editor.org/rfc/rfc9110.html`
  - `https://www.rfc-editor.org/rfc/rfc6585.html`
  - `https://nodejs.org/api/globals.html#fetch`
- 二手主题地图：
  - `https://github.com/alchaincyf/agent-skills-orange-book`
- 仓内相邻教程校准：
  - `starlight/src/content/docs/agent-skills/pipeline-skill-design.mdx`
  - `starlight/src/content/docs/agent-skills/thinking-distillation-boundary.mdx`

## 验收条件

- MDX 删除 `SourceCard`，底部改成真实来源与橙皮书用途 / 作者 / 许可限制说明。
- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`。
- `review.md` 保持 `PENDING`，writer 不自评。
- research pack 至少包含 `brief.md`、`horizontal-research.md`、`vertical-research.md`、`evidence-ledger.md`、`asset-ledger.md`、`showcase/`、`control-verification.md`、`release-gate-result.txt`、`review.md`。
- 跑 `verify-showcase.mjs`、`run-codex-live.mjs`、privacy scan、partial validator、`npm --prefix starlight run build`、`git diff --check`，把真实退出码写进控制面。
