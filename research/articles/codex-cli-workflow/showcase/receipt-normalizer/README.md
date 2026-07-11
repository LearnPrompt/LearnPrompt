# receipt-normalizer showcase

这个 Showcase 只做一件事：把 `codex exec` 变成一个可验证闭环，而不是再次让模型解释自己。

目录分工：

- `fixture/`：基线仓库文件，离线可复现。
- `schema/`：`--output-schema` 使用的 JSON Schema。
- `scripts/create-temp-repo.mjs`：把 `fixture/` 复制到系统临时目录，并初始化成隔离 Git 仓库。
- `scripts/release-gate.mjs`：零模型 gate；正例读取真实 good patch 与 final report，负例读取故意越界的 bad patch。
- `scripts/privacy-scan.mjs`：对整个 `research/articles/codex-cli-workflow/` 做机械 privacy scan。
- `scripts/verify-showcase.mjs`：一键离线 replay good gate、bad gate 与 privacy scan；不会再次调用模型。
- `results/`：真实运行后的脱敏工件，以及 replay / privacy scan 的冻结结果。

从仓库根离线重放：

```bash
node research/articles/codex-cli-workflow/showcase/receipt-normalizer/scripts/verify-showcase.mjs
```

预期冻结结果：

- `good_exit_code: 0`
- `good_fresh_repo_tests: tests=4 pass=4 fail=0`
- `bad_exit_code: 3`
- `bad_reason: README.md out of scope`
- `privacy_exit_code: 0`
- `privacy_output: PASS privacy scan`

结果文件：

- `results/replay-result.txt`：精确记录 good / bad / privacy 的命令、输出与 exit code。
- `results/privacy-scan.txt`：机械 scanner 的真实 PASS 输出。
- `results/gate-rerun-test-output.txt`：fresh repo 4/4 测试的稳定化摘录。

单独创建隔离临时仓库：

```bash
node research/articles/codex-cli-workflow/showcase/receipt-normalizer/scripts/create-temp-repo.mjs
```

这条命令只打印临时仓库路径，不会调用模型，也不会写回 LearnPrompt 工作树。
