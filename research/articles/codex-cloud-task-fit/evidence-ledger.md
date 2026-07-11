# 证据台账

| 编号 | claim（正文中的事实主张） | evidence（证据） | evidence type | 验证日期 | 置信度 | limitation |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Codex Cloud task 会先创建 container 并 checkout 选定分支或 commit，然后才进入 setup / maintenance / agent loop | [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment) | 一手官方文档 | 2026-07-11 | 高 | 文档描述通用行为，不替代具体仓库配置 |
| C2 | agent phase 默认无网络，但 setup scripts 仍可联网安装依赖；用户也可按环境开启 agent internet，并用 domain allowlist 与 HTTP methods 收窄 | [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment)；[Agent internet access](https://learn.chatgpt.com/docs/cloud/internet-access) | 一手官方文档 | 2026-07-11 | 高 | 启网会增加 prompt injection、外泄、恶意依赖与许可风险；本文正例选择保持关闭 |
| C3 | Cloud task 完成后会显示 answer 和 diff，用户可以开 PR 或发 follow-up | [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment) | 一手官方文档 | 2026-07-11 | 高 | 本文没有实际创建 PR |
| C4 | env vars 在整个 task 期间可用，secrets 只在 setup scripts 可用，agent phase 开始前会被移除 | [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment) | 一手官方文档 | 2026-07-11 | 高 | 只说明官方生命周期，不代表某仓库已经正确配置 |
| C5 | setup script 和 agent phase 是不同 Bash session，`export` 不会自动延续到 agent phase | [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment) | 一手官方文档 | 2026-07-11 | 高 | 需要通过环境设置或 `~/.bashrc` 显式持久化 |
| C6 | container cache 最长可保留 12 小时；恢复缓存时会 checkout 任务分支并可选跑 maintenance script | [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment) | 一手官方文档 | 2026-07-11 | 高 | 文档说的是平台机制，不保证任何任务都适合依赖缓存 |
| C7 | 官方 prompting 建议对 Codex 写清目标行为、相关代码或复现步骤、要保留的约束和验证方式 | [Prompting](https://learn.chatgpt.com/docs/prompting) | 一手官方文档 | 2026-07-11 | 高 | 是方法建议，不代替具体 contract 设计 |
| C8 | 本机 `codex-cli 0.142.2` 提供 `codex cloud` 和 `codex cloud exec`，并要求 `cloud exec` 传 `--env <ENV_ID>` | `research/articles/codex-cloud-task-fit/showcase/cloud-handoff-lab/results/local-cloud-help.txt` | 本机 CLI 证据 | 2026-07-11 | 高 | 只说明命令面，不代表可用 Cloud environment 已存在 |
| C9 | `cloud-handoff-lab` 正向场景在 clean temp HOME、无 agent 网络、无 secret、无本机文件依赖的预演里通过 gate 和测试 | `showcase/cloud-handoff-lab/scripts/verify-showcase.mjs`；`showcase/cloud-handoff-lab/results/run-result.txt`；`showcase/cloud-handoff-lab/results/positive-test-output.txt` | 可重跑本地 Showcase | 2026-07-11 | 高 | 这是 handoff 预演，不是真实 Cloud run |
| C10 | 正向补丁只修改 `src/rollupByReporterDay.js`，把 UTC 日期分桶改成 reporter time zone day key | `showcase/cloud-handoff-lab/results/positive-diff.txt`；`showcase/cloud-handoff-lab/patches/good.patch` | 可重跑本地 Showcase | 2026-07-11 | 高 | 单文件 patch 只证明这个 fixture 的适配性 |
| C11 | `~/Library/Keychains` 依赖会被 gate 以 `21` 拒绝 | `showcase/cloud-handoff-lab/contracts/negative-keychain-dependency.json`；`showcase/cloud-handoff-lab/results/run-result.txt` | 可重跑本地 Showcase | 2026-07-11 | 高 | 退出码是本文 gate 设计，不是官方保留码 |
| C12 | 浏览器登录态依赖会被 gate 以 `22` 拒绝 | `showcase/cloud-handoff-lab/contracts/negative-browser-login.json`；`showcase/cloud-handoff-lab/results/run-result.txt` | 可重跑本地 Showcase | 2026-07-11 | 高 | 退出码是本文 gate 设计，不是官方保留码 |
| C13 | 缺验收命令会被 gate 以 `23` 拒绝 | `showcase/cloud-handoff-lab/contracts/negative-missing-acceptance.json`；`showcase/cloud-handoff-lab/results/run-result.txt` | 可重跑本地 Showcase | 2026-07-11 | 高 | 该 gate 只代表本文 contract |
| C14 | 任务方向不明确会被 gate 以 `24` 拒绝 | `showcase/cloud-handoff-lab/contracts/negative-unclear-direction.json`；`showcase/cloud-handoff-lab/results/run-result.txt` | 可重跑本地 Showcase | 2026-07-11 | 高 | 该 gate 只代表本文 contract |
| C15 | 公开 research pack 已通过隐私扫描，没有冻结真实临时路径、运行 ID 或 credential-shaped 值 | `showcase/cloud-handoff-lab/results/privacy-scan.txt`；`showcase/cloud-handoff-lab/scripts/privacy-scan.mjs` | 本地确定性验证 | 2026-07-11 | 高 | 规则覆盖常见泄漏模式，不等于全面安全审计 |
| C16 | Codex Orange Book 只作为中文二手主题地图保留，公开正文必须由一手资料重建 | [alchaincyf/codex-orange-book](https://github.com/alchaincyf/codex-orange-book) | 二手主题地图 | 2026-07-11 | 高 | 不作为当前产品行为权威 |
