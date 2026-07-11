# Weekly Brief Pipeline

这个 Showcase 用两份固定离线源快照，演示“双来源 AI 周报”的七阶段内容流水线。它不联网、不调用模型、不需要密钥，也不触发外部发布。

## 中心问题

如果你把需求写成“抓两份源，帮我总结成周报，然后发出去”，Agent 很容易把抓取失败、字段缺失、草稿 contract 被改坏、人工未审批等不同问题压扁成一句“今天没内容”或“我已经帮你发布”。这个 Showcase 的目标正好相反：

- 把七个阶段的状态逐段落盘。
- 让失败停在对应阶段，而不是伪装成空结果或已完成。
- 默认只产 `draft`。
- 只有给定人工批准工件，才进入本地 `publish-candidate/`。
- 即使进入 `publish-candidate/`，也不外发。

## 目录结构

```text
weekly-brief-pipeline/
├── fixtures/
│   ├── approval-approved.json
│   ├── source-anthropic.snapshot.json
│   ├── source-openai-missing-source-url.snapshot.json
│   └── source-openai.snapshot.json
├── results/
│   ├── success/
│   ├── missing-source-field/
│   ├── verify-failed/
│   ├── no-approval/
│   └── run-result.txt
└── scripts/
    ├── run-pipeline.mjs
    └── verify-showcase.mjs
```

## 七阶段模型

1. `snapshot`：只承认冻结快照，不在运行中现抓。
2. `normalize`：把不同来源映射成统一字段，并对必填字段做失败即停。
3. `dedupe`：按 `source_url` 去重，保留选择理由。
4. `score`：用确定性规则打分，记录入选原因。
5. `draft`：生成 Markdown 草稿，逐条携带 `source_url` 和筛选理由。
6. `verify`：检查草稿字段、数量、去重一致性是否符合 contract。
7. `approve`：只有存在人工批准工件时，才复制到本地 `publish-candidate/`。

这里的七阶段命名是本文的教学模型，不是 Claude Code 官方术语。Claude Code 官方资料负责提供工作流、Hook、权限与审批边界；本 Showcase 负责把这些边界落成一个离线可回放的周报流水线。

## 首选一键复现

```bash
node research/articles/content-automation-pipeline/showcase/weekly-brief-pipeline/scripts/verify-showcase.mjs
```

这条命令会顺序重放四个场景，校对退出码 `0/21/23/31`，先把每个场景的完整 stdout / stderr 写进 `os.tmpdir()` 下的隔离 raw 目录；只有 raw 写成功后，才会从这些 raw 文件读回内容，按固定规则脱敏 / 裁剪并冻结到 `results/<scenario>/command-summary.txt`，同时更新 `results/run-result.txt`。

## 单场景命令

```bash
node research/articles/content-automation-pipeline/showcase/weekly-brief-pipeline/scripts/run-pipeline.mjs --scenario success
node research/articles/content-automation-pipeline/showcase/weekly-brief-pipeline/scripts/run-pipeline.mjs --scenario missing-source-field
node research/articles/content-automation-pipeline/showcase/weekly-brief-pipeline/scripts/run-pipeline.mjs --scenario verify-failed
node research/articles/content-automation-pipeline/showcase/weekly-brief-pipeline/scripts/run-pipeline.mjs --scenario no-approval
```

单场景命令保留给局部调试使用；如果你需要恢复 `command-summary.txt` 与根层 `run-result.txt`，请重新跑上一节的一键命令。

固定冻结规则也在一键脚本里写死了：脱敏会移除 session / request ID 与绝对 `os.tmpdir()` 路径，裁剪上限是 80 行 / 6000 字符；如果 raw 写入失败或某场景退出码不符，脚本不会生成或更新冻结 summary，最后还会在 `finally` 中清理 raw 目录。

## 场景与退出码

| 场景 | 说明 | 预期退出码 | 关键结论 |
| --- | --- | ---: | --- |
| `success` | 两份正常快照 + 人工批准工件 | `0` | 生成草稿，并提升到本地 `publish-candidate/` |
| `missing-source-field` | 第二份快照里有一条记录缺 `source_url` | `21` | 停在 `normalize`，状态为 `blocked_data_quality`，不会误报“今日无内容” |
| `verify-failed` | 输入与打分都正常，但在 `draft` 后故意破坏一条 `source_url` | `23` | 停在 `verify`，证明出稿后的 contract 破坏也能被机械拦截 |
| `no-approval` | 正常快照，但不给批准工件 | `31` | 草稿和校验工件都生成，但不会创建 `publish-candidate/` |

## 可替换边界

本 Showcase 不接模型。每条资讯的摘要都来自 fixture 中冻结的 `summary` 字段，脚本只做模板拼装。这样做是刻意的：

- `snapshot -> normalize -> dedupe -> score -> draft -> verify -> approve` 全部保持离线可回放。
- “摘要生成”只被当作一个可替换边界，未来可以接 Claude Code、别的模型，或人工改写。
- 无论摘要层换成什么，发布门禁都不能绕过 `verify` 和 `approve`。

## 结果工件

每个场景都会在 `results/<scenario>/` 下留下最小但足够的工件：

- `pipeline-state.json`：整条流水线状态。
- 各阶段 `*.manifest.json`：输入计数、错误、去重、打分、校验、批准结果。
- `drafts/*.md`：草稿。
- `publish-candidate/*.md`：仅成功场景存在。
- `command-summary.txt`：由 `verify-showcase.mjs` 从隔离 raw stdout / stderr 读回后脱敏 / 裁剪并冻结的执行摘录。

根层 `results/run-result.txt` 另外汇总四场景的退出码、最终状态和最终阶段；它和各场景 `command-summary.txt` 一样，都是从隔离 raw 捕获读回后再冻结的，方便在 rerun 之后快速确认归档仍然完整。

这些结果文件不包含密钥、账号标识符、会话 ID、绝对路径或外部发布结果。
