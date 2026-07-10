# Card 2：独立评审（低权限、可异步）

## 任务

在一段 staged 的示例代码上运行 `codex review`，验证“角色隔离的独立评审”这种工作方式在本地 CLI 上是什么样子。

## 环境

- `codex-cli 0.142.2`，本机 macOS，工作目录同 card-1。
- 示例文件 [sample-snippet.py](./sample-snippet.py) 是本次 Showcase 专门编写的、带有明显 shell 注入漏洞的最小样例，仅用于制造一个可评审的 diff，不是仓库其他部分的真实代码。

## 命令

```bash
git add research/articles/codex-form-factors/showcase/card-2-independent-review/sample-snippet.py
codex review -c model="gpt-5.5" --uncommitted --title "showcase: sample snippet review"
```

退出码：0
脱敏摘录：[review-output.log](./review-output.log)。1,189 行原始日志包含本机路径和运行标识，未进入仓库。

## 实际结果

- `codex review` 读到了 staged 的 `sample-snippet.py`，随后探索了多个无关仓库路径。
- 运行时继承的 sandbox 是 `danger-full-access`，不是预期的只读隔离。执行记录里的命令以读取为主，但这不能证明权限边界安全。
- 捕获的输出没有形成针对那段故意漏洞的结构化结论。因此“进程退出 0”不能算评审目标成功。

## 结论

- 这是一张失败任务卡：`review` 命令名不会自动带来只读 sandbox、冻结的读取范围或合格报告。
- 正确路由应使用全新会话，显式指定 `read-only` 与 `approval=never`，只提供冻结的评审材料，并验收最终报告内容。
- 本次只保留“未隔离调用如何失败”的证据，不声称它成功发现了示例漏洞。
