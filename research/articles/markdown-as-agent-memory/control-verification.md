# control-verification.md — 控制与核验记录

核验日期：2026-07-12。

## 一手来源与本机边界

- Obsidian 官方页面已复核：notes 以 Markdown 纯文本文件保存在本地 vault；properties 以 YAML 形式存放在文件顶部，适合小型原子值。
- CommonMark 0.31.2 与 `git diff` 官方文档已复核：前者提供语法便携性，后者提供文本差异审计能力；两者都不定义 Agent memory semantics。
- Claude Code memory 文档已复核；本机 `claude --version` 为 `2.1.206 (Claude Code)`，`claude --help` 中 `--bare` 明示会跳过 auto-memory 与 `CLAUDE.md` auto-discovery。
- Codex `AGENTS.md` 官方文档已复核；本机 `codex --version` 为 `codex-cli 0.142.2`，`codex features list` 可见 `memories experimental true`，因此正文只把它当作实验特性存在，不臆测其记忆语义。

## Frozen showcase 控制面

- `markdown-handoff-packet` 只使用合成的 scheduled digest timezone drift 事故。
- Deterministic replay 已覆盖 `0 / 41 / 42 / 43 / 44 / privacy 0`，并证明 normal packet 只写 `reports/handoff.json` 与 `reports/handoff.md`，且 source packet unchanged。
- 负例中的 `43` 采用结构化敏感标记占位符，而不是提交真实 secret/runtime 形状；因此 privacy scan 仍然必须为 `0`。

## Writer run 与外层控制器补跑

- writer-side 首次真实 nested Codex 尝试因初始 `codex exec` 调用形状不兼容而失败；该历史没有被改写成成功。
- 外层控制器随后按修正后的同一冻结 prompt/schema/fixture 执行 `node research/articles/markdown-as-agent-memory/showcase/markdown-handoff-packet/scripts/run-codex-live.mjs`。
- 当前冻结摘要见 `showcase/markdown-handoff-packet/results/live-run-summary.json`：`status=completed`、Codex CLI `0.142.2`、model `gpt-5.5`、exec `0`、packet unchanged、JSON/Markdown reports 均写出、report match、assertions pass。
- 唯一变更是临时 repo 的 `reports/`；worktree 内只提交脱敏后的 final message、两份 live handoff 和机械检查摘要。

## 发布状态

- Showcase verifier：normal `0`，negative `41/42/43/44`，privacy `0`。
- Partial validator：article/research/status 均 PASS。
- 教学 SVG 已用 Chrome 以 `1400×900` 渲染到 worktree 外，目视确认标题、输出字段、四条 reject rail 均无裁切或越框。
- Starlight build：49 pages，exit `0`；`git diff --check` exit `0`。
- 独立只读 reviewer：Codex Spark，仓库外 raw final report，writer 未参与评分或改写。
- 最终结论：PASS `97/100`，blocker/major/minor = `0/0/0`，视觉 PASS。
- frontmatter 已在 reviewer PASS 后更新为 `showcase_status: verified`、`quality_score: 97`。
- 这些控制记录与机械门禁不替代 reviewer verdict；最终 verdict 见 `review.md`。
