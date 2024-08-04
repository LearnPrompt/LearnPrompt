---
sidebar_position: 5
title: GPT技巧 - 提供示例
description: This page provides examples of prompts to effectively interact with ChatGPT, including 1-shot and few-shot techniques.
keywords: [ChatGPT, AI prompts, 1-shot, few-shot, AI interaction, examples]
slug: /prompt-engineering/example-prompts-for-chatgpt/
---
# 🟢 提供示例

目前我们与 ChatGPT 交流的主要形式是文字。提示除了**指令+问题**的形式外，还可以包含例子。特别是当我们需要具体的输出时，提供例子可以省去我们对具体任务的解释，帮助ChatGPT更好地理解我们的确切需求，从而提供更准确，更有针对性的答案。

## 1-shot 单个示例

> 值得注意的是，shot代表的是“样本”。0-shot就是没有样本直接给模型输入文本，1-shot就是提供模型一个单一的示例。
> 

### 表格生成

如果我们使用上一篇的提示模版，**指令+问题**的话，这里的prompt应该是**“生成一个电子表格，列出了顶级科幻电影和上映年份”**

![Example of incorrect table generation](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptUseCase1.png)

ChatGPT 理解成了我想使用 python 语言生成一个电子表格。虽然它给出了对应的程序，但这并不是我们想要的，我们需要直接得到想要的表格。

那么，如果我们利用 ChatGPT 的多轮对话能力，对表格生成任务进行补充解释呢？

![Example of multi-turn conversation](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptUseCase2.png)

ChatGPT真的不能生成表格信息吗？我们是否只能按照它上面建议的步骤，使用Excel文件输入并调整，得到我们想要的表格？

在这一点上，我们其实可以通过举例子，让ChatGPT更有针对性的输出。

![Example with provided table](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptUseCase3.png)

可以看到，当我们使用这个例子后，ChatGPT 不仅产生了我们想要的格式，而且输出的数据也比前两个结果多。

## few-shot 多个示例

我们可以不局限于一个例子；few-shot是>=2个样本的例子的统称。在few-shot的情况下，我们可以提供多个例子。