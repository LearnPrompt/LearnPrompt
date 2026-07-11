# Control verification

核验日期：2026-07-11。以下为 writer 阶段的机械门禁；原始 stdout / stderr / JSONL 先写在工作树外系统临时目录，本目录只保留脱敏后的最小证据。

## Showcase 与 deterministic gate

- `receipt-normalizer` 的真实 `codex exec` 已在工作树外隔离 Git 仓库完成：
  - preflight：固定 `gpt-5.6-sol` 被 `codex-cli 0.142.2` 以“requires a newer version of Codex”拒绝；
  - 正式 run：固定 `gpt-5.5`，`--ephemeral`、显式 `workspace-write`、全局 `-a never`、`--json`、`--output-schema`、`--output-last-message`；
  - 最终只修改 `src/normalizeReceipt.js`，把 `digits.slice(0, 4)` 改为 `digits.slice(-4)`。
- 脱敏与 replay：
  - `stdout-sanitized.jsonl` 已把真实 `item.id` 改成稳定占位符，并把命令里的绝对 shell 路径替换成 `<shell>`；
  - `node research/articles/codex-cli-workflow/showcase/receipt-normalizer/scripts/verify-showcase.mjs` 在离线模式 replay good gate、bad gate 与 privacy scan，不会再次调用模型；
  - good gate：exit 0，fresh repo `npm test` 仍是 4/4 通过；
  - bad gate：exit 3，因 `README.md` 越界被拒绝；
  - privacy scan：PASS，机械扫描整个 `research/articles/codex-cli-workflow/`，拒绝真实 identifier、UUID、绝对临时路径、绝对 shell 路径；
  - 连续 replay 后，冻结结果文件保持不变。

## 深度与结构门禁

- 正文字数：`body_chars=8412`
- 去代码中文解释字符：`cn_explanatory_chars=2849`
- H2 数量：`h2_count=10`
- partial validator：PASS

## 站点与 diff 门禁

- `npm --prefix starlight run build`：PASS
- Starlight / Pagefind：49 页生成，目标路由 `/codex/codex-cli-workflow/` 已产出
- staged diff check（临时 index，不污染真实 index）：PASS

这些机械记录不代替独立 reviewer 的事实判断。writer 阶段保持 partial；独立只读 follow-up 关闭全部 finding 后，最终状态为 verified 98/100。
