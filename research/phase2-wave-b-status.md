# Phase 2 Wave B 生产状态

更新时间：2026-07-11

## 第一对结果

| 文章 | 审稿链路 | 最终状态 |
| --- | --- | --- |
| `claude-code/install-and-first-project.mdx` | 初审 FAIL 83/100（2 major / 1 minor）→ follow-up FAIL 87/100（1 major）→ 固定 rubric 校准 PASS 96/100（0/0/0） | verified |
| `claude-code/minimum-claude-md.mdx` | 初审 FAIL 83/100（2 major）→ PASS 93/100（0/0/0） | verified |

## 第二对结果

| 文章 | 审稿链路 | 最终状态 |
| --- | --- | --- |
| `claude-code/control-style-with-claude-md.mdx` | 初审 FAIL 86/100（1 major / 1 minor）→ PASS 92/100（0/0/0） | verified |
| `claude-code/advanced-conversation-patterns.mdx` | 初审 FAIL 84/100（1 major / 1 minor）→ follow-up FAIL 93/100（1 minor）→ PASS 98/100（0/0/0） | verified |

## 第三对结果

| 文章 | 审稿链路 | 最终状态 |
| --- | --- | --- |
| `claude-code/skills-hooks-mcp-roles.mdx` | 初审 FAIL 94/100（1 factual minor）→ 修正事实与证据台账 → PASS 94/100（0/0/0） | verified |
| `claude-code/multi-agent-collaboration.mdx` | 初审 FAIL 84/100（1 major）→ 新增双独立 worker 实跑 → PASS 93/100（0/0/0）；合并后 Unicode 路径窄审 FAIL（1 major）→ 修复 → 新会话复审 PASS（0/0/0） | verified |

## 第四对结果

| 文章 | 审稿链路 | 最终状态 |
| --- | --- | --- |
| `claude-code/chrome-extension-prototype.mdx` | 初审 FAIL 81/100（2 major / 1 minor）→ PASS 96/100（0/0/0） | verified |
| `claude-code/content-automation-pipeline.mdx` | 初审 FAIL 72/100（有效 blocker 1 / major 3）→ follow-up FAIL 92/100（1 major）→ PASS 100/100（0/0/0）；主分支 EOF 稳定性窄审 PASS（0/0/0） | verified |

## 第五对结果

| 文章 | 审稿链路 | 最终状态 |
| --- | --- | --- |
| `codex/codex-cli-workflow.mdx` | 初审 FAIL 85/100（blocker 1 / major 1）→ 修复运行标识符、绝对 shell 路径与离线 replay 门禁 → PASS 98/100（0/0/0） | verified |
| `codex/sandbox-and-permissions.mdx` | 初审 FAIL 87/100（major 1 / minor 2）→ follow-up FAIL 81/100（major 1 / minor 2）→ 终审 FAIL 90/100（major 1，fixture marker hygiene）→ 运行时 marker 回修 → PASS 98/100（0/0/0） | verified |

## 关闭的问题

`install-and-first-project`：

- 明确 `acceptEdits` 只用于受限非交互归档运行，首日交互仍从 `manual/default` 起步，陌生仓库先用 `plan`。
- 区分订阅用户的浏览器登录与 Showcase 已配置 API key 的认证环境，不把两条路径混成同一流程。
- 将验收脚本从当前 `HEAD` 检查加固为不可变 `baseline` tag 比较，代码必须与基线一致，README 必须相对基线新增运行段。
- 补齐 fixture、验收脚本、真实 patch 与运行位置的完整复现步骤，严格照文档重放通过 3/3；越界代码负例退出码 1。

`minimum-claude-md`：

- 官方实时 memory 原页仍写 `maximum depth of four hops`；纠正任务卡和陈旧检索摘要中的五跳说法，并在证据台账保留出入记录。
- 新增 release gate 冻结结果，记录 validator、5 FAIL→5 PASS、49 页 build 与 diff-check 的精确命令、关键输出和退出码。
- 为真实只读 canary 会话补齐 fixture、完整 CLAUDE.md、精确命令、退出码捕获与默认模型未固定的限制；收窄为单次加载的强证据，不外推长期遵循率。
- 修正教学 SVG 的右侧文字溢出并重新渲染检查。

`control-style-with-claude-md`：

- 将风格治理从抽象规则改成 UI + API 具体 Showcase：before 同时失败，after 同时通过，并用 `SKIP ui-token rule for src/api/...` 证明 UI 规则不命中 API。
- 区分根级 `CLAUDE.md`、path-scoped `.claude/rules` 与脚本 / lint / hook；静态检查只证明机械约束，不外推模型服从性。
- 补齐冻结的 validator、49 页 build、diff-check 和退出码工件；修正依赖工作目录的复现命令。
- 修正教学 SVG 文字布局，并用 1200×820 浏览器视口复检无越界。

`advanced-conversation-patterns`：

- 用可重跑 `slugify` bug 把 Stage A 只读探索、frozen handoff、fresh process 实现和 acceptance 验收拆成两阶段；缺 acceptance command 的负例退出码 2。
- 收紧 `continue` / `resume` / `compact` / `clear` / `fork` 的状态关系，明确 `resume` 不清洗旧 session，产品 checkpoint / rewind 也不等于跨进程 handoff。
- 补齐冻结的正负例、validator、49 页 build、diff-check 和退出码工件。
- 修正教学 SVG 长文本布局，并用 1200×780 浏览器视口复检无越界。

`skills-hooks-mcp-roles`：

- 用 `release-workbench` 把重复发布摘要固化为 Skill、把 `git push` 放进 `PreToolUse` Hook 拒绝、把外部 issue 数据置于本地 stdio MCP 进程边界，并用机制闸门拒绝“把纯本地固定流程包装成 MCP”的错误设计。
- 修正 Skill `name` 被误写成触发条件的事实问题：frontmatter 字段均非强制，`description` 是推荐发现信号，`when_to_use` 仅为补充字段，`name` 通常是显示标签。
- 6/6 release gate 与 1200×780 教学决策树视觉检查通过；公开正文无 SourceCard，底部来源和橙皮书许可完整。

`multi-agent-collaboration`：

- 将只有任务卡与仓库终态源码的抽象示例升级为两个独立 Node worker：不同临时目录、各写唯一 owned file、核对冻结 contract、自测并报告 SHA；协调器直接消费两份临时产物完成集成。
- 保留 write set 冲突退出码 3、接口未冻结或依赖未满足退出码 4 两个负例，明确 Showcase 验证的是协调骨架，不冒充真实 Agent Team 能力实验。
- 合并到含中文的主仓库路径后，现场重放暴露 `URL.pathname` 与手拼 `file://` 的 percent-encoding 缺陷；四处统一改用 `fileURLToPath` / `pathToFileURL`。第一次独立窄审发现遗漏并 FAIL，补齐后新的只读会话 PASS，worker CLI、双进程集成、正负门禁与 e2e 全部重跑通过。
- 920×560 合并门禁流程图通过视觉检查；冻结 worker SHA 已随最终源码重算并由 reviewer 核对。

`chrome-extension-prototype`：

- 用“当前页阅读卡”替代抽象扩展示例：快捷键触发 `activeTab`，service worker 通过 `scripting` 读取标题、URL 与选中文本，写入 `storage.local`，popup 只读展示最近成功结果与最近运行状态。
- Chrome for Testing 150 真实完成 22 项机械检查；official branded Chrome 150 因 Chrome 137+ 的 `--load-extension` 边界，只保留 `chrome://extensions -> Load unpacked` 人工验收，不伪造自动化结果。
- 受限 `chrome://` 页面失败不会覆盖上一张成功卡片；故意申请 `tabs + unlimitedStorage + <all_urls>` 的 manifest 被权限审计拒绝。
- 统一 brief、正文、README 与 evidence 的浏览器口径，修复教学图三处越框和 README 占位路径；1200×720 实际渲染复审 PASS。

`content-automation-pipeline`：

- 将一次性“抓取、总结、发布”改成七阶段双来源周报：`snapshot / normalize / dedupe / score / draft / verify / approve`，模型摘要只作为可替换边界。
- 一键脚本真实重放成功、缺来源字段、草稿 contract 被破坏、未人工批准四场景，退出码为 0/21/23/31；`blocked_data_quality` 不冒充 `no_content`，本地 `publish-candidate` 不冒充已外发。
- 补齐 raw stdout/stderr 先写 `os.tmpdir()`、再读回脱敏冻结、最后清理的 provenance 闭环；四个场景只有全部 raw 写入和退出码核对成功后才更新 summary。
- 统一六段/七阶段漂移、补齐退出码 23、修正文与工件字段名，并将教学图重排为七阶段主路径和三张互不越界的失败卡。
- 主分支重复重放发现草稿 EOF 多写空行；修生成器后冻结工件保持无 diff，独立只读窄审确认语义不变。

`codex-cli-workflow`：

- 用 `receipt-normalizer` 真实临时 Git 仓库串起交互 discovery、冻结 task contract、一次真实 `codex exec`、patch/test/diff/report 与确定性 release gate；正式运行固定本机可用的 `gpt-5.5`，并如实记录旧 CLI 对 `gpt-5.6-sol` 的兼容失败。
- good patch 只修改 `src/normalizeReceipt.js` 且 fresh repo 4/4 tests；bad patch 越界修改 `README.md`，门禁退出码 3；privacy scan 与重复 replay 均通过。
- 初审发现真实 item id 与 `/bin/zsh` 进入脱敏 JSONL、README 缺少可复制 replay；修复后以稳定占位符和一键 `verify-showcase.mjs` 关闭全部 finding。

`sandbox-and-permissions`：

- 用 `docs-link-fix` 无模型实验室实跑 `:read-only`、`:workspace` 和继承 `:workspace` 且 deny `**/*.env` 的 `docs-edit` 三个 profile；分别证明工作区写拒绝、工作区内 allow + 同级 sentinel deny、普通 docs allow + `.env` deny。
- runner 在用户家目录创建非 temp lab，在系统临时目录保存 raw capture；两轮生成 checksum manifest、probe summary、verifier output 与 replay stability，外部重复运行五个冻结文件哈希稳定。
- reviewer 发现固定 fixture marker 虽非 secret 仍进入 committed 摘要；最终改为由固定非敏感种子在运行时派生 key/value，冻结工件只保留 `fixture_marker_in_logs=no` 等布尔证据，终审确认 marker hygiene 关闭。

## Writer 与重试记录

- 两路 Claude writer 均完成一手研究、真实 Showcase 和部分工件后遇到同一外部配额错误；保留已完成工件，没有伪造或重跑结果。
- `minimum-claude-md` 消耗两次恢复机会中的两次：第一次恢复因外部配额启动失败，第二次切换 Codex GPT-5.4 完成；`install-and-first-project` 使用一次 Codex GPT-5.4 恢复。
- Codex CLI 首次继承了当前安装不支持的默认模型配置，启动阶段即退出、未修改内容；固定到本机模型缓存中的 `gpt-5.4` 后恢复生产。
- 第二对的两路 Claude 初始 writer 分别遇到认证失败与服务端持续重试；每篇只调用一次 skill，随后各使用一次 Codex GPT-5.4 恢复机会完成 partial 稿，没有重复调用 skill。
- 第三对两路 Claude Opus writer 均一次完成 partial 稿；每篇严格只调用一次 skill，未消耗恢复重试预算。
- 第四对两路 Claude Opus 在执行前遇到外部 503/403，token 为 0、工作树无改动，也未实际调用 Skill。Chrome 使用第 1 次 Codex GPT-5.4 恢复；内容流水线的第 1 次 Claude 恢复仍失败，随后使用第 2 次 Codex GPT-5.4 恢复。两位 Codex writer 各完整读取并使用一次本地 Skill，没有重复调用。
- 第五对两路 Codex GPT-5.4 writer 各完整读取并使用一次本地 Skill；后续 finding 回修会话均未重复读取 Skill。沙箱教程最后一次回修会话因外层 sandbox 禁止嵌套 Seatbelt 而中止、未写文件，主会话只做 marker hygiene 定向修正，随后由新的独立只读 reviewer 终审。
- reviewer 与 writer 始终为独立会话；reviewer 使用 read-only sandbox，原始报告只写工作树外。

## 门禁结果

- 本 Wave 十篇均为 `showcase_status: verified`，质量分 96、93、92、98、94、93、96、100、98、98。
- 十张原创教学 SVG 均通过语义教学价值和 CC BY-NC-SA 4.0 许可审查。
- 第五对两篇单独 verified validator：PASS；两条 lane 的 49 页构建：PASS。
- 合并后两组 Showcase 在含中文的主仓库路径重放通过，24 篇 verified 全量 validator：PASS。
- Validator 回归：1 positive / 3 depth negatives / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- 主分支完整构建：49 页 PASS。
- 当前全站计数：24 verified / 17 个仍含 SourceCard 的待处理深度教程。

## 本地提交

- `6f9db8a docs(claude-code): goldenize first project workflow (96)`
- `575ea7f docs(claude-code): goldenize minimum CLAUDE.md (93)`
- `623dd40 docs(claude-code): goldenize CLAUDE.md style controls (92)`
- `618e482 docs(claude-code): goldenize conversation patterns (98)`
- `73624b8 docs(claude-code): goldenize skills hooks MCP roles (94)`
- `30d47a7 docs(claude-code): goldenize multi-agent collaboration (93)`
- `9ee5bcb fix(showcase): decode multi-agent fixture paths`
- `47b713a docs(claude-code): goldenize Chrome extension prototype (96)`
- `fe33d1d docs(claude-code): goldenize content automation pipeline (100)`
- `ac5d600 fix(showcase): keep content drafts replay-stable`
- `839db33 docs(codex): goldenize CLI workflow (98)`
- `53039b4 docs(codex): goldenize sandbox and permissions (98)`

没有 push、部署或发布。
