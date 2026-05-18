# LearnPrompt

中文文档 | [README in English](./README_EN.md)

LearnPrompt 是一个永久免费开源的中文 AI 实战教程站，覆盖提示语工程、ChatGPT、RAG、Agent、AI 编程、Agent Skills、Obsidian AI、Midjourney、Runway、Stable Diffusion、数字人、AI 声音与音乐、大模型微调等主题。

官网：https://www.learnprompt.pro

## 当前站点架构

当前主站已经迁移到 Astro Starlight，站点源码位于：

```text
starlight/
```

仓库根目录中仍保留旧版 Docusaurus 相关内容，作为历史内容与迁移参考；Vercel 生产构建入口以根目录 `vercel.json` 为准，实际构建 `starlight/` 子项目。

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

## Vercel 部署设置

本仓库使用根目录 `vercel.json` 固定 Vercel 构建配置，避免 Vercel 默认从旧 Docusaurus 根项目构建。

当前配置为：

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "cd starlight && npm ci",
  "buildCommand": "cd starlight && npm run build",
  "outputDirectory": "starlight/dist"
}
```

如果在 Vercel Dashboard 中手动核对，请确保：

- Install Command：`cd starlight && npm ci`
- Build Command：`cd starlight && npm run build`
- Output Directory：`starlight/dist`
- 不要为 Starlight 添加旧 Docusaurus 的全量 SPA rewrite。

## GitHub Pages 预览

Starlight 预览站点也可以通过 GitHub Pages 构建：

```bash
cd starlight
npm run build:pages
```

公开预览地址：

```text
https://learnprompt.github.io/LearnPrompt/
```

## 迁移原则

- 不新增 analytics、telemetry 或广告脚本。
- 公开资料只做教程化改写，不全文搬运。
- 旧 Docusaurus 内容暂不删除，后续逐步迁移、过时标记和重定向。
- UI 与内容结构优先服务真实学习路径，而不是简单堆目录。

## 进群交流 & 支持我们

感谢大家对课程内容的支持。「AI 沃茨」正在不断成长，交流群供大家自由分享和探讨 AI 实战经验。你可以添加开发者微信：`aiwarts101`。

## 提交反馈

欢迎反馈：

- 内容建议
- 格式修改
- 新内容贡献
- 站点体验问题

你可以通过以下方式联系：

- 在 GitHub 提交 [issue](https://github.com/LearnPrompt/LearnPrompt/issues)
- Email：[carl@goodcase.ai](mailto:carl@goodcase.ai)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=LearnPrompt/LearnPrompt&type=Date)](https://star-history.com/#LearnPrompt/LearnPrompt&Date)

## Reference

编写本教程时参考了以下教程或文档的内容和示例，感谢创作者们的付出：

1. [Learn Prompting](https://learnprompting.org/zh-Hans/)
2. [Midjourney Documentation](https://docs.midjourney.com/)
3. [Aituts](https://aituts.com/)
