# Brief：第一份最小 CLAUDE.md

## 要解决的问题

一个人已经跑完过一次 Claude Code 的小任务，但每开一轮新会话，都要重新解释一遍：
这个项目怎么构建、哪些目录不能碰、改完怎么验收、结尾要汇报什么。同样的错误也被
AI 重复犯第二次、第三次。问题不在提示词不够长，而在于这些「项目事实」散落在 README、
package.json 和你脑子里的踩坑记忆里，从没被压成一份让每轮执行都能读到的短文件。

本文要把「写第一份 CLAUDE.md」从抄模板，变成一次可机械验收的提炼：从一个真实项目的
重复失败里，提炼出五类必要信息，并知道哪些内容不该塞进去。

## 目标读者

已经用 Claude Code 完成过至少一次可验收小改动、现在想减少每轮重复解释的实践者。
默认会用命令行、能读 Markdown，但没系统读过官方 memory 文档，容易把 CLAUDE.md 当成
「项目愿景手册」或「硬权限开关」。

## 学习目标

读者读完能够：

1. 从一个项目的重复失败里，提炼出第一份短、具体、可验证的 CLAUDE.md。
2. 说清一份最小 CLAUDE.md 必须回答的五类信息：真实命令、允许修改范围、禁区、最快验收、输出收尾。
3. 准确区分 CLAUDE.md、CLAUDE.local.md、.claude/rules、auto memory、AGENTS.md 各自是什么。
4. 理解官方定位：CLAUDE.md 是 context 而非 enforced configuration，硬约束要用 hook/settings。
5. 知道哪些东西不该塞进 CLAUDE.md（价值观口号、一次性任务、长风格治理、把它当权限或自动记忆）。

## 中心结论

一份能真正减少重复失败的 CLAUDE.md，价值不在长，而在于它把散落的项目事实压成五类
具体、可验收的规则；官方明确它只是每轮读入的 context（建议），不是强制配置，所以写得
越具体、越短，模型越可能照做，硬性阻止要另用 PreToolUse hook 或 managed settings。

## 非目标

- 不深挖代码风格治理与长期工程约束（交给 control-style-with-claude-md）。
- 不展开 hooks / skills / MCP 的写法。
- 不把 CLAUDE.md 当硬权限层或 auto memory。
- 不做模型排名，不把静态检查器说成模型遵循度实验。
- 首次任务闭环由 install-and-first-project 负责，本文不重复。

## 需要的证明

- 一手来源：code.claude.com 官方 memory / best-practices / features-overview，本机 claude --version/--help。
- 一个具体最小项目上的机械验收：空泛说明 vs 最小 CLAUDE.md，保存 fail→pass 输出与退出码。
- 附加一次受控真实只读会话，确认项目指令被读到（在线模型，已披露局限）。

## 验收条件

- 五类必要信息每类都有具体写法示例与对应的失败场景。
- CLAUDE.md / CLAUDE.local.md / .claude/rules / auto memory / AGENTS.md 区分准确，与官方文档一致。
- @import 递归深度、200 行建议等时效信息按发布日核实并标注日期。
- 至少一张原创教学图，含具体 alt、紧随图注、asset-ledger、CC BY-NC-SA 4.0。
- 通过单篇 validator 与 49 页站点构建。

## 未决假设（无人值守下的最小安全假设）

- 文章卡称 @import「当前最大递归深度是五跳，不应复用旧的四跳说法」。但 2026-07-11 现场核对
  官方 memory 文档，原文仍为 "with a maximum depth of four hops"。按 skill 的一手来源优先原则，
  正文采用官方现行的「四跳」，并在证据台账与待 reviewer 项中明确标注此与文章卡的出入。
