---
sidebar_position: 5
title: Chain of Thought Prompting in AI
description: This page explains the concept of Chain of Thought Prompting, its importance in enhancing reasoning capabilities of large language models, and provides examples.
keywords: [Chain of Thought Prompting, AI reasoning, LLM, complex problem solving, arithmetic reasoning, Jason Wei]
slug: /advanced-prompting/chain-of-thought/
---
# 🟢 Chain of Thought Prompting

Jason Wei and co-authors define Chain of Thought as **a series of intermediate reasoning steps**. The purpose is to improve the complex reasoning capabilities of large language models (LLM).

![Chain of Thought Prompting Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/promptCOT.png)

Chain of Thought is usually associated with complex reasoning tasks such as arithmetic, common sense, and symbolic reasoning. When solving complex reasoning tasks (such as multi-step mathematical word problems), the typical approach is to break down the problem into multiple intermediate steps and solve them one by one, then provide the final answer. Chain of Thought provides a model with an interpretable window, guiding it on how to arrive at a specific answer and offering an opportunity to debug errors in the reasoning process.

## Arithmetic Reasoning

### Standard Prompting

```python
prompt:
Leah had 32 chocolates and her sister had 42. 
If they ate 35, how many pieces do they have left in total?

output:
**7 pieces**
```

This is an obviously incorrect answer.

### Chain of Thought Prompting

This time, we provide detailed steps to solve the problem:

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

This time, ChatGPT easily arrived at the correct answer.