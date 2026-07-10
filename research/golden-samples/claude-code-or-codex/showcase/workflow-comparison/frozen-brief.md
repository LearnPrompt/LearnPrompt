# Frozen task brief

## Goal

把 `starlight/src/content/docs/ai-coding/project-checklist.mdx` 从简短清单升级为面向“接手已有仓库的初学者”的可执行教程。

## Scope

- 只修改目标 MDX。
- 保留 URL、现有 frontmatter 与 `SourceCard`。
- 不提交、不推送、不发布。

## Required content

1. 五分钟开工表：问题、去哪里找、留下什么。
2. 可复制 YAML 项目卡。
3. 缺少清单导致返工的 before/after。
4. 凭据和发布动作 caution。
5. LearnPrompt Starlight 迁移完整案例，并说明可迁移到其他仓库。
6. 指向 `minimum-agentic-coding-workflow` 的相对链接，避免重复教学。
7. 新项目与已有仓库的差异 callout。
8. 练习与读后验收清单。

## Evidence and acceptance

- 所有项目命令来自仓库真实配置。
- 唯一验收命令：`cd starlight && npm run build`。
- 交付改动文件、结构摘要、构建结果和仍有的不确定性。

## 从问题到任务卡的映射

| Discovery 问题 | 编辑者回答 | 写入 frozen brief |
| --- | --- | --- |
| 是否给可复制模板？ | 给 YAML 项目卡，不只讲原则 | Required content 2 |
| 面向新项目还是已有仓库？ | 主场景是已有仓库，新项目放 callout | Goal、Required content 7 |
| 用真实还是通用案例？ | 使用 LearnPrompt Starlight，并解释可迁移性 | Required content 5 |
| 是否与相邻教程分工？ | 互链，不重复 Plan/Patch/Verify/Learn | Required content 6 |

这张映射是“先探索再委派”的直接证据：四个问题分别改变了文章的模板、受众、案例和课程边界。
