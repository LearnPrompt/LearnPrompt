---
sidebar_position: 30
title: ControlNet - Enhancing Stable Diffusion with Powerful Plugins
description: Discover how ControlNet plugins revolutionize image generation with Stable Diffusion by integrating shapes and structures right at the start, facilitating AI to complete the masterpiece.
keywords: [ControlNet, Stable Diffusion, AI Plugins, Image Generation, AI Art, Plugin Installation, ControlNet Models]
slug: /stable-diffusion/controlnet/
---

# 🟢  ControlNet

ControlNet is a plugin for Stable Diffusion that allows the incorporation of a predefined shape into the initial image, which AI then completes.

## Plugin Installation

For Windows users who followed the installation and deployment section, the plugin is already included in the downloaded package, so no manual installation is necessary. Others can install the `sd-webui-controlnet` plugin from the extensions section.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/plugin-installation-guide.png)

## Model Installation

In addition to the plugin, the ControlNet model needs to be downloaded from the following links:

[https://huggingface.co/webui/ControlNet-modules-safetensors/tree/main](https://huggingface.co/webui/ControlNet-modules-safetensors/tree/main)

[https://huggingface.co/lllyasviel/ControlNet/tree/main/models](https://huggingface.co/lllyasviel/ControlNet/tree/main/models)

Place the downloaded models in the following path:

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/model-path-example.png)

For some versions, place the applications in the `/extensions/sd-webui-controlnet/models` directory.

## **Model Overview**

| Model | Effect |
| --- | --- |
| Canny | Uses algorithms to intricately capture the edges of the image as references for generation. |
| mlsd | Attempts to capture prominent straight lines in the image for reference. |
| hed | Attempts to capture image features for reference. |
| Scribbles | Uses provided lines as structural references for generating images. |
| openpose | Generates a skeleton from the human figures in the image for reference. |
| seg | Replaces the image with broad color blocks for reference. |
| depth | Tries to capture the depth and distance within the image for reference. |
| normal | Similar to depth, tries to capture the depth and distance within the image for reference. |

## Examples

For instance, using Canny for coloring line art:

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/canny-coloring-example.png)

Enter the prompt words, select the main model, sampler, and adjust the height as needed.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/controlnet-setup-example.png)

Then click on the ControlNet module, upload your line art, check the enable box and invert input colors (since our image has a white background), adjust the canvas height accordingly. If your GPU performance is limited, consider selecting the low memory mode.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/controlnet-activation-example.png)

Then click generate, and the result is as shown:

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/final-generated-image.png)

Another example is using openpose, a feature that generates images based on skeletons:

We select the openpose model in ControlNet and click generate.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/openpose-setup-example.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/openpose-generated-image.png)
