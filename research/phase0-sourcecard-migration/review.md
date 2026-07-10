# Phase 0 independent review

日期：2026-07-10
审稿器：Codex CLI 0.142.2 / `gpt-5.4` / medium / read-only / never approval

## 初审结论：FAIL

未关闭问题：blocker 0 / major 2 / minor 1。

### Major 1：validator 未检查二手主题地图标签

计划和文章契约要求把橙皮书明确标为二手主题地图，但初版 validator 只检查一手资料标识与许可/署名。这会放过把橙皮书当作事实权威的稿件。

处理：validator 在来源章节出现“橙皮书”时，额外要求“主题地图”“二手来源”或等价英文标签。

### Major 2：validator 未绑定 `research_path`

初版 validator 检查 frontmatter 中存在 `research_path`，却没有确认它与 `--research` 实际审计目录一致。文章可能指向过时目录仍然 PASS。

处理：将解析后的 `research_path` 规范化为绝对路径并与 `--research` 对比；同时要求 `showcase_path` 位于该研究目录内。

### Minor 1：选型文章 legacy 来源字段不成对

`choose-claude-code-or-codex.mdx` 的 `source_repo` 列出两个仓库，`source_url` 只指向 Codex 仓库，不符合迁移字段“成对且准确”的契约。

处理：legacy 元数据只记录与 URL 成对的 `alchaincyf/codex-orange-book`；两本实际使用的橙皮书仍完整保留在底部来源章节。

## 三篇文章初审

- `what-is-harness`：公开页迁移成立，来源、署名、研究证据和最终评分一致。
- `choose-claude-code-or-codex`：公开页迁移成立，只有 legacy frontmatter 元数据需修正。
- `five-moves`：公开页迁移成立，来源、MIT License、研究证据和最终评分一致。

## 复审状态

复审稿器：Codex CLI 0.142.2 / `gpt-5.4` / medium / read-only / never approval

## 复审结论：PASS

未关闭问题：blocker 0 / major 0 / minor 0。

初审问题闭环：

- Finding 1：已关闭。validator 强制橙皮书使用“主题地图”“二手来源”或等价英文标签；三篇文章均符合。
- Finding 2：已关闭。validator 将 frontmatter `research_path` 与 `--research` 绑定，并要求 `showcase_path` 位于该目录内；错目录负向测试按预期失败。
- Finding 3：已关闭。选型文章的 `source_repo` 与 `source_url` 已成对指向 Codex 橙皮书，两本实际使用的橙皮书仍保留在底部来源。

逐篇结论：

- `what-is-harness`：无 `SourceCard`；最终 H2 为来源；一手资料、主题地图和署名说明完整；原 review 最终 PASS。
- `choose-claude-code-or-codex`：无 `SourceCard`；最终 H2 为来源；两本橙皮书标为二手主题地图并保留 CC BY-NC-SA 4.0；原 review 最终 PASS。
- `five-moves`：无 `SourceCard`；最终 H2 为来源；橙皮书标为主题地图并保留 MIT License；原 review 最终 PASS。

Phase 1 readiness：YES。

最终状态：PASS
