# Phase 1 pilot status

更新时间：2026-07-11

## 当前状态

| 文章 | Lane | 状态 | Writer 工件 | 最终结果 |
| --- | --- | --- | --- | --- |
| `ai-coding/project-checklist.mdx` | A | verified | 完整 | 94/100，独立复审 0 blocker / 0 major / 0 minor，validator 与 49 页构建通过 |
| `agent-skills/first-skill-md.mdx` | B | verified | 完整 | 93/100，独立复审 0 blocker / 0 major / 0 minor，validator 与 49 页构建通过 |
| `codex/codex-form-factors.mdx` | A | verified | 完整 | 93/100，独立复审 0 blocker / 0 major / 0 minor，validator 与 49 页构建通过 |

Phase 1 gate：**PASS**。三种差异母稿已全部 verified，允许进入 Phase 2 分波次生产。

## 前两篇失败链路

两个 lane 使用同一 Phase 0 基线 `766b95b`，各自拥有独立 worktree 与独立 `starlight/node_modules`。每次调用都只包含一个 `/learnprompt-single-mdx` 任务。

### 初次调用

- 结果：`401 Invalid authentication credentials`
- 现场：文章和 `research/articles/` 均无改动。
- 诊断：Codex 桌面线程中的失效 `CLAUDE_CODE_OAUTH_TOKEN` 覆盖了本机仍可用的 Claude 登录。

### 第一次自动重试

- 调整：仅对 writer 子进程取消 `CLAUDE_CODE_OAUTH_TOKEN`。
- 结果：仍为 `401 Invalid authentication credentials`。
- 最小矩阵：基础调用、strict MCP、工具与权限组合都成功；只有 `--setting-sources project` 会复现 401。

### 第二次自动重试

- 调整：取消失效 token，同时移除 `--setting-sources project`；保留 strict MCP、限定工具和隔离 worktree。
- 结果：`503 所有供应商已熔断，无可用渠道`。
- 现场：两个 lane 仍为 clean，未生成目标 MDX diff 或研究工件。

两篇曾耗尽“初次调用 + 两次自动重试”的旧预算。2026-07-11 用户明确重置两篇文章预算；后续各自重新按“新初次调用 + 最多两次重试”计数。

### 恢复检查

- 2026-07-11，在仓库外 `/private/tmp` 运行非文章最小调用：取消失效的 `CLAUDE_CODE_OAUTH_TOKEN`，不使用 `--setting-sources project`，Claude 成功返回 `GATEWAY_OK`，exit code 0。
- 在 Lane A 运行相同的无工具、无写入 smoke：成功返回 `LANE_OK`，exit code 0；主分支和两个 lane 均保持 clean。
- 这两次调用没有执行 `/learnprompt-single-mdx`，不算文章 writer 重试。外部认证/网关故障当前已恢复；用户随后明确重置两篇文章预算，状态从 blocked 改为 resumed。

## 全站生产计数

- `showcase_status: verified`：6 篇（3 篇 Phase 0 黄金样稿 + 3 篇 Phase 1 母稿）。
- 仍含 `SourceCard` 的深度教程：35 篇。
- Phase 1：3 verified / 0 review / 0 partial / 0 blocked；Phase 2 可启动。

## `codex-form-factors` 生产记录

### Writer

- 第一次调用：进程持续 5 分 36 秒，没有终端输出、目标 diff 或研究目录，人工中止；清理了含账户标识的调试日志。
- 第一次重试：成功识别项目级 `/learnprompt-single-mdx`，生成 1 篇 MDX、完整 research pack 和 3 张真实任务卡；writer 保持 `partial`，未写分数或 PASS。
- Writer 检查：单篇 validator 通过，Starlight 构建 49 页通过。

### 独立评审与修复

1. 初审：Codex `gpt-5.4`，全新只读会话；2 blocker / 3 major / 1 minor，61/100，FAIL。
2. 修复：纠正 Chrome extension / ChatGPT web / desktop app 层级；限定本地配置共享范围；补 Windows 一手资料；缩窄 Showcase 外推；将 Card 2 明确写成失败实验；脱敏原始日志；逐项标注来源类型。
3. Follow-up 1：全新只读会话；0 blocker / 0 major / 1 minor，95/100，FAIL。唯一问题是把单次继承到的 `danger-full-access` 外推成通用默认值。
4. 修复：删除“默认值”断言，改为要求显式核对实际权限模式。
5. Follow-up 2：第三个全新只读会话；0 blocker / 0 major / 0 minor，93/100，PASS。

### 最终门禁与提交

- `showcase_status: verified`
- `quality_score: 93`
- 单篇 validator：PASS verified (93/100)
- Lane A 完整构建：49 页 PASS
- 主分支 cherry-pick 后完整构建：49 页 PASS
- SourceCard：目标 MDX 零命中
- 隐私扫描：session/request/account 标识与本机绝对路径零命中
- Lane commit：`cdd3641 docs(codex): goldenize codex-form-factors (93)`
- 主分支 cherry-pick：`afbb39f docs(codex): goldenize codex-form-factors (93)`

## 恢复预算两篇生产记录

### Writer 与预算

- 两篇在用户重置预算后分别按“新初次调用 + 最多两次重试”重新计数。
- 新初次调用（attempt 1/3）在模型启动前被空 MCP 配置格式校验拒绝；两个 lane 均零改动。控制面仍按谨慎口径计入一次尝试。
- 第一次重试（attempt 2/3）改用 `{"mcpServers":{}}`，两条 Claude Code writer 均成功执行一次 `/learnprompt-single-mdx`；没有使用 attempt 3/3。
- 两个 writer 只修改各自 MDX、`research/articles/<slug>/` 与 `starlight/public/images/articles/<slug>/`，保持 `partial`，不自评、不写 `quality_score`。

### `project-checklist`（94/100）

- 从 41 行清单扩展为六格开工契约；Showcase 保存完整/不完整项目卡和无依赖 Node 校验器，控制面复跑得到预期退出码 0 / 1。
- Harness 橙皮书因无标准开放许可只作为二手主题地图链接；教学 SVG 为 LearnPrompt 原创，CC BY-NC-SA 4.0。
- 独立只读初审直接 PASS：0 blocker / 0 major / 0 minor，94/100。
- Lane commit：`3badfc4 docs(ai-coding): goldenize project checklist (94)`；主分支 cherry-pick：`3390833`。

### `first-skill-md`（93/100）

- Showcase 保存合法与三个非法 `SKILL.md`、当前官方 `quick_validate.py` 输出和 `.skill` 打包结果；教学图解释三级渐进披露。
- Agent Skills 橙皮书许可不明确，只保留主题地图链接，未复制图片或成段文字。
- 独立初审 FAIL（2 blocker / 2 major / 1 minor，59/100）：发现官方脚本已加入 `compatibility`、旧 commit/日期不一致、XML 校验边界错误、“唯一触发器”表述过强。
- 控制面以官方 `anthropics/skills` commit `9d2f1ae` 重跑并修正文、研究包、Showcase 冻结输出和 SVG。全新 follow-up 确认 finding 全部关闭；另一全新只读会话按六维量表终审 PASS（0 / 0 / 0，93/100）。
- Lane commit：`748a2d8 docs(agent-skills): goldenize first skill guide (93)`；主分支 cherry-pick：`f7104c9`。

### Phase 1 总门禁

- 6 篇 verified 教程全部重新通过 validator。
- Validator 回归：1 positive / 11 privacy negatives / 11 visual negatives / 7 review negatives，全部 PASS。
- 两篇合并后主分支完整构建：49 页 PASS。
- 主分支 `SourceCard` 剩余 35 篇，正好对应尚未黄金化的深度教程；Phase 2 不把这些草稿算完成。

## Pilot 控制面加固

`codex-form-factors` 暴露了两个生产风险：原始 reviewer 日志曾写入被审 worktree，形成自引用读取；脱敏前的日志还包含运行标识和本机路径。文章层已修复，生产 skill 同步加固，避免后续批量复制这个问题。

- Skill workflow：原始命令和 review 输出必须先写到仓库外，进程结束后冻结并脱敏；不能以退出码代替最终评审报告。
- Research contract：账号、认证头、凭据、session/thread/turn/item/request ID、用户目录与临时工作树路径均为 release blocker。
- Validator：递归扫描 research pack 中所有文本特征文件，包括无扩展名文件；verified review 必须声明只读隔离和仓库外捕获，并包含六维评分、`blocker 0 / major 0 / minor 0`、与 frontmatter 一致的最终 PASS 分数。
- 回归测试：1 个正例、11 个隐私负例、11 个视觉负例、7 个 review 格式负例全部 PASS。
- 正向回归：3 篇 Phase 0 黄金样稿与 `codex-form-factors` 全部重新通过 validator；旧 Loop Showcase 中一条真实 macOS 临时目录已脱敏为 `$TMPDIR/...<redacted>`。
- Skill 结构校验：PASS。
- 完整构建：49 页 PASS。
- 重新打包：`.claude/packages/learnprompt-single-mdx.skill`，SHA-256 `97bffa23b6fba544a37280afd5bd362dc29042340b1ca22bcbb57955d6ea6858`。
- 独立控制面评审：初审 FAIL（1 blocker / 2 major / 0 minor）；第二轮 FAIL（0 / 2 / 1）；第三轮仍为 FAIL（0 / 2 / 1），证明宽松隔离声明和 PASS 块后的 `当前状态：FAIL` 仍可绕过；第四轮独立只读复审 PASS（0 blocker / 0 major / 0 minor），上述 finding 全部关闭。

## 教学视觉门禁加固

- 四篇 verified 母稿各新增 1 张 1200×675 的本地原创教学 SVG、具体 alt、紧邻图注和 `asset-ledger.md`；均经独立只读视觉审稿，Loop 一稿先 FAIL、修复来源追踪与描述后复审 PASS。
- verified 文章的最后视觉终审必须逐图记录 `Visual assessment: PASS`、精确 `Asset` 路径、`Teaching role`、`Decorative-only: no` 与明确 `Rights`。
- Validator 拒绝装饰/封面/banner 等用途、空泛 teaching purpose、缺文件/图注/台账、未进入最终视觉终审的图片，以及只写“原创/自有/project-owned”而没有明确许可证或授权引用的权利声明。
- 可写控制面回归：1 个正例、11 个隐私负例、11 个视觉负例、7 个 review 负例全部 PASS；四篇正向 validator 和 49 页完整构建 PASS。
- 视觉控制面初审 FAIL（2 blocker / 1 major / 1 minor），发现装饰图与 ownership-only license 绕过；修复后复审只剩状态记录未同步的 1 major。本节完成落账后，最后独立只读复核 PASS（0 blocker / 0 major / 0 minor）。

## 边界

- 不把 CLI 启动、401、503 或进程存活记作文章写作进度。
- 重置预算的两篇只使用 attempt 1/3 与 attempt 2/3；没有擅自扩大到第四次或继续消耗 attempt 3/3。
- 不用主控制器代写来伪装 `/learnprompt-single-mdx` 已成功执行。
- 当前没有 push、部署或发布。
- Phase 1 总门禁已通过；Phase 2 仍按每篇单独 Skill、最大并发 2、每两篇合并后全站构建的规则执行。
