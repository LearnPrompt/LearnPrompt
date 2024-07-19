---
sidebar_position: 20
title: Introduction to Stable Diffusion Models 2023
description: Explore how to leverage various models to enhance the quality and style of generated images using Stable Diffusion.
keywords: [Stable Diffusion, AI models, image generation, style transfer, machine learning]
slug: /stable-diffusion/models/
---

# 🟢 Introduction to Stable Diffusion Models

The model is the most crucial factor determining the quality of the generated images. Thus, learning how to utilize various models to enhance the quality and style of generated images is a valuable pursuit.

You can find various models here:

[https://huggingface.co/models?pipeline_tag=text-to-image](https://huggingface.co/models?pipeline_tag=text-to-image)

[https://civitai.com/](https://civitai.com/)

## Large Models

Also known as the base model, this category includes models with the largest training datasets, which significantly impact the quality of image generation. The default large model for Stable Diffusion is typically SD x.x (version number).

The downloaded large model can be placed in the application's `models/Stable_diffusion` path for use.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5b42ee3b91049d05f33c7de9f3e63cc8.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a79ea085845c107e7b77b91387018989.png)

### Anime Style Large Models

abyssorangemix3AOM3_aom3a1

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/077e88b538b0295e7d56f32d6b9cb66d.png)

dalcefoPainting_v4

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5ff2594916c9312261e236dbd60abde0.png)

pastelMixStylizedAnime_pastelMixPrunedFP16

Oil Painting Style

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/055102a32cec3b3cc0c9c54a6186f8c6.png)

threeDelicacyWonton_threeflavorwontonmixv

Ink Painting Style

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/8dfe4d0331469cda634d71a8b660a92f.png)

revAnimated_v11

Large Scenes

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/592baf82ffa43bc917e556e8a279fbd3.png)

Counterfeit

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/72fb7bebd5d0ff67151fcc4ec1e2f058.png)

TMND-Mix

Exceptional Indoor Environment

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/76a15877fab44ed325c71914279df5b4.png)

animelike2D

Anime Series Style

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/70098a4d212bf1393724f9014505aa30.png)

cetusMix

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1e9818567bf42a40cc5d3be5ee7debc5.png)

Color Box Model

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fa2269f02de47826946dccb8e6cb316e.png)

Night Sky YOZORA Style Model

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/28c52553b3cf058bcf6623446e22d17f.png)

## VAE Beautification Model

Similar to applying a filter, choosing VAE is akin to adding a filter to the image; default is none.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a4f646c6377999b664497ad9db1d81cd.png)

## Lora Model

The Lora model is a smaller model generated from parts of the large model. It doesn't have the full capabilities of the large models but performs better under specific conditions after targeted training.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/85da7ed49e10fbcf83ec036b6d43202d.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/dec25198c2a8d315e0c51ccf9081654e.png)

For example, if we see some Lora model images we like on C station, we can download its Lora model by clicking on the exclamation mark to view its parameters.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/77693e1debf3e4bd3a3a21c5a30582e9.png)

Once downloaded, we place the Lora model in this path

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c52652d3360dd1d4ba12c6ff0e251f66.png )

In the application, select the Lora model under additional network to use.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/798e87afebc5d349688985d68fa786e9.png)

Below are the comparison images generated with and without using the Lora model.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c26ecf9425627139281dab35e00bf539.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ac570db3284828a3ecc376760273bbde.png)
