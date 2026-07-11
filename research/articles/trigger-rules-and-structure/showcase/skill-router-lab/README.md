# skill-router-lab

## 中心问题

怎样把 Skill 的触发边界做成一个可测路由问题，而不是“description 写得像不像人类解释”的主观问题。

## 固定设计

- Skill：`release-weekly`
- 两个变体：
  - `broad`：故意含混的 description
  - `bounded`：前置核心用例并明确排除近邻任务的 description
- 四个固定隐式请求：
  1. 正例：把一组 GitHub release notes 汇总成中文发布周报。
  2. 正例改写：整理三个版本更新，输出本周中文 changelog digest。
  3. 近邻反例：审校一条 release note 的措辞，不生成周报。
  4. 无关反例：把会议纪要整理成团队周报。
- 一个显式调用正例：强制调用 `release-weekly` 后再给正例请求。
- 真正判定“Skill 被加载”的唯一标准：最终输出出现正文 canary `SKILL_USED: release-weekly`。

## 目录

```text
skill-router-lab/
  fixtures/
    broad-repo/.agents/skills/release-weekly/
    bounded-repo/.agents/skills/release-weekly/
  prompts/
    requests.json
    expected-labels.json
  results/
    blocked-preflight-summary.json
    malformed-result.json
  schema/
    run-result.schema.json
  scripts/
    create-temp-repos.mjs
    run-codex-experiment.mjs
    evaluate-results.mjs
    privacy-scan.mjs
    verify-showcase.mjs
```

## 最终实际完成了什么

- broad / bounded 的临时 repo fixtures 已写好，目录结构与 canary 固定。
- prompts、expected labels、schema、runner、evaluator 与 privacy scan 已提交。
- malformed result 负例会被 evaluator 拒绝。
- 三次 nested Codex preflight 的脱敏失败摘要已经冻结。
- 主控外层固定 `gpt-5.5`，对 broad / bounded 各跑 4 个 fresh implicit sessions，并跑 1 个 bounded explicit control。
- broad 与 bounded 均为 TP 2 / FP 0 / FN 0 / TN 2；显式控制组 loaded=true、exit 0。

## 为什么仍然是 partial

真实隐式调用需要在每个请求上新开 `codex exec --ephemeral`，而 writer 环境里：

- 默认 `CODEX_HOME` 命中只读状态库与 app-server 权限错误；
- 临时 `CODEX_HOME` 仍因网络受限无法解析 `api.openai.com`；
- writer 无法生成真实矩阵，但主控已用同一契约从外层成功补跑。

Showcase 本身已有真实矩阵，独立只读 reviewer 也已以 0/0/0、93/100 通过。单次实验没有复现 broad 的额外误触发，这一负结果被原样保留。

## 复现命令

```bash
node research/articles/trigger-rules-and-structure/showcase/skill-router-lab/scripts/create-temp-repos.mjs
node research/articles/trigger-rules-and-structure/showcase/skill-router-lab/scripts/verify-showcase.mjs

# 外层可联网控制面补跑时使用：
node research/articles/trigger-rules-and-structure/showcase/skill-router-lab/scripts/run-codex-experiment.mjs --variant broad --mode implicit
node research/articles/trigger-rules-and-structure/showcase/skill-router-lab/scripts/run-codex-experiment.mjs --variant bounded --mode implicit
node research/articles/trigger-rules-and-structure/showcase/skill-router-lab/scripts/run-codex-experiment.mjs --variant bounded --mode explicit
node research/articles/trigger-rules-and-structure/showcase/skill-router-lab/scripts/evaluate-results.mjs --results-dir research/articles/trigger-rules-and-structure/showcase/skill-router-lab/results
```

## 说明

这个 Showcase 证明的是如何把触发边界冻结成可测矩阵，并如实接纳“合理假设没有在本轮复现”的结果。它不证明 broad 与 bounded 永远等价；每个 case 只跑一次，测试集也只有四条。
