# 控制与核验记录

## 一手来源核验（2026-07-11）

- Claude Code memory 文档：https://code.claude.com/docs/en/memory —— 逐条核对 CLAUDE.md 层级与载入、auto memory 存储路径/载入阈值（前 200 行或 25KB）/版本门槛 v2.1.59+/开关/审计、compaction 后重注入、AGENTS.md 关系、「何时写记忆」清单。
- 本机 Claude Code 2.1.206：`claude --help` 的 `--bare` 说明确认该模式会禁用 auto-memory，并跳过 CLAUDE.md 自动发现；这里不据此推断两者各自存在独立开关。
- 本机 codex-cli 0.142.2：`codex features list` 确认 `memories`(experimental=true)、`auto_compaction`(stable=true)、`chronicle`(under development=true)；`codex --help`/`codex resume --help` 确认会话 resume/fork/archive。
- 版本：`claude --version`=2.1.206；`codex --version`=codex-cli 0.142.2；`node --version`=v24.11.0；`sw_vers`=macOS 26.5.1。

## 产品不混淆声明

- Claude Code auto memory 与 Codex `memories` 是不同产品的不同实现，名字不同、行为不同。本文对 Codex `memories` 只陈述其为实验特性（有特性名），不臆测召回/淘汰语义。
- CLAUDE.md（Claude Code 读）与 AGENTS.md（Codex 读，Claude Code 需导入才读）分属两套指令机制，不互相等同。

## Showcase 核验

- `recall.mjs` / `run-session.mjs` 为「记忆读取纪律（相关性门控 + 过期淘汰）」的最小可复现模型，非任何产品本身；README 与正文均标注此限制。
- 原始日志在工作树外 `$TMPDIR` 采集，进程退出后冻结，脱敏摘录写入 result.txt。
- 脱敏核查：result.txt / README / memory-store 均无密钥、无 session id、无绝对路径、无用户私密历史。
