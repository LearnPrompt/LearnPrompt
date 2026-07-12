# Horizontal research：API 集成型 Skill 设计

| 来源 | 支撑什么 | 不能证明什么 |
| --- | --- | --- |
| Agent Skills specification | Skill 目录最小结构、`SKILL.md`、`scripts/` / `references/` / `assets/`、渐进加载模型 | 不定义任何具体 HTTP contract，也不规定退出码 |
| Agent Skills skill-creator best practices | Skill 应从真实经验出发、保持中等粒度、用 progressive disclosure、偏 procedure 不偏 declaration | 不是 Codex/Claude 的产品规范 |
| OpenAI Build skills | Codex Skills 是可复用 workflow 容器；优先 instructions，确定性或外部工具场景再下沉 scripts | 不给出 REST API 的具体分页/重试细节 |
| OpenAI Customization overview | `AGENTS.md`、Skills、MCP 的职责分层；Skill 适合“重复工作流”而非一次性回答 | 不决定什么时候该选哪个第三方 API |
| Claude Code Skills docs | Claude 侧也把 Skill 定位成“反复粘贴的 instructions / checklist / multi-step procedure”容器，且 body 按需加载 | 不证明 LearnPrompt 的退出码或 response schema |
| GitHub REST API best practices + pagination docs | 串行请求、分页由 `link`/分页机制驱动、`429` 要尊重 `Retry-After`、大量变更型请求要节流 | 不代表所有 REST API 都和 GitHub 一样命名字段 |
| GitHub credential security docs | 凭据不能硬编码，不能明文推仓库，最少权限原则成立 | 不等于 `.env` 永远是最佳生产做法；这里只是最低安全底线 |
| RFC 9110 + RFC 6585 | `GET` 的检索语义、`429` 与 `Retry-After` 的标准语义 | 不提供 Skill 层的 audit/report 形状 |
| Node.js fetch docs | Node 当前原生提供浏览器兼容的 `fetch` / `Request` / `Response` / `Headers` | 不替代具体业务的 schema 和 retry policy |
| Agent Skills 橙皮书仓库 | “Integration pattern” 主题地图、作者与许可边界、中文术语组织 | 不能证明当前产品行为，也不授权复制 PDF 正文或图片 |

## 相邻教程如何校准本文

- `pipeline-skill-design` 已验证：失败恢复和退出码必须先于自然语言，这影响本文的 `41 / 42 / 43 / 44` 设计。
- `thinking-distillation-boundary` 仍是旧稿：它提醒本文不要停在“注意安全、注意失败”这种空泛口号，必须落到具体 request contract。

## 本文采取的写法

1. 用官方文档证明 Skill 容器边界、`GET` 语义、分页 / 限流 / credential 的原则。
2. 用 LearnPrompt fixture 证明“如何把原则落成 contract”。
3. 把 writer sandbox 中真实 blocked 的 loopback / nested 结果明确写成 blocked，而不是偷换成 verified。
