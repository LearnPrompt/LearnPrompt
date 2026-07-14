# evidence-ledger.md — 事实与证据台账

| Claim | Evidence | Evidence type | Verification date | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- |
| Claude Code 现在可在 terminal、IDE、desktop、browser 多入口运行 | Claude Code Overview 官方文档 | 官方产品文档 | 2026-07-11 | 高 | 文档证明可用入口，不证明某个具体工作流最优 |
| Native Install 是当前推荐安装路径 | Claude Code Overview / Quickstart 官方文档 | 官方产品文档 | 2026-07-11 | 高 | 版本后续可能变化，需要重查 |
| `plan` 模式只做研究与计划，不改源文件 | Claude Code permission modes / best practices 官方文档 | 官方产品文档 | 2026-07-11 | 高 | 不代表每个小任务都必须先 plan |
| `acceptEdits` 适合先让 Claude 改，再用 diff 审查 | Claude Code permission modes 官方文档 | 官方产品文档 | 2026-07-11 | 高 | 是否适合仍取决于任务风险 |
| `activeTab` 在用户调用扩展时给予当前页临时权限，且不触发权限 warning | Chrome `activeTab` 官方文档 | 官方平台文档 | 2026-07-11 | 高 | 仅限当前页、受限页仍会失败 |
| `chrome.scripting` 可配合 `activeTab` 读取当前页而不声明常驻 host 权限 | Chrome `scripting` 官方文档 | 官方平台文档 | 2026-07-11 | 高 | 仍需明确用户触发动作 |
| `tabs` 权限主要关联 `tabs.Tab` 的敏感字段，如 title、url | Chrome `tabs` 官方文档 | 官方平台文档 | 2026-07-11 | 高 | 某些更复杂用例仍可能需要 `tabs` |
| `storage.local` 适合保存扩展本地状态，且不同于网页 `localStorage` | Chrome `storage` 官方文档 | 官方平台文档 | 2026-07-11 | 高 | 不适合跨设备同步 |
| MV3 service worker 按需运行，不再是长期 background page | Chrome MV3 官方文档 | 官方平台文档 | 2026-07-11 | 高 | 不代表每个原型都必须在 worker 中放核心逻辑 |
| MV3 不允许依赖远程托管 JS 作为扩展逻辑 | Chrome MV3 / CSP 官方文档 | 官方平台文档 | 2026-07-11 | 高 | 允许取数据，不允许把远程代码当扩展逻辑执行 |
| 新 headless 模式支持加载扩展 | Chrome end-to-end testing 官方文档 | 官方平台文档 | 2026-07-11 | 高 | 自动化库仍可能在 popup 操作上有限制 |
| Popup 可通过 `action.openPopup()` 打开；测试 popup 时可考虑 tab ID override | Chrome popup / end-to-end testing 官方文档 | 官方平台文档 | 2026-07-11 | 高 | override 只解决“目标 tab 识别”，不自动扩大 host 权限 |
| Chrome branded builds 从 Chrome 137 开始移除 `--load-extension`，Chromium / Chrome for Testing 继续支持 | Chrome Extensions June 2025 官方博文 + Chromium Extensions 邮件列表 PSA | 官方平台文档 | 2026-07-11 | 高 | 这是命令行加载边界，不影响 branded Chrome 手动 Load unpacked |
| 本机 official branded Chrome 150.0.7871.115 的版本已现场核对，本文把它作为 `chrome://extensions -> Load unpacked` 的人工验收对象，而不是机械 `--load-extension` 证据 | 本机 `Google Chrome --version` + `showcase/chrome-branded-load-note.txt` | 本机命令 + 现场说明 | 2026-07-11 | 高 | 本机版本与人工验收边界都是时点事实 |
| Chrome for Testing 150.0.7871.115 继续支持 `--load-extension`，并完成了这篇 Showcase 的机械 22-check | `showcase/verify-output.txt` + `showcase/README.md` + `control-verification.md` | 真实运行 + 冻结工件 | 2026-07-11 | 高 | 自动化依赖工作树外 Puppeteer 依赖与 Chrome for Testing |
| branded Chrome 150.0.7871.115 上，命令行 `--load-extension` 不再作为这篇文章的机械加载路径；本轮只保留 `chrome://extensions -> Load unpacked` 的人工说明 | `showcase/chrome-branded-load-note.txt` + `control-verification.md` | 现场观察 + 脱敏证据 | 2026-07-11 | 中高 | 这是本机 / 当日观察，不代表其他版本或企业策略完全相同 |
| Showcase 使用 Node.js v24.11.0 / npm 11.6.1 | 本机 `node -v && npm -v` | 本机命令 | 2026-07-11 | 高 | 本机版本是时点事实 |
| 主扩展 manifest 只申请 `activeTab`、`scripting`、`storage`，无 `tabs`、`host_permissions`、`unlimitedStorage` | `showcase/fixture/extension/manifest.json` 与 `verify-extension.mjs` 审计输出 | 仓库工件 + 确定性检查 | 2026-07-11 | 高 | 只证明这个 fixture 如此设计 |
| 真实扩展可在 fixture 页面抓到标题、URL 与选中文本并存入 `chrome.storage.local` | `showcase/verify-output.txt` 成功路径；`verify-extension.mjs` 浏览器自动化 | 真实运行 + 确定性检查 | 2026-07-11 | 高 | 在线自动化依赖本机 Chrome 与临时 Puppeteer 依赖 |
| 受限页会触发抓取失败，而不是悄悄成功 | `showcase/verify-output.txt` 失败路径 | 真实运行 + 确定性检查 | 2026-07-11 | 高 | 具体报错文本可能随 Chrome 版本变化 |
| 存在一个故意越权的 manifest 负例，检查会把它判为 FAIL | `showcase/fixture/negative/manifest-overreach.json` 与 `verify-output.txt` | 负例工件 + 确定性检查 | 2026-07-11 | 高 | 负例证明“为什么不该这样做”，不证明所有生产场景都永远不需要这些权限 |
| 公开 SVG 在 1200x720 PNG 复检中无文字越框或越画布 | `visual-check/acceptance-to-popup-flow.png` + `visual-check/acceptance-to-popup-flow-check.md` | 非公开视觉复检工件 | 2026-07-11 | 高 | 这是人工视觉检查，不替代独立 reviewer 的终审 |
| writer 阶段停在 `partial`；独立只读 follow-up 关闭 2 major / 1 minor 后，正文升为 `verified` 96/100 | 文章 frontmatter 与 `review.md` | 仓库工件 | 2026-07-11 | 高 | 分数与最终状态来自 reviewer，不是 writer 自评 |
