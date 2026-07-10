# AGENTS.md（示例：LearnPrompt 文档站开工清单）

这份文件是给编码 Agent 读的项目说明，等价于一份“开工清单”。
每一节都对应 project-card.yaml 里的一个必填字段，人读这份，机器读那份。

## 仓库与当前分支

- 仓库：LearnPrompt 文档站（Docusaurus 与 Starlight 双栈）。
- 当前工作分支：内容改稿分支，不直接在主分支提交。

## 运行方式与最快检查

- 站点在 `starlight/` 目录，使用 npm。
- 最快检查：`cd starlight && npm run build`，退出码 0 视为通过。

## 允许与禁改目录

- 允许修改：目标 MDX 文件、对应 `research/` 研究包、`starlight/public/images/`。
- 禁止修改：`starlight/src/content/config.ts`、其它文章、`package.json`、部署配置。

## 密钥提供方式

- 本仓库构建不需要密钥；如需外部凭据，走环境变量注入，不写入仓库。

## 验收命令

- `cd starlight && npm run build`

## 回滚方式

- 改动未提交时用 `git restore` 丢弃；已提交用 `git revert` 生成反向提交，不改写历史。
