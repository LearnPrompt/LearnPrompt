---
sidebar_position: 10
title: Understanding SD_WebUI
description: This page provides a detailed guide on using and switching between different Stable Diffusion models in SD_WebUI.
keywords: [SD_WebUI, Stable Diffusion, AI model, VAE, image generation, presets]
slug: /stable-diffusion/sd-webui-guide/
---

# 🟢 Understanding SD_WebUI

In the top left corner is the option to switch between different Stable Diffusion large models. We can place the downloaded large model files under `/sd-webui-aki/sd-webui-aki-v4/models/Stable-diffusion`, and then switch to the large model we need.

The following websites allow us to download the desired large models:
[https://huggingface.co/models?pipeline_tag=text-to-image](https://huggingface.co/models?pipeline_tag=text-to-image)

[https://civitai.com/](https://civitai.com/)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5b6ab4503cb29526469f514dcfecdf30.png)

VAE (Variational Auto-Encoder) models can be considered as filters. The VAE models we have downloaded can be placed under `/sd-webui-aki/sd-webui-aki-v4/models/VAE` to switch the VAE model.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/db1ddf79d3ced50340b16f183321470c.png)

Unlike Midjourney, SD offers not only positive prompt words but also negative prompt words that help control the content not to appear in the generated images. More on this feature will be discussed in the following sections.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/90e1b87d79ffb64c21d69422c00d3622.png)

Next, let's talk about the function of these buttons. The generate button is used after setting the prompt words and parameters to generate the image.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/cc5e7b5ad659bbe0f6a2bc33d0da42a1.png)

The first button is to load all the parameter information (including keywords) of the last generated image. For example, if you close the software after drawing an image, and then start it again, clicking this button will copy the parameters back in.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a94f2b7c064fcfdf14db86e3ce5b97c0.png)

The second button is for deleting, clearing the keywords.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ffada52b2852c85f82195e3ae1142e8b.png)

The third button is for model selection management. After clicking, an additional box appears allowing manual model selection.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7ef29c6589a31cd8243869243e1282c4.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/57879f0db830feae84661418641fc7af.png)

The last button is to save our presets. After setting the prompt words, clicking the last button will display a box where you can enter a name to save as a preset template.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/97de92165dc41e411f34b1c8dabb644f.png)

In the preset styles, select the preset we just saved, and clicking the fourth button will load the preset we just saved.
