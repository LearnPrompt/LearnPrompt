---
sidebar_position: 3
locale: en-us
style: chicago
---

# 思维链 Chain of Thought Prompting

Jason Wei等作者对思维链的定义是**一系列的中间推理步骤（ a series of intermediate reasoning steps ）**。目的是为了提高大型语言模型（LLM）进行复杂推理的能力。

![CoT](./img/CoT.png)

思维链通常是伴随着算术，常识和符号推理等复杂推理任务出现的。在解决复杂的推理任务（例如多步骤的数学单词问题）时，典型的做法是将问题分解成多个中间步骤，并逐一解决，然后再给出最后的答案。思维链为模型提供了一个可解释的窗口，引导它如何得出一个特定的答案并提供机会来调试推理过程中的出错点。

## 算术推理

### Standard Prompting

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="Leah had 32 chocolates and her sister had 42. If they ate 35, how many pieces do they have left in total?" initial-response="7 pieces" max-tokens="256" box-rows="7" model-temp="0" top-p="0"></div>

这是一个很明显的错误答案。

### Chain of Thought Prompting

这次我们给出了详细的解题步骤：

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="Leah had 32 chocolates and her sister had 42. If they ate 35, how many pieces do they have left in total? \n\nOriginally, Leah had 32 chocolates. Her sister had 42. So in total they had 32 + 42 = 74. After eating 35, they
had 74 - 35 = 39. The answer is 39.\n\nLeah had 53 chocolates and her sister had 31. If they ate 25, how many pieces do they have left in total?" initial-response="Originally, Leah had 53 chocolates. Her sister had 31. So in total they had 53 + 31 = 84. After eating 25, they
had 84 - 25 = 59. The answer is 59." max-tokens="256" box-rows="18" model-temp="0" top-p="0"></div>

这一次，ChatGPT轻松算出了我们想要的答案。

