# 横向研究：从自然语言需求到可运行 MVP

比较对象覆盖“商业 MVP 定义”“交给 Agent 的任务契约”“产品自带的任务入口”和
“中文主题地图”，标明每个来源能证明什么、不能证明什么。核验日期 2026-07-11。

## 1. 商业 MVP 的经典定义（作为要区分的对照，不是本文主张）

- 来源：Wikipedia《Minimum viable product》，转述 Eric Ries 的定义——
  “用最小的投入收集关于用户的最大量可验证认知”；术语 2001 年由 Frank Robinson 提出，
  经 Steve Blank、Eric Ries 推广（Lean Startup）。
- 支持：MVP 的原意是**验证市场假设**，关注“validated learning”。
- 不能证明：它没有回答“交给 coding agent 前，需求要冻结到什么技术粒度”。
  本文正是要把话题从“商业验证”切换到“可被 Agent 一次实现并验收的技术切片”，
  因此这条只作对照，避免读者把两个 MVP 混为一谈。

## 2. 交给长任务 Agent 的“任务契约”（一手工程实践）

- 来源：Anthropic《Effective harnesses for long-running agents》。
- 支持：在写代码前先就“done 长什么样”达成 sprint contract；评审用带硬阈值的
  验收标准，任一项不达标该轮即失败；用文件做结构化交接；把“做事的 Agent”与
  “判断做对的 Agent”分开是很强的杠杆。这直接支撑本文“先写验收动作、把完成写成
  可判断信号”的机制。
- 不能证明：它讲的是运行期 harness 设计，不是“如何把一句模糊想法冻结成切片”的
  前置步骤。本文把它用作“为什么验收要先写”的机制依据，冻结方法本身是编辑综合。

## 3. 产品如何接收一个任务（一手产品文档）

- 来源：OpenAI Codex CLI 文档（learn.chatgpt.com/docs/codex/cli）。
- 支持：Codex 以自然语言描述任务开始，并通过 `/permissions`、sandbox、可写根目录
  控制它能改什么、何时需批准。说明“把需求交给 Agent”是真实产品动作，且带边界。
- 不能证明：产品文档不告诉你需求该削减到多小；它只承接你已经想清楚的任务。

## 4. 中文主题地图（二手，仅供选题）

- 来源：Claude Code 橙皮书（alchaincyf/claude-code-orange-book，README 声明
  CC BY-NC-SA 4.0）。
- 支持：提供“把想法做成第一版”的中文语境与“AI 新闻雷达”这一选题灵感。
- 不能证明：它是快照式二手资料，不作现行产品行为或本文方法的事实权威。
  本文结构、任务卡四维法、Showcase 均独立重建，橙皮书只保留为主题地图与署名。

## 相邻文章分工（避免重复）

- `project-checklist`：已有仓库交给 Agent 前的六格开工清单（仓库/运行/禁区/密钥/验收/回滚）。
- `minimum-agentic-coding-workflow`：Plan→Patch→Verify→Learn 执行循环。
- `plan-auto-approval-boundary`：自动执行与人工审批边界。
- 本文只负责**更上游的一步**：把一句还没有仓库、没有任务的模糊想法，冻结成可交付切片。
