# Showcase：observable-receipt-distiller

本篇 Showcase 只验证一件事：能不能从**可观察 receipts** 中提炼出一个候选 Skill，并用留出集证明它没有越过隐私与“隐藏思维链”边界。

冻结目录：`research/articles/thinking-distillation-boundary/showcase/observable-receipt-distiller/`

- `fixture/`：隔离 temp repo 的基线，包含 3 份训练 receipts、4 个 holdout fixtures，以及显式 `$observable-receipt-distiller` 所需的 Skill。
- `scripts/verify-showcase.mjs`：离线 replay `0 / 51 / 52 / 53 / 54 / privacy 0`，不会再次调用模型。
- `scripts/run-codex-live.mjs`：只做一次真实 nested Codex 显式 Skill 调用尝试，固定 `gpt-5.5`、prompt 与 JSON schema。
- `results/`：脱敏后的 replay、privacy、candidate snapshot、live summary 与 stderr/stdout 摘要。

从仓库根目录运行：

```bash
node research/articles/thinking-distillation-boundary/showcase/observable-receipt-distiller/scripts/verify-showcase.mjs
node research/articles/thinking-distillation-boundary/showcase/observable-receipt-distiller/scripts/run-codex-live.mjs
```

写作状态规则：本文 writer 阶段保持 `showcase_status: partial`。如果 nested Codex 在当前宿主被阻断，只冻结 blocked 证据，不伪造成功；离线 replay 仍必须可连续重放。
