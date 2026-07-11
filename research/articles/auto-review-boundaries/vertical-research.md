# Vertical research：为什么这两个 surface 最容易被混淆

核验日期：2026-07-11。

## 1. 表面上都叫 auto-review，输入和输出却完全不同

GitHub surface 的输入是 pull request diff，加上仓库中的 `AGENTS.md` review guidelines；输出是发布在 GitHub PR 里的标准 code review comment。它的目标是发现 serious issues，并把评论聚焦在 P0/P1。

`approvals_reviewer = "auto_review"` 的输入不是 PR diff，而是 approval boundary 上出现的 eligible approval request。输出也不是 GitHub review comment，而是由 reviewer subagent 对“这次批准要不要通过”做裁决。它只发生在 `on-request` 或 granular approval policies 的语境里。

## 2. 两者共享的只有“审”，不是执行面

两种 surface 都有“review”字样，所以最容易被误解成：

- 打开 `auto_review`，Codex 就会像 PR reviewer 一样检查我改的代码。
- 既然 reviewer 在自动审批，那它也应该顺便放宽 sandbox。

官方文档恰好把这两种推论都否定了：

- GitHub page 把 code review 明确定义成 pull request diff 上的 GitHub review。
- config reference 与 sandboxing 明确写了：`approvals_reviewer` 只 review eligible approval prompts，而且“不改变 sandboxing or review actions already allowed inside the sandbox”。

## 3. “closest AGENTS.md” 只属于 GitHub code review surface

GitHub code review 页面说 Codex 会搜索仓库里的 `AGENTS.md`，并对每个 changed file 应用 closest `AGENTS.md`。这意味着：

- 它天然依赖 pull request changed files；
- 它的 review guidance 是按文件树就近匹配；
- 重点是 review output 的聚焦，而不是权限提升。

`approvals_reviewer = "auto_review"` 页面并没有给出同样的 changed-file / closest `AGENTS.md` 机制说明。它的语义中心是“who reviews eligible approval prompts”，不是“how code review guidance is resolved on a PR diff”。

## 4. `never` 与 `danger-full-access` 也不能反推为 GitHub review

sandboxing 页面把常见组合拆得很清楚：

- `danger-full-access` + `never` 才是 Full access。
- `workspace-write` + `on-request` 是低风险本地自动化预设。
- `approvals_reviewer = "auto_review"` 只是决定 eligible approval prompts 由 reviewer agent 处理还是由 user 处理。

所以不能从“本地审批更自动化了”反推“这已经等价于 GitHub PR review”，更不能从“有 reviewer agent”反推“这次 repo code review 肯定已经发生”。

## 5. 本地 structured review 能复现什么，不能复现什么

本地 `codex exec` read-only structured review 可以复现的是：

- 有一个真实 diff；
- 有一份 repo guidance（本例用 fixture 顶层 `AGENTS.md`）；
- 输出是一个 anchored finding，能机械验证 file/line 是否命中 changed line。

它不能复现的是：

- GitHub 托管环境；
- `@codex review` comment 生命周期；
- Automatic reviews 触发时机；
- GitHub UI 里的 P0/P1 comment threading 与后续 `@codex fix the P1 issue` 云端回写。

## 6. 编辑综合判断

这篇教程的核心不是“哪个 auto-review 更高级”，而是“先问你要解决的是哪类问题”：

- 要的是 PR diff 风险发现：用 GitHub code review surface。
- 要的是本地权限边界上的批准代理：用 `approvals_reviewer = "auto_review"`。
- 要的是在工作树里教学性地复现 `diff + guidance + finding` 合同：用本地 structured review，但要明确披露这不是 GitHub 托管 review。
