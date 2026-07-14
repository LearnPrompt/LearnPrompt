# Environment boundary

验证日期：2026-07-11

## 真实运行命令（脱敏后）

```bash
codex -a never exec \
  --cd <temp-repo> \
  --ephemeral \
  --ignore-user-config \
  --ignore-rules \
  --sandbox workspace-write \
  --model gpt-5.5 \
  --json \
  --color never \
  --output-schema <schema-path> \
  --output-last-message <temp-artifacts>/final-report.json \
  - < prompt.txt \
  > <temp-raw>/codex.stdout.jsonl \
  2> <temp-raw>/codex.stderr.log
```

## 边界说明

- `receipt-normalizer` Git 仓库创建在系统临时目录，位于 LearnPrompt 工作树之外。
- raw `stdout`、raw `stderr`、最终 JSON 先全部写到系统临时目录；仓库内只保留脱敏后的最小摘录。
- `--ephemeral`：不把这次 run 的 rollout files 持久化到磁盘。
- `--ignore-user-config` / `--ignore-rules`：避免继承本机高权限默认配置与规则文件。
- `--sandbox workspace-write` + 全局 `-a never`：允许在隔离 repo 内自动执行，但不要求人工审批。
- `--output-schema` + `--output-last-message`：把最终结论冻结成机器可读 JSON，而不是自然语言段落。

## 模型兼容 preflight

第一次 preflight 固定 `gpt-5.6-sol`，raw JSONL 返回 400：

```text
The 'gpt-5.6-sol' model requires a newer version of Codex.
Please upgrade to the latest app or CLI and try again.
```

因此正式 Showcase 改为固定 `gpt-5.5`。这个修正说明“固定模型”必须是**当前 CLI 真可用**的模型，而不是只看名字最新。
