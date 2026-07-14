# Minimal Harness Showcase

这个目录把 Harness 压缩成五个可以检查的部件：

1. `AGENTS.md`：指令——Agent 应该怎样工作。
2. `capabilities.json`：能力——允许使用哪些工具。
3. `constraints.json`：约束——哪些边界不能跨越。
4. `memory.md`：状态——哪些信息需要跨轮次保留。
5. `orchestration.json`：编排——先做什么、谁验收、何时停止。

运行验证：

```bash
node scripts/verify-harness.mjs
```

脚本只使用 Node.js 内置模块。五项全部通过，才说明这个示例同时具备五个部件；它不代表生产环境已经安全。

2026-07-10 的原始运行记录保存在同目录的 `result.txt`。
