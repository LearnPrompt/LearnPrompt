# Showcase — content-automation-pipeline

本篇文章只有一个 Showcase：[`weekly-brief-pipeline/`](./weekly-brief-pipeline/)。

它把“一次性抓取 + 总结”的需求改写成可恢复、可追溯、默认只产草稿、人工批准后才进入发布候选的七阶段流水线：

1. `snapshot`
2. `normalize`
3. `dedupe`
4. `score`
5. `draft`
6. `verify`
7. `approve`

这里的七阶段命名是本文的教学模型，不是 Claude Code 官方术语。Claude Code 官方资料负责提供工作流、Hook、权限与审批边界；本 Showcase 负责把这些边界落成一个离线可回放的周报流水线。

- 首选一键复现：`node research/articles/content-automation-pipeline/showcase/weekly-brief-pipeline/scripts/verify-showcase.mjs`
- 冻结链路：一键脚本先把四场景完整 raw stdout / stderr 写到 `os.tmpdir()` 隔离目录，再读回做 session / request ID 与绝对 tmp 路径脱敏、80 行 / 6000 字裁剪，并在 `finally` 清理 raw 目录
- 单场景命令、fixtures、脚本与结果：见 [`weekly-brief-pipeline/README.md`](./weekly-brief-pipeline/README.md)
- 顶层机械门禁（Showcase + validator(partial) + 49 页 build + diff check + SVG 视觉复检）：见上一级的 `release-gate-result.txt`
