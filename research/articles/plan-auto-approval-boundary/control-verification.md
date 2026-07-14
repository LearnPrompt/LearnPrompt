# Control verification

核验日期：2026-07-11。以下由 writer 之外的控制面在独立复核阶段执行；原始命令输出保存在仓库外，本文件只记录无本地路径的最小结论。

## Showcase 复现

在新建的临时工作目录中，对同一个 `split.py` 运行：

- read-only 读取：退出码 0；
- read-only 追加写入：退出码 1，`Operation not permitted`；
- workspace-write 追加写入：退出码 0。

控制面没有复测 read-only 下的网络，因此正文和 Showcase 汇总表将该格明确标为“本次未测”。

## 内容与构建门禁

- 正文字符：6,824；去除 fenced/inline code 后中文解释字符：3,045；H2：9。
- partial validator：PASS。
- Starlight 完整构建：PASS，49 页生成，目标路由已产出。
- `git diff --check`：PASS。

这些记录只证明当前工作树的控制面复现与构建状态，不代替独立 reviewer 的事实判断和最终评分。
