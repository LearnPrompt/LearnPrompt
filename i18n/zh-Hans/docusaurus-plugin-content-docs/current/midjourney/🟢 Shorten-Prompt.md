---
sidebar_position: 35
title: Shorten Command - Optimizing Prompts for Midjourney
description: Learn how to use the /shorten command to optimize prompts for better results in Midjourney.
keywords: [Midjourney, AI prompts, prompt optimization, /shorten command, token analysis]
slug: /midjourney/shorten-command/
---
# 🟢 “缩短”提示

> 😀 `/shorten` 命令会分析提示，突出显示提示中一些最有影响力的单词，并建议可以删除的不必要的单词。使用此命令，您可以通过关注基本术语来优化提示。
> `/shorten`** 与多提示或 **`--no`** 参数不兼容

## 📝 **使用 /Shorten**

Midjourney 机器人通过将提示分解为称为token的较小单元来分析您的提示。这些标记可以是短语、单词甚至音节。Midjourney 机器人将这些token转换为它可以理解的格式。它将它们与训练期间学到的关联和模式一起使用，以指导如何生成图像。将token视为帮助 Midjourney 机器人理解输入并创建所需视觉输出的构建块。

### 为什么需要**/Shorten？

Ans：带有不必要的单词、冗长的描述、诗意的短语或直接称呼机器人的长提示（“请给我做一张图片”、“谢谢你的帮助，Midjourney Bot！”）可能会导致意外的元素被添加到您的图像中。`/shorten` 命令可以帮助您发现提示中最重要的单词以及可以省略的单词。**

## **命令示例**

> 🔥 Prompt提示语：Please create a whimsical majestic tower of donuts, intricately crafted and adorned with a mesmerizing array of colorful sprinkles. Bring this sugary masterpiece to life, ensuring every detail is rendered in stunning magical realism. Thank you!

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b3c1229630dd5b0b58a8fce90b189404.jpg)

如果在上述提示符下使用 **`/shorten`** 命令，Midjourney Bot 将返回以下信息：

> **重要Tokens**
> 
> 
> Please ~~create~~ a whimsical **majestic tower** of **donuts**, intricately crafted and adorned with a mesmerizing array of **colorful sprinkles**. Bring this **sugary** masterpiece to life, ~~ensuring every~~ detail is rendered in ~~stunning~~ **magical realism**. ~~Thank you!~~
> 
> **缩短的提示**
> 
> 1️⃣ Please, majestic tower of donuts, crafted, array of colorful sprinkles, sugary masterpiece, rendered, magical realism
> 1️⃣ 拜托，雄伟的甜甜圈塔，精心制作，五颜六色的洒水阵列，含糖的杰作，渲染，魔幻现实主义
> 
> 2️⃣ Please, majestic tower of donuts, colorful sprinkles, sugary masterpiece, rendered, magical realism
> 2️⃣ 拜托，雄伟的甜甜圈塔，五颜六色的洒水，含糖的杰作，渲染，魔幻现实主义
> 
> 3️⃣ majestic tower of donuts, colorful sprinkles, sugary, magical realism
> 3️⃣ 雄伟的甜甜圈塔，五颜六色的洒水，含糖，魔幻现实主义
> 
> 4️⃣ majestic tower of donuts, colorful sprinkles, magical
> 4️⃣ 雄伟的甜甜圈塔，五颜六色的洒水，神奇
> 
> 5️⃣ tower of donuts, sprinkles
> 
> 5️⃣ 甜甜圈塔，洒水
> 

提示中最重要的标记以粗体突出显示，最不重要的标记以粗体突出显示。根据此信息，您还将获得 5 个可能的较短提示。

## **分析结果**

最短的提示， **`Option 5️⃣ : tower of donuts, sprinkles`** 生成最接近原始目标的图像。许多填充词，如“异想天开”、“令人着迷”和“杰作”都可以省略。了解到“塔”和“魔法”被认为是重要的标记，这有助于解释为什么有些图像是用童话城堡元素生成的。了解这一点提供了一个线索，如果目标是创建一堆美味的甜甜圈，则应该从提示中删除“神奇”。