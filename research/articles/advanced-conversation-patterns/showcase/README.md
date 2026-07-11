# Showcase README — advanced-conversation-patterns

本 Showcase 证明的是**流程隔离**，不是 Claude 产品或模型能力排名。

- **Stage A**：只读探索，运行基线测试，冻结一份 handoff。
- **Stage B**：在全新进程里，只依赖 `repo + handoff` 做最小修复并验证。
- **负例**：如果 handoff 缺少 `acceptance.commands`，Stage B 必须拒绝继续。

## 目录

- `fixture/`：一次性 bug 仓库，零外部依赖，包含 `slugify` 双连字符 bug。
- `scripts/stage-a-explore.mjs`：只读探索并冻结 handoff。
- `scripts/stage-b-implement.mjs`：验证 handoff、复制 fixture 到临时目录、修复、验收。
- `handoff/`：冻结的正例 / 负例 handoff。
- `results/`：实际运行结果归档。

## 复现命令

在仓库根目录执行：

```bash
node research/articles/advanced-conversation-patterns/showcase/scripts/stage-a-explore.mjs
node research/articles/advanced-conversation-patterns/showcase/scripts/stage-b-implement.mjs \
  --handoff research/articles/advanced-conversation-patterns/showcase/handoff/handoff-good.json \
  --result research/articles/advanced-conversation-patterns/showcase/results/positive-run.txt
node research/articles/advanced-conversation-patterns/showcase/scripts/stage-b-implement.mjs \
  --handoff research/articles/advanced-conversation-patterns/showcase/handoff/handoff-missing-acceptance.json \
  --result research/articles/advanced-conversation-patterns/showcase/results/negative-run.txt
```

## 预期结果

- `stage-a-summary.txt`：记录基线失败症状，并写出完整 handoff。
- `positive-run.txt`：先显示基线失败，再显示只改 `src/slugify.js` 后验收通过。
- `negative-run.txt`：显示 `REJECT missing acceptance.commands[0]` 一类拒绝信息，退出码非 0。

## 限制

- 这是 deterministic 工程流程示范，不是在线模型实跑。
- Stage B 的修复逻辑故意写得很窄：它只认识这个 fixture 的 bug 形态，目的是证明
  “干净上下文 + 完整 handoff + acceptance gate” 这条流程。
- 临时副本创建在系统临时目录；结果文件不记录本机绝对路径。
