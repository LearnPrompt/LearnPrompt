---
sidebar_position: 70
title: Midjourney V6 Alpha Review - Enhancing Chinese Artistic Style, Crafting New Prompts
description: This review highlights the new features of Midjourney V6 Alpha and provides a guide for creating effective prompts to utilize its enhanced capabilities.
keywords: [Midjourney V6, Alpha, prompt crafting, artistic style, new features, image generation]
slug: /midjourney/v6-alpha-review/
---
# 🟢 Midjourney V6 Alpha Review - Enhancing Chinese Artistic Style, Crafting New Prompts

> 😀 As of December 21, the Midjourney V6 Alpha version is open for testing! Select V6 from the dropdown menu in /settings or enter --v 6 at the end of your prompt.

Experience the web version: [alpha.midjourney.com](http://alpha.midjourney.com/)

V6 is the third model trained from scratch by the Midjourney team. This project has been in preparation for 9 months.

![V6 Screenshot](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/v61.JPG)

## What's New in V6?

[**@xiaohuggg](https://twitter.com/xiaohuggg) summarized community feedback so far**

- **Prompt length is now 350+**
- **You can specify colors and other details (highlight)**
- **You can place things like text on the canvas**
- **You can prompt multiple subjects**
- **You can chat with Midjourney like ChatGPT**
- **V6 can understand punctuation and grammatical nuances (e.g., panda eats, shoots, and leaves)**
- **You can create niji-like comics using V6**
- **You can add frames or borders to images by describing them**

Official Discord channel's detailed interpretation of this update (translated):

**V6 Base Model New Features**

- More accurate adherence to prompt instructions, supporting longer prompts
- Significant improvements in model coherence and knowledge level
- Improved image prompts and mixing effects
- Simple text rendering capability (place text in quotes, using **`--style raw`** or lower **`--stylize`** values may help)
    - Example: /imagine portrait of a brown kiwi, red santa hat on head, with white fur trim, happy, Color, huge eyes, brown body, cartoon, hyperrealistic, kawaii, on isolated clean white background, Text, "Cutie KIWI". --s 250 --v 6.0

![Example Image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/v63.png)

- Improved upscalers, with 'subtle' and 'creative' modes (2x resolution increase)

The following features/parameters are supported at launch: --ar, --chaos, --weird, --tile, --stylize, --style raw, Vary (subtle), Vary (strong), Remix, /blend, /describe (V5 only)

These features are not yet supported but should appear within the next month: Pan, Zoom, Vary (region), /tune, /describe (new V6 version)

## Enhanced V6 Prompts

- **V6 prompts differ significantly from V5. You need to "relearn" how to prompt.**
- V6 is more sensitive to your prompts. Avoid "junk" content like "award winning, photorealistic, 4k, 8k".
- Clearly express what you want, as it is better at understanding you now.
- If you want more photographic/less subjective/more literal content, you might default to --style raw.
- Lower --stylize values (default 100) may better understand the prompt, while higher values (up to 1000) may have better aesthetic effects.

> 💡 All signs point to **not reusing your v5.2 prompts directly; you can add more details to the new prompts!**

## 🤗 New Prompt Structure

V6 can better understand prompts. This means random phrases and words are no longer effective. We need a new method for creating prompts.

[@ciguleva](https://twitter.com/ciguleva) proposed a simple structure reflecting typical language frameworks

**Style + Subject + Setting + Composition + Lighting + Additional Information**

For example, this prompt:

💡 **1. Style:**

- Purpose: Provide a specific aesthetic or artistic direction.
- Details to include: Preferred style or era.

**2. Subject:**

- Purpose: Define the main focus of the image.
- Details to include: Characteristics of the central subject (e.g., person, object, animal), including appearance, color, and unique features.

**3. Setting:**

- Purpose: Establish the environment or background for the subject.
- Details to include: Location (indoor, outdoor, imaginary), environmental elements (nature, city), time of day, and weather conditions.

**4. Composition:**

- Purpose: Determine how the subject and elements are constructed and viewed.
- Details to include: Perspective (close-up, wide-angle, aerial), angle, and specific framing preferences.

**5. Lighting:**

- Purpose: Set the mood and visual tone of the image.
- Details to include: Type of lighting (bright, dim, natural), mood (cheerful, mysterious), and ambiance effects.

**6. Additional Information:**

- Purpose: Add complexity and depth to the image.
- Details to include: Secondary objects, characters, animals, and their interactions or positions relative to the main subject.

Try creating your own prompts with this structure!

## V5 vs V6

![Comparison Image 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3191703154727_.pic_hd.jpg)

![Comparison Image 2](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/73d7936e16f7b43a5329d37c5e5fa207.jpg)

# Personal Feelings

This alpha test reflects part of V6's functionality. In addition to improvements in realism and image quality, what impresses me most is its "artistic" enhancement at an epic level!

The high-profile return of V6 might be the start of the next wave of AI-generated image competition.

After waiting for half a year, I didn't subscribe to MJ for a while, but I have to say that MJ V6 will rekindle my joy of creating images!

**If you want to experience it yourself but don't have an account, feel free to purchase one through our official channel [有号friend](https://www.learnprompt.pro/aiMarket)👏**
