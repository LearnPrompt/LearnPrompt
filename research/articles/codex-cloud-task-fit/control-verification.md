# Control verification

核验日期：2026-07-11。以下是 writer 阶段的机械门禁记录；真实临时目录只存在于系统 `TMPDIR`，不会冻结进仓库。

## Showcase 与 cloud-fit-gate

- 可重跑命令：

```bash
node research/articles/codex-cloud-task-fit/showcase/cloud-handoff-lab/scripts/verify-showcase.mjs
```

- 正向 `positive-clean-room`：
  - `cloud-fit-gate`: exit `0`
  - clean checkout：PASS
  - good patch apply：PASS
  - acceptance command：`npm test -- --test-reporter tap`
  - changed files：仅 `src/rollupByReporterDay.js`
- 负向场景：
  - `negative-keychain-dependency`: exit `21`
  - `negative-browser-login`: exit `22`
  - `negative-missing-acceptance`: exit `23`
  - `negative-unclear-direction`: exit `24`
- privacy scan：PASS

## MDX 深度与 validator

- partial validator：PASS
- 正文字数：`body_chars=13738`
- H2 数量：`h2_count=11`
- 去代码中文解释字符：`cn_explanatory_chars=4913`

## 命令面证据

- 本机 `codex cloud --help` / `codex cloud exec --help` 摘录已冻结到 `showcase/cloud-handoff-lab/results/local-cloud-help.txt`
- 用途：只证明 `codex-cli 0.142.2` 的本地命令面有 `cloud`、`cloud exec`、`--env`、`--attempts`、`--branch`
- 边界：不代表真实 Cloud task 已提交

## 站点构建与 staged diff

- `cd starlight && npm run build`：PASS
- Starlight / Pagefind：找到并构建 `49` 个 HTML 文件；目标路由 `/codex/codex-cloud-task-fit/` 已生成
- staged diff check：PASS
  - 做法：把 worktree git metadata 复制到可写临时目录，在临时 gitdir 中执行 `git add` 与 `git diff --cached --name-only`
  - 结果：仅出现允许路径下的 MDX、research pack 与 SVG 资产

## 最终状态

- 独立 Spark 终审已关闭全部 finding。
- frontmatter：`showcase_status: verified`
- `quality_score: 100`
- Showcase replay、privacy scan、validator、build 与 diff-check 均通过。
