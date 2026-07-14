# SKILL.md frontmatter 反例集合

这三个目录各自复现一种被官方校验规则拒绝的写法。每个 `SKILL.md`
都能被 skill-creator 的 `quick_validate.py` 判为 invalid，用来说明触发器
（name / description）不是自由文本，而是有硬边界的字段。

- `bad-name/`：`name` 用了空格与大写，违反 kebab-case 规则。
- `extra-key/`：加入了 `version` 这个不在允许集合内的字段。
- `no-desc/`：缺少必填的 `description`。

复现命令见上一级 `../README.md`。原始运行输出（脱敏后）见 `../result.txt`。
