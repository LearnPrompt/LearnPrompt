# Horizontal Research：vault placement contract

验证日期：2026-07-12。本文把一手产品资料当事实来源，把 Johnny.Decimal 当教学比较，把 Obsidian AI Orange Book 当中文主题地图。

## 1. 一手来源：Obsidian Help

| 来源 | 支撑什么 | 不能证明什么 |
| --- | --- | --- |
| https://obsidian.md/help/Files%2Band%2Bfolders/How%2BObsidian%2Bstores%2Bdata | vault 是本地文件夹，notes 是 Markdown 明文，外部编辑会 refresh，`.obsidian` 在根目录，官方不建议 nested vault | 不能证明任何 `00/10/20/30/50/99` 编号约定，也不定义 folder role |
| https://obsidian.md/help/Files%2Band%2Bfolders/Manage%2Bvaults | vault 名和底层 folder 同步、existing folder 可直接 open as vault、`.obsidian` 可拷贝迁移设置 | 不能证明“好目录结构长什么样” |
| https://obsidian.md/help/properties | properties 是文件顶部 YAML；适合小而原子的 human-/machine-readable values | 不能证明目录树本身如何分类，也不定义 agent contract |

结论：Obsidian 官方只定义“文件系统语义”和少量 note metadata 语义，不定义本文的 placement contract。

## 2. 一手来源：Codex 与 Claude Code 的 instruction surfaces

| 来源 | 支撑什么 | 不能证明什么 |
| --- | --- | --- |
| https://openai.com/index/introducing-codex/ | Codex 可读取 repo 内的 `AGENTS.md` 之类文本指导文件，指导导航、测试命令和项目实践 | 不能把 `AGENTS.md` 等同于 vault 目录结构标准 |
| https://code.claude.com/docs/en/memory | `CLAUDE.md` 是持久指令 surface，Claude 把它当 context 而非 enforced configuration | 不能说明某个 vault 目录编号就天然有语义 |

结论：这两类文档说明“Agent 会读文字规则”，所以如果你希望它稳定放置文件，**目录角色与拒收规则就必须显式写出来**，不能只靠人类默认理解。

## 3. 教学参考：Johnny.Decimal

来源：https://johnnydecimal.com/

这个教学参考对本文有两个价值：

1. 它强调浅层、可预测结构能降低“该放哪”的犹豫。
2. 它说明**编号系统的价值主要是降低歧义**，而不是自动产生语义。

它不能证明本文的 `00/10/20/30/50/99` 合同，因为 Johnny.Decimal 讲的是通用编号法，不定义“项目/知识/输出/资源/系统/拒收”的角色分工，也不覆盖敏感材料 reject gate。

## 4. 二手主题地图：Obsidian AI Orange Book

来源：https://github.com/alchaincyf/obsidian-ai-orange-book

- 作者：花叔 / `alchaincyf`
- 用途：帮助确认“Obsidian + Agent + 第二大脑”这条中文叙事线里，目录结构确实是一个高频问题
- 限制：它不是当前产品行为的一手权威，也不授权本文复制 PDF 正文、截图或图片

本页只保留它作为中文主题地图和署名来源。事实与当前产品行为全部回到上面的一手来源。

## 5. 对相邻文章的补位

| 文章 | 已覆盖内容 | 本文补什么 |
| --- | --- | --- |
| `markdown-as-agent-memory.mdx` | 为什么 Markdown 适合做 Agent 记忆接口 | 目录树怎样变成稳定放置协议 |
| `claude-md-index-navigation.mdx` | `CLAUDE.md` / `index.md` 导航法 | 导航文件之外，目录角色与 canonical path 怎么写 |
| `ai-maintains-knowledge-base.mdx` | AI 维护知识库的高层流程 | “新文件落到哪” 的判定与 reject boundary |
| `obsidian-git-workflow.mdx` | diff / rollback / git 边界 | 还没进入 commit 之前，文件应该被放到哪类目录 |

结论：本文要补的是 **placement contract**，不是 Markdown 语义、导航索引、维护流程或 Git 回滚。
