# Showcase：当前页阅读卡（真实扩展 + 本机 Chrome 验证）

## 这个 Showcase 证明什么

它证明的不是“Claude Code 自动写前端很神”，而是下面这条更实用的命题：

> 当你先把验收标准冻结成“抓当前页标题、URL、可选选中文本，存进 `chrome.storage.local`，并在 popup 显示最近一次结果”，Claude Code 就能被约束在一个足够小、可验证、权限克制的 MV3 扩展原型里。

本 Showcase 分成三层证据：

1. **真实 extension 源码**：`fixture/extension/`
2. **真实浏览器验证**：`verify-extension.mjs` + `verify-output.txt`（`SUMMARY PASS 22 checks`）
3. **负例**：受限页抓取失败、以及越权 manifest 审计失败

## 目录

```text
showcase/
├── README.md
├── verify-extension.mjs
├── verify-output.txt
├── chrome-branded-load-note.txt
└── fixture/
    ├── extension/
    │   ├── manifest.json
    │   ├── background.js
    │   ├── popup.html
    │   ├── popup.css
    │   └── popup.js
    ├── negative/
    │   └── manifest-overreach.json
    └── page.html
```

## 设计要点

- **功能最小化**：只抓一个页面的一张阅读卡，不做批量抓取、站外同步、账号体系。
- **权限最小化**：只声明 `activeTab`、`scripting`、`storage`。
- **显式触发**：用户按快捷键后，扩展才读取当前页。
- **本地持久化**：最近一次成功结果与最近一次运行状态一起写入 `chrome.storage.local`。
- **负例前置**：
  - 受限页（例如 `chrome://extensions`）抓取失败，popup 给出错误状态。
  - 一个故意写坏的 manifest 负例会被确定性检查判为越权。

## 环境

- OS：macOS（Darwin）
- 本机 branded Chrome：`/Applications/Google Chrome.app`，版本 `150.0.7871.115`
- 机械自动化浏览器：Chrome for Testing `150.0.7871.115`
- Node.js：v24.11.0
- npm：11.6.1

## 为什么机械自动化不直接用 `/Applications/Google Chrome.app`

这不是省事，而是 2025 年后的官方变化。Chrome 官方在 2025 年 6 月的扩展动态里说明，Chrome branded builds 从 **Chrome 137** 开始移除 `--load-extension`；Chromium Extensions 邮件列表进一步明确，这个变化适用于 official Chrome branded builds，而 **Chromium / Chrome for Testing** 继续支持这条命令行路径。

因此本轮做了两层区分：

- **本机 branded Chrome 150.0.7871.115**：已现场确认命令行 `--load-extension` 不再适合作为机械加载路径，相关说明冻结在 `chrome-branded-load-note.txt`。对 branded Chrome，真实 unpacked 安装仍应通过 `chrome://extensions` 的 **Load unpacked**。
- **Chrome for Testing 150.0.7871.115**：官方仍支持 `--load-extension`，因此本次机械自动化用它完成真实扩展验证。

## 如何复现

以下命令假设你当前就在**仓库根目录**。

### 1. 安装临时测试依赖（工作树外）

官方 Chrome 文档把 Puppeteer 作为扩展端到端测试示例。为了不把测试依赖写进本站仓库，本次实际运行是在工作树外创建临时目录安装 `puppeteer-core`。

```bash
SHOWCASE="research/articles/chrome-extension-prototype/showcase"
REPO_ROOT="$PWD"
TMP_NODE_DIR="$(mktemp -d)"
cd "$TMP_NODE_DIR"
npm init -y >/dev/null
npm install puppeteer-core
```

### 2. 安装 Chrome for Testing（工作树外）

```bash
CHROME_LINE="$(npx @puppeteer/browsers install chrome@stable | tail -n 1)"
CHROME_PATH="$(printf '%s\n' "$CHROME_LINE" | cut -d ' ' -f2-)"
```

### 3. 运行验证脚本

原始 stdout 先写到工作树外，再把脱敏结果冻结到仓库内：

```bash
RAW_LOG="$(mktemp)"
NODE_PATH="$TMP_NODE_DIR/node_modules" \
  CHROME_PATH="$CHROME_PATH" \
  node "$REPO_ROOT/$SHOWCASE/verify-extension.mjs" \
  > "$RAW_LOG"

cp "$RAW_LOG" "$REPO_ROOT/$SHOWCASE/verify-output.txt"
```

> 说明：`NODE_PATH` 指向工作树外的临时 `node_modules`，`CHROME_PATH` 指向 Chrome for Testing 可执行文件。仓库内保存的是已经脱敏的冻结输出；原始执行日志始终在工作树外生成。

## 机械验证覆盖了什么

- manifest 权限审计：确认主扩展没有 `tabs`、`host_permissions`、`unlimitedStorage`。
- 真实 Chrome for Testing 以 unpacked 方式加载扩展（通过 `--load-extension` 指向同一套源代码）。
- 打开本地 fixture 页面，选中预设文本。
- 用系统级快捷键 `Command/Ctrl+Shift+Y` 触发扩展抓取。
- 检查 popup 渲染结果与 `chrome.storage.local` 中的最近保存记录。
- 打开 `chrome://extensions` 作为受限页，再次触发快捷键并确认失败状态。
- 审计故意越权的 `manifest-overreach.json`，确认它被判为 FAIL。

## 自动化没有覆盖什么

下面这些项本轮**没有伪装成已自动通过**，而是明确留给人工在 `chrome://extensions` 验收：

- 在扩展管理页里手动使用“Load unpacked”按钮选择目录。
- 观察扩展卡片上是否出现警告、错误计数或权限提示。
- 在 branded Chrome 的真实扩展管理页中确认快捷键、popup 和权限文案是否与你本机设置一致。
- 人眼检查 popup 的视觉细节、长文本换行和深色/浅色主题观感。

这部分仍明确保留为 branded Chrome 的人工验收边界；独立只读 reviewer 已检查自动化/人工分层、22-check、两个负例与教学图，关闭全部 finding 后才把文章升为 `showcase_status: verified`。

## 结果读取方式

- 成功路径：看 `verify-output.txt` 中 `PASS browser capture on fixture page` 与冻结的 reading card。
- 失败路径：看 `PASS restricted page failure is surfaced`。
- 越权负例：看 `PASS overreach manifest is rejected by permission audit`。
