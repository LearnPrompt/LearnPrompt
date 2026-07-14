| Claim | Evidence | Evidence type | Verified at | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| 开放规范要求 Skill 至少包含 `SKILL.md`，并把 `scripts/`、`references/`、`assets/` 作为可选目录 | [Agent Skills Specification](https://agentskills.io/specification) | 官方一手文档 | 2026-07-12 | 高 | 规范不规定具体客户端路径 |
| 开放规范的 progressive disclosure 是 metadata 先载入、正文触发后载入、资源按需载入 | [Agent Skills Specification](https://agentskills.io/specification) | 官方一手文档 | 2026-07-12 | 高 | 只是通用机制，不等于所有客户端预算一致 |
| Codex 当前从 `.agents/skills` 扫描 repo skills，并支持显式 `$skill` 与隐式 description 匹配 | [Build skills | ChatGPT Learn](https://learn.chatgpt.com/docs/build-skills) | 官方一手文档 | 2026-07-12 | 高 | 这是 Codex 实现，不是开放规范 |
| Codex 初始 skills listing 最多占上下文 2%，未知窗口时上限 8000 字符；description 会先被截短，极端情况下还会省略部分 skills | [Build skills | ChatGPT Learn](https://learn.chatgpt.com/docs/build-skills) | 官方一手文档 | 2026-07-12 | 高 | 具体机器上还受技能数量影响 |
| Codex 可在 `agents/openai.yaml` 里用 `allow_implicit_invocation: false` 禁止隐式调用 | [Build skills | ChatGPT Learn](https://learn.chatgpt.com/docs/build-skills) | 官方一手文档 | 2026-07-12 | 高 | 这是 OpenAI 客户端扩展，不是规范字段 |
| Claude Code 默认把技能描述载入上下文，显式 `/<name>` 与自动匹配是两条并存路径 | [Features overview | Claude Code Docs](https://code.claude.com/docs/en/features-overview) | 官方一手文档 | 2026-07-12 | 高 | 该文档不说明固定字符上限 |
| Claude Code 的自动匹配依赖 skill description；如果描述含混或重叠，可能误触发或漏触发 | [Features overview | Claude Code Docs](https://code.claude.com/docs/en/features-overview) | 官方一手文档 | 2026-07-12 | 高 | 属于行为说明，不给出算法细节 |
| Claude Code 支持 `disable-model-invocation: true`，使 Skill 只保留显式调用 | [Features overview | Claude Code Docs](https://code.claude.com/docs/en/features-overview) | 官方一手文档 | 2026-07-12 | 高 | 这是 Claude Code 实现细节 |
| Claude Code 文档明确指出：frontmatter 损坏时 `/skill-name` 仍可运行，但 metadata 为空，自动匹配会失效 | [Slash commands / skills | Claude Code Docs](https://code.claude.com/docs/en/slash-commands) | 官方一手文档 | 2026-07-12 | 高 | 只适用于 Claude Code |
| Claude Code skills listing 会截短 description；当前本机安装里可提取到“per-skill description character cap ... default: 1536”常量说明 | `claude --help`、本机 Claude Code 安装二进制的 `strings` 脱敏摘录，见 `showcase/skill-router-lab/results/blocked-preflight-summary.json` 与 `control-verification.md` | 本机实现探针 | 2026-07-12 | 中高 | 固定数值来自本机安装常量，不是官方网页上的规范文本 |
| Orange Book 可以作为触发与冲突的中文主题地图，但不能证明当前客户端的“关键词优先级”算法 | 任务提供的工作树外 Orange Book 中文触发章节摘录 | 二手主题地图 | 2026-07-12 | 中高 | 不能当一手事实 |
| `skill-router-lab` 的 broad 与 bounded 各完成四次 fresh implicit run；两者都为 TP 2 / FP 0 / FN 0 / TN 2，precision 与 recall 都为 1 | `showcase/skill-router-lab/results/evaluation-summary.json`；八个 `run-*-implicit-*.json` | 本地真实运行 + 确定性 evaluator | 2026-07-12 | 高 | 每 case 只运行一次、测试集只有四条，不能外推稳定触发率 |
| bounded 显式控制组返回 canary、`loaded=true`、exit 0 | `showcase/skill-router-lab/results/run-bounded-explicit-request-5.json` | 本地真实运行 | 2026-07-12 | 高 | 只证明显式加载链可用，不证明隐式路由准确率 |
| writer sandbox 无法完成真实 `codex exec --ephemeral` 隐式调用：先后命中了参数错误、只读状态库 / app-server 权限、以及无法解析 `api.openai.com` 的网络错误 | `showcase/skill-router-lab/results/blocked-preflight-summary.json` | 真实运行失败摘要 | 2026-07-12 | 高 | 只证明当前 writer sandbox，不代表外层主控环境一定同样失败 |
| deterministic evaluator 会拒绝 malformed result，并用两版共享的同一 ground truth 计算矩阵，避免把 broad 的预期误触发错算成 TP | `showcase/skill-router-lab/results/malformed-result.json`、`prompts/expected-labels.json`、`scripts/evaluate-results.mjs` | 确定性脚本 + 实际运行 | 2026-07-12 | 高 | 只保证冻结工件内部一致，不替代更大样本复验 |
