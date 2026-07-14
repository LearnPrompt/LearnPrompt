# Brief：用 CLAUDE.md 管住风格膨胀

## 要解决的问题

目标读者已经会写最小 `CLAUDE.md`，但一旦项目里同时出现 UI、API、测试等多类规则，就容易把所有约束继续堆到根级文件：既想让 Claude 知道构建命令，又想让它记住前端 token、后端 envelope、命名约定和局部禁区。结果是规则越来越长、越来越泛，冲突和噪音一起上升，却无法回答“这条规则到底该放在哪里”。

本文要把这个问题改写成可操作的放置判断：从一次真实风格失败出发，判断一条规则该留在根级 `CLAUDE.md`、拆到路径作用域 `.claude/rules/`，还是落到确定性检查，并建立“添加 -> 验证 -> 修剪”的维护循环。

## 目标读者

- 已经用 Claude Code 写过最小项目规则文件。
- 当前痛点不是“从零开始”，而是规则膨胀、作用域混乱、同一份文件同时塞进全局和局部要求。
- 能读 Markdown、理解脚本输出与目录结构。

## 学习成果

读完应能：

1. 从一次风格失败中提炼出“具体规则”，而不是继续写抽象提醒。
2. 区分根级共享规则、路径作用域规则和机械检查三种层级。
3. 理解 `CLAUDE.md` 是 context，不是硬权限；需要硬性通过时，应改用确定性执行层。
4. 通过一个小型 UI + API showcase 解释为什么 UI 规则不应作用于 API。
5. 建立“添加、验证、修剪”的维护循环，而不是只会追加。

## 中心结论

当规则已经开始膨胀时，最有价值的动作不是“把根级 CLAUDE.md 写得更完整”，而是按适用范围和可验证强度拆层：全局共识留在根文件，目录/类型相关规则放进 `.claude/rules/`，可机械判断的约束落到脚本或测试。这样才能同时降低上下文噪音、减少冲突、保留可证明的通过/失败信号。

## 非目标

- 不重讲 minimum-claude-md 的最小五类信息。
- 不把 `CLAUDE.md` 说成硬权限或安全边界。
- 不展开 hooks、skills、MCP 的实现教程；只在放置判断里点到为止。
- 不做在线模型排名或服从性基准。

## 需要的证明

- 一手来源：Claude Code 官方 `memory`、`best-practices`、`features-overview`、`overview`。
- 二手主题地图：`claude-code-orange-book`，仅作中文选题地图并保留许可。
- 一个可重跑 showcase：小型 UI + API repo，包含根级规则、UI/API path-scoped rules、确定性脚本、before/after 输出。
- 至少一张原创教学图，展示失败 -> 具体规则 -> 作用域 -> 机械检查 -> 修剪，以及 root/rules/hook 的放置判断。

## 验收条件

- 目标 MDX 去掉旧的卡片式来源结构，改成深度教程。
- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`。
- 正文至少 5000 body chars、至少 6 个 H2、至少 1800 中文解释字符。
- research pack 完整，含 evidence ledger、asset ledger、showcase README/result、review 阻塞说明、control verification。
- 进入 `research/articles/control-style-with-claude-md/showcase/style-scope/` 后，分别运行
  `node verify-style-scope.mjs before` 与 `node verify-style-scope.mjs after`。
- 运行单篇 validator 与 `cd starlight && npm run build`，结果记录进 research pack。

## 未决假设与限制

- 本次恢复任务明确禁止重新走原有 `/learnprompt-single-mdx` 认证链路；因此不能把在线 Claude Code 真实行为测试包装成“已验证遵循”。会在正文与 showcase README 中如实标注：本次可复现证据只证明规则分层与机械约束，不证明模型一定遵守。
- 当前内容 schema 没有 `articleState` 字段，只有 `showcase_status`。为了保持站点可构建，使用 `showcase_status: partial` 表达未终审状态。
