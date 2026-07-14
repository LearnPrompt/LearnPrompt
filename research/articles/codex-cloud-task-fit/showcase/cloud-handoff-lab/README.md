# cloud-handoff-lab

这个实验室只做一件事：判断一个具体 bug 修复任务是否已经适合交给 Codex Cloud，并在本地用 clean-room replay 证明它不依赖本机隐式状态。

## Fixture

`fixture/` 里是最小仓库：

```text
AGENTS.md
package.json
src/rollupByReporterDay.js
test/rollupByReporterDay.test.js
```

其中 `src/rollupByReporterDay.js` 故意保留一个 bug：它按 UTC 日期分桶，而不是按 reporter 指定时区的本地日期分桶。

## Contracts

- `positive-timezone-rollup.json`：允许路径、期望修复、验收命令和无本机依赖边界都已冻结。
- `negative-keychain-dependency.json`：依赖 `~/Library/Keychains`，应被 gate 以 `21` 拒绝。
- `negative-browser-login.json`：依赖浏览器登录态，应用 `22` 拒绝。
- `negative-missing-acceptance.json`：没有验收命令，应用 `23` 拒绝。
- `negative-unclear-direction.json`：任务方向仍模糊，应用 `24` 拒绝。
- `environment-contract.json`：把 Cloud 环境里真正稳定的边界写死，例如 clean checkout、agent phase 默认无网络、env var 与 secret 生命周期不同。

## 结果文件

- `results/run-result.txt`：稳定退出码和正向 replay 摘要。
- `results/positive-test-output.txt`：从 clean-room `npm test -- --test-reporter tap` 归一化后的测试摘要。
- `results/positive-diff.txt`：唯一允许的补丁内容。为避免冻结工件自身触发 trailing-whitespace 门禁，`@@LEARNPROMPT_BLANK_CONTEXT@@` 代表 unified diff 的空白 context 行；runner 只在工作树外的临时 patch 中还原单个前导空格。
- `results/local-cloud-help.txt`：本机 `codex cloud --help` / `codex cloud exec --help` 摘录，仅作命令面证据。
- `results/privacy-scan.txt`：公开 research pack 的隐私扫描结果。

## 边界

- 这里没有真实 Cloud container，也没有真实 Cloud task ID。
- 这里证明的是“任务适配”和“干净 replay”，不是“官方环境已经实际执行过本仓库”。
- 如果未来要提交真实 Cloud task，仍需在产品里选择仓库环境、分支和 follow-up 路径。
