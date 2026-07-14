# 证据台账

每条核心事实与每处「实测」都登记来源、类型、验证日期、置信度与局限。核验日期 2026-07-11。

| # | 声明 | 证据 | 证据类型 | 验证日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Claude Code 每个会话从全新上下文窗口开始，靠两套机制跨会话携带知识：CLAUDE.md（你写）与 auto memory（模型写） | code.claude.com/docs/en/memory | 官方一手文档 | 2026-07-11 | 高 | 文档随版本更新，需按发布日期复核 |
| 2 | 两套记忆都在每次会话开始载入，且被当作 context 而非强制配置；硬拦截要用 PreToolUse 钩子 | code.claude.com/docs/en/memory | 官方一手文档 | 2026-07-11 | 高 | 不保证严格遵守 |
| 3 | CLAUDE.md 层级（载入顺序 broad→specific）：managed policy → user(~/.claude/CLAUDE.md) → project(./CLAUDE.md 或 ./.claude/CLAUDE.md) → local(CLAUDE.local.md)；祖先目录全量载入，子目录按需 | code.claude.com/docs/en/memory | 官方一手文档 | 2026-07-11 | 高 | 具体解析顺序以官方为准 |
| 4 | CLAUDE.md 建议 < 200 行；@path 导入最多 4 跳、载入时展开、不减少上下文；.claude/rules/ 可用 paths frontmatter 路径门控 | code.claude.com/docs/en/memory | 官方一手文档 | 2026-07-11 | 高 | 数字为官方当前建议 |
| 5 | auto memory 存 `~/.claude/projects/<project>/memory/`，含 MEMORY.md 索引 + topic 文件；每 git 仓一目录、worktree 共享、机器本地 | code.claude.com/docs/en/memory | 官方一手文档 | 2026-07-11 | 高 | 路径由 git 仓派生；autoMemoryDirectory 可改 |
| 6 | MEMORY.md 每次会话载入前 200 行或前 25KB（先到先算），超出不载入；topic 文件不在启动载入、按需读 | code.claude.com/docs/en/memory | 官方一手文档 | 2026-07-11 | 高 | 该限制只针对 MEMORY.md；CLAUDE.md 全量载入 |
| 7 | auto memory 需 v2.1.59+，默认开，可用 /memory 切换、autoMemoryEnabled 或 CLAUDE_CODE_DISABLE_AUTO_MEMORY 关；明文 markdown，可 /memory 审计与删除 | code.claude.com/docs/en/memory；本机 `claude --help` 列出 auto-memory | 官方文档 + CLI | 2026-07-11 | 高 | 版本门槛会前移 |
| 8 | 模型不是每次都存，而是判断「未来会话是否有用」才存；官方「何时写 CLAUDE.md」含「第二次犯同样的错」「又敲了一遍上次的纠正」 | code.claude.com/docs/en/memory | 官方一手文档 | 2026-07-11 | 高 | 判断由模型做，非确定性 |
| 9 | 项目根 CLAUDE.md 在 /compact 后从磁盘重读重注入；嵌套 CLAUDE.md 不自动重注入 | code.claude.com/docs/en/memory（What survives compaction） | 官方一手文档 | 2026-07-11 | 高 | 细节以 context-window 文档为准 |
| 10 | Claude Code 读 CLAUDE.md 而非 AGENTS.md；要共用需 @AGENTS.md 导入或 symlink | code.claude.com/docs/en/memory | 官方一手文档 | 2026-07-11 | 高 | — |
| 11 | Codex 暴露实验特性 `memories`（experimental=true）与稳定 `auto_compaction`（true）、`chronicle`（under development=true） | 本机 `codex features list` | CLI 实测 | 2026-07-11 | 高 | 特性状态随版本变化；未文档化其召回语义 |
| 12 | Codex 会话可 resume/fork/archive/delete（按 UUID 或 session 名）；跨会话「指导」文档化机制为 AGENTS.md（指令类，根到叶合并、project_doc_max_bytes 默认 32KiB） | 本机 `codex --help`/`codex resume --help`；instruction-layer 已核对 | CLI 实测 + 邻篇核对 | 2026-07-11 | 高 | AGENTS.md 属指令，不等同 auto memory |
| 13 | 无记忆时两个独立进程重复同一个报错；写入教训后 recall 取出；先召回再行动校验通过 exit 0 | showcase/memory-recall/result.txt 阶段1–3 | 实测 | 2026-07-11 | 高 | 确定性脚本模型，非产品本身 |
| 14 | 过期条目在 today > expires 时被 EVICT、不注入；durable 条目存活 | showcase/memory-recall/result.txt 阶段4a | 实测 | 2026-07-11 | 高 | recall.mjs 是读取纪律的最小模型 |
| 15 | 记忆在盘上但进程不召回（skip-recall）时重复同一报错，exit 1 | showcase/memory-recall/result.txt 阶段4b | 实测 | 2026-07-11 | 高 | 证明记忆≠模型自动记住 |
| 16 | 本地环境：Claude Code 2.1.206、codex-cli 0.142.2、Node v24.11.0、macOS 26.5.1 | `claude --version`/`codex --version`/`node --version`/`sw_vers` | 实测 | 2026-07-11 | 高 | 版本会更新 |
| 17 | 橙皮书为教育性分享、要求署名、无标准开源许可，故不复制其图片/成段文字 | github.com/alchaincyf/harness-engineering-orange-book；visual-assets.md 许可矩阵 | 二手来源 + 项目许可说明 | 2026-07-11 | 中 | 仅作主题地图，不作事实依据 |

## 事实 / 推断 / 综合的分界

- 事实：条 1–12、17（有一手文档、CLI 实测或项目声明）。
- 实测：条 13–16（本机真实运行，输出冻结在 showcase/result.txt）。
- 综合（编辑归纳）：五桶按生命周期分类、写入/召回/淘汰三段纪律、失败模式清单、记忆层与指令/状态/反馈/编排的分工——见 vertical-research.md，正文标注为操作化归纳，不冒充官方术语。
