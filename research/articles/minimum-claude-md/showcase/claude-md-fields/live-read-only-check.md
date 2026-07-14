# 控制核验：真实只读会话确认项目指令被读到

字段完整度检查器（`check-claude-md.mjs`）只证明一件事：文件里写齐了五类必要信息。
它不能证明 Claude Code 真的把这份 CLAUDE.md 读进了上下文。为补上这一环，做了一次
受控的真实只读会话。

## 环境

- 工具: Claude Code CLI 2.1.206（`claude --version`）
- 运行日期: 2026-07-11
- 模式: 在线模型，headless（`claude -p`），`--allowedTools ""`（不授予任何写工具，只读）
- 模型: 使用当时认证环境的默认模型，未固定 model id；因此自然语言措辞不可保证逐字复现
- 工程: 工作树外新建的最小 git 仓库，含一份带「金丝雀令牌」的 CLAUDE.md 和一个 README.md

目录结构：

```text
claude-md-live-demo/
├── CLAUDE.md
└── README.md
```

## 输入

项目根目录的 CLAUDE.md 关键片段（含一个独一无二的令牌，便于判断是否被加载）：

```md
## Commands
- Test: `npm run check`

## Do Not Edit
- 不要修改或提交 `.env`；不要动 `secrets/` 目录。

## Output
- 每次回复结尾必须原样输出这个令牌: FIELDS-LOADED-7Q2
```

`README.md` 只有项目名与一句描述，不包含测试命令、禁区或金丝雀令牌。

发出的提示（只读，不允许改文件）：

```text
不要编辑或创建任何文件。只根据项目规则回答：这个项目的测试命令是什么？哪些路径是禁区？
```

## 精确运行与退出码捕获

下面是本次归档使用的完整复现步骤。`timeout` 只负责给进程设置 90 秒上限；系统没有该命令时可以去掉，不改变提示与工具权限。

```bash
demo="$TMPDIR/claude-md-live-demo"
mkdir -p "$demo"
cd "$demo"
git init -q

cat > CLAUDE.md <<'EOF'
# Project Rules

一个把 Markdown 转成 HTML 的小工具。

## Commands
- Test: `npm run check`

## Do Not Edit
- 不要修改或提交 `.env`；不要动 `secrets/` 目录。

## Output
- 每次回复结尾必须原样输出这个令牌: FIELDS-LOADED-7Q2
EOF

printf '# md2html\n\nA tiny Markdown to HTML tool.\n' > README.md
raw="$TMPDIR/claude-md-live-raw.txt"

set +e
timeout 90 claude -p \
  "不要编辑或创建任何文件。只根据项目规则回答：这个项目的测试命令是什么？哪些路径是禁区？" \
  --allowedTools "" > "$raw" 2>/dev/null
run_rc=$?
set -e
printf 'exit=%s\n' "$run_rc"
```

本次 `run_rc=0`。原始输出先留在工作树外，进程退出后才读取、检查并冻结下面的最小摘录。

## 实际输出（原样，未改写）

```text
项目测试命令：`npm run check`

禁区路径：`.env` 文件（不要修改或提交），以及 `secrets/` 目录（不要动）。

FIELDS-LOADED-7Q2
```

退出码: 0

## 这次运行证明了什么

- CLAUDE.md 在会话开始时被加载进上下文：模型准确复述了测试命令和两个禁区路径。
- 结尾原样输出了金丝雀令牌 `FIELDS-LOADED-7Q2`。在这个受控 fixture 中，测试命令、
  禁区和令牌都只存在于 CLAUDE.md；三者同时命中，是该次会话读取文件的强证据。

## 这次运行没有证明什么（披露）

- 这是一次在线模型的单次受控运行，不是基准测试，也不给任何模型排名。
- 本次没有固定 model id；换时间或默认模型后，自然语言措辞可能变化，复现目标应是读取同一三类项目事实，而非逐字相同。
- 官方文档明确说明 CLAUDE.md 是 context 而非 enforced configuration，
  单次遵守不代表长期、跨任务一定遵守。要硬性阻止某个动作，应使用 PreToolUse hook。
- 令牌复现属于「刻意设计的可观察信号」，用于确认加载，而不是宣称模型总会照做。
- 原始输出先写入工作树之外的临时文件，确认不含绝对路径、账号或会话标识后，
  才把这段最小脱敏摘录纳入研究包。
