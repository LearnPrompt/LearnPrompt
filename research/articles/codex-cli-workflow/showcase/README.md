# Showcase：把一次 `codex exec` 冻结成 patch、测试、diff 与报告

验证日期：2026-07-11。环境：本机 macOS，`codex-cli 0.142.2`。

## 这次 Showcase 验证什么

- 交互式 `codex` 与自动化 `codex exec` 的分工边界。
- 在工作树外创建隔离 Git 仓库后，`codex exec` 是否能只改允许文件、跑测试并输出结构化报告。
- 一次真实模型 run 之后，能否只用 deterministic gate 验证好 patch，并拒绝坏 patch。

## 这次 Showcase 不验证什么

- 不比较模型能力排名。
- 不宣称 `codex exec` 适合所有仓库。
- 不把一次成功 run 外推为“最佳实践已经完全定型”。

## 关键路径

1. 用 `scripts/create-temp-repo.mjs` 把 `receipt-normalizer/fixture/` 复制到系统临时目录，并初始化成隔离 Git 仓库。
2. 先在工作树外捕获 raw JSONL、stderr 与最终 JSON。
3. 用 `gpt-5.6-sol` 进行 preflight 时，CLI 版本兼容失败；因此实际 Showcase 改为固定 `gpt-5.5`。
4. 成功 run 后，只冻结最小公开工件：环境边界、sanitized stdout 摘录、final report、good patch、bad patch、测试输出、gate 结果。
5. deterministic gate 不再调用模型，只读 patch 与报告并在 fresh temp repo 里重跑测试。
6. writer 回合新增 `scripts/verify-showcase.mjs` 与 `scripts/privacy-scan.mjs`，从仓库根即可离线 replay，且 bad patch 会以 `README.md` 越界稳定返回 exit 3。

## 目录

- `receipt-normalizer/fixture/`：临时仓库的基线文件。
- `receipt-normalizer/schema/`：`--output-schema` 使用的 JSON Schema。
- `receipt-normalizer/scripts/`：建仓脚本与 deterministic gate。
- `receipt-normalizer/results/`：本轮真实 run 的脱敏最小工件，以及离线 replay / privacy scan 的冻结输出。

从仓库根离线 replay：

```bash
node research/articles/codex-cli-workflow/showcase/receipt-normalizer/scripts/verify-showcase.mjs
```

预期：

- good gate：exit 0
- fresh repo 测试：4/4 通过
- bad gate：exit 3，原因是 `README.md` 越界
- privacy scan：PASS

这条 replay 只消费已冻结的 patch、report 与脱敏结果，不会再次调用模型。
