# 证据台账：指令层

| 主张 | 证据 | 证据类型 | 核验日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- |
| CLAUDE.md 是用户手写、每次会话开头全量载入的指令文件，有托管策略/用户/项目/本地四个作用域，按从宽到窄的顺序进入上下文 | Claude Code 官方 memory 文档“Choose where to put CLAUDE.md files / How CLAUDE.md files load” | 官方一手文档 | 2026-07-11 | 高 | 文档会更新，按发布日复核；子目录文件按需加载 |
| 官方把 CLAUDE.md 定位为上下文而非强制配置，要硬拦动作须用 PreToolUse 钩子 | 原文“Claude treats them as context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook instead.” | 官方一手文档 | 2026-07-11 | 高 | 支撑指令层/约束层分工 |
| 指令越具体、越简洁越被稳定遵循；“Run `npm test` before committing”优于“Test your changes” | 原文“The more specific and concise your instructions…”及 Specificity 对照例子 | 官方一手文档 | 2026-07-11 | 高 | 为方向性建议，无量化遵循率 |
| 两条规则矛盾时模型可能任选其一 | 原文“if two rules contradict each other, Claude may pick one arbitrarily.” | 官方一手文档 | 2026-07-11 | 高 | 支撑“必须显式声明冲突优先级” |
| 单个 CLAUDE.md 建议控制在 200 行内，越长越占上下文、遵循度越低 | 官方 memory 文档 Size 段落 | 官方一手文档 | 2026-07-11 | 高 | 200 行为建议非硬校验 |
| Claude Code 读 CLAUDE.md 而非 AGENTS.md，可用 `@AGENTS.md` 导入或符号链接复用；`@path` 导入最大递归四跳 | 官方 memory 文档“AGENTS.md”“Import additional files” | 官方一手文档 | 2026-07-11 | 高 | 递归上限为四跳 |
| Codex 按“全局 ~/.codex → 项目根 → 走到 cwd”发现 AGENTS.md，根到叶拼接，越近越优先 | Codex 官方 AGENTS.md 指南“concatenates files from the root down… appear later in the combined prompt” | 官方一手文档 | 2026-07-11 | 高 | learn.chatgpt.com 托管，developers.openai.com 308 跳转 |
| Codex 合并指令有 32 KiB 上限（project_doc_max_bytes 默认 32 KiB），超限停止加入 | 官方指南“stops adding files once the combined size reaches… (32 KiB by default)” | 官方一手文档 | 2026-07-11 | 高 | 可在 config.toml 调整 |
| AGENTS.md 是开放格式、标准 Markdown、无必填字段，被 6 万多项目采用，由 Linux 基金会下 Agentic AI Foundation 托管；就近生效，用户 chat prompt 覆盖一切 | agents.md 官方站点 | 官方一手文档 | 2026-07-11 | 高 | 采用数为站点自述 |
| 确定性检查器对模糊 AGENTS.md 打 0/5、对可执行 AGENTS.md 打 5/5 | Showcase result.txt A 段，退出码 1 与 0 | 实测 | 2026-07-11 | 高 | 检查器只判维度可定位，不判内容是否明智 |
| 模糊指令导向的实现返回 `Sat, 11 Jul 2026`，被 `2026-07-11` 断言拒绝，3 条挂 2 条 | Showcase result.txt B 段 | 实测 | 2026-07-11 | 高 | 候选实现由作者手写代表导向，非模型输出 |
| 可执行指令导向的实现 3 条验收全过 | Showcase result.txt C 段，退出码 0 | 实测 | 2026-07-11 | 高 | 同上 |
| harness-engineering 橙皮书为教育性分享、注明署名，但未发布标准开源许可 | 仓库 README 许可核验；项目 visual-assets 许可矩阵 | 二手来源许可核验 | 2026-07-11 | 中 | 因此不复制其图片/成段文字，仅作主题地图链接 |

## 编辑综合（非事实，需标注）

- “指令层的五个可执行维度（目标/范围/顺序/验收/冲突优先级）”是对官方“具体、可验证”建议的操作化归纳，非官方术语。
- “优先级阶梯：安全与范围约束 > 显式任务指令 > 通用风格偏好”是基于官方分工与安全常识的编辑判断；其中“显式 prompt 覆盖一切”由 agents.md 直接支撑。
- Showcase 不构成任何模型排名；可复现的确定部分是验收 harness 与其真实输出。
