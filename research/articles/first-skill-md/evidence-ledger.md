# 证据台账：第一个 SKILL.md 怎么写

| 主张 | 证据 | 证据类型 | 核验日期 | 置信度 | 局限 |
| --- | --- | --- | --- | --- | --- |
| 每个 Skill 必须有带 YAML frontmatter 的 SKILL.md，必填 name 与 description | 官方 Agent Skills 文档“Skill structure” | 官方一手文档 | 2026-07-11 | 高 | 文档会更新，需按发布日复核 |
| name：≤64 字符、仅小写字母/数字/连字符、不含 XML 标签、不含保留词 anthropic/claude | 官方文档“Field requirements” | 官方一手文档 | 2026-07-11 | 高 | 脚本的 kebab-case 正则会排除尖括号，但未单独检查保留词 |
| description：非空、≤1024 字符、不含 XML 标签 | 官方文档“Field requirements” + quick_validate.py | 官方一手文档 + 可运行脚本 | 2026-07-11 | 高 | 当前脚本明确拒绝 `<`/`>` |
| 三级加载：Level1 元数据约 100 tokens/个、始终加载；Level2 正文低于 5k tokens、触发后加载；Level3 资源近似无限、按需/经 bash | 官方文档“Three types...”与加载表 | 官方一手文档 | 2026-07-11 | 高 | token 数为官方给出的量级参考，非精确计费 |
| 发现机制：name 与 description 始终加载；请求匹配 Skill 的 description 后，Claude 用 bash 读 SKILL.md | 官方文档“How Skills work / Example” | 官方一手文档 | 2026-07-11 | 高 | description 是主要匹配依据；实际准确率未量化 |
| Claude Code 的 Skill 放在 ~/.claude/skills/ 或 .claude/skills/ | 官方文档“Sharing scope / Claude Code” | 官方一手文档 | 2026-07-11 | 高 | 仅 Claude Code 语境 |
| skill-creator 允许字段集合={name,description,license,allowed-tools,metadata,compatibility} | commit `9d2f1ae` 的 quick_validate.py 第 42 行；Showcase extra-key 反例被拒 | 可运行脚本 + 实测 | 2026-07-11 | 高 | compatibility 可选、字符串、≤500 |
| name 违反 kebab-case 会被校验拒绝 | Showcase bad-name 反例，退出码 1 | 实测 | 2026-07-11 | 高 | 见 showcase/minimal-skill/result.txt |
| 缺 description 会被校验拒绝 | Showcase no-desc 反例，退出码 1 | 实测 | 2026-07-11 | 高 | 同上 |
| 打包会先校验再产出 .skill（zip） | package_skill.py 调用 validate_skill；Showcase 打包输出与 unzip -l | 可运行脚本 + 实测 | 2026-07-11 | 高 | .skill 即带扩展名的 zip |
| skill-creator 属于 anthropics/skills，其目录采用 Apache License 2.0 | 官方仓库 remote + `skills/skill-creator/LICENSE.txt`，commit `9d2f1ae` | 一手仓库元数据 | 2026-07-11 | 高 | 许可针对 skill-creator 目录，未外推整个仓库 |
| SKILL.md 正文建议控制在 500 行内、Concise is key、按脆弱度设自由度 | skill-creator SKILL.md“Core Principles / Progressive Disclosure” | 官方一手文档 | 2026-07-11 | 高 | 为设计建议非硬性校验 |
| agent-skills 橙皮书无标准开源许可，README 声明仅个人/教育用途、未经许可不得商用再分发 | 仓库 README 许可核验 | 二手来源许可核验 | 2026-07-11 | 中 | 因此不复制其图片/成段文字 |

## 编辑综合（非事实，需标注）

- “把长脚本放 scripts/、正文只留工作流”是对官方三级加载原则的操作化推论。
- “第一个 Skill 失败八成是触发器与边界问题”是基于机制的编辑判断，非官方结论。
