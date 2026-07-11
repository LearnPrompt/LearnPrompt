# asset-ledger.md — 图片台账

| Public path | Teaching purpose | Original source | Creator | License | Modifications | Verified at |
| --- | --- | --- | --- | --- | --- | --- |
| /images/articles/chrome-extension-prototype/acceptance-to-popup-flow.svg | 解释从验收标准反推出最小 MV3 结构的链路：用户动作如何触发 `activeTab`，service worker 如何调用 `scripting.executeScript()`，结果怎样写入 `storage.local`，popup 如何只读展示最近状态，以及为什么 `tabs` 与 `<all_urls>` 属于越权选项 | 原创示意图，直接可视化 `vertical-research.md` 的机制拆解与 `showcase/verify-output.txt` 的成功/失败判定点 | LearnPrompt 编辑部 | CC BY-NC-SA 4.0（本仓库许可） | 原创绘制；2026-07-11 follow-up 调整中上说明、右上权限 pill、右下受限页 pill 的换行与尺寸，并通过 XML 与 1200x720 PNG 复检 | 2026-07-11 |

## 说明

- 本图是教学图，不是封面或装饰图。
- 图中只使用本文已经验证过的结构与权限，没有额外引入第三方产品截图，因此无需单独外部视觉授权。
- 提交前需用 `xmllint --noout` 检查 SVG 为合法 XML。

## 非公开复检工件

- `research/articles/chrome-extension-prototype/visual-check/acceptance-to-popup-flow.png`：由 `sips` 从公开 SVG 渲染出的 1200x720 PNG，仅用于人工检查文字是否落在框/画布内。
- `research/articles/chrome-extension-prototype/visual-check/acceptance-to-popup-flow-check.md`：记录 `xmllint`、`sips`、尺寸核对与人工视觉检查结论；不进入公开图片目录。
