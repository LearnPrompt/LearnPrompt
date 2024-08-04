---
sidebar_position: 5
title: 思维链
description: This page explains the concept of Chain of Thought Prompting, its importance in enhancing reasoning capabilities of large language models, and provides examples.
keywords: [Chain of Thought Prompting, AI reasoning, LLM, complex problem solving, arithmetic reasoning, Jason Wei]
slug: /advanced-prompting/chain-of-thought/
---
# 🟢 思维链 Chain of Thought Prompting

Jason Wei等作者对思维链的定义是**一系列的中间推理步骤（ a series of intermediate reasoning steps ）**。目的是为了提高大型语言模型（LLM）进行复杂推理的能力。

![Chain of Thought Prompting Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/promptCOT.png)

思维链通常是伴随着算术，常识和符号推理等复杂推理任务出现的。在解决复杂的推理任务（例如多步骤的数学单词问题）时，典型的做法是将问题分解成多个中间步骤，并逐一解决，然后再给出最后的答案。思维链为模型提供了一个可解释的窗口，引导它如何得出一个特定的答案并提供机会来调试推理过程中的出错点。

## 算术推理

### Standard Prompting

```python
prompt:
Leah had 32 chocolates and her sister had 42. 
If they ate 35, how many pieces do they have left in total?

output:
**7 pieces**
```

这是一个很明显的错误答案。

### Chain of Thought Prompting

这次我们给出了详细的解题步骤：

```python
prompt:
Leah had 32 chocolates and her sister had 42. 
If they ate 35, how many pieces do they have left in total? 

Originally, Leah had 32 chocolates. Her sister had 42. 
So in total they had 32 + 42 = 74. After eating 35, they
had 74 - 35 = 39. The answer is 39.

Leah had 53 chocolates and her sister had 31.
If they ate 25, how many pieces do they have left in total?

output:
**Originally, Leah had 53 chocolates. Her sister had 31. 
So in total they had 53 + 31 = 84. After eating 25, they
had 84 - 25 = 59. The answer is 59.**
```

这一次，ChatGPT轻松算出了我们想要的答案。