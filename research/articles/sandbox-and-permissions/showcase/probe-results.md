# Probe results

本文件由 `run-probes.sh` 实跑后冻结。原始日志和 checksum 先写入 `os.tmpdir()` 下的工作树外目录，再由 `verifier.sh` 生成本脱敏摘要和同目录的 `checksum-manifest.md`。
本次 `.env` 写入的是运行时确定性生成的非 credential 测试标记，只用于验证 deny-read 和日志检索；其 key/value 不进入冻结产物。

| Probe | Profile | Command intent | Exit code | `docs/link.md` | `sentinel.txt` | `.env` | Proof |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | `:read-only` | 追加写 `docs/link.md` | 1 | 未改（`initial == probe1`） | 未改（`initial == probe1`） | 未改（`initial == probe1`） | `checksum-manifest.md` |
| 2 | `:workspace` | 先写 `docs/link.md`，再越界写同级 `sentinel.txt` | 1 | 已追加 `probe-2`（`probe2 != probe1`） | 未改（`probe2 == initial`） | 未改（`probe2 == initial`） | `checksum-manifest.md` |
| 3 | `docs-edit` | 先写 `docs/link.md`，再读取 `.env` | 1 | 已追加 `probe-3`（`probe3 != probe2`） | 未改（`probe3 == initial`） | 读取失败且未改（`probe3 == initial`） | `checksum-manifest.md` |

## Probe 1：`:read-only`

命令意图：

```bash
HOME=<LAB_ROOT>/home \
codex sandbox --log-denials \
  --permissions-profile :read-only \
  --cd <LAB_ROOT>/workspace \
  /bin/sh -lc 'printf "probe-1\n" >> docs/link.md'
```

最小日志：

```text
/bin/sh: docs/link.md: Operation not permitted
(bash) file-write-data <LAB_ROOT>/workspace/docs/link.md
```

副作用：

- 退出码：`1`
- `docs/link.md`、`sentinel.txt`、`.env` 的 SHA-256 见 `checksum-manifest.md`

## Probe 2：`:workspace`

命令意图：

```bash
HOME=<LAB_ROOT>/home \
codex sandbox --log-denials \
  --permissions-profile :workspace \
  --cd <LAB_ROOT>/workspace \
  /bin/sh -lc 'printf "probe-2\n" >> docs/link.md && printf "probe-2\n" >> ../sentinel.txt'
```

最小日志：

```text
/bin/sh: ../sentinel.txt: Operation not permitted
(bash) file-write-data <LAB_ROOT>/sentinel.txt
```

副作用：

- 退出码：`1`
- `docs/link.md` 在 `probe2` 与 `probe1` 之间发生递进；`sentinel.txt` 与 `.env` 仍与 `initial` 一致，见 `checksum-manifest.md`

说明：这次实验室故意不放在 temp 目录下。因为官方 `Permissions` 文档明确写到，内置 `:workspace` 也允许 system temp directories；如果 `sentinel` 也在 temp，越界写测试会失真。

## Probe 3：`docs-edit`

命令意图：

```bash
HOME=<LAB_ROOT>/home \
codex sandbox --log-denials \
  --permissions-profile docs-edit \
  --cd <LAB_ROOT>/workspace \
  /bin/sh -lc 'printf "probe-3\n" >> docs/link.md && cat .env > /dev/null'
```

最小日志：

```text
cat: .env: Operation not permitted
(cat) file-read-data <LAB_ROOT>/workspace/.env
```

副作用：

- 退出码：`1`
- `docs/link.md` 在 `probe3` 与 `probe2` 之间发生递进；`sentinel.txt` 与 `.env` 仍与 `initial` 一致，见 `checksum-manifest.md`
