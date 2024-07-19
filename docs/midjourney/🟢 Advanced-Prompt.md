---
sidebar_position: 75
title: Advanced Prompt Tools - Permutation Prompts, Repeat, and Seed
description: This guide introduces three tools to accelerate AI visual exploration, Permutation Prompts, Repeat, and Seed.
keywords: [Midjourney, permutation prompts, repeat, seed, image generation, advanced tools]
slug: /midjourney/advanced-prompt/
---
# 🟢 Advanced Prompt Tools: Permutation Prompts, Repeat, and Seed

> 😀 This article introduces three tools to help you accelerate AI visual exploration: **Permutation Prompts, Repeat, and Seed**

## Permutation Prompts

> Permutation prompts allow you to quickly generate variants of a prompt using a single `/imagine` command. By including a list of options separated by commas within curly braces `{}`, you can create multiple versions of a prompt with different combinations of these options.

Separate the list of options within curly braces `{}` to quickly create and process multiple prompt variants.

**Prompt Example:**

**`/imagine prompt`** **`a {red, green, yellow} bird`** creates and processes three jobs:

**`/imagine prompt`** **`a red bird`**

**`/imagine prompt`** **`a green bird`**

**`/imagine prompt`** **`a yellow bird`**

## Prompt Examples

1. The prompt **`/imagine prompt`** **`a naturalist illustration of a {pineapple, blueberry, rambutan, banana} bird`** will create and process four jobs:

![Example 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d92d11dd0447286c1167d83de1f34db9.png)

2. The prompt **`/imagine prompt`** **`a naturalist illustration of a fruit salad bird --{v 5, niji, test}`** will create and process three jobs using different Midjourney model versions:

![Example 2](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/89964a6e8e32452b96d4d0925c28e378.png)

## Repeat

> 🔥 The `--repeat` or `--r` parameter runs a job multiple times. Combine `--repeat` with other parameters (such as --chaos) to accelerate the pace of visual exploration.

## Using the `--repeat` or `--r` Parameter

Add **`--repeat <value>`** or **`--r <value>`** to the end of your prompt.

![Example 3](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/89964a6e8e32452b96d4d0925c28e378.png)

## Image Consistency Secret: Seeds

### The Midjourney bot uses seed numbers to generate a field of visual noise, similar to static noise on a TV screen, as a starting point for creating the initial image grid. Each image's seed number is generated randomly, but users can manually specify the seed parameter (`--seed`). If you use the same seed number with the same prompt, the resulting images will be very similar.

- **`--seed`** accepts integers from 0 to 4294967295.
- In model versions 4, 5, 6, and niji, using the same seed value (`--seed`) will generate almost identical images.

### Running Three Times Without Specifying a Seed

Prompt example: **`/imagine prompt`** **`celadon owl pitcher`**

### Running Three Times With a Specified Seed

Prompt example: **`/imagine prompt`** **`celadon owl pitcher --seed 123`**
