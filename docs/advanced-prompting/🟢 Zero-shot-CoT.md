---
sidebar_position: 10
title: Zero-shot Chain of Thought (CoT) in AI Prompting
description: Explore the concept of Zero-shot Chain of Thought (CoT) in AI, a task-agnostic method to guide models to think step-by-step.
keywords: [AI, artificial intelligence, zero-shot, chain of thought, CoT, step-by-step reasoning]
slug: /advanced-prompting/zero-shot-cot/
---
# 🟢 Zero-shot-CoT

Just as there are few-shot and zero-shot examples in prompting, Chain of Thought (CoT) also has a zero-shot version. With Zero-shot-CoT, we do not need to meticulously design specific task steps for different complex reasoning problems. Before answering each question, we simply add a straightforward prompt "Let’s think step by step" to guide the model to think step-by-step. Most importantly, Zero-shot-CoT is universal and task-agnostic.

![Zero-shot Chain of Thought](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/zCoT.png)

## Arithmetic Reasoning

We repeated the arithmetic problem from the previous page to see the effects of different CoTs.

### Chain of Thought Prompting

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

**Zero-shot Chain of Thought Prompting**

```python
prompt:
Leah had 53 chocolates and her sister had 31. 
If they ate 25, how many pieces do they have left in total?

Let’s think step by step

output:
**Leah had 53 chocolates
Her sister had 31 chocolates
They ate 25 chocolates

So we can do:
53 + 31 = 84
84 - 25 = 59

Therefore, Leah and her sister have 59 pieces of chocolate left in total.**
```

This time, ChatGPT not only calculated the answer we wanted but also saved us the process of writing out the reasoning steps.