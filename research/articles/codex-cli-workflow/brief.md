# Brief：把 Codex CLI 变成可验证闭环

## 问题

旧稿只说“进项目根目录、让 Codex 改、跑检查”，但没有回答新手最容易踩空的三个点：

1. 交互式 `codex` 和自动化 `codex exec` 到底怎么分工。
2. 怎样把“帮我修一下”冻结成机器可执行、人工可验收的 task contract。
3. 一次成功的模型运行，怎样落成不再依赖模型的 patch、测试、diff 与结构化报告闭环。

## 目标读者

已经装好 Codex CLI、会跑基本 `git` / `npm test`，但还没有把一次聊天升级成可审查自动化闭环的初学者工程师。

## 学习目标

读完读者能：

1. 区分交互式 `codex` 与非交互 `codex exec` 的适用场景，不把二者混成“同一个聊天框换个 flag”。
2. 在进入自动化前，先检查目录、工作树、Git 仓库边界与权限参数，再冻结 task contract。
3. 复现一次真实的 `receipt-normalizer` showcase：只改一个实现文件、跑测试、检查 diff、生成结构化最终报告。
4. 用离线 deterministic gate 验证 patch、测试结果、文件范围与报告字段，而不是再次调用模型“帮我看看行不行”。

## 非目标

- 不比较 Codex 与其他模型或其他 coding agent 的能力排名。
- 不宣称一次成功的 `codex exec` 代表“最优自动化路线”。
- 不覆盖 Cloud、IDE、桌面 App 的完整产品面，那是其他文章的范围。

## 中心论点

把 Codex CLI 用稳，不是多写 prompt，而是把执行闭环拆成六步：检查目录与工作树、冻结 contract、执行最小修改、跑测试、检查 diff、结构化汇报。交互式 `codex` 适合把需求问清楚；`codex exec` 适合在 Git 仓库、权限边界和验收命令都已冻结后，作为一次可记录、可回放、可机械验收的自动化步骤。

## Showcase 问题

在工作树外创建一个隔离临时 Git 仓库 `receipt-normalizer`，其中只有一个实现文件带着可复现 bug。真实运行一次 `codex exec`（`codex-cli 0.142.2`），要求它：

- 先检查仓库目录与工作树。
- 读取冻结的 `task-contract.json`。
- 只修改 `src/normalizeReceipt.js`。
- 运行 `npm test`。
- 检查 diff。
- 用 `--output-schema` 产出结构化最终报告。

随后再用不调用模型的 deterministic gate 验证好 patch，并对故意越界的 bad patch 返回非零退出码。

## 需要的证据

- 2026-07-11 的官方一手文档：
  - `https://learn.chatgpt.com/docs/non-interactive-mode`
  - `https://learn.chatgpt.com/docs/developer-commands?surface=cli`
  - `https://learn.chatgpt.com/docs/agent-approvals-security`
- 本机 `codex --version`、`codex --help`、`codex exec --help`、`codex exec resume --help`、`codex doctor`。
- 一次真实的 `codex exec` 原始 stdout / stderr / JSONL，先落在工作树外，再脱敏进 research pack。
- 一个 deterministic gate 的正例与负例运行结果。

## 验收条件

- 公开页删除 `SourceCard`，底部仅保留官方资料与 Codex Orange Book 链接、署名和 CC BY-NC-SA 4.0 许可说明。
- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`。
- 正文至少 6 个 H2，正文字符与去代码中文字符达到深度下限。
- 至少一个本地原创教学图，解释 contract、执行、验收、diff、报告之间的闭环。
- 运行真实 showcase、partial validator、49 页构建与 staged diff check；保存脱敏证据。

## 目标文件

- `starlight/src/content/docs/codex/codex-cli-workflow.mdx`
- `research/articles/codex-cli-workflow/`
- `starlight/public/images/articles/codex-cli-workflow/`
