# 证据台账 — content-automation-pipeline

来源核对日期统一为 2026-07-11。

| # | 声明 | 证据 | 证据类型 | 验证日期 | 置信度 | 限制 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Claude Code 官方 `Common workflows` 提供 worktrees、`plan` 模式和把 Claude 接入脚本的工作流积木 | `https://code.claude.com/docs/en/common-workflows` | 一手文档 | 2026-07-11 | 高 | 官方页面没有定义本文的七阶段流水线术语 |
| 2 | `plan` 模式允许先读文件和做计划，再由人批准后写磁盘 | Claude Code 官方 `permissions` 与 `common-workflows` 页面关于 `plan` mode 的描述 | 一手文档 | 2026-07-11 | 高 | 证明的是编辑边界，不是内容质量 |
| 3 | Hook 是生命周期上的确定性控制层，而不是建议性提示 | Claude Code 官方 `hooks-guide` 中关于 deterministic control 的说明 | 一手文档 | 2026-07-11 | 高 | Hook 能保证动作发生，不保证编辑判断本身正确 |
| 4 | `PreToolUse` hook 可通过 stdin 接收事件 JSON，并用 stdout / exit code 返回 deny / ask / allow 决定 | Claude Code 官方 `hooks` reference 与 `hooks-guide` 的输入输出示例 | 一手文档 | 2026-07-11 | 高 | 本文 Showcase 未在线调用 Hook，只借用其门禁思想 |
| 5 | allow / ask / deny 的真正执行者是 Claude Code 权限系统，而不是 prompt 或 `CLAUDE.md` | Claude Code 官方 `permissions` 页面“Permission rules are enforced by Claude Code, not by the model” | 一手文档 | 2026-07-11 | 高 | 本文没有接真实发布工具，因此只做本地候选门禁 |
| 6 | Skill 适合承载可复用工作流，且正文按需加载 | Claude Code 官方 `skills` 与 `features-overview` 页面 | 一手文档 | 2026-07-11 | 高 | 本文只借其工作流思想，不把 Showcase 打包成项目 Skill |
| 7 | `snapshot / normalize / dedupe / score / draft / verify / approve` 是本文自建的七阶段操作模型，不是 Claude Code 官方术语 | 对照 `common-workflows`、`hooks`、`permissions`、`features-overview` 页面后得出的编辑综合 | 编辑综合 | 2026-07-11 | 高 | 属于教学建模，需要在正文中明确标注 |
| 8 | 成功场景读取两份快照共 6 条记录，normalize 后 6 条、dedupe 后 5 条、score 入选 4 条 | `showcase/weekly-brief-pipeline/results/success/command-summary.txt`、`snapshot.manifest.json`、`dedupe.manifest.json`、`score.manifest.json` | 一手实跑 | 2026-07-11 | 高 | 离线 fixture，非实时新闻抓取 |
| 9 | 成功场景生成的草稿逐条保留 `source_url`、来源快照、发布时间与筛选理由 | `showcase/weekly-brief-pipeline/results/success/drafts/2026-07-11-dual-source-ai-weekly.md` | 一手实跑 | 2026-07-11 | 高 | 摘要文本来自冻结 fixture，不代表在线模型能力 |
| 10 | 成功场景只有在读取批准工件后才进入本地 `publish-candidate/`，且 manifest 明示 `external_publish_triggered: false` | `showcase/weekly-brief-pipeline/results/success/approve.manifest.json` | 一手实跑 | 2026-07-11 | 高 | 证明的是本地候选状态，不是外部发布集成 |
| 11 | 缺少 `source_url` 的负例停在 `normalize`，退出码 `21`，状态是 `blocked_data_quality`，并且 `no_content: false` | `showcase/weekly-brief-pipeline/results/missing-source-field/command-summary.txt` 与 `normalize.manifest.json` | 一手实跑 | 2026-07-11 | 高 | 只覆盖一种字段缺失场景 |
| 12 | `verify-failed` 负例在 `draft` 后故意破坏 `openai-codex-cli` 的 `source_url`，随后真实停在 `verify`，退出码 `23` | `showcase/weekly-brief-pipeline/results/verify-failed/command-summary.txt`、`draft.manifest.json`、`verify.manifest.json` 与 `pipeline-state.json` | 一手实跑 | 2026-07-11 | 高 | 演示的是下游 contract 破坏，不是输入快照损坏 |
| 13 | 未提供人工批准的负例先完成 `draft` 和 `verify`，再在 `approve` 段以退出码 `31` 阻断，且 `candidate_created: false` | `showcase/weekly-brief-pipeline/results/no-approval/command-summary.txt` 与 `approve.manifest.json` | 一手实跑 | 2026-07-11 | 高 | 仍是本地演示，不含外部 CMS 或 webhook |
| 14 | 一键 Showcase 脚本会顺序重放四场景、校对 `0/21/23/31`，先把完整 raw stdout / stderr 写入 `os.tmpdir()` 隔离目录，写成功后再读回做 session / request ID 与绝对 tmp 路径脱敏、80 行 / 6000 字裁剪，并 finally 清理 raw 目录后回填各场景 `command-summary.txt` 与根层 `run-result.txt` | `showcase/weekly-brief-pipeline/scripts/verify-showcase.mjs` 与 `results/run-result.txt` | 代码审阅 + 一手实跑 | 2026-07-11 | 高 | repo 内只保留冻结摘要；单场景直跑不会自动重建根层归档 |
| 15 | Showcase 的零密钥边界成立：fixtures、脚本、草稿、manifest 都在本仓库内，未引入网络请求或真实外部发布 | `showcase/weekly-brief-pipeline/README.md` 与 `scripts/run-pipeline.mjs` | 代码审阅 + 一手实跑 | 2026-07-11 | 高 | 未覆盖将来接入真实抓取 API 的情况 |
| 16 | `claude-code-orange-book` README 声明 CC BY-NC-SA 4.0，可作为二手主题地图保留署名与许可说明 | `https://github.com/alchaincyf/claude-code-orange-book` README License 段 | 二手来源许可核验 | 2026-07-11 | 中 | 不用于证明当前产品行为 |
| 17 | 教学图为 LearnPrompt 原创 SVG，未复制第三方截图，且已用实际渲染 PNG 复检文本边界 | `asset-ledger.md`、`visual-check.txt` 与 SVG 文件本身 | 本地原创工件 + 视觉复检 | 2026-07-11 | 高 | 图示表达是本文教学综合，不是官方流程图 |
| 18 | writer 阶段 partial validator 与终审后的 verified validator 均已运行并通过 | `validator-output.txt` 与 `control-verification.md` 第 2 节 | 一手实跑 | 2026-07-11 | 高 | 机械结构闸门与独立 reviewer verdict 分开记录 |
| 19 | `cd starlight && npm run build` 已生成 49 页，并包含 `/claude-code/content-automation-pipeline/` 页面 | `build-output.txt` 与 `control-verification.md` 第 3 节 | 一手实跑 | 2026-07-11 | 高 | 构建成功不等于内容已通过独立评审 |
| 20 | diff check 只涉及允许修改的三个路径族 | `diff-check.txt` 与 `control-verification.md` 第 4 节 | 一手实跑 | 2026-07-11 | 高 | 仍需靠独立 reviewer 判断内容是否充分 |
