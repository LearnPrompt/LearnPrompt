---
sidebar_position: 15
title: 如何写 Midjourney 提示语
description: A comprehensive guide on how to create effective prompts for generating images with Midjourney.
keywords: [Midjourney, prompt, image generation, AI, guide, tutorial, art]
slug: /midjourney/prompt-guide/
---
# 🟢 Prompt 提示语

> 💡 提示（Prompt）是一段简短的文本短语，Midjourney机器人会对其进行解释以生成图像。Midjourney机器人将提示中的单词和短语分解为更小的部分（称为标记），将其与其训练数据进行比较，然后用于生成图像。

## 基础结构

一个基本的提示可以简单到一个单词、短语或表情符号。非常短的提示将在很大程度上依赖于 Midjourney 的默认样式。

![Basic Prompt Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/22199e1b8838f8aa638d244ebd650c71.png)

完整 prompt：可以包括一个或多个图像链接、多个文本短语或单词，以及一个或多个后缀参数

![Complete Prompt Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d26bd9bbc22ca67d681c0b74f41eec26.png)

- **Image Prompts**: 可以将图像 URL 添加到提示中以影响最终结果的样式和内容。图片 URL 始终位于提示的前面。
- **Prompt Text**：你要生成的图像的文本描述。
- **Parameters**：参数改变图像的生成方式。参数可以更改宽高比、模型、放大器等等。参数位于提示的末尾。

> Image Prompts将在下一页详细说明

## 语法原则

Midjourney Bot 并不能像人类那样理解语法和句子结构。因此单词的选择十分重要。

- 在许多情况下，更具体的同义词效果更好。例如用gigantic, enormous, or immense来取代big。
- 尽可能精简单词。更少的词意味着每个词都有更强大的影响力。
- 使用逗号、括号和连字符来帮助组织你的想法。
- Midjourney Bot 不考虑大小写。
- 最好描述你想要什么而不是你不想要什么。如果要确保某个对象不在最终图像中，请尝试使用--no参数。

V4 和V5 在解释句子结构方面略优于其他模型。

## 细节描述

尽量弄清楚重要的背景或细节：

1. 主题：人、动物、人物、地点、物体等。｜ person, animal, character, location, object, etc.
2. 媒介：照片、绘画、插图、雕塑、涂鸦、挂毯等。｜ photo, painting, illustration, sculpture, doodle, tapestry, etc.
3. 环境：室内、室外、月球上、纳尼亚、水下、翡翠城等。｜ indoors, outdoors, on the moon, in Narnia, underwater, the Emerald City, etc.
4. 照明：柔和、环境、阴天、霓虹灯、工作室灯等 ｜ soft, ambient, overcast, neon, studio lights, etc
5. 颜色：充满活力、柔和、明亮、单色、彩色、黑白、柔和等。｜ vibrant, muted, bright, monochromatic, colorful, black and white, pastel, etc.
6. 情绪：稳重、平静、喧闹、精力充沛等。｜ Sedate, calm, raucous, energetic, etc.
7. 构图：人像、爆头、特写、鸟瞰图等。｜Portrait, headshot, closeup, birds-eye view, etc.

:::takeaways
当你没有在提示里面说明时，对应的内容就会被随机化。在最初的时候可能会给你一些灵感，但如果你想减少随机性，可以使用提示模板将上面的元素一一补充。
:::

## 指定艺术媒介

蜡笔、刮板、印刷机、闪光、墨水和彩色纸。生成图像的最佳方法之一是指定一种媒介。

```python
/imagine prompt <any art style> style cat
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1dffe168b3771147b9ca67e1161b51cd.png)

## 年份

不同的时代有不同的视觉风格。

```python
/imagine prompt <decade> cat illustration
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ac4a7dae7cb2e2ba80e19075fed9e568.png)

## 情感

```python
/imagine prompt <emotion> cat
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/049f4cddf1f43a28a21b4121e50cb8dc.png)

## 色彩

```python
/imagine prompt <color word> colored cat
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e5c21df2d4f505306ff2a93f41238e8a.png)

## 环境

```python
/imagine prompt <location> cat
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/078288fc01fda81aeb9428b7ffcdd555.png)