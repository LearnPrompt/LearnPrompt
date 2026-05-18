# LearnPrompt Starlight

这是 LearnPrompt 当前主站的 Astro Starlight 实现，源码位于 `starlight/`。

## 本地运行

```bash
cd starlight
npm ci
npm run dev -- --host 0.0.0.0
```

默认本地地址：

```text
http://localhost:4321/
```

## 构建验收

```bash
cd starlight
npm run build
```

构建产物输出到：

```text
starlight/dist/
```

## Vercel 部署

Vercel 由仓库根目录的 `vercel.json` 控制，实际构建 `starlight/` 子项目：

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "cd starlight && npm ci",
  "buildCommand": "cd starlight && npm run build",
  "outputDirectory": "starlight/dist"
}
```

注意：不要再使用旧 Docusaurus 的全量 SPA rewrite，否则 Starlight 文档路径会被错误重写到首页。

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
