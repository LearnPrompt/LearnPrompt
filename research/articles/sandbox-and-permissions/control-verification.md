# Control verification

核验日期：2026-07-11。本轮 reviewer 修正后的机械门禁与关键输出已冻结在 `release-gate-result.txt`；本文件只保留索引和边界说明。

## Deterministic gate

- `showcase/run-probes.sh`：PASS。实际连续生成两轮 frozen outputs，冻结 `environment.txt`、`checksum-manifest.md`、`probe-results.md`、`verifier-output.txt`、`replay-stability.txt`；第二轮 verifier 为 `checksum_manifest_matches_expected=yes`，replay compare 为 `stable=yes`。精确命令、关键输出和退出码见 `release-gate-result.txt` 第 1 节。
- verified validator：PASS 98/100。命令、关键输出和退出码见 `release-gate-result.txt` 第 2 节。
- Starlight 完整构建：PASS，Pagefind 报告 49 个 HTML 文件；精确摘录见 `release-gate-result.txt` 第 3 节。
- staged diff check：PASS。命令、退出码和暂存/回退方式见 `release-gate-result.txt` 第 4 节。

## Allowed-path check

- 本轮变更仍限制在以下路径：
  - `starlight/src/content/docs/codex/sandbox-and-permissions.mdx`
  - `research/articles/sandbox-and-permissions/`
  - `starlight/public/images/articles/sandbox-and-permissions/`
- 本次未修改其他文章、状态总表、sidebar/schema、Skill、组件或 git 历史。

独立只读终审已关闭全部 finding；最终 `showcase_status: verified`、`quality_score: 98`。
