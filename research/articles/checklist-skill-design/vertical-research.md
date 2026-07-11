# Vertical research：从 vague checklist 到 release gate

验证日期：2026-07-12

## 关键问题

为什么一串“检查一下 changelog、版本号、安装命令”的问题，不足以构成 release gate？

## 机制拆解

### 1. 问题列表不等于可执行 contract

只写“检查 changelog”时，Agent 仍然要自己猜：

- 哪个文件算 changelog
- 什么叫“通过”
- 缺失时是 blocker 还是提醒
- 失败应该返回什么机器可读信号

所以本文把每个 row 冻结成：

- `id`：用于 gate code 与文章叙述对齐
- `evidence`：说明看了哪个文件、跑了什么命令
- `pass_rule`：把“通过”写成可判断句
- `severity`：把失败分成 blocker / major / minor
- `not_applicable_policy`：限制滥用 `N/A`
- `result`：最后的判定

### 2. Release gate 的核心不是“多检查”，而是“固定拒绝条件”

本文的 fixture 把四类失败冻结成确定退出码：

- `21`：没有 changelog
- `22`：版本不一致
- `23`：安装命令在 pre-publish 阶段不可验证
- `24`：用 `N/A` 逃避检查但没有证据

这些退出码不是 npm 或 Agent Skills 官方标准，而是 LearnPrompt 为了让 replay、审稿和 build gate 能机械复现而加的 contract。

### 3. 为什么 install command 需要单独立项

`npm pack --dry-run` 只能证明“如果 pack，会打包什么”，它不会替你验证 README 里的 install / smoke 路径真的能跑通。对于未发布的 release candidate，`npx clip-clean@1.4.0 --help` 这种命令依赖 registry 上已经存在对应版本，本质上不可在 publish 前闭环验证。

因此本文把 install row 的通过条件写成：必须有一个**本地可重放**的 smoke command，能在不 publish 的情况下把 tarball 装进临时目录并执行 CLI help。

### 4. 为什么 `N/A` 比 fail 更危险

fail 至少会留下阻断证据；随手写 `N/A` 则会让 release gate 丢失审计性。真正的 `N/A` 只能在 repo 证明“这个 surface 根本不存在”时使用，比如根本没有 `bin`，或者 package 不是 CLI。本文的 fixture 明明是 npm CLI，所以 changelog / version / install 都不允许无证据豁免。

## 失败模式

- 只给自然语言结论，不给 evidence：读者无法 replay。
- row 没有 severity：团队无法决定“现在能不能发”。
- 允许空洞的 `N/A`：agent 会把最难验的项绕过去。
- 把 `npm pack --dry-run` 当成全部 release 证明：它不验证 changelog，也不验证 smoke command。

## 编辑性综合

“vague checkbox -> evidence row -> severity -> release decision” 这条链路，是本文基于一手 Skill / npm 文档再加本地 showcase 提炼出的 LearnPrompt 操作模型，不是任何官方规范原话。
