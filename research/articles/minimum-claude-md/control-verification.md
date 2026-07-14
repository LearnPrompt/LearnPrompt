# 控制与核验记录

核验日期：2026-07-11。

## 一手事实

- 官方 `code.claude.com/docs/en/memory` 实时页面明确：CLAUDE.md 是每轮读入的 context，不是 enforced configuration；单文件建议控制在 200 行以内。
- 同一官方页面现场原文为 `maximum depth of four hops`。任务卡中的“五跳”来自陈旧检索摘要，正文与证据台账均以官方实时原页的“四跳”为准。
- 本机 `claude --version` 为 2.1.206；`claude --help` 的 `--bare` 说明会跳过 CLAUDE.md 自动发现和 auto-memory，用于确认默认加载机制的存在，不据此推断未公开的内部实现。

## Showcase 控制复现

- `node check-claude-md.mjs vague-notes/CLAUDE.md`：五类字段全部 FAIL，退出码 1。
- `node check-claude-md.mjs minimal/CLAUDE.md`：五类字段全部 PASS，退出码 0。
- 检查器只验证字段完整度与具体性，不代表模型遵循度，也不证明规则内容本身正确。
- 另行运行一次真实在线 Claude Code 只读会话：模型复述了仅存在于项目 CLAUDE.md 的测试命令、禁区和金丝雀令牌，退出码 0。该单次运行只证明文件在那次会话中被加载，不构成长期遵循保证或模型排名。
- 精确命令、fixture 目录、退出码捕获和复现限制已冻结在 `showcase/claude-md-fields/live-read-only-check.md`；原始输出先写在工作树外的 `$TMPDIR`，进程结束并完成脱敏检查后才进入研究包。

## 发布前机械门禁

- 单篇 validator：`PASS article`、`PASS research`、`PASS status: partial`；冻结命令与关键输出见 `release-gate-result.txt`。
- 两个静态 Showcase 分支：空泛文件退出码 1，最小文件退出码 0，与冻结结果一致。
- `npm --prefix starlight run build`：49 页构建成功；冻结摘录见 `release-gate-result.txt`。
- `git diff --check`：通过；退出码记录见 `release-gate-result.txt`。
- 当前仍等待独立只读 reviewer；writer 未自评、未写质量分或 PASS。
