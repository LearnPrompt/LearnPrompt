# Same-repo read-only prompt

```text
只读分析当前仓库，不要修改任何文件。请读取不超过 8 个关键文件，并用简洁 JSON 回答：project（项目是什么）、entrypoints（最多 3 个入口文件）、first_check（第一条应运行的验收命令）、evidence（最多 4 条路径或事实）、uncertainty（仍不确定什么）。
```

这个任务故意限制为只读、最多八个文件，并要求结构化证据。它检验的是两个工具如何进入陌生仓库和表达不确定性，不是模型综合能力。
