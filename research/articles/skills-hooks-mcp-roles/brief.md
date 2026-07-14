# Brief — skills-hooks-mcp-roles

## 问题

读者已经会用 CLAUDE.md 和 `.claude/rules` 配置 Claude Code，但一遇到"把流程固化"、"在操作前拦截"或"读外部数据"这类扩展需求，就把 Skill、Hook、MCP 混在一起——要么全部写成 MCP，要么用 Hook 做业务编排。

## 目标读者

已写过 CLAUDE.md / `.claude/rules`、用过 Claude Code 日常编码、但从未自己建过 Skill 或 Hook 的中级用户。

## 一句话成果

读者能根据"重复工作流、事件时点保证、外部系统/数据"三个问题选择正确机制，并知道何时组合、何时不要上 MCP。

## 中心主张

Skill、Hook、MCP 解决的不是同一个问题。用三个判定问题就能找到正确机制，组合时各守边界。

## 非目标

- 不展开插件完整打包、远程 OAuth、企业托管、Agent Teams。
- 不把 Hook 说成任意业务编排器。
- 不把 MCP 当万能工具。
- 不做模型排名。

## 需要的证据

- 一手来源验证 Skill 按需加载与 SKILL.md 结构。
- 一手来源验证 Hook PreToolUse 事件 JSON 格式和 deny/silent 行为。
- 一手来源验证 MCP stdio transport、信任边界、prompt injection 风险。
- Showcase：release-workbench（Skill 契约、Hook deny/silent、MCP 子进程、误用反例）。

## 验收标准

- 正文 >= 5000 字符，去代码 >= 1800 中文字符，>= 6 个 H2。
- 无 SourceCard。
- 至少一张教学 SVG，有 asset-ledger。
- 底部来源区包含官方文档链接与橙皮书 CC BY-NC-SA 4.0。
- Showcase 6/6 通过。
- Starlight 构建 49 页通过。
- partial validator 通过。

## 构建命令

```bash
cd starlight && npm run build
```
