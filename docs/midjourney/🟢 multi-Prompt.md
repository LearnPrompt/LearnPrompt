---
sidebar_position: 25
title: Multi-prompt Techniques
description: A guide on how to use multi-prompts and their weights in Midjourney Bot.
keywords: [Midjourney, multi-prompt, prompt weight, AI image generation, hot dog example]
slug: /midjourney/multi-prompts/
---
# 🟢 Multi-Prompt Techniques

Use double colons "::" in prompts to indicate that Midjourney Bot should consider each part of the prompt separately.

In the example below, the prompt **hot dog** is considered as a single concept, and Midjourney Bot generates an image of a hotdog. If the prompt is split into two parts **hot:: dog**, Midjourney Bot considers the two concepts separately, resulting in an image of a "hot" dog.

![Hot Dog Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/109f046ad8ae1b470d5f4091d48418e8.png)

## Multi-Prompt Weights

When using double colons :: to split prompts into different parts, you can immediately follow the double colons with a number to assign the relative importance of that part of the prompt.

In the example below, the prompt **hot:: dog** generates a warm dog.

Changing the prompt to **hot::2 dog** makes the term "hot" twice as important as the term "dog", resulting in a fiery dog!

![Hot Dog Weight Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/98cd841e1cc07eb7b19fc72d1c03e936.png)
