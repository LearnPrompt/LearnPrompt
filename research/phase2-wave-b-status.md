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

## Writer 与重试记录

- 两路 Claude writer 均完成一手研究、真实 Showcase 和部分工件后遇到同一外部配额错误；保留已完成工件，没有伪造或重跑结果。
- `minimum-claude-md` 消耗两次恢复机会中的两次：第一次恢复因外部配额启动失败，第二次切换 Codex GPT-5.4 完成；`install-and-first-project` 使用一次 Codex GPT-5.4 恢复。
- Codex CLI 首次继承了当前安装不支持的默认模型配置，启动阶段即退出、未修改内容；固定到本机模型缓存中的 `gpt-5.4` 后恢复生产。
- 第二对的两路 Claude 初始 writer 分别遇到认证失败与服务端持续重试；每篇只调用一次 skill，随后各使用一次 Codex GPT-5.4 恢复机会完成 partial 稿，没有重复调用 skill。
- 第三对两路 Claude Opus writer 均一次完成 partial 稿；每篇严格只调用一次 skill，未消耗恢复重试预算。
- reviewer 与 writer 始终为独立会话；reviewer 使用 read-only sandbox，原始报告只写工作树外。

## 门禁结果

- 本 Wave 六篇均为 `showcase_status: verified`，质量分 96、93、92、98、94、93。
- 六张原创教学 SVG 均通过语义教学价值和 CC BY-NC-SA 4.0 许可审查。
- 第三对两篇单独 verified validator：PASS；两条 lane 的 49 页构建：PASS。
- 合并并修复主路径回放问题后，20 篇 verified 全量 validator：PASS。
- Validator 回归：1 positive / 3 depth negatives / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- 主分支完整构建：49 页 PASS。
- 当前全站计数：20 verified / 21 个仍含 SourceCard 的待处理深度教程。

## 本地提交

- `6f9db8a docs(claude-code): goldenize first project workflow (96)`
- `575ea7f docs(claude-code): goldenize minimum CLAUDE.md (93)`
- `623dd40 docs(claude-code): goldenize CLAUDE.md style controls (92)`
- `618e482 docs(claude-code): goldenize conversation patterns (98)`
- `73624b8 docs(claude-code): goldenize skills hooks MCP roles (94)`
- `30d47a7 docs(claude-code): goldenize multi-agent collaboration (93)`
- `9ee5bcb fix(showcase): decode multi-agent fixture paths`

没有 push、部署或发布。
