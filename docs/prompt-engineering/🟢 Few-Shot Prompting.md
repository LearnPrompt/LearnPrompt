---
sidebar_position: 5
title: Few shot for ChatGPT
description: This page provides examples of prompts to effectively interact with ChatGPT, including 1-shot and few-shot techniques.
keywords: [ChatGPT, AI prompts, 1-shot, few-shot, AI interaction, examples]
slug: /prompt-engineering/example-prompts-for-chatgpt/
---
# 🟢 Few-Shot Prompting

Currently, our primary form of interaction with ChatGPT is through text. Prompts can include examples in addition to the **instruction+question** format. Especially when we need specific outputs, providing examples can save us from explaining the task in detail, helping ChatGPT better understand our exact needs, and thus provide more accurate and targeted answers.

## 1-shot Single Example

> It is worth noting that "shot" stands for "sample". 0-shot means providing no sample and directly inputting the text to the model, while 1-shot means providing the model with a single example.

### Table Generation

If we use the previous prompt template, **instruction+question**, the prompt here should be **"Generate a spreadsheet listing top science fiction movies and their release years"**.

![Example of incorrect table generation](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptUseCase1.png)

ChatGPT interpreted this as wanting to generate a spreadsheet using Python. Although it provided the corresponding code, this is not what we wanted. We need the table directly.

So, what if we use ChatGPT's multi-turn conversation capability to supplement the explanation for the table generation task?

![Example of multi-turn conversation](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptUseCase2.png)

Does ChatGPT really not generate table information? Do we have to follow its suggested steps to input and adjust in an Excel file to get the table we want?

At this point, we can actually use examples to make ChatGPT's output more targeted.

![Example with provided table](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptUseCase3.png)

As you can see, when we use this example, ChatGPT not only produces the format we want, but also outputs more data than the previous two results.

## few-shot Multiple Examples

We are not limited to one example; few-shot refers to providing >=2 samples of examples. In the case of few-shot, we can provide multiple examples.
