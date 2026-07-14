# Showcase：第一次闭环（真实运行 + 确定性验收门）

## 这个 Showcase 证明什么

在一个可丢弃的最小 git 仓库里，把一个第一天该做的任务冻结成一句话，跑通
`盘点 → 冻结计划 → 最小改动 → 真实验收 → 检查 diff` 的闭环，并保存真实
before/after、验收命令、退出码、git diff 和一条失败路径。

本 Showcase 有两层证据，各自作用不同：

1. **真实 Claude Code 非交互会话**（`run-summary.txt`、`readme.diff`）：证明一个
   真实模型在冻结约束下产出了最小改动。
2. **确定性验收门**（`verify-first-loop.mjs`、`gate-output.txt`）：证明验收不依赖
   模型自述，任何人重跑都能得到相同 PASS/FAIL，并演示失败如何被挡回 PLAN/EDIT。

> 说明：第 1 层调用了在线模型，因此其自然语言产出不可逐字复现；第 2 层是纯
> 确定性脚本，才是可被读者一字不差重放的部分。两者不要混为一谈。

## 环境

- OS：Darwin（macOS）
- Node.js：v24.11.0
- Claude Code：2.1.206（native install，位于 `~/.local/bin/claude`）
- 认证：本机通过 API key 生效（原始日志顶部有一行 connectors 提示，属提示类别，
  不含任何密钥，已按类别脱敏，不逐字保留）。

## 一、可复现的练习仓库

`project/` 是练习仓库的初始状态（README 故意缺少本地运行说明）：

```text
project/
├── README.baseline.md   # 初始 README，只有标题和功能，没有运行说明
├── wordcount.js         # 纯函数 CLI，无依赖
├── test.js              # node 断言，作为验收命令
└── package.json         # scripts.test = "node test.js"
```

复现步骤：

```bash
SHOWCASE=/path/to/research/articles/install-and-first-project/showcase
mkdir wc && cd wc
cp "$SHOWCASE/project/"* .
cp "$SHOWCASE/verify-first-loop.mjs" .
mv README.baseline.md README.md
git init -q && git add -A && git commit -q -m "init"
git tag baseline   # 固定不可变基线，验收脚本始终与它比较
npm test          # 基线：all tests passed，exit 0
```

## 二、冻结任务

只用一句话把范围钉死：

```text
给 README.md 补齐一段本地运行说明（安装 / 运行 CLI / 跑测试）。
硬约束：不改代码逻辑（wordcount.js、test.js 不动），不新增依赖，只编辑 README.md。
```

## 三、真实运行

实际执行命令（原始日志写在 `$TMPDIR`，退出后才提取脱敏摘录）：

```bash
claude -p "<上面的冻结任务>" \
  --permission-mode acceptEdits \
  --allowedTools "Read Edit Bash(npm test) Bash(git diff)" \
  --model claude-haiku-4-5-20251001
# claude 退出码：0
```

这里的 `acceptEdits` 是为了把一次**受限的非交互归档运行**压成单条命令，并不是给新手
第一轮交互练习的默认推荐。它同时把 `--allowedTools` 收到读、改文件、`npm test` 和
`git diff`；第一次交互上手仍应使用 `manual/default`，陌生仓库先用 `plan` 盘点。

本次归档机器已经配置 API key，因此没有走 Quickstart 面向订阅用户的浏览器登录；
这只改变认证入口，不改变后面的权限、范围、验收与 diff 闭环。

模型只改了 README.md（见 `readme.diff`，+31 行），代码文件未动，脱敏后的模型自述见
`run-summary.txt`。

## 四、真实验收（退出码）

```bash
git diff --name-only          # 只有 README.md
git diff -- wordcount.js test.js package.json   # 空 → 代码/配置未改
npm test                      # all tests passed，exit 0
```

## 五、确定性验收门与失败路径

`verify-first-loop.mjs` 把上面的验收标准写成脚本，并始终与不可变的 `baseline` tag
比较：即使候选改动后来被提交，越界代码改动也不会因为 `HEAD` 前进而消失。读者可一字不差重放。
`gate-output.txt` 保存两次真实输出：

如果只想复现确定性门、不重新调用在线模型，在上面的 `wc/` 中应用已经冻结的真实 patch，
再运行刚才复制进来的脚本：

```bash
git apply "$SHOWCASE/readme.diff"
node verify-first-loop.mjs
```

- 好状态：3/3 通过，退出码 0，任务被接受。
- 失败路径：故意往 `wordcount.js` 追加一行代码后，门立即报
  `FAIL no-code-edit`，退出码 1，判定 task NOT accepted，回到 PLAN/EDIT；
  `git checkout -- wordcount.js` 撤销后重跑恢复 3/3。

这条失败路径说明：验收不是模型说完成就完成，而是由独立于执行者的检查决定。

## 复现限制

- 第一层用了 `claude-haiku-4-5-20251001` 在线模型，换模型 / 换日期，README 的
  措辞会不同，但冻结约束与验收门标准不变，`no-code-edit` 与 `check-passes`
  两项对任何模型都应成立。
- 门检查的是三条可观察事实（代码与 baseline 一致、README 相对 baseline 新增运行段、测试通过），不判断
  README 文案质量，那仍需人读。
- 本 Showcase 在一个玩具仓库演示闭环，不代表在大型真实仓库同样一次成功。
