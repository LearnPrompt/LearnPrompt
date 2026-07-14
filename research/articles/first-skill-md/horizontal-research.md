# 横向研究：写第一个 SKILL.md

对比三类来源，标明各自能支撑什么、不能证明什么。

## 1. 官方 Agent Skills 文档（一手，权威）

- 链接：https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
  （`docs.claude.com/...` 会 302 跳到 `platform.claude.com/...`，2026-07-11 核验）
- 支撑：
  - 结构：每个 Skill 必须有带 YAML frontmatter 的 `SKILL.md`；必填字段 `name`、`description`。
  - 字段约束：`name` 最多 64 字符、仅小写字母/数字/连字符、不得含 XML 标签、不得含保留词
    `anthropic` / `claude`；`description` 非空、最多 1024 字符、不得含 XML 标签。
  - 三级渐进披露与量级：Level 1 元数据（约 100 tokens/个，启动时始终加载）；
    Level 2 正文（低于 5k tokens，触发后加载）；Level 3 资源与脚本（近似无限，按需/经 bash 执行）。
  - 触发机制：`description` 与用户请求匹配后，Claude 用 bash 读取 `SKILL.md`。
  - 安全：应只用可信来源的 Skill；恶意 Skill 可诱导工具滥用与数据外泄。
  - Claude Code 的 Skill 放在 `~/.claude/skills/`（个人）或 `.claude/skills/`（项目）。
- 不能证明：具体某个 `description` 在真实对话里的触发准确率；也不给“最佳目录结构”的唯一答案。

## 2. 官方 skill-creator（一手，可运行）

- 来源：`anthropics/skills` 仓库的 `skills/skill-creator`
  （https://github.com/anthropics/skills/tree/9d2f1ae187231d8199c64b5b762e1bdf2244733d/skills/skill-creator ，目录内 `LICENSE.txt` 为 Apache License 2.0，commit `9d2f1ae`，2026-07-11 核验）。
- 支撑：
  - 设计原则：Concise is key、按脆弱度设置自由度、三级渐进披露、SKILL.md 正文建议 500 行内。
  - 结构：`SKILL.md`（必需）+ 可选 `scripts/`、`references/`、`assets/`；不要塞 README/CHANGELOG 之类附属文档。
  - 可运行校验（`scripts/quick_validate.py`）：允许字段集合 = {name, description, license, allowed-tools, metadata, compatibility}；
    `name` 匹配 `^[a-z0-9-]+$`、不得首尾连字符或连续连字符、≤64；`description` 非空、不含 `<`/`>`、≤1024；可选 `compatibility` 必须是字符串且≤500。
  - 打包（`scripts/package_skill.py`）：先调用校验，通过后把目录打成 `.skill`（zip）。
- 不能证明：`quick_validate.py` 仍是官方约束的子集实现——kebab-case 正则会排除 `name` 中的尖括号，但脚本没有单独拒绝保留词 `anthropic` / `claude`。
  因此“本地校验通过”不等于覆盖了官方文档的全部语义约束，权威约束仍以文档为准。

## 3. agent-skills 橙皮书（二手，仅作主题地图）

- 链接：https://github.com/alchaincyf/agent-skills-orange-book
- 许可核验（2026-07-11）：仓库未采用标准开源许可，README 声明仅供个人与教育用途、
  未经许可不得商用再分发。因此不复制、不改编其任何图片或成段文字。
- 用途：作为中文主题地图，说明“第一个 Skill、触发规则、目录结构”这类选题在中文社区的组织方式。
- 不能证明：不能作为当前产品行为或字段约束的权威来源；相关事实全部改用官方文档与可运行脚本核验。

## 结论

字段约束、三级加载、触发机制以官方文档为准；可运行边界用 skill-creator 脚本亲手验证；
橙皮书只保留为主题地图链接，不进入事实链，也不复制其视觉资产。
