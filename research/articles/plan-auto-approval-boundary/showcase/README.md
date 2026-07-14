# Showcase：用沙箱把三档权限边界真的跑出来

本 showcase 证明一件事：只读计划、普通自动执行、高风险动作之间的边界，可以由机械机制强制，而不是靠信任模型。

## 文件

- `environment.txt`：运行环境与复现前提（脱敏）。
- `experiment-output.md`：`codex sandbox` 对同一批动作在 read-only 与 workspace-write 下的逐条裁决（脱敏后的最小片段）。
- `boundary-matrix.md`：Claude Code 与 Codex 的权限原语对照，明确两套术语不混用。

## 怎么复现

在任意 git 项目里（本机装了 codex-cli 0.142.2、macOS）：

```bash
# 只读：读允许、写拒绝
codex sandbox -c sandbox_mode=read-only -- cat some_file
codex sandbox -c sandbox_mode=read-only -- sh -c 'echo x >> some_file'   # Operation not permitted

# 工作区可写：写工作区允许，写工作区外与联网仍拒
codex sandbox -c sandbox_mode=workspace-write -- sh -c 'echo x >> some_file'         # ok
codex sandbox -c sandbox_mode=workspace-write -- sh -c 'echo x > $HOME/should-fail'  # Operation not permitted
codex sandbox -c sandbox_mode=workspace-write -- sh -c 'curl -s -m 5 https://example.com'  # 网络默认关闭
```

## 范围与安全边界

- 只跑读取、工作区内写入、以及被沙箱拦下的越界尝试，没有任何真实的 push、部署、发布、删除或外部消息。
- 越界写入（`$HOME`）和联网都被内核拒绝，未真正发生。
- 原始输出在仓库外捕获，进入研究包前已脱敏，去除了本机绝对路径。
- 结论只针对本次 macOS Seatbelt 实验；其他平台的实现与报错未核验。
