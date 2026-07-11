# control-verification.md — 控制与核验记录

核验日期：2026-07-12。本文件记录 live/offline showcase、privacy、独立评审、verified validator、Starlight build 与 diff check。

## Showcase

- deterministic replay：`verify-showcase.mjs` 通过，冻结 `ready=0 / missing-changelog=21 / version-mismatch=22 / unverifiable-install=23 / na-without-evidence=24 / privacy=0`。
- writer 隔离层首次真实调用被宿主 app-server 权限阻断；该失败证据保留在 `codex-stderr-summary.txt`。
- 外层主控使用同一冻结 fixture / prompt / schema 与 gpt-5.5 补跑成功：`exec_exit_code=0`、`release_exit_code=0`、tests `2/2`、JSON / Markdown 报告均写入，变更仅为 `reports/`。
- privacy scan：`exit 0`，未提交 runtime ID、绝对临时路径、用户目录路径或 shell 绝对路径。

## 终审前状态规则

- writer 阶段保持 `showcase_status: partial`，不自填 `quality_score`，`review.md` 保持 `PENDING`。
- 独立只读 reviewer 给出 PASS 97/100、blocker 0 / major 0 / minor 0、视觉 PASS 后，外层主控才提升为 `verified`。

## 当前状态

- verified validator：PASS。
- `npm --prefix starlight run build`：PASS，Pagefind 报告 49 个 HTML 文件，包含 `/agent-skills/checklist-skill-design/index.html`。
- `git diff --check`：PASS。
- 本轮交付 research pack、fixture、SVG、MDX、真实 live 结果和机械门禁结果。
- frontmatter：`showcase_status: verified`，`quality_score: 97`。
- `review.md` 最终状态：PASS。
