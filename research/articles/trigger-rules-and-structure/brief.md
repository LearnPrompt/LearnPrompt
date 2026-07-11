# Brief：Skill 触发规则与目录结构

## 文章卡

- 目标 MDX：`starlight/src/content/docs/agent-skills/trigger-rules-and-structure.mdx`
- 研究目录：`research/articles/trigger-rules-and-structure`
- 图片目录：`starlight/public/images/articles/trigger-rules-and-structure/`
- 构建命令：`cd starlight && npm run build`
- Showcase：`skill-router-lab`
- 验证日期：2026-07-12

## 目标读者与产出

- 目标读者：已经会写第一个 `SKILL.md`，但开始遇到误触发、漏触发、近邻冲突和“正文写很长也没用”的实践者。
- 一句话产出：读完能把 Skill 触发边界做成正 / 负 / 近邻测试矩阵，并用 `SKILL.md + references/ + scripts/ + assets/` 的分层支撑渐进披露。

## 中心主张

Skill 的触发可靠性首先是路由问题，不是文风问题。可测试的边界来自两件事：

1. 把 broad / bounded 的 metadata 写成可比较的实验对象；
2. 把完整合同、近邻边界和确定性步骤从 `SKILL.md` 主体下沉到 `references/`、`scripts/`、`assets/`。

## 明确不做

- 不重复 `first-skill-md` 已覆盖的 `name` / `description` 基础硬限制、最小模板和打包步骤。
- 不把橙皮书的“关键词匹配优先级”写成当前客户端事实。
- 不把一次 writer 沙箱里失败的嵌套 Codex 预演包装成“实测成功”。
- 不复制橙皮书图片、截图或成段文字。

## 需要的证明

- 开放规范对目录结构、`SKILL.md`、progressive disclosure 的一手说明。
- OpenAI 官方对 Codex 技能目录 `.agents/skills`、显式 `$`、隐式 `description` 匹配、listing 预算与 `openai.yaml` 扩展的说明。
- Anthropic 官方对 `.claude/skills`、`/<name>`、自动匹配、listing 截短和 `disable-model-invocation` 的说明。
- 一个 concrete showcase：同一 `release-weekly` Skill 的 broad 与 bounded 两版 fixture、固定测试集、canary、runner、schema、evaluator、九次真实 Codex 调用和 blocked preflight 摘要。

## 运行边界与补跑策略

- writer sandbox 里嵌套 `codex exec --ephemeral` 无法完成真实隐式调用：
  - 默认 `CODEX_HOME` 触发只读 `state_5.sqlite` 与 app-server 初始化错误；
  - 改到可写临时 `CODEX_HOME` 后，仍因网络受限无法解析 `api.openai.com`。
- 主控外层随后保持同一冻结契约补跑成功：
  - broad / bounded 各 4 个 fresh implicit runs；
  - bounded 1 个 explicit control；
  - 两版共享同一 ground truth；
  - evaluator 结果均为 TP 2 / FP 0 / FN 0 / TN 2；显式控制组 loaded=true；
  - malformed result 负例拒绝与 privacy scan 均通过。
- writer 阶段 frontmatter 必须保持 `showcase_status: partial`；独立终审通过后才允许写入 `verified` 与最终分数。

## 验收条件

- 正文至少 6 个 H2，并明确覆盖触发假设、正 / 负 / 近邻测试表、真实实验状态、目录分层、排错顺序、何时禁用隐式、练习和来源。
- 删除 `SourceCard`，底部保留真实来源。
- 至少一张 1400x900 本地原创教学 SVG，许可在 `asset-ledger.md` 里闭环。
- 研究包包含 `brief.md`、`horizontal-research.md`、`vertical-research.md`、`evidence-ledger.md`、`asset-ledger.md`、`showcase/`、`control-verification.md`、`release-gate-result.txt`、`review.md`。
- 运行 showcase check、partial validator、Starlight build、privacy scan、`git diff --check`，并记录实际退出码。
