# Project Rules

一个把 Markdown 转成 HTML 的小工具。以下规则让每一轮改动少踩同类坑。

## Before Editing
- 先读 `README.md` 和 `package.json` 再动手。
- 先说明计划改哪些文件，只改计划中列出的文件，保持小而可审查的 diff。

## Commands
- Install: `npm install`
- Build: `npm run build`
- Test: `npm run check`

## Do Not Edit
- 不要修改或提交 `.env`、`.env.local` 里的任何值。
- 不要改 `dist/` 里的生成文件。
- 不要动 `.github/workflows/` 下的部署配置，除非任务就是改部署。

## Verify
- 改完行为后先跑最快的检查：`npm run check`。
- 如果命令失败，先停下来解释错误，不要继续改更多文件。

## Output
- 结尾汇报改了哪些文件、跑了哪些验证命令、结果如何。
- 指出还剩什么风险或未解决的不确定项。
