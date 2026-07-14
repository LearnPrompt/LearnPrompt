# Minimal SKILL.md Showcase

这个 Showcase 让读者亲手走完“写一个最小 Skill → 校验 → 打包”的闭环，
而不是只看抽象模板。它证明一个事实：`SKILL.md` 的 frontmatter 不是自由文本，
`name` 和 `description` 有官方硬边界，写错就会在打包前被挡下。

## 目录

```text
minimal-skill/
├── link-to-obsidian/
│   └── SKILL.md            # 合法的最小 Skill
├── invalid-cases/
│   ├── bad-name/SKILL.md   # name 含空格与大写
│   ├── extra-key/SKILL.md  # 混入不允许的 version 字段
│   └── no-desc/SKILL.md    # 缺少必填 description
└── result.txt              # 冻结的真实运行输出（已脱敏）
```

## 环境

- macOS，Python 3。
- 校验与打包脚本来自官方 `anthropics/skills` 仓库里的 `skill-creator`
  （其目录内 `LICENSE.txt` 为 Apache License 2.0，commit `9d2f1ae`，2026-07-11 核验）。
- 用 `SC_ROOT` 指向该仓库的 `skills/skill-creator` 目录，`SHOWCASE` 指向本目录。

## 复现步骤

```bash
# 1. 校验合法 Skill（应输出 Skill is valid! 且退出码 0）
python3 "$SC_ROOT/scripts/quick_validate.py" link-to-obsidian

# 2. 逐个校验反例（每个都应非零退出，并打印具体原因）
python3 "$SC_ROOT/scripts/quick_validate.py" invalid-cases/bad-name
python3 "$SC_ROOT/scripts/quick_validate.py" invalid-cases/extra-key
python3 "$SC_ROOT/scripts/quick_validate.py" invalid-cases/no-desc

# 3. 打包合法 Skill 到仓库外的输出目录（会先自动校验再打包）
(cd "$SC_ROOT" && python3 -m scripts.package_skill "$SHOWCASE/link-to-obsidian" "$DIST")

# 4. 查看 .skill 的内容
unzip -l "$DIST/link-to-obsidian.skill"
```

## 2026-07-11 的真实结果

- 合法 Skill：`Skill is valid!`，退出码 0。
- `bad-name`：被 kebab-case 规则拒绝。
- `extra-key`：`version` 不在允许字段集合内（allowed-tools、compatibility、description、license、metadata、name）被拒。
- `no-desc`：缺少必填 `description` 被拒。
- 打包成功，`.skill` 是一个 zip，内含 `link-to-obsidian/SKILL.md`。

完整脱敏输出见 `result.txt`。

## 它证明了什么

- `name` 必须是小写字母、数字、连字符组成的 kebab-case。
- frontmatter 只接受受限字段集合，随手加字段会被拒。
- `description` 必填。
- 打包前会强制校验，校验不过就不产出 `.skill`。

## 它没有证明什么

- 校验通过只保证字段格式合规，不代表 `description` 真的能让 Agent 在正确
  场景触发，也不代表工作流写得好。
- 当前 `quick_validate.py` 会拒绝 `description` 中的尖括号，并用 kebab-case 正则排除 `name` 中的尖括号；
  但它没有单独拒绝 `name` 中的保留词 `anthropic` / `claude`。
  因此本地通过仍不等于覆盖官方文档的全部语义约束（见文章证据台账）。
- 触发准确率、进阶结构和长期可维护性，需要真实使用与迭代来验证。
