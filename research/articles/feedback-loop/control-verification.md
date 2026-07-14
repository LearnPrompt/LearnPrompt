# Control verification

核验日期：2026-07-11。以下由 writer 之外的控制面在独立复核阶段执行；原始输出保存在仓库外，本文件只保留无本地路径的最小结论。

## Showcase 复现

控制面将 `showcase/feedback-signal/` 复制到新临时目录后复现：

- 模糊检查器：退出码 1，只返回无定位的失败摘要。
- 原始实现运行同一组测试：3 项中 1 项失败，退出码 1，给出 expected/actual 与 file:line。
- 应用本文选择的 `.toLowerCase()` 一行候选补丁后重跑：3 项全部通过，退出码 0。
- 原始实现与候选补丁的实际 diff 只有新增 `.toLowerCase()` 一行；当前测试证明该候选满足现有用例，不证明唯一实现。

## 内容与构建门禁

- 正文字符：6,794；去除 fenced/inline code 后中文解释字符：3,783；H2：11。
- partial validator：PASS。
- Starlight 完整构建：PASS，49 页生成，目标路由已产出。
- `git diff --check`：PASS。

这些记录不代替独立 reviewer 的事实判断和最终评分。
