# Control Verification

核验日期：2026-07-12。以下记录 writer 阶段和主控外层补跑的真实机械门禁，不代替独立 reviewer 的最终判定。

## 产品事实不混淆

- OpenAI repo Skill 当前写 `.agents/skills`，Claude Code 项目 Skill 当前写 `.claude/skills`，正文分开写，没有混成统一标准路径。
- Codex 的显式调用语法写 `$skill`，Claude Code 的显式调用语法写 `/skill-name`，没有互换。
- `AGENTS.md` / `CLAUDE.md`、Skill、script、MCP、plugin 都按各自一手文档定义分层。

## Showcase 事实

- 冻结 Showcase：`showcase/receipt-renamer-skill/`
- 离线 replay：`normal=0`、`missing currency=21`、`conflict=23`、`privacy scan=0`
- `fixture/package.json` 内 `npm test`：`4/4` 通过
- writer sandbox 的第一次 nested `codex exec` 被只读 state DB 与 app-server 初始化权限拦截；主控随后用同一 fixture、prompt 和 schema 在外层补跑成功
- 外层真实调用：`model=gpt-5.5`、`exec_exit_code=0`、`skill_invocation=$receipt-renamer`
- changed files：只有未跟踪的 `reports/`；三个源 PDF 未改名
- reports written：`json=true`、`markdown=true`
- `npm test`：`4/4` 通过

## 脱敏检查

- 离线 replay 与 live success artifacts 都已通过 `showcase/receipt-renamer-skill/scripts/privacy-scan.mjs`
- research pack 内未冻结真实用户主目录、系统临时目录、runtime id 或绝对 shell 路径
- `codex-stdout-sanitized.jsonl` 保留脱敏事件流；`codex-last-message.json` 与两份 live plan 保留最小验收证据

## 最终 writer 门禁

- partial validator：PASS
- 正文字数：`body_chars=9833`
- H2 数量：`h2_count=9`
- 去代码中文解释字符：`cn_explanatory_chars=3662`
- Starlight build：PASS
  - `49` 个 HTML 文件
  - 目标路由：`/agent-skills/what-are-agent-skills/`
- `git diff --check`：PASS
- SVG render check：PASS
  - 用 `sharp` 将 `skill-load-chain.svg` 实际渲染为 `1400x900` PNG
  - 目视检查无越框、无文字截断

## 最终状态

- 独立只读终审：PASS 96/100，blocker/major/minor = 0/0/0
- frontmatter：`showcase_status: verified`、`quality_score: 96`
- `review.md`：最终状态 PASS
