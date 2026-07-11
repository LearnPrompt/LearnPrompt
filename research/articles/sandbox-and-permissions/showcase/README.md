# Showcase：`docs-link-fix` 权限实验室

这组 Showcase 只证明一件事：**Codex 的本地沙箱/profile 决定命令物理上能碰到什么；approval policy 只决定 agent 什么时候停下来问。**

为避免把模型、审批弹窗和 prompt 规则混进来，实验全部使用无模型的 `codex sandbox` 子命令完成。原始日志先写到 `os.tmpdir()` 下的工作树外临时目录，进研究包前再脱敏冻结。
`workspace/.env` 里写入的是运行时确定性生成的非 credential 测试标记，它只用于 deny-read 与日志检索；其 key/value 不进入冻结研究包。

## 文件

- `environment.txt`：版本、平台和帮助面摘要。
- `checksum-manifest.md`：由 raw checksum 生成的 committed SHA-256 清单，只保留逻辑路径名。
- `docs-edit.profile.toml`：本次自定义 profile 的最小配置。
- `probe-results.md`：三次独立 probe 的命令、退出码、副作用与最小脱敏日志，并指向 `checksum-manifest.md`。
- `replay-stability.txt`：同一次 `run-probes.sh` 调用里连续两轮 frozen outputs 的 SHA-256 对照，要求全部 `stable=yes`。
- `run-probes.sh`：从仓库根一键创建两轮一次性 lab、写 raw capture、依次执行三个 probe、调用 verifier，并只在两轮 frozen outputs 哈希一致时才落盘。
- `verifier.sh`：根据 raw checksum 生成或校验 `checksum-manifest.md`，并汇总退出码、`sentinel/.env` 完整性与 fixture marker 日志检索结果。
- `verifier-output.txt`：本次实际 verifier 输出。

## 实验室布局

正式实验室位于用户家目录下，而不是 `os.tmpdir()`：

```text
<lab-root>/
  workspace/
    docs/link.md
    .env
  sentinel.txt
  home/.codex/config.toml
```

这样设计不是形式主义，而是为了避开 `:workspace` 的一个重要事实：官方文档明确说明它允许写 active workspace roots 和 system temp directories。如果把 `sentinel` 也放在 temp 目录里，“工作区外写失败”的实验就会被自己设计坏掉。

## 一键命令

在仓库根目录运行：

```bash
bash research/articles/sandbox-and-permissions/showcase/run-probes.sh
```

脚本会自动：

1. 在当前用户家目录下连续创建两轮一次性 lab，而不是放进 `/tmp`、`$TMPDIR` 或当前仓库。
2. 在 `os.tmpdir()` 下创建 raw capture，记录 config 校验、三个 probe 的真实退出码、raw log 和四个阶段的 checksum。
3. 第一轮先生成 `environment.txt`、`checksum-manifest.md` 与 `probe-results.md`；第二轮再用 `CHECKSUM_MANIFEST_EXPECTED` 指向刚生成的 manifest，要求 `verifier-output.txt` 里的 `checksum_manifest_matches_expected=yes`。
4. 对两轮的 `environment.txt`、`checksum-manifest.md`、`probe-results.md`、`verifier-output.txt` 做 SHA-256 比对，并把结果写进 `replay-stability.txt`。
5. 只有当 verifier 和 replay compare 都通过时，才会冻结 committed outputs；任一步骤失败都会非零退出，且不会伪造 summary。

## 复现细节

1. 在非 temp 目录创建 `<lab-root>/workspace/docs/link.md`、`<lab-root>/workspace/.env` 和同级 `<lab-root>/sentinel.txt`；其中 `.env` 写入由固定非敏感种子在运行时确定性生成的测试标记。
2. 把 `docs-edit.profile.toml` 写入 `<lab-root>/home/.codex/config.toml`，并用 `HOME=<lab-root>/home codex --strict-config help` 验证语法。
3. 分别执行三个 probe：
   - `:read-only`：只尝试写 `docs/link.md`。
   - `:workspace`：先写 `docs/link.md`，再写同级 `sentinel.txt`。
   - `docs-edit`：先写 `docs/link.md`，再读 `.env`。
4. 在每个 probe 后记录退出码、文件 checksum 和最小日志。
5. 最后连续完成“生成 manifest/probe 结果”与“expected compare”两次 verifier 调用，并确认：
   - `config_rc=0`
   - 三个 probe 都有真实退出码
   - `link_probe1_matches_initial=yes`
   - `link_probe2_differs_from_probe1=yes`
   - `link_probe3_differs_from_probe2=yes`
   - `sentinel_unchanged=yes`
   - `env_unchanged=yes`
   - `fixture_marker_in_logs=no`
   - `checksum_manifest_matches_expected=yes`
6. 再确认 `replay-stability.txt` 里四个 frozen outputs 全部 `stable=yes`。

## 关键边界

- 本次没有把 `danger-full-access` 用来做越界写入；那会把“安全边界证明”变成“真实放权”。
- `approval_policy = "never"` 只用于让 probe 非交互、可重复。它不是结果来源，结果来自 sandbox/profile。
- 日志里只保留最小脱敏片段：错误文本、关键 denial 行、退出码和副作用摘要。绝对路径、账号信息及运行时测试标记的 key/value 都不进入研究包。
