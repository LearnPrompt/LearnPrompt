# LearnPrompt Starlight Migration

这是 LearnPrompt 的 Starlight 迁移实验站，当前保留在 `codex/starlight-wiki-migration` 分支中，不替换线上 Docusaurus 入口。

## 本地运行

```bash
cd starlight
npm install
npm run dev -- --host 0.0.0.0
```

## 构建验收

```bash
cd starlight
npm run build
```

## GitHub Pages 预览构建

公开预览地址：

```text
https://learnprompt.github.io/LearnPrompt/
```

```bash
cd starlight
npm run build:pages
```

## 迁移原则

- 不新增 analytics、telemetry 或广告脚本。
- 公开资料只做教程化改写，不全文搬运。
- 旧 Docusaurus 内容暂不删除，后续逐步迁移、过时标记和重定向。
- UI 按 `nexu-io/open-design` 的 docs-page / web-prototype / critique 工作流约束实现。
