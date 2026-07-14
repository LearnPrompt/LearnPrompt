# Control verification

核验日期：2026-07-11。以下由 writer 之外的控制面在独立复核阶段执行；原始输出保存在仓库外，本文件只保留无本地路径的最小结论。

## Showcase 复现

控制面将 `showcase/constraint-gate/` 复制到新临时目录后，对同一组动作复现：

- 无机械闸门的直接 shell 写入：退出码 0；这只证明文字提醒本身不提供执行强制，不包装成在线 Agent 违背指令的实测。
- `policy-gate.mjs`：2/5 allowed、3 denied，退出码 2；脚本仅作为执行前判定的教学模型。
- Codex read-only 沙箱写入：退出码 1，`Operation not permitted`。
- Codex read-only 沙箱读取：退出码 0。

## 内容与构建门禁

- 正文字符：7,448；去除 fenced/inline code 后中文解释字符：3,361；H2：10。
- partial validator：PASS。
- Starlight 完整构建：PASS，49 页生成，目标路由已产出。
- `git diff --check`：PASS。

这些记录不代替独立 reviewer 的事实判断和最终评分。
