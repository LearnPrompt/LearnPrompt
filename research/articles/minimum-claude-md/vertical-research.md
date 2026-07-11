# 纵向研究：从「为什么每轮都要重复解释」追到机制、失败模式与边界

中心问题：一份最小 CLAUDE.md 到底解决什么，为什么是这五类信息，它的能力边界在哪。

## 表层现象

跑完第一次小任务后，第二次开会话，AI 又不读 README 就改文件、又跑了不存在的命令、
又碰了不该碰的目录、又在结尾没交代改了什么。你把这些当成「模型不聪明」，于是提示词
写得越来越长。但下一轮照样重演。

## 往下一层：为什么提示词补不上

官方 memory 文档给出机制：每个会话从空白上下文开始；CLAUDE.md 是在会话开始时被读入的
持久 context。你在聊天里临时说的话不会跨会话保留，`/compact` 之后也可能丢失（官方：
项目根 CLAUDE.md 会在 compaction 后重新从磁盘读入并注入，纯对话里给的指令则不会）。
所以「重复解释」的根因不是模型健忘，而是这些事实没有被写进一个每轮都会读的文件。

## 为什么恰好是这五类

从「一次可验收的小改动」这个闭环反推，AI 每一步会卡在哪里：

1. 真实命令——它不知道构建/测试到底跑什么，于是猜或编一个不存在的命令。
   官方 best-practices 的具体性示例正是命令类：「Run `npm test` before committing」优于「Test your changes」。
2. 允许修改范围——它不知道该改哪、能改多大，于是顺手改了无关文件。
   对应官方「small, reviewable diffs」「先说明要改的文件」。
3. 禁区——它不知道哪些路径是雷区，于是碰了 `.env`、生成目录或部署配置。
4. 最快验收——它改完不知道用什么来判断对错，于是「看起来没问题」就交差。
   官方 best-practices：「give Claude something that produces a pass or fail, and the loop closes on its own」。
5. 输出收尾——它不知道要交代什么，于是输出很散，你无法快速审查与继续。

这五类不是行业标准，而是把官方零散建议按「一次小改动闭环」操作化后的编辑综合（下有标注）。
它们的共同点：每一类都能被机械检查是否存在、是否具体——这正是本文 Showcase 的设计依据。

## 关键边界：context，不是 enforcement

最容易踩的认知错误，是把 CLAUDE.md 当成硬权限或自动记忆。官方原文把话说死：
「Claude treats them as context, not enforced configuration」，且 CLAUDE.md 以 system prompt
之后的 user message 形式递送，「there's no guarantee of strict compliance」。要真正硬性阻止
一个动作（例如禁止 push、禁止读密钥），得用 PreToolUse hook（deterministic、guarantee）或
managed settings 的 `permissions.deny`（客户端强制）。CLAUDE.md 负责「让它更可能做对」，
不负责「让它不可能做错」。这条边界必须在文章里讲清，否则读者会误以为写进去就等于拦住了。

## 与相邻机制的区分（避免混用）

- CLAUDE.local.md：你写的、项目私有偏好，加 .gitignore，与 CLAUDE.md 同样对待、一起载入。
- .claude/rules：把大项目的规则按 `paths` 作用域拆分，匹配文件时才载入，减少每轮噪音。
- auto memory：Claude 自己写的学习笔记，存 `~/.claude/projects/<project>/memory/`，不是你手写的 CLAUDE.md。
- AGENTS.md：Claude Code 只读 CLAUDE.md，不直接读 AGENTS.md；已有 AGENTS.md 就用 `@AGENTS.md` import 或 symlink 复用。

把这四者和 CLAUDE.md 混为一谈，会导致「我明明写了却没生效」或「我以为它自动记住了」这类困惑。

## 失败模式与何时不该用

- 写成价值观口号（「重视质量、优雅协作」）：无法机械验收，也改变不了行为。
- 过度膨胀：官方反模式「over-specified CLAUDE.md」，太长会让重要规则淹没，模型忽略一半。
- 把一次性任务塞进长期规则：应放 issue / 对话，而不是每轮都读。
- 把长期风格治理全塞这里：那是 control-style-with-claude-md 的范围。
- 空目录里的一次性小实验：可以不写 CLAUDE.md，等出现固定命令、禁区或重复失败再补。

## 编辑综合（非官方结论，需标注）

- 「五类必要信息」是 LearnPrompt 对官方零散建议按「一次小改动闭环」的操作化归纳，不是官方分类，也不是行业标准。
- 「每次失败只补一条能改变行为的规则」是基于官方「弄错两次就写进 CLAUDE.md」与「可删性自问」的编辑判断。
- 字段完整度检查器只验证「写没写齐、够不够具体」，不验证模型是否遵循；这一区分是本文的方法论底线。
