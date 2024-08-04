---
sidebar_position: 20
title: Stable Diffusion常用模型介绍
description: Explore how to leverage various models to enhance the quality and style of generated images using Stable Diffusion.
keywords: [Stable Diffusion, AI models, image generation, style transfer, machine learning]
slug: /stable-diffusion/models/
---

# 🟢  Stable Diffusion 模型介绍

模型是决定图片生成的效果的最重要的因素，因此如何利用模型来提高生成的图片的质量、风格是非常值得学习的一环。

这里可以找到各种各样的模型：

[https://huggingface.co/models?pipeline_tag=text-to-image](https://huggingface.co/models?pipeline_tag=text-to-image)

[https://civitai.com/](https://civitai.com/)

## 大模型

又可以称为base model，这一类模型的训练数据集最大，对图片生成效果的影响也最大。Stable Diffusion一般默认的大模型为SD x.x(版本号)

下载的大模型我们把它放在应用的models/Stable_diffusion 路径下，即可使用

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5b42ee3b91049d05f33c7de9f3e63cc8.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a79ea085845c107e7b77b91387018989.png)

### 二次元风格大模型

abyssorangemix3AOM3_aom3a1

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/077e88b538b0295e7d56f32d6b9cb66d.png)

dalcefoPainting_v4

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5ff2594916c9312261e236dbd60abde0.png)

pastelMixStylizedAnime_pastelMixPrunedFP16

油画风

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/055102a32cec3b3cc0c9c54a6186f8c6.png)

threeDelicacyWonton_threeflavorwontonmixv

水墨风

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/8dfe4d0331469cda634d71a8b660a92f.png)

revAnimated_v11

大场景

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/592baf82ffa43bc917e556e8a279fbd3.png)

Counterfeit

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/72fb7bebd5d0ff67151fcc4ec1e2f058.png)

TMND-Mix

优秀的室内环境

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/76a15877fab44ed325c71914279df5b4.png)

animelike2D

动漫番画风

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/70098a4d212bf1393724f9014505aa30.png)

cetusMix

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1e9818567bf42a40cc5d3be5ee7debc5.png)

Color Box Model

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fa2269f02de47826946dccb8e6cb316e.png)

Night Sky YOZORA Style Model

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/28c52553b3cf058bcf6623446e22d17f.png)

## VAE美化模型

比较像滤镜的感觉，选择VAE相当于给图片加上滤镜；默认是无。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a4f646c6377999b664497ad9db1d81cd.png)

## Lora模型

Lora模型是拿大模型的一部分生成的小模型，它的能力没有大模型完整，但是经过特定的训练在某些特定内容下会有更好的效果。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/85da7ed49e10fbcf83ec036b6d43202d.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/dec25198c2a8d315e0c51ccf9081654e.png)

比如我们看到C站上一些喜欢的Lora模型的图片，我们可以下载它的lora模型，点击感叹号查看它的参数

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/77693e1debf3e4bd3a3a21c5a30582e9.png)

下载好的lora模型我们放在此路径下

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c52652d3360dd1d4ba12c6ff0e251f66.png)

在应用中的additional network就可以选择lora模型使用了

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/798e87afebc5d349688985d68fa786e9.png)

以下是使用lora模型和未使用的生成图片的对比

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c26ecf9425627139281dab35e00bf539.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ac570db3284828a3ecc376760273bbde.png)