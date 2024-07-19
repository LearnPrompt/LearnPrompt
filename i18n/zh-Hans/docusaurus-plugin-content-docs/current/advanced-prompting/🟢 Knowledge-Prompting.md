---
sidebar_position: 15
title: Knowledge Prompting in AI
description: This page explains how integrating external knowledge can improve commonsense reasoning through knowledge prompting, without needing task-specific supervision or access to structured knowledge bases.
keywords: [knowledge prompting, AI, commonsense reasoning, language model, knowledge integration]
slug: /advanced-prompting/knowledge-prompting/
---
# 🟢 知识提示 Knowledge Prompting

纳入外部知识是否能促进常识性推理仍然是一个开放的问题。一系列的工作表明，外部知识的整合可以提高模型的任务表现。知识提示（ Knowledge Prompting ）不需要对知识整合的具体任务进行监督，也不需要访问结构化的知识库。相反，知识提示可以直接从语言模型中产生知识，然后在回答问题时将这些知识作为附加输入。

用作者的一句话来说“我们提出了一种简单但有效的方法，在few-shot的情况下从通用语言模型中获取知识陈述（即以自然语言陈述形式表达的知识）”。

![know.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/4e3e1fe9d3ed4fbf396cefbb6f230411.png)

知识提示主要分为两阶段：

1. 使用少量示范从语言模型中生成与问题相关的知识陈述
2. 使用第二个语言模型对每个知识陈述进行预测，然后选择最高置信度的预测。

## 知识生成

这里我们打算通过 ChatGPT 回复常识性问题:

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/85d760f59c8d5795459c9d7f3e7f3e22.png)

ChatGPT认为企鹅是没有翅膀的。

![wiki.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/21a72038ab77798cbd8803247e839acb.png)

接着我们让 ChatGPT 生成一些跟企鹅有关的知识：

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c4a0c84ed76062ea31b3ed2e1a5f6236.png)

## 知识注入

这时候我们通过外部知识的注入，重新向 ChatGPT 提问：

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/bc5827a7b96493e048f18b486fe0259b.png)

这次企鹅终于要回了它的两只翅膀😂