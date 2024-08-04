---
sidebar_position: 15
title: Guide to Creating Effective Prompts for Midjourney
description: A comprehensive guide on how to create effective prompts for generating images with Midjourney.
keywords: [Midjourney, prompt, image generation, AI, guide, tutorial, art]
slug: /midjourney/prompt-guide/
---
# 🟢 Prompt

> 💡 A prompt is a short text phrase that the Midjourney bot interprets to generate an image. The Midjourney bot breaks down the words and phrases in the prompt into smaller parts (called tokens), compares them to its training data, and then uses them to generate an image.

## Basic Structure

A basic prompt can be as simple as a single word, phrase, or emoji. Very short prompts will rely heavily on Midjourney's default style.

![Basic Prompt Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/22199e1b8838f8aa638d244ebd650c71.png)

Complete prompt: Can include one or more image links, multiple text phrases or words, and one or more suffix parameters.

![Complete Prompt Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d26bd9bbc22ca67d681c0b74f41eec26.png)

- **Image Prompts**: You can add image URLs to a prompt to influence the style and content of the final result. Image URLs always come at the beginning of the prompt.
- **Prompt Text**: The text description of the image you want to generate.
- **Parameters**: Parameters change how the image is generated. Parameters can change aspect ratios, models, upscalers, etc. Parameters are at the end of the prompt.

> Image Prompts will be detailed on the next page.

## Syntax Principles

The Midjourney bot does not understand grammar and sentence structure like humans do. Therefore, word choice is crucial.

- In many cases, more specific synonyms work better. For example, use "gigantic," "enormous," or "immense" instead of "big."
- Use fewer words whenever possible. Fewer words mean each word has a more powerful impact.
- Use commas, brackets, and hyphens to help organize your ideas.
- The Midjourney bot does not consider case sensitivity.
- It's better to describe what you want rather than what you don't want. If you want to ensure that something is not in the final image, try using the --no parameter.

V4 and V5 are slightly better at interpreting sentence structure than other models.

## Detailed Descriptions

Try to clarify important context or details:

1. Subject: Person, animal, character, location, object, etc.
2. Medium: Photo, painting, illustration, sculpture, doodle, tapestry, etc.
3. Environment: Indoors, outdoors, on the moon, in Narnia, underwater, the Emerald City, etc.
4. Lighting: Soft, ambient, overcast, neon, studio lights, etc.
5. Color: Vibrant, muted, bright, monochromatic, colorful, black and white, pastel, etc.
6. Mood: Sedate, calm, raucous, energetic, etc.
7. Composition: Portrait, headshot, close-up, bird's-eye view, etc.

:::takeaways
When you do not specify something in your prompt, the corresponding content will be randomized. This can provide some inspiration initially, but if you want to reduce randomness, use prompt templates to fill in the elements above.
:::

## Specifying Art Medium

Crayon, scratchboard, printmaking, flash, ink, and colored paper. One of the best ways to generate an image is to specify a medium.

```python
/imagine prompt <any art style> style cat
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1dffe168b3771147b9ca67e1161b51cd.png)

## Decades

Different eras have different visual styles.

```python
/imagine prompt <decade> cat illustration
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ac4a7dae7cb2e2ba80e19075fed9e568.png)

## Emotions

```python
/imagine prompt <emotion> cat
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/049f4cddf1f43a28a21b4121e50cb8dc.png)

## Colors

```python
/imagine prompt <emotion> cat
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/049f4cddf1f43a28a21b4121e50cb8dc.png)

## Environments

```python
/imagine prompt <location> cat
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/078288fc01fda81aeb9428b7ffcdd555.png)