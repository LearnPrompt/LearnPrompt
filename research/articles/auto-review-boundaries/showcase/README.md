# Showcase：refund-window-review

验证日期：2026-07-11。环境目标：本机 macOS，`codex-cli 0.142.2`，模型固定 `gpt-5.5`。

## 这次 Showcase 验证什么

- GitHub code review surface 的核心合同能否在本地最小复现成三件事：真实 diff、repo guidance、anchored finding。
- 一个 staged JS diff 是否会引入“未来 `deliveredAt` 仍被判断可退款”的真实行为漏洞。
- 一次真实 read-only `codex exec` structured review 能否抓到该 changed-line regression。
- deterministic gate 能否机械验证真实 finding 的 file/line 锚点、漏洞描述、severity 与 reproduction，并稳定拒绝 fabricated out-of-diff finding。

## 这次 Showcase 不验证什么

- 不触发真实 GitHub `@codex review`、Automatic reviews 或 PR comment。
- 不比较模型能力排名。
- 不把本地 structured review 冒充为 GitHub 托管运行。
- 不证明 reviewer subagent、`approvals_reviewer = "auto_review"` 或 sandbox escalations 的生命周期。

## 目录

- `refund-window-review/fixture/base/`：基线 JS 仓库文件。
- `refund-window-review/fixture/staged.diff`：模拟 PR 的 staged diff。
- `refund-window-review/prompts/review-prompt.txt`：真实 structured review 提示词。
- `refund-window-review/schema/review-findings.schema.json`：`--output-schema` 约束。
- `refund-window-review/scripts/create-review-repo.mjs`：在工作树外创建隔离 Git repo，并把 bug diff staged。
- `refund-window-review/scripts/verify-review-finding.mjs`：good/bad gate，检查 changed file/right-side changed line 与 finding 内容。
- `refund-window-review/scripts/replay-showcase.mjs`：离线重放 deterministic gate，不再调用模型。
- `refund-window-review/results/`：脱敏 finding 与 good/bad gate 冻结输出。

## 真实模型运行约束

真实 run 使用：

- `codex-cli 0.142.2`
- 模型：`gpt-5.5`
- `-a never`
- `--sandbox read-only`
- `--ephemeral`
- `--ignore-user-config`
- `--ignore-rules`
- `--json`
- `--output-schema`
- `--output-last-message`

raw JSONL、stderr 与临时 repo 路径必须先写工作树外；研究包里只保留脱敏后的最小 finding 与 deterministic gate 结果。

## 离线 replay

从仓库根执行：

```bash
node research/articles/auto-review-boundaries/showcase/refund-window-review/scripts/replay-showcase.mjs
```

预期：

- good gate：exit 0
- bad gate：exit 3
- 不调用模型

这条 replay 只消费已冻结的 `real-finding.json`、`fabricated-out-of-diff-finding.json` 与 `fixture/staged.diff`。
