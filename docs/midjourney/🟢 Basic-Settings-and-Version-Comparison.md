---
sidebar_position: 50
title: Basic Settings and Version Comparison
description: This page provides an overview of common options like model version, style values, quality values, and upgrader version settings.
keywords: [Midjourney, MJ Version, model settings, style values, quality settings, MJ upgrade]
slug: /midjourney/settings-version-comparison/
---
# 🟢 Basic Settings and Version Comparison

The **/settings** command provides toggle buttons for commonly used options such as model version, style values, quality values, and upgrader version.

> Parameters added to the end of the prompt will override the settings in **/settings**.

![Settings Image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a823f709427ba5070a549a46f3f26d79.jpg)

## Model Versions

- 1️⃣ MJ Version 1
- 2️⃣ MJ Version 2
- 3️⃣ MJ Version 3
- 4️⃣ MJ Version 4
- 5️⃣ MJ Version 5
- 🌈 Niji Mode
- 🤖 MJ Test
- 📷 MJ Test Photo

These buttons can be used to set the model version being used. MJ Version 5 is only available to Midjourney subscription users.

Midjourney defaults to the latest model. There are two ways to switch models:

- Add **-version [v1|v2|v3|v4|v5|V5.1|V5.2]** to the end of the prompt. (version can be abbreviated to v)
- Use the **/settings** command and select the model version.

### V5.2

The Midjourney V5.2 model was released in June 2023. To use this model, add the **`--v 5.2`** parameter to the end of the prompt, or use the **`/settings`** command and select **`5️⃣ MJ Version 5.2`**.

This model produces more detailed, clearer results with better colors, contrast, and composition. It also has slightly better prompt understanding than earlier models and is more responsive to the **`--stylize`** parameter across its full range.

### **Model Version 5.2 + Style Raw Parameter**

Midjourney Versions 5.1 and 5.2 can be fine-tuned using the **`--style raw`** parameter to reduce Midjourney's default aesthetic adjustments.

![Style Raw Image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/144cb3a3c3b6eec230e5a82406714764.png)

### V5.1

The Midjourney V5.1 model was released on May 4, 2023. To use this model, add the **`--v 5.1`** parameter to the end of the prompt, or use the **`/settings`** command and select **`5️⃣ MJ Version 5.1`**.

This model has a stronger default aesthetic, making it easier to use simple text prompts. It also has higher consistency, better natural language prompt interpretation, fewer unwanted artifacts and borders, improved image clarity, and supports advanced features like the **`--tile`** repeat mode.

![V5.1 Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3b79fb3690a0dab81a6c93d44c94dcb3.png)

## V5

The V5 model, released on March 15, 2023, is the latest and most advanced model. To use this model, add the **--v 5** parameter to the end of the prompt, or use the **/settings** command and select **5️⃣ MJ Version 5**. This model has very high coherence, excels at interpreting natural language prompts, and offers higher resolution.

![MJ_V5_VibrantCaliforniaPoppies](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e4fb001f577344317e7672926d749347.png)

```python
vibrant California poppies --v 5
```

## V4

The V4 model is the version we use the most now. It has more knowledge about creatures, places, objects, etc. It is better at handling small details correctly and can handle complex prompts containing multiple roles or objects.

![MJ_V4a](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fa67b0aa9f59bf1d17a4d24dfcc096e8.jpg)

```python
vibrant California poppies
```

## V4 style switch 4a,4b,4c

Midjourney Model Version 4 has three slightly different "styles" and makes minor adjustments to the style adjustment of the model. Experiment with these versions by adding --style 4a, --style 4b at the end of the V4 prompt.

1. -v 4 --style 4c is the current default value and does not need to be added to the end of the prompt.
2. -style 4a and --style 4b only support 1:1, 2:3 and 3:2 aspect ratios.
3. -style 4c supports up to 1:2 or 2:1 aspect ratios.

## Niji

This model is a collaboration between Midjourney and Spellbrush niji, which can be adjusted to produce animation and illustration styles. This model has a better understanding of animation style and animation aesthetics. Generally speaking, it performs well in dynamic and action shots and character-centered composition.

## V5 version Niji

The Niji Version 5 model is the latest and most advanced Niji model. To use this model, you can add the --niji 5 parameter to the end of the prompt, or use the instruction settings and select 5️🍏 Niji version 5**. Niji Model Version 5 can also achieve a unique appearance through --style. Try --style expressive or --style cute**:

## **Image quality**

![MJ_settings](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a823f709427ba5070a549a46f3f26d79.jpg)

- 🔥 Half Quality
- 🔥 Base Quality
- 🔥 High Quality (2x cost)

Half Quality = --q .5, Base Quality = --q 1, High Quality = --q 2.

The **--quality** instruction (which can be abbreviated as **-q**) is used to modify the time required to generate the image. Higher-quality settings take longer to process and generate more details. **Quality settings do not affect the resolution**.

- The default value of --quality is 1.
- -quality accepts the following values: .25, .5 and 1. The larger value will be rounded down to 1.
- -quality only affects the initial image generation.
- -quality is suitable for model versions 1, 2, 3, 4, 5 and niji.

Higher-quality is not always better. Sometimes lower-quality can produce better results.

## Remix

Use Remix mode to change the aspect ratio between prompts, parameters, model versions or variants. Remix will adopt the general composition of the starting image and use it as part of the new work.

- Use the/prefer remix instruction
- Use the /settings command and toggle button to activate the mix mode 🎛️ Remix Mode

The use of Remix is mainly divided into three steps.

1. Open the Remix mode and select the image grid or the upgraded image to Remix.

2. Select "Make Variations" to modify or enter a new prompt in the pop-up window.

3. Midjourney Bot generates images with new tips affected by the original image.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/df60b4f7b9bf7baca45ea2cb1a8a1db0.png)

Personally, I think it is easier to use in complex composition.

## Privacy & Generation Speed

The following four parameters can only be set by subscribers.

🧍‍♂️Public 🕵️ Stealth

Switch between public mode and stealth mode. Corresponds to **/public** and **/stealth** instructions. Under the public model, the photos you generate are visible to everyone; the stealth model is the opposite.

🐇 Fast 🐢 Relax

Switch between Fast and Relaxed modes. Corresponds to the /fast and /relax commands. Fast mode consumes the subscriber's GPU time. If it exceeds the length of the package, it will automatically switch to Relax.

## Custom preferences

Use the prefer instruction to create custom options to automatically add common parameters to the end of the prompt.

- The completed work of prefer auto_dm will be automatically sent to direct messages.
- prefer option Create or manage custom options.
- prefer option list to see your current custom options.
- prefer suffix specifies the suffix to be added to the end of each prompt.

### Preference options

```python
/prefer option set <name> <value>
```

Create custom parameters that can be used to quickly add multiple parameters to the end of the prompt.

1. Step 1: Create a custom phrase

![PreferOptionSet](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/24d0b3deb51b115d81637f8e83601702.png)

1. Step 2: Using **/imagine prompt vibrant California poppies --mine**, it will be interpreted as **/imagine prompt vibrant Califor Nia poppies --hd --ar 7:4
2. List all custom phrases prefer option list

List all the options created with prefer option set. Users can have up to 20 custom options.

![PreferOptionList](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/f0e53c3b49347765610732f8aa559b5a.png)

1. Delete custom phrases To delete custom phrases, use

```python
/prefer option set <name to delete>
```

## Preferred suffix

**/prefer suffix**automatically adds the specified suffix after all prompts. Use the unvalued command to reset.

Example of adding suffix: /prefer suffix --uplight --video

Example of reset: /prefer suffix