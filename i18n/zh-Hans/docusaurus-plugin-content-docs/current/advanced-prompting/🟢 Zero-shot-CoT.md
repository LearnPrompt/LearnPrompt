---
sidebar_position: 10
title: 零样本思维链
description: Explore the concept of Zero-shot Chain of Thought (CoT) in AI, a task-agnostic method to guide models to think step-by-step.
keywords: [AI, artificial intelligence, zero-shot, chain of thought, CoT, step-by-step reasoning]
slug: /advanced-prompting/zero-shot-cot/
---
# 🟢 零样本思维链

正如在提示中存在few-shot和zero-shot一样，CoT也有一个zero-shot的版本。有了Zero-shot-CoT，我们就不需要为不同的复杂推理问题精心设计具体的任务步骤；在回答每一个问题之前，我们只需添加一个简单的提示 **"Let’s think step by step"**，以引导模型逐步思考。最重要的是，Zero-shot-CoT是通用的，与任务无关的。

![Zero-shot Chain of Thought](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/zCoT.png)

## 算术推理

我们重复尝试了上一页的算术题，看看不同CoT带来的效果。

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

这一次，ChatGPT 不仅算出了我们想要的答案，还省去了我们编写推理步骤的过程。