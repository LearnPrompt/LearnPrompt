# control-verification.md — 控制与核验记录

核验日期：2026-07-12。本文件记录 writer preflight、主控外层补跑、机械门禁与独立终审。

## Showcase 与 blocked preflight

- `skill-router-lab` 的 broad / bounded fixture repos、prompts、expected labels、schema、runner、privacy scan 与 evaluator 已提交。
- 嵌套 `codex exec --ephemeral` 的三次 preflight 已做脱敏冻结：
  - 第一次证明 `codex exec` 不接受 `-a/--ask-for-approval`；
  - 第二次证明默认宿主态被 `state_5.sqlite` 只读与 app-server 权限阻断；
  - 第三次证明改到临时 `CODEX_HOME` 后，仍因 `api.openai.com` 解析失败无法真正连模。
- malformed result 负例会被 deterministic evaluator 拒绝。
- ground truth 已修正为两版共享同一标签：request 1/2 为正例、3/4 为反例；不再把 broad 的预测误触发写成“应该触发”。
- 主控外层真实运行：broad implicit 4 次、bounded implicit 4 次、bounded explicit 1 次，均为 fresh `codex exec --ephemeral`，固定 `gpt-5.5`。
- broad 与 bounded 均为 TP 2 / FP 0 / FN 0 / TN 2，precision=1、recall=1；explicit loaded=true、exit 0。
- canary 只从每次 final answer 判定，不从过程日志判定。

## 内容与构建门禁

- partial validator：见 `release-gate-result.txt`。
- Starlight build：见 `release-gate-result.txt`。
- privacy scan：见 `release-gate-result.txt`。
- `git diff --check`：见 `release-gate-result.txt`。

## 当前状态

- frontmatter：`showcase_status: verified`、`quality_score: 93`
- review：新的独立 follow-up reviewer PASS，blocker/major/minor = 0/0/0
- 真实 broad / bounded implicit confusion matrix：complete
