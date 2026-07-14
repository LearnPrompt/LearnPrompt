# Vertical Research：从 decorative taxonomy 到 placement contract

验证日期：2026-07-12。

## 中心问题

怎样把一个 vault 目录树写成稳定 placement contract，而不是“人觉得整齐、Agent 却要靠猜”的 decorative taxonomy？

## 1. 为什么“有分类”还不够

很多 vault 的问题不在于没有文件夹，而在于文件夹只回答了“看起来大概像什么”，没有回答：

- 这个材料是当前项目上下文，还是可复用知识？
- 这是待发布输出，还是原始外部快照？
- 这是系统模板，还是一份应该留在 inbox 等人确认的临时输入？
- 什么材料绝对不该放进去？

对人类来说，这种模糊有时还能靠背景知识补完。对 Agent 来说，它只能看到文件名、路径、少量文件内容和 instruction surfaces。没有 contract，它就会用最便宜的启发式乱猜。

## 2. 官方保证给了什么，没给什么

### 官方保证

- Obsidian 把笔记存成 Markdown plain text files。
- vault 是本地文件系统 folder，包含 subfolders。
- 你可以用外部 editor 和 file manager 修改文件，Obsidian 会 refresh。
- `.obsidian` 位于 vault root，保存 vault-specific settings。
- 官方不建议 nested vaults。
- properties 是 note 顶部的 YAML，适合小而原子的值。

### 官方没有定义

- 项目 / 知识 / 输出 / 资源 / 系统这些角色该怎样分。
- 什么叫 canonical path。
- 哪些材料应该 reject。
- 审计 orphan、duplicate、unknown root 的 gate。

所以 placement contract 必须是编辑综合或团队约定，而不是“Obsidian 应该知道”。

## 3. 合同的最小组成

本文把一个可执行 placement contract 压成五部分：

1. **Role roots**：每个根目录只承担一种稳定角色。
2. **Placement templates**：每种材料有 canonical path 模板，而不是“差不多放这边”。
3. **Decision rule**：进入哪个 role 的判断条件写清楚。
4. **Reject boundary**：敏感或不应共享的材料明确拒收，不走“先塞进去再说”。
5. **Audit plan**：用固定 gates 检查 orphan、role mismatch、unknown root、sensitive placement、duplicate canonical destination。

这五部分里，最常被忽略的是第 4 和第 5 项。没有 reject boundary，目录树只是一个吸尘器；没有 audit plan，contract 只能靠主观感觉维持。

## 4. 目录与 properties 的分工

官方 properties 文档给了一个重要边界：properties 适合小而原子的 human- and machine-readable values。

因此可以把两层问题拆开：

- **目录角色**回答：这份材料应该属于哪一个稳定区域？
- **properties**回答：这份材料在区域内的状态是什么？例如 `status`、`owner`、`source_url`、`reviewed_at`。

如果把一切状态都编码进目录树，你会得到越来越深、越来越脆弱的路径。如果把角色也放到 properties 里，而目录根随便放，Agent 还是会先在错误的区域里递归搜索。两层都需要，但不是一回事。

## 5. 为什么 canonical path 比“目录语义”更重要

对 Agent 来说，最贵的动作不是 `mv`，而是“我得先读十几个相近目录，才能猜哪个更合适”。

canonical path 的作用不是好看，而是消灭歧义：

- 决策笔记固定进 `10_项目/<scope>/决策/...`
- 任务固定进 `10_项目/<scope>/任务/...`
- 外部快照固定进 `50_资源/<source>/...`
- runbook 固定进 `99_系统/runbooks/...`

一旦模板写死，place/reject 变成了有限判断题，而不是开放式分类作文。

## 6. Frozen Showcase 证明了什么

`vault-placement-contract` showcase 冻结了：

- 12 个 synthetic inbox items
- `inbox-manifest.json`
- `vault-policy.json`
- deterministic validator
- completed live-attempt evidence and generated plan reports

它证明了三类事情：

1. **合同可机械验证**：`0/51/52/53/54/55` 六种 exit 都能稳定复现。
2. **Unicode path 可通过**：中文源路径与中文 canonical path 都能走通 validator。
3. **拒收边界真实存在**：敏感标记项不是“放到某个私密目录”，而是 `reject + destination null`。

writer-side 首次 nested run 在只读 state DB 初始化时被 sandbox 拦住；外层控制器没有覆盖这条历史，而是按同一冻结合同重新运行。fresh `gpt-5.5` 最终只写出两份 `reports/placement-plan.*`，12/12 accounted、11 placed、1 rejected，validator exit `0`，manifest 与 synthetic vault inventory 都未改变。独立只读终审随后 PASS `96/100`、0/0/0，并确认教学图视觉 PASS，因此 `showcase_status` 才更新为 `verified`。

## 7. 失败模式

最常见的失败模式不是“目录名不好看”，而是下面五类：

- **51 orphan/unaccounted**：manifest 里有材料，但计划里没给出去向。
- **52 folder-role mismatch**：材料进了存在的目录，但角色错了，例如把快照放进知识库。
- **53 unstable/unknown root**：出现 `40_杂项` 这类未声明 root，或把 intake root 当 destination。
- **54 sensitive item placed**：应该 reject 的材料仍被塞进共享 vault。
- **55 duplicate canonical destination**：两条材料争同一个 canonical path，后续就会互相覆盖或制造歧义。

这五类 gate 比“你觉得这次放得差不多”更重要，因为它们能作为自动化检查存在。

## 编辑综合判断

下面这些内容是 LearnPrompt 为本文构造的操作模型，不是假装官方：

- `00/10/20/30/50/99` 这套角色划分
- `project / knowledge / output / resource / system / reject` 的映射
- canonical path 模板
- `51/52/53/54/55` 这些 exit gates
- “目录只回答角色、properties 回答状态”的教学拆分

这套模型的价值不在于“唯一正确”，而在于它把 Agent 需要的判断题写成了可验证契约。
