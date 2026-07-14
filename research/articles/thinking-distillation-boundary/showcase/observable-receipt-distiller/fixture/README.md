# Fixture Repo：observable-receipt-distiller

这个隔离 repo 只包含**合成** frontmatter 修复案例，用来演示“从 observable receipts 提炼 candidate skill”的边界。

目录说明：

- `.agents/skills/observable-receipt-distiller/`：供显式 `$observable-receipt-distiller` 调用的 Skill。
- `receipts/training/`：3 份训练 receipts，只保留 input snapshot、accepted patch、user correction、validator command/result、known limitation。
- `receipts/negative/`：三类拒绝 marker：evidence-poor、sensitive marker、private transcript / hidden-CoT request marker。
- `holdout/`：4 个留出任务与 `expected.json`，覆盖 missing title、missing description、invalid sidebar order、already-valid no-op。
- `.agents/skills/frontmatter-repair/`：候选 Skill 的目标生成路径。基线 fixture 中不存在，必须由 distillation 过程生成。

从 fixture repo 根目录运行：

```bash
node .agents/skills/observable-receipt-distiller/scripts/distill-candidate.mjs \
  --receipts receipts/training \
  --candidate .agents/skills/frontmatter-repair \
  --summary reports/distillation-summary.json

node .agents/skills/observable-receipt-distiller/scripts/evaluate-candidate.mjs \
  --candidate .agents/skills/frontmatter-repair \
  --holdout holdout \
  --summary reports/evaluation-summary.json

npm test
```

训练 receipts 与 holdout fixtures 都不包含真实 transcript、真实 credential 或真实用户数据。
