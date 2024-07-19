---
sidebar_position: 35
title: Shorten Command - Optimizing Prompts for Midjourney
description: Learn how to use the /shorten command to optimize prompts for better results in Midjourney.
keywords: [Midjourney, AI prompts, prompt optimization, /shorten command, token analysis]
slug: /midjourney/shorten-command/
---
# 🟢 "Shorten" Prompt

> 😀 The `/shorten` command analyzes prompts, highlighting the most impactful words, and suggests unnecessary words that can be removed. By using this command, you can optimize your prompts by focusing on essential terms.
> The `/shorten` command is not compatible with multi-prompts or the `--no` parameter.

## 📝 Using /Shorten

The Midjourney bot analyzes your prompts by breaking them down into smaller units called tokens. These tokens can be phrases, words, or even syllables. The Midjourney bot converts these tokens into a format it understands, using the associations and patterns learned during training to guide how it generates images. Think of tokens as building blocks that help the Midjourney bot understand your input and create the desired visual output.

### Why Use /Shorten?

Long prompts with unnecessary words, lengthy descriptions, poetic phrases, or direct addresses to the bot ("Please make me a picture," "Thank you for your help, Midjourney Bot!") can lead to unexpected elements being added to your image. The `/shorten` command helps you identify the most important words in your prompt and which words can be omitted.

## Command Example

> 🔥 Prompt: Please create a whimsical majestic tower of donuts, intricately crafted and adorned with a mesmerizing array of colorful sprinkles. Bring this sugary masterpiece to life, ensuring every detail is rendered in stunning magical realism. Thank you!

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b3c1229630dd5b0b58a8fce90b189404.jpg)

If you use the `/shorten` command on the above prompt, the Midjourney Bot will return the following information:

> **Important Tokens**
> 
> Please ~~create~~ a whimsical **majestic tower** of **donuts**, intricately crafted and adorned with a mesmerizing array of **colorful sprinkles**. Bring this **sugary** masterpiece to life, ~~ensuring every~~ detail is rendered in ~~stunning~~ **magical realism**. ~~Thank you!~~
> 
> **Shortened Prompts**
> 
> 1️⃣ Please, majestic tower of donuts, crafted, array of colorful sprinkles, sugary masterpiece, rendered, magical realism
> 2️⃣ Please, majestic tower of donuts, colorful sprinkles, sugary masterpiece, rendered, magical realism
> 3️⃣ Majestic tower of donuts, colorful sprinkles, sugary, magical realism
> 4️⃣ Majestic tower of donuts, colorful sprinkles, magical
> 5️⃣ Tower of donuts, sprinkles

The most important tokens are highlighted in bold, and the least important tokens are struck through. Based on this information, you also get 5 possible shorter prompts.

## Analysis Results

The shortest prompt, **Option 5️⃣: tower of donuts, sprinkles**, produced images closest to the original goal. Many filler words like "whimsical," "mesmerizing," and "masterpiece" can be omitted. Knowing that "tower" and "magical" are considered important tokens helps explain why some images were generated with fairy tale elements. Understanding this provides a clue that if the goal is to create a pile of delicious donuts, the word "magical" should be removed from the prompt.
