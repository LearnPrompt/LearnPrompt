---
sidebar_position: 4
---

# 零样本思维链 Zero-shot-CoT

正如在提示中存在few-shot和zero-shot一样，CoT也有一个zero-shot的版本。有了Zero-shot-CoT，我们就不需要为不同的复杂推理问题精心设计具体的任务步骤；在回答每一个问题之前，我们只需添加一个简单的提示 **"Let’s think step by step"**，以引导模型逐步思考。最重要的是，Zero-shot-CoT是通用的，与任务无关的。

![zCoT](./img/zCoT.png)

## 算术推理

我们重复尝试了上一页的算术题，看看不同CoT带来的效果。

### Chain of Thought Prompting

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="Leah had 32 chocolates and her sister had 42. If they ate 35, how many pieces do they have left in total? \nOriginally, Leah had 32 chocolates. Her sister had 42. So in total they had 32 + 42 = 74. After eating 35, they
had 74 - 35 = 39. The answer is 39.\n\nLeah had 53 chocolates and her sister had 31. If they ate 25, how many pieces do they have left in total?" initial-response="Originally, Leah had 53 chocolates. Her sister had 31. So in total they had 53 + 31 = 84. After eating 25, they
had 84 - 25 = 59. The answer is 59." max-tokens="256" box-rows="18" model-temp="0" top-p="0"></div>

### Zero-shot Chain of Thought Prompting

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="Leah had 53 chocolates and her sister had 31. If they ate 25, how many pieces do they have left in total?\n\nLet’s think step by step" initial-response="Leah had 53 chocolates\nHer sister had 31 chocolates\nThey ate 25 chocolates\n\nSo we can do:\n53 + 31 = 84\n84 - 25 = 59\n\nTherefore, Leah and her sister have 59 pieces of chocolate left in total." max-tokens="256" box-rows="18" model-temp="0.5" top-p="1.0"></div>

这一次，ChatGPT 不仅算出了我们想要的答案，还省去了我们编写推理步骤的过程。


