# Showcase Index

本篇只有一个冻结 Showcase：`docs-migration-pipeline/`。

- 入口：[`docs-migration-pipeline/README.md`](./docs-migration-pipeline/README.md)
- 目标：证明流水线型 Skill 的核心不是“把步骤列出来”，而是用 stage contract、receipt、checkpoint、resume、invalidation 和 idempotency 管理失败恢复
- 当前状态：`showcase_status: verified`；独立只读 reviewer PASS 98/100、无 findings、视觉 PASS。offline replay 与外层 gpt-5.5 显式 Skill 调用已通过，writer 隔离层首次宿主阻断也保留为历史证据。privacy scan 与 release gate 结果记录在同目录 `results/` 和上一级 `release-gate-result.txt`
