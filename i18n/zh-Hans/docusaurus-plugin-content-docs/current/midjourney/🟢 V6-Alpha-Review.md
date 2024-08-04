---
sidebar_position: 70
title: Midjourney v6 Alpha评测
description: This review highlights the new features of Midjourney V6 Alpha and provides a guide for creating effective prompts to utilize its enhanced capabilities.
keywords: [Midjourney V6, Alpha, prompt crafting, artistic style, new features, image generation]
slug: /midjourney/v6-alpha-review/
---
# 🟢 Midjourney v6 Alpha评测-国风艺术性拉满，新的提示语要怎么写

> 😀 12/21号 Midjourney V6 alpha 版本已开放测试！直接从 /settings 下的下拉菜单中选择 V6 或在提示后输入 --v 6

体验网页：[alpha.midjourney.com](http://alpha.midjourney.com/)

V6 是Midjourney团队从头开始训练的第三个模型。该项目已经筹备了 9 个月。

![V6 Screenshot](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/v61.JPG)

## V6 有什么新功能？

[**@xiaohuggg](https://twitter.com/xiaohuggg)总结了社区上目前的反馈**

- **提示词长度现在是350+**
- **您可以指定颜色和其他细节（划重点）**
- **你可以在画布上放置你想要的东西，如添加文本**
- **您可以提示多个主题**
- **你可以像ChatGPT一样和Midjourney聊天**
- **V6能够理解标点和语法的细微差别(即：熊猫吃、射、走）**
- **可以使用V6制作niji那样的漫画**
- **可以通过描述图像来为其添加框架或边框**

官方 Discord 频道对这次更新的详细解读（译）：

**V6 基础模型新特性**

- 更精准地遵循提示指令，支持更长的提示内容
- 模型的连贯性和知识水平有了显著提升
- 图像提示和混合效果得到改善
- 简单的文本绘制功能（需要将文本放在引号中，使用 **`--style raw`** 或较低的 **`--stylize`** 值可能更有帮助）
    - 例如：/imagine portrait of a brown kiwi, red santa hat on head, with white fur trim, happy, Color, huge eyes, brown body, cartoon, hyperealistic, kawaii, on isolated clean white background, Text, "Cutie KIWI". --s 250 --v 6.0
      

![Example Image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/v63.png)
    
- 改进的放大器，有 '细微' 和 '创造性' 两种模式（分辨率提高 2 倍）

以下特性/参数在启动时得到支持：--ar, --chaos, --weird, --tile ,--stylize, --style raw , Vary (subtle) ,Vary (strong), Remix, /blend ,/describe (仅 v5 版本)

这些功能尚未得到支持，但应该会在接下来的一个月内出现：Pan, Zoom, Vary (region), /tune, /describe (一个新的 v6 版本)

## 语义增强后的 V6 提示

- **与 V5 相比，V6 的提示有很大的不同。您需要“重新学习”如何提示。**
- V6 对您的提示更加敏感。不要用 "award winning, photorealistic, 4k, 8k" 这样的“垃圾”内容。
- 明确表达您想要的内容，现在它更擅长理解您。
- 如果您希望获得更具摄影性 / 更少主观性 / 更字面的内容，您可能应该默认使用 --style raw
- 较低的 --stylize 值（默认 100）可能会更好地理解提示，而较高的值（最高 1000）可能会有更好的美学效果

> 💡 一切都指向了 **不要直接复用你的v5.2prompt，新版的prompt里面可以增加更多细节！**

## 🤗 新的提示结构

v6 可以更好地理解提示。这意味着随机的短语和单词不再有效。我们需要一种创建提示的新方法。

[@ciguleva](https://twitter.com/ciguleva)提出了一个反映典型语言框架的简单结构

**风格+主题+设置+组成+照明+附加信息**

例如这个prompt:

💡 **1.风格：**

- 目的：提供特定的美学或艺术方向。
- 要包括的详细信息：首选风格或时代。

**2、主题：**

- 目的：定义图像的主要焦点。
- 要包括的细节：中心主题（例如人、物体、动物）的特征，包括外观、颜色和独特特征。

**3、设置：**

- 目的：为主题建立环境或背景。
- 详细信息包括：位置（室内、室外、想象）、环境元素（自然、城市）、一天中的时间和天气条件。

**4、组成：**

- 目的：确定如何构建和查看主题和元素。
- 详细信息包括：视角（特写、广角、空中）、角度和特定的取景偏好。

**5、照明：**

- 目的：设定图像的情绪和视觉基调。
- 详细信息包括：灯光类型（明亮、昏暗、自然）、情绪（欢快、神秘）和氛围效果。

**6、附加信息：**

- 目的：增加图像的复杂性和深度。
- 要包括的细节：次要物体、人物、动物以及它们相对于主要主题的相互作用或位置。

大家可以快来做自己的提示prompt试试看！

## V5 vs V6

![Comparison Image 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3191703154727_.pic_hd.jpg)

![Comparison Image 2](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/73d7936e16f7b43a5329d37c5e5fa207.jpg)

# 个人感受

这次内测反映了V6的一部分功能，除了在真实感和图像质量方面的提升，让我最深刻是它的“艺术性”史诗级别增强了！

V6版本的高调回归，可能是下一波AI生图“内卷”的苗头。

这半年的等待有一段时间，我并没有再订阅MJ，但我想说的是MJ V6是会让我重获生图的快乐～

**大家如果上自己上手体验但没有账号的话，欢迎在我们官方渠道 [有号friend](https://www.learnprompt.pro/aiMarket) 购买👏**