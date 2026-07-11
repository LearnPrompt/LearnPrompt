# 控制与核验记录

核验日期：2026-07-11。以下工件均由当前 writer 会话实际重跑；仓内只保留脱敏后的最小冻结结果。

## 浏览器验证边界

- Chrome for Testing 150：使用 `--load-extension` 对同一套 `fixture/extension/` 源码完成机械 22-check。
- official branded Chrome 150：不再把命令行 `--load-extension` 当作本文的机械证据，只保留 `chrome://extensions -> Load unpacked` 的人工验收边界说明。

## 本轮实际重跑

- 机械 22-check：已重跑 `showcase/verify-extension.mjs`，冻结输出见 `showcase/verify-output.txt`；摘要为 `SUMMARY PASS 22 checks`。
- SVG 视觉复检：已对公开 SVG 运行 `xmllint --noout`，并用 `sips` 渲染出 `visual-check/acceptance-to-popup-flow.png`；尺寸核对为 `1200 x 720`，人工检查三处原有越框文本均已回到框内/画布内。
- writer 阶段 partial validator 已通过；独立只读 follow-up 关闭全部 finding 后，最终 verified validator 也已通过，冻结输出见 `showcase/validator-output.txt`。
- 49 页构建：已重跑 `npm --prefix starlight run build`，冻结输出见 `showcase/build-output.txt`。
- diff check：已重跑允许修改路径上的 `git diff --check`，冻结输出见 `showcase/diff-check.txt`。

## Writer 边界

- 本文件只记录 writer 已完成的修正与重跑结果，不自评 PASS，不宣布 `verified`。
- 初审 `2 major / 1 minor` 是否全部关闭，留待独立 follow-up 会话判定。
