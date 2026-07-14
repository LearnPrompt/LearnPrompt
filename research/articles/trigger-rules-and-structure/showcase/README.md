# Showcase index：trigger-rules-and-structure

本篇 Showcase 只包含一个实验：`skill-router-lab`。

- 目标问题：同一个 `release-weekly` Skill，在 broad 与 bounded 两版 description 下，面对固定四个隐式请求会出现怎样的 TP / FP / FN / TN。
- 当前状态：writer sandbox 的 nested run 被宿主权限与网络拦截后，主控在外层用同一冻结契约完成 8 个 implicit runs 与 1 个 explicit control；两版矩阵相同，显式控制组 loaded=true。独立只读终审 0/0/0、93/100，文章已升级为 `showcase_status: verified`。
- 顶层机械门禁（showcase check、partial validator、build、privacy scan、diff-check）：见上一级 `release-gate-result.txt`。

进入实验目录：

- [`skill-router-lab/`](./skill-router-lab)
