# Control Verification — content-automation-pipeline

本文件记录 writer 阶段真实执行的机械验证，以及独立只读 follow-up 关闭全部 finding 后的最终 verified 门禁；机械结果本身不替代 reviewer verdict。

主分支最终重放还验证了生成器的 EOF 稳定性：草稿以恰好一个换行结尾，重复执行一键 Showcase 后冻结结果无 diff；独立只读窄审 PASS（0/0/0）。

## 1. 一键 Showcase 四场景

命令：

```bash
node research/articles/content-automation-pipeline/showcase/weekly-brief-pipeline/scripts/verify-showcase.mjs
```

结果：

- `success`：退出码 `0`
  - 关键摘录见 `showcase/weekly-brief-pipeline/results/success/command-summary.txt`
  - 关键工件：
    - `results/success/drafts/2026-07-11-dual-source-ai-weekly.md`
    - `results/success/approve.manifest.json`
    - `results/success/publish-candidate/2026-07-11-dual-source-ai-weekly.md`
- `missing-source-field`：退出码 `21`
  - 关键摘录见 `showcase/weekly-brief-pipeline/results/missing-source-field/command-summary.txt`
  - 关键工件：
    - `results/missing-source-field/normalize.manifest.json`
    - `results/missing-source-field/pipeline-state.json`
- `verify-failed`：退出码 `23`
  - 关键摘录见 `showcase/weekly-brief-pipeline/results/verify-failed/command-summary.txt`
  - 关键工件：
    - `results/verify-failed/draft.manifest.json`
    - `results/verify-failed/verify.manifest.json`
    - `results/verify-failed/pipeline-state.json`
- `no-approval`：退出码 `31`
  - 关键摘录见 `showcase/weekly-brief-pipeline/results/no-approval/command-summary.txt`
  - 关键工件：
    - `results/no-approval/drafts/2026-07-11-dual-source-ai-weekly.md`
    - `results/no-approval/approve.manifest.json`

根层汇总：`showcase/weekly-brief-pipeline/results/run-result.txt`

## 2. 单篇 validator(partial)

命令：

```bash
node .claude/skills/learnprompt-single-mdx/scripts/validate-golden-mdx.mjs \
  --article starlight/src/content/docs/claude-code/content-automation-pipeline.mdx \
  --research research/articles/content-automation-pipeline
```

结果：

- 退出码：`0`
- 摘录：

```text
PASS article: starlight/src/content/docs/claude-code/content-automation-pipeline.mdx
PASS research: research/articles/content-automation-pipeline
PASS status: verified (100/100)
```

归档：`validator-output.txt`

## 3. Starlight build

命令：

```bash
npm --prefix starlight run build
```

结果：

- 退出码：`0`
- 脱敏摘录：

```text
> learnprompt-starlight@0.1.0 build
> ASTRO_TELEMETRY_DISABLED=1 astro build
21:23:39   ├─ /claude-code/content-automation-pipeline/index.html (+5ms)
21:23:39 [starlight:pagefind] Found 49 HTML files.
21:23:39 [build] 49 page(s) built in 2.35s
21:23:39 [build] Complete!
```

归档：`build-output.txt`

## 4. diff check

命令：

```bash
git status --short --untracked-files=all -- \
  starlight/src/content/docs/claude-code/content-automation-pipeline.mdx \
  research/articles/content-automation-pipeline \
  starlight/public/images/articles/content-automation-pipeline

git diff --stat -- \
  starlight/src/content/docs/claude-code/content-automation-pipeline.mdx \
  research/articles/content-automation-pipeline \
  starlight/public/images/articles/content-automation-pipeline

git diff --check -- \
  starlight/src/content/docs/claude-code/content-automation-pipeline.mdx \
  research/articles/content-automation-pipeline \
  starlight/public/images/articles/content-automation-pipeline
```

结果：

- 所有变更都落在允许路径内。
- `git diff --stat` 对 tracked 文件显示：

```text
.../claude-code/content-automation-pipeline.mdx    | 439 ++++++++++++++++++++-
1 file changed, 420 insertions(+), 19 deletions(-)
```

- `git diff --check` 无输出。
- 完整冻结记录见 `diff-check.txt`。

## 5. 教学图视觉复检

命令：

```bash
sips -s format png \
  starlight/public/images/articles/content-automation-pipeline/pipeline-state-gates.svg \
  --out research/articles/content-automation-pipeline/pipeline-state-gates-visual-check.png
```

结果：

- 生成 PNG：`pipeline-state-gates-visual-check.png`
- 尺寸：`1280 x 860`
- 人工复检：success-path 面板里的 provenance 说明行没有越界。
- 人工复检：底部 provenance 说明行保持在下方面板内。
- 人工复检：A / B / C 三个失败分支卡片彼此独立，没有互相侵入。

归档：`visual-check.txt`

## 原始日志策略

- 一键脚本先在 `os.tmpdir()` 隔离目录分别写出四场景 raw stdout / stderr；任一 raw 写入失败时，不更新 `command-summary.txt` 或 `run-result.txt`。
- 只有 raw 写成功后，脚本才会从 raw 文件读回内容，移除 session / request ID 与绝对 tmp 路径，并按 80 行 / 6000 字符裁剪。
- `command-summary.txt` 与根层 `run-result.txt` 都只由一键脚本回填；脚本会在 `finally` 中清理 raw 目录。
