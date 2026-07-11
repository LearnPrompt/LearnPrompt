# 边界机制强制实验：Codex 沙箱逐条裁决（脱敏）

验证日期：2026-07-11 · 工具：codex-cli 0.142.2 · 命令：`codex sandbox`

原始输出在仓库外的临时目录捕获，本文件只保留证明结论所需的最小片段，并把本机用户绝对路径改写为 `$HOME`。

## 任务背景

一个真实的小任务：修一个记账函数的 bug（整数除法丢分）。项目里有 `split.py` 和 `test_split.py`。我们不看模型怎么修，只用沙箱逐条裁决：同一批动作，在不同沙箱模式下分别是允许还是拒绝。

## Tier 1：只读探索

```text
$ codex sandbox -c sandbox_mode=read-only -- cat split.py
def split_bill(total, people):
    # bug: integer division loses cents
    return total // people
exit=0
```

读取源码在 read-only 模式下直接通过。只读探索不需要任何额外授权。

## Tier 2：改工作区文件

同一条写入动作，只读模式拒绝，工作区可写模式放行：

```text
$ codex sandbox -c sandbox_mode=read-only -- sh -c 'echo x >> split.py'
sh: split.py: Operation not permitted
exit=1

$ codex sandbox -c sandbox_mode=workspace-write -- sh -c 'echo # patched >> split.py'
exit=0
```

关键点：拒绝写入的不是模型的礼貌，而是内核返回的 `Operation not permitted`。同一条命令换个沙箱模式就从失败变成功。

## Tier 3：高风险动作，工作区可写也拦得住

即使切到 workspace-write，写工作区之外和联网仍然被拒：

```text
$ codex sandbox -c sandbox_mode=workspace-write -- sh -c 'echo pwned > $HOME/pab-blocked.txt'
sh: $HOME/pab-blocked.txt: Operation not permitted
exit=1

$ codex sandbox -c sandbox_mode=workspace-write -- sh -c \
    'curl -s -m 5 https://example.com >/dev/null && echo NET_OK || echo NET_BLOCKED'
NET_BLOCKED
exit=0

# 确认工作区外的文件确实没被创建
$ ls $HOME/pab-blocked.txt
ls: $HOME/pab-blocked.txt: No such file or directory
ls_exit=1
```

workspace-write 让工作区可写，但没有在本次实验中自动放开 `$HOME` 写入或出站网络（`sandbox_workspace_write.network_access` 默认 false）。这个结果只覆盖所列路径与当前平台，不应外推成“所有工作区外路径一律拒绝”。真正的高风险动作要跨过这条线，应停止当前任务并由人显式重新授权，而不是依赖模型自己决定是否请求。

## 结果汇总

| 动作 | read-only | workspace-write |
| --- | --- | --- |
| 读工作区文件 | 允许 | 允许 |
| 写工作区文件 | 拒绝（Operation not permitted） | 允许 |
| 写工作区外（$HOME） | 拒绝 | 拒绝 |
| 出站网络 | 本次未测 | 拒绝（默认关闭） |

## 失败边界与复现限制

- 本实验只在 macOS Seatbelt 上跑；其他平台的实现和报错未在本次实验中核验。
- `codex sandbox` 演示的是内核级沙箱，不涉及 Codex 的 approval_policy；审批是另一条正交轴，见 boundary-matrix.md。
- Claude Code 的 plan 模式与 allow/ask/deny 规则由 Claude Code 进程强制，不是本机 OS 沙箱，二者不能混为一谈。
