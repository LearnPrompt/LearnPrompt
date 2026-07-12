# Brief：thinking-distillation-boundary

## 问题

旧稿只说“把判断框架写成 Skill 时别玄学化”，但真正难点不是文风，而是**蒸馏边界**：

1. 哪些材料算可发布、可复用的蒸馏输入？
2. reasoning summary、decision record、accepted patch 和 raw chain-of-thought 到底差在哪一层？
3. 为什么单次成功路径不能直接升格成团队 Skill，必须先产出 candidate，再过留出集和人工批准？
4. 为什么真实聊天 transcript 默认不是训练集，而更像一个高风险、混杂隐私与 prompt injection 的原始现场？

## 目标读者

已经写过基础 Skill，并且想把反复出现的专家判断方法沉淀成 Skill 的高级用户、工作流作者和 agent 维护者。

## 学习目标

读完后读者能：

1. 说清“蒸馏”输入必须来自 observable receipts，而不是隐藏思维链。
2. 区分 reasoning summary、rationale、decision record 与 raw chain-of-thought 的产品边界。
3. 用一组固定 exit code 解释：什么情况下应该拒绝 distillation，什么情况下 candidate 没通过 holdout。
4. 看懂 `observable-receipt-distiller` Showcase：如何从 3 份训练 receipts 生成 `.agents/skills/frontmatter-repair/` candidate，并用 4 个 holdout fixtures 做 4/4 机械验收。
5. 在自己的工作流里画出“candidate -> holdout -> human approval”这条安全边界，而不是把单次好结果直接变成团队默认 Skill。

## 中心论点

所谓“思维蒸馏型 Skill”，如果要可发布、可复用、可审计，它的输入必须是**可观察工件**：输入快照、accepted diff、用户纠正、validator 命令与结果、已知限制。真正可继承的是这些外显证据里反复出现的规则，而不是模型的隐藏链路。产物也只能先是 candidate Skill，必须再经过留出任务和人工批准，才能谈团队复用。

## 非目标

- 不解释模型训练里的 knowledge distillation。
- 不声称可以恢复模型真实内部思维。
- 不把“思维蒸馏型”冒充成 Agent Skills 官方术语。
- 不处理真实用户聊天、真实私有资料、真实 credential 或未脱敏 transcript。
- 不把 candidate Skill 自动升级成团队现行 Skill。

## Showcase 问题

冻结 Showcase：`observable-receipt-distiller`

- 环境：隔离临时 Git repo。
- 训练数据：3 份完全合成 frontmatter 修复 receipts。
- 目标产物：`.agents/skills/frontmatter-repair/` candidate。
- 留出集：`missing title`、`missing description`、`invalid sidebar order`、`already-valid no-op` 共 4 个 fixtures。

Showcase 必须回答：

1. valid observable receipts -> candidate + holdout 4/4 是否稳定 exit `0`？
2. 只有结论、没有 input/diff/validator 的 evidence-poor receipt 是否稳定 exit `51`？
3. 只有结构化 `contains_sensitive_material: true` marker 的 receipt 是否稳定 exit `52`？
4. raw private transcript / hidden-CoT request marker 是否稳定 exit `53`？
5. candidate 若没通过留出集，是否稳定 exit `54`？
6. privacy scan 是否 exit `0`？
7. writer 宿主的 blocked 与外层真实 `gpt-5.5` success 是否分层保留，而不是互相覆盖？

## 需要的证据

- 官方一手资料：
  - `https://learn.chatgpt.com/docs/build-skills`
  - `https://learn.chatgpt.com/docs/customization/overview`
  - `https://developers.openai.com/api/docs/guides/reasoning`
  - `https://code.claude.com/docs/en/skills`
  - `https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills`
  - `https://agentskills.io/specification`
  - `https://agentskills.io/skill-creation/evaluating-skills`
- 二手主题地图：
  - `https://github.com/alchaincyf/agent-skills-orange-book`
  - `https://raw.githubusercontent.com/alchaincyf/agent-skills-orange-book/main/README.md`
  - `https://raw.githubusercontent.com/alchaincyf/agent-skills-orange-book/main/README_zh.md`
- 冻结 Showcase：
  - `research/articles/thinking-distillation-boundary/showcase/observable-receipt-distiller/`

## 关键问题

1. 为什么“可复用方法”只能从 observable receipts 中抽，而不能从 hidden CoT 中抽？
2. 为什么 reasoning summary 和 decision record 可以公开归档，而 raw chain-of-thought 不能被当成训练语料默认保留？
3. 为什么单次 accepted patch 只能生成 candidate，而不是团队级 universal rule？
4. 哪些边界应该被脚本机械拒绝，哪些边界必须保留人工批准？

## 验收条件

- `starlight/src/content/docs/agent-skills/thinking-distillation-boundary.mdx` 重写为深度教程；删除旧 `SourceCard` 使用。
- frontmatter 保持 `showcase_status: partial`，不写 `quality_score`。
- `review.md` 保持 `PENDING`，writer 不自评 PASS。
- Showcase research pack 至少含 `brief.md`、`horizontal-research.md`、`vertical-research.md`、`evidence-ledger.md`、`asset-ledger.md`、`control-verification.md`、`release-gate-result.txt`、`review.md` 与可重跑 `showcase/`。
- 教学图为本地原创 1400×900 SVG，并完成实际渲染检查。
- 运行 `verify-showcase.mjs`、privacy scan、writer-stage partial validator、`npm --prefix starlight run build`、`git diff --check`。
- writer-side nested 尝试只执行一次并如实冻结；外层用同一 fixture / prompt / schema 补跑成功证据。

## 目标文件

- `starlight/src/content/docs/agent-skills/thinking-distillation-boundary.mdx`
- `research/articles/thinking-distillation-boundary/`
- `starlight/public/images/articles/thinking-distillation-boundary/`
