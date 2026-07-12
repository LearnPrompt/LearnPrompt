# control-verification.md — 控制与核验记录

核验日期：2026-07-12。本文件记录 `release-feed-api` showcase、privacy、partial validator、Starlight build、diff check 与教学图渲染检查的真实状态。

## Showcase

- fixture tests：`npm test` 通过，7/7 pass；同一 request contract 在 in-process transport 下覆盖了 success、`41`、`42`、`43`、`44` 语义。
- writer sandbox 首次 loopback / nested 尝试被 `EPERM listen 127.0.0.1` 阻断；该 blocked 事实保留为宿主层证据。
- 外层修复 `release-gate.mjs` / `run-codex-live.mjs` 的同步子进程事件循环锁死后，`verify-showcase.mjs` 退出 `0`，六个场景分别命中 `0 / 0 / 41 / 42 / 43 / 44`，privacy `0`。
- “缺 credential”测试显式清空 `RELEASE_FEED_TOKEN`，避免 live 环境变量泄漏进测试；fixture tests 7/7 通过。
- nested Codex：真实 `gpt-5.5` 显式 `$release-feed-api` 退出 `0`，读取 3 个 release，写出 JSON / Markdown 报告，测试 7/7 通过，只新增 `reports/`。

## 教学图

- `api-request-contract.svg` 已实际 rasterize 为 `$TMPDIR/api-request-contract.png` 并目检。
- 结论：无裁切、无重叠、无溢出；主流程和 `41/42/43/44` 分支可辨识。
- 本地 rasterize 需要显式指定 `Helvetica.ttc`，否则 ImageMagick 在当前宿主上拿不到默认字体。

## 终审前状态规则

- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`。
- `review.md` 保持 `PENDING`；writer 不自评。
- writer blocked 与外层 success 分层记录；最终 results 指向外层同 fixture / prompt / schema 的成功重跑。

## 当前状态

- 独立只读 reviewer：PASS 100/100，blocker / major / minor = 0 / 0 / 0，视觉 PASS。
- frontmatter：`showcase_status: verified`，`quality_score: 100`。
- privacy scan：PASS。
- partial validator：PASS。
- `npm --prefix starlight run build`：PASS，输出包含 `/agent-skills/api-integration-skill-design/index.html`；Pagefind 报告 49 个 HTML 文件。
- `git diff --check`：PASS。
- 工作树仅包含目标文章、对应 research pack 与图片目录改动，没有扩散到其他教程。
