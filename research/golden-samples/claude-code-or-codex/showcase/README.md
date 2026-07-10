# Claude Code / Codex same-task showcase

验证环境：2026-07-10，macOS，本仓库 `main` 分支，执行前工作树干净。分支、提交和状态记录见 `environment.txt`。

CLI 版本：

```text
claude: 2.1.206 (Claude Code)
codex: codex-cli 0.142.2
```

运行命令：

```bash
claude -p --permission-mode plan --tools "Read,Glob,Grep,Bash" \
  --no-session-persistence --output-format json "<prompt.md 中的提示词>"

codex -m gpt-5.4 -s read-only -a never exec \
  --ephemeral --json "<prompt.md 中的提示词>"
```

Codex 首次使用本地默认模型运行时发生版本兼容错误，记录在 `codex-first-attempt.txt`。没有为这次文章擅自升级全局 CLI，而是显式选择本机已缓存且兼容的模型继续。

## 如何阅读结果

- 两边都识别出当前站点是 `starlight/`，根目录还保留旧 Docusaurus。
- 两边都把 `cd starlight && npm run build` 视为核心验收路径。
- Claude 读到了 `starlight/astro.config.mjs`，Codex 更明确地列出新旧首页入口。
- 模型、内部策略、缓存和运行时间没有受控，所以结果不能用于速度或能力排名。
- Claude 使用当时默认模型与显式工具白名单；Codex 在默认模型失败后显式使用 `gpt-5.4`。这不是同配置 A/B 测试。
