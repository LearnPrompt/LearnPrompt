---
sidebar_position: 75
title: Midjourney高级提示工具
description: This guide introduces three tools to accelerate AI visual exploration, Permutation Prompts, Repeat, and Seed.
keywords: [Midjourney, permutation prompts, repeat, seed, image generation, advanced tools]
slug: /midjourney/advanced-prompt/
---
# 🟢 高级提示工具：排列提示&重复生成&随机数种子

> 😀 本文会介绍三个帮助大家加快AI视觉探索的工具，有**Permutation Prompts 排列提示，Repeat重复，Seeds种子**

## 排列提示

> 排列提示允许您使用单个 `/imagine` 命令快速生成提示的变体。通过在提示中包含用逗 `,` 号分隔的大括 `{}` 号内的选项列表，可以创建具有这些选项的不同组合的提示的多个版本。

将选项列表分隔在大括号 {} 内，以快速创建和处理多个提示变体。

**Prompt Example: 提示示例：**

**`/imagine prompt`** **`a {red, green, yellow} bird`** creates and processes three Jobs.**`/imagine prompt`** **`a {red, green, yellow} bird`** 创建并处理三个作业。

**`/imagine prompt`** **`a red bird`**

**`/imagine prompt`** **`a green bird`**

**`/imagine prompt`** **`a yellow bird`**

## 提示示例

1. 提示 **`/imagine prompt`** **`a naturalist illustration of a {pineapple, blueberry, rambutan, banana} bird`** 将创建并处理四个作业：

![Example 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d92d11dd0447286c1167d83de1f34db9.png)

1. 提示 **`/imagine prompt`** **`a naturalist illustration of a fruit salad bird --{v 5, niji, test}`** 符将使用不同的 Midjourney 模型版本创建和处理三个作业：

## Repeat 重复生成

> 🔥 `--repeat` or `--r` 参数多次运行作业。与其他参数（如 --chaos）结合 `--repeat` 使用，以加快视觉探索的节奏。

## 使用 `-repeat` or `-r` 参数

Add **`--repeat <value>`** or **`--r <value>`** to the end of your prompt.在提示的末尾添加 **`--repeat <value>`** 或 **`--r <value>`** 。

![Example 3](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/89964a6e8e32452b96d4d0925c28e378.png)

## 图像一致性秘籍：Seeds 随机数种子

### Midjourney机器人利用种子号生成一个视觉噪声区域，这个区域类似于电视屏幕的静态噪声，作为创造初始图像网格的出发点。每个图像的种子号都是随机产生的，但用户可以通过设置种子参数（--seed）来手动指定。如果你对同一个提示使用相同的种子号，最终得到的图像将会十分相似。

- **`--seed`** 接受整数 0–4294967295。
- 在模型版本4、5、6以及niji中，使用相同的种子值（--seed）可以生成几乎一致的图像。

### 未指定随机种子运行三次

提示示例： **`/imagine prompt`** **`celadon owl pitcher`**

### 指定随机种子运行三次

提示示例： **`/imagine prompt`** **`celadon owl pitcher --seed 123`**