---
sidebar_position: 25
title: Multi-prompt Techniques
description: A guide on how to use multi-prompts and their weights in Midjourney Bot.
keywords: [Midjourney, multi-prompt, prompt weight, AI image generation, hot dog example]
slug: /midjourney/multi-prompts/
---
# 🟢 多提示

在提示中添加双冒号“::”向 Midjourney Bot 表明它应该分别考虑提示的每个部分。

在下面的示例中，对于提示 **hot dog**,所有单词都被放在一起考虑，Midjourney Bot 生成了热狗的图像。如果将提示分成两部分**hot:: dog** 后，Midjourney Bot会将两个概念分开考虑，从而创建一只“热”的狗。

![Hot Dog Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/109f046ad8ae1b470d5f4091d48418e8.png)

## 多提示权重

当使用双冒号::将提示分成不同的部分时，你可以在双冒号后立即添加一个数字，以分配提示的该部分的相对重要性。

在下面的示例中，提示**hot:: dog**生成了一只温暖的狗。

将提示更改**hot::2 dog**，使“hot”一词的重要性是“dog”一词的两倍，从而产生了一只火热的狗！

![Hot Dog Weight Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/98cd841e1cc07eb7b19fc72d1c03e936.png)