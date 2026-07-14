# Real workflow comparison

验证日期：2026-07-10

这次不再让两个工具做抽象的只读仓库扫描，而是在两个隔离 worktree 中完成同一个真实任务：把现有 `project-checklist.mdx` 从短清单改成一篇可执行教程，并通过 Starlight 构建。

## 固定条件

- 基线提交：`038bcd5`
- 两个 detached worktree，彼此不共享改动
- 目标文件相同：`starlight/src/content/docs/ai-coding/project-checklist.mdx`
- 最终验收相同：只修改一个 MDX，`cd starlight && npm run build` 退出码为 0
- Node.js：v24.11.0
- Claude Code：2.1.206，Sonnet
- Codex CLI：0.142.2，`gpt-5.4`，medium reasoning

两个 worktree 都用 `npm ci` 安装锁定依赖。安装报告 4 个既有依赖漏洞；本次文章任务没有运行自动修复，以免扩大改动范围。

## 两条路线

- `claude-code/`：先给一个模糊方向，只读诊断并提出澄清问题；编辑者回答后再执行。保留会话续接、插件干扰、窄工具重试和最终构建记录。
- `codex/`：把澄清后的决定冻结成完整 brief，一次委派，允许修改目标文件和运行构建。

比较对象是工作流，不是模型智力、速度或文字质量。提示词、模型、工具权限和执行 Harness 均不相同，不能由此做产品跑分。

详见 `comparison.md` 与两侧结果记录。

## 可审计工件

- `frozen-brief.md`：问题、编辑回答与最终任务卡的映射。
- `command-log.md`：关键命令和真实失败摘录。
- `outputs/`：两个隔离 worktree 最终生成的完整 MDX，不参与站点构建。
- `claude-code/` 与 `codex/`：各自的执行、diff、哈希和构建记录。
