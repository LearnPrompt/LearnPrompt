# Horizontal research：两种 auto-review surface 的横向对照

核验日期：2026-07-11。

| 来源 | 类型 | 支撑什么 | 不能证明什么 |
| --- | --- | --- | --- |
| [Codex code review in GitHub](https://learn.chatgpt.com/docs/third-party/github) | 官方一手文档 | `@codex review`、Automatic reviews、GitHub PR diff、P0/P1、closest `AGENTS.md` review guidelines、GitHub 标准 code review 输出 | 不能证明本地 `approvals_reviewer = "auto_review"` 的行为；也不证明一次本地 `codex exec` 会自动生成同样的 GitHub review comment |
| [Sandbox](https://learn.chatgpt.com/docs/sandboxing) | 官方一手文档 | sandbox modes、approval policies、`approvals_reviewer` 的交互位置、`auto_review` 只审 eligible approval request、不改变 sandbox boundary | 不能证明 GitHub PR review surface，也不证明 reviewer subagent 会主动做 repo code review |
| [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference) | 官方一手文档 | `approvals_reviewer = user | auto_review` 的精确定义，尤其是“Who reviews eligible approval prompts ... This setting doesn't change sandboxing...” | 不能单独解释 GitHub review 的 P0/P1 或 `AGENTS.md` review guidance |
| [alchaincyf/codex-orange-book](https://github.com/alchaincyf/codex-orange-book) | 二手主题地图 | 提醒选题与术语：auto-review、AGENTS.md、sandbox、approval 这几个面经常被同写；适合做中文导读的结构提醒；README 还公开了 `CC BY-NC-SA 4.0` 许可，便于底部署名 | 不是现行事实权威，不能替代 2026-07-11 官方页面；其中截图与用词都不能直接当当前 product behavior 证据 |
| `starlight/src/content/docs/codex/sandbox-and-permissions.mdx` | 仓内已发布教学参考 | 对齐 LearnPrompt 的教程节奏：先拆边界、再给机制图、再给 deterministic Showcase 与 failure modes | 不作为外部事实来源，只用于教学结构校准 |

## 结论

- 如果问题是“Codex 会不会在 GitHub PR 上像同事一样留 review comment、只标高优先级风险、按 `AGENTS.md` 定制审查重点”，主证据只能来自 GitHub code review 页面。
- 如果问题是“本地 CLI/桌面端在需要批准时，谁来替我审 eligible approval request”，主证据只能来自 sandboxing + config reference。
- Orange Book 只能保留为中文二手主题地图，并在公开正文底部明确署名与许可；正文不能再渲染 `SourceCard`。
