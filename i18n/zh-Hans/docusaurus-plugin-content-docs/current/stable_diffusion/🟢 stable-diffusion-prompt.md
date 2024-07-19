---
sidebar_position: 15
title: SD Prompt Template Syntax Guide
description: This guide provides a detailed overview of syntax and techniques for creating high-quality image prompts using SD models.
keywords: [SD prompt, image generation, prompt techniques, syntax, high-quality images]
slug: /stable-diffusion/sd-prompt-syntax/
---

# 🟢  SD Prompt模板语法

## 提示词输入基本要求

使用英文描述最佳，（有的模型使用中文训练， 可以使用中文写提示词）

标点符号建议使用英文进行输入

用逗号、句号、甚至是空字符（\0）来分隔关键词，可以提高图像质量。

提示词描述和图像风格尽可能搭配，相近的描述不要重复

利用反面提示词去除图片的负面效果

避免使用有多种含义的词语造成歧义

避免使用with, and 之类的连接词

姿势的描述越精简越好

避免过长的提示词，由于提示词的权重值从前向后递减，放置在特别靠后的提示词已经对图片的实际生成影响甚微。

## 输入技巧

先构思需要画什么，可以参考Danbooru这样的网站的数据集标签词

将相似的提示词组合在一起，使用英文半角逗号作为分隔符，按照从最重要到最不重要的顺序排列

模板示例

```python
(quality), (subject)(style), (action/scene), (artist), (filters)
```

`(quality)` 代表画面的品质，比如 low res 结合 sticker 使用来 “利用” 更多数据集， 1girl 结合 high quality 使用来获得高质量图像。

`(subject)` 代表画面的主题，锚定画面内容，这是任何提示的基本组成部分。

`(style)` 是画面风格，可选。

`(action/scene)` 代表动作/场景，描述了主体在哪里做了什么。

`(artist)` 代表艺术家名字或者出品公司名字。

`(filters)` 代表一些细节，补充。可以使用 艺术家，工作室，摄影术语，角色名字，风格，特效等等。

## 提示词语法

### 权重系数

`(word)` - 将权重提高 1.1 倍

`((word))` - 将权重提高 1.21 倍（= 1.1 * 1.1），乘法的关系。

`[word]` - 将权重降低 90.91%

 `(word:1.5)`- 将权重提高 1.5 倍

`(word:0.25)` - 将权重减少为原先的 25%

`\(word\)` - 在提示词中使用字面意义上的 () 字符

使用数字指定权重时，必须使用 () 括号。如果未指定数字权重，则假定为 1.1。

```
> ( n ) = ( n : 1.1 )
> (( n )) = ( n : 1.21 )
> ((( n ))) = ( n : 1.331 )
> (((( n )))) = ( n : 1.4641 )
> ((((( n )))) = ( n : 1.61051 )
> (((((( n )))))) = ( n : 1.771561 )
```

### 标签替换

可以一开始使用一个提示词，在生成的过程中间切换到其他提示词。基本语法是：

`[to:when]` 在指定数量的 step 后添加 to 到提示

`[from::when]` 在指定数量的 step 后从提示中删除 from

`[from:to:when]` 在指定数量的 step 后将 from 替换为 to

其中 `from` 与 `to` 是替换前后的提示词，`when` 表示替换时机。

如果 `when` 是介于 0 和 1 之间的数字，则它指进行切换的步数的百分比。如果它是一个大于零的整数，那么这代表进行切换的字面步数。

### 常用模板

**正面提示词：**

万能画质要求

```python
(masterpiece,best quality),
```

**反面提示词**

避免糟糕人像的

```python
ugly, fat, obese, chubby, (((deformed))), [blurry], bad anatomy,disfigured, poorly drawn face, mutation, mutated, (extra_limb),(ugly), (poorly drawn hands fingers), messy drawing, morbid,mutilated, tranny, trans, trannsexual, [out of frame], (bad proportions),(poorly drawn body), (poorly drawn legs), worst quality, low quality,normal quality, text, censored, gown, latex, pencil,
```

避免生成水印和文字内容

```python
lowres, bad anatomy, bad hands, text, error, missing fingers,extra digit, fewer digits, cropped, worst quality, low quality,normal quality, jpeg artifacts, signature, watermark, username, blurry,
```

通用

```python
lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,
```

避免变形的手和多余的手

```python
extra fingers,fused fingers,too many fingers,mutated hands,malformed limbs,
extra limbs,missing arms,poorly drawn hands,
```