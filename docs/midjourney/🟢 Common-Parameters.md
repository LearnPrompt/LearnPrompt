---
sidebar_position: 60
title: Common Parameters
description: This page details commonly used parameters in Midjourney for customizing image generation settings.
keywords: [Midjourney, image parameters, aspect ratio, chaos, image weight, upscaler, stylize, tile, seed, stop]
slug: /midjourney/common-parameters/
---
# 🟢 Common Parameters

In the previous page, we explained the basic settings and provided examples of several parameters that start with *--*.

Parameters are options added to prompts that change how images are generated, such as the aspect ratio, switching between Midjourney model versions, changing the upscaler used, etc. The benefit of using parameters is that we can directly customize the settings for the current image without adjusting global settings.

Midjourney's prompts differ from ChatGPT's. Simply put, you can input complex prompts in ChatGPT because it can read syntax, whereas Midjourney works best with simple prompts + keywords (separated by commas).

The reason for placing commonly used parameters at the beginning of the Midjourney prompt is that you can consider parameters as keywords/prompts that maintain consistency in image generation. If there are parameters corresponding to the images you want to create (such as style, composition, etc.), I recommend using the parameter first instead of describing it with complex syntax in the prompt.

## /imagine Suffix Parameters

The parameters here apply to the end of the prompt. Multiple parameters can be added to a single prompt.

> 🔥 For some uncommon parameters, we will explain them in more detail later.

| Parameter | Name | Function |
| --- | --- | --- |
| --aspect | Aspect Ratio | Adjust the aspect ratio of the image |
| --chaos | Chaos | Change the diversity of results. Higher values produce more unusual and unexpected results |
| --iw <0–2> | Image Weight | Set the importance of the image prompt relative to the text prompt. The default value is 1. |
| --no | Negative Prompt | --no plants will attempt to remove plants from the image |
| --quality | Quality | --q <.25, .5, 1, or 2> represents how much rendering time is spent. The default value is 1. Higher values take more rendering time, lower values take less |
| --style random | Random Style | Adds a random Style Tuner code from the 32 base styles to your prompt. |
| --repeat <1–40> | Repeat | Create multiple jobs from a single prompt. |
| --seed | Seed | Random numbers are randomly generated for each image. Using the same seed number and prompt will produce similar images |
| --stop | Stop | Use the --stop parameter to complete the job midway. Stopping earlier will produce blurrier, less detailed results |
| --tile | Tile | Generates an image that can be used as a repeatable tile to create seamless patterns for fabrics, wallpapers, and textures |
| --version | Model Version | --v <1, 2, 3, 4, or 5> uses different versions of the Midjourney model |
| --style | Style Switch | --style <4a, 4b, or 4c> V4 model style switch; --style <expressive, or cute> Niji model style switch |
| --stylize | Stylize | Low stylize values generate images that match the prompt very closely but are less artistic. High stylize values create very artistic images that are less connected to the prompt |

[Official Full Parameter List](https://docs.midjourney.com/docs/parameter-list)

## Aspect Ratio

Use --aspect or --ar to change the aspect ratio of the generated image. The aspect ratio is the width-to-height ratio of an image. It is usually expressed as two numbers separated by a colon, such as 7:4 or 4:3.

Square images have equal width and height, described as a 1:1 aspect ratio. The image can be 1000px × 1000px, or 1500px × 1500px, and the aspect ratio remains 1:1. The ratio for computer screens might be 16:10, meaning the width is 1.6 times the height. So an image can be 1600px × 1000px, 4000px × 2000px, 320px × 200px, etc.

:::takeaways
The default aspect ratio is 1:1.
Aspect ratios must use integers. Use 139:100 instead of 1.39:1. The aspect ratio affects the shape and composition of the generated image.
:::

| Command | Description | V5 | V4 | Niji |
| --- | --- | --- | --- | --- |
| vibrant california poppies --ar 5:4 | Common aspect ratios--aspect 1:1 default ratio. --aspect 5:4 common for frames and prints. --aspect 3:2 common in print photography. --aspect 7:4 close to HD television screens and smartphone screens. | Supports any aspect ratio | 4c:1:2 to 2:1 4a/4b: only: 1:1, 2:3, or 3:2 | 1:2 to 2:1 |

![Aspect Ratio Chart](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9b1652d827cf505e263c2379358a74ca.png)

## Chaos

- The --chaos parameter affects how varied the initial image grid is. High --chaos values produce more unusual and unexpected results and combinations. Lower --chaos values have more reliable, repeatable results.

:::takeaways
· The --chaos range is 0–100.
· The default value is 0.
:::

### Low Value

Using a low --chaos value or not specifying a value will generate an initial image grid that is slightly different each time the job is run.

Example: /imagine prompt watermelon owl hybrid

![Owl Image 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/113e908a456305a75eff39f4d6e433f1.jpg)

### High Value

Using a high value for --chaos will produce more varied and unexpected initial image grids each time the job is run.

Example: /imagine prompt watermelon owl hybrid --c 50

![Owl Image 2](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/8e3144279e4ae6495d70985c1d5b02d5.jpg)

### Ultra-High Value

Using an extremely high value will produce different initial image grids with unexpected compositions or artistic mediums each time the job is run.

Example: /imagine prompt watermelon owl hybrid --c 100

![Owl Image 3](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ea2b694edde8dad2f4a3bbaaa3aa7a31.jpg)

## Tile

The --tile parameter generates images that can be used as repeatable tiles to create seamless patterns for fabrics, wallpapers, and textures.

:::takeaways
--tile works with model versions 1, 2, 3, and 5.
:::

Example: /imagine prompt scribble of moss on rocks --v 5 --tile

![Mossy Rocks](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/bda95e6771073de99d85b135e924ed9b.png)

Example: /imagine prompt watercolor koi --v 5 --tile

![Watercolor Koi](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/bf7c1775ad8530e4400ecdb0c3503d21.png)

## Stylize

The Midjourney Bot is trained to generate images that favor artistic colors, composition, and forms. --stylize (--s) is used to set the strength of this effect. Low values generate images that match the prompt very closely but are less artistic. High values create very artistic images that are less connected to the prompt.

:::takeaways
The default value for --stylize is 100, and it accepts integer values from 0-1000 when using the default [V4 model].
:::

![Stylize Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a1908917822bf0175dfe0afabd3293f1.png)

Example: /imagine prompt illustrated figs --s 100

![Illustrated Figs](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/cfcbf9a72c526578feafb0f7ca734637.jpg)

Example: /imagine prompt colorful risograph of a fig --s 100

![Colorful Risograph Fig](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a42ca78b1d9236f54f9fefca26d2814a.jpg)

Next chapter, we will focus on Midjourney prompts.
