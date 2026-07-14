# Card 1：本地 CLI 沙箱权限的真实边界

## 任务

在本仓库的 `research/articles/codex-form-factors/showcase/card-1-local-sandbox/probe.txt` 写入一行文本，验证 Codex CLI 的沙箱模式如何处理写入请求。

## 环境

- `codex-cli 0.142.2`，本机 macOS，隔离 worktree。
- 认证：ChatGPT 账号登录。
- 命令使用 `-c model="gpt-5.5"` 固定本次实验模型；本文不据此比较模型能力。

## 命令与结果

### 尝试 1：`--sandbox read-only`

```bash
codex exec -c model="gpt-5.5" --sandbox read-only \
  "在 research/articles/codex-form-factors/showcase/card-1-local-sandbox/probe.txt 写入一行文本 'sandbox probe'。只做这一件事。"
```

退出码：0（codex 进程本身正常退出，但任务未达成写入目标）
完整记录：[attempt-1-readonly.log](./attempt-1-readonly.log)

关键结果：

```
error=patch rejected: writing is blocked by read-only sandbox; rejected by user approval settings
未能写入。当前环境是 read-only sandbox 且 approval policy=never，apply_patch 被拒绝。
文件未创建，未修改其它文件。
```

### 尝试 2：`--sandbox workspace-write`

```bash
codex exec -c model="gpt-5.5" --sandbox workspace-write \
  "在 research/articles/codex-form-factors/showcase/card-1-local-sandbox/probe.txt 写入一行文本 'sandbox probe'。只做这一件事。"
```

退出码：0
完整记录：[attempt-2-workspace-write.log](./attempt-2-workspace-write.log)

结果：文件成功写入，diff 只涉及目标文件一处新增。

## 结论

- `read-only` 沙箱在 `approval_policy=never` 下会直接拒绝写入；但 CLI 进程仍返回 0，因此不能把退出码当作任务完成证明。
- `workspace-write` 只放开工作目录内的写权限，任务按预期只改了目标文件。
- 这张卡片验证的是本文“权限风险”维度：显式 sandbox 能控制影响半径，验收还必须检查目标文件和 diff。

提交的两份日志都是脱敏摘录；完整原始日志因包含本机路径和运行标识未进入仓库。
