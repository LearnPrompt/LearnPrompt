# Control verification

核验日期：2026-07-11。以下记录由当前 writer 会话实际执行，原始命令输出先在终端检查，再只保留脱敏后的最小结论。

## Showcase 复现

命令：

```bash
cd research/articles/control-style-with-claude-md/showcase/style-scope
node verify-style-scope.mjs before
node verify-style-scope.mjs after
```

预期：

- `before`：UI 规则与 API 规则都能被定位，但 UI 文件含硬编码颜色、API 文件直接返回裸对象，因此结果 FAIL。
- `after`：两类问题都修正，结果 PASS。
- 两个场景都应输出 `SKIP ui-token rule for src/api/handlers/profile.ts ...`，证明 UI 规则不对 API 生效。

实际（完整关键输出与退出码见 `release-gate-result.txt`）：

- `before` 退出码 1，结果 FAIL。
- `after` 退出码 0，结果 PASS。
- 作用域轨迹符合预期，详情见 `showcase/style-scope/result.txt`。

## 内容与构建门禁

命令：

```bash
node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs \
  --article starlight/src/content/docs/claude-code/control-style-with-claude-md.mdx \
  --research research/articles/control-style-with-claude-md

cd starlight && npm run build
```

实际（冻结命令、关键输出与退出码见 `release-gate-result.txt`）：

- partial validator：PASS。
- Starlight build：PASS。
- `git diff --check`：PASS。

说明：

- 当前仍为 writer 阶段，`showcase_status: partial`，未写 `quality_score`。
- 这些记录不替代独立 reviewer 的事实审查与最终评分。
