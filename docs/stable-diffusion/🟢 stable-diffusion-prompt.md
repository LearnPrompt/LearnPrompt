---
sidebar_position: 15
title: SD Prompt Template Syntax Guide
description: This guide provides a detailed overview of syntax and techniques for creating high-quality image prompts using SD models.
keywords: [SD prompt, image generation, prompt techniques, syntax, high-quality images]
slug: /stable-diffusion/sd-prompt-syntax/
---

# 🟢 SD Prompt Template Syntax

## Basic Requirements for Prompt Input

It's best to use English descriptions, although some models are trained in Chinese, allowing for Chinese prompt inputs.

It is recommended to use English punctuation.

Use commas, periods, or even null characters (\0) to separate keywords, which can improve image quality.

Match prompt descriptions and image styles as closely as possible; avoid repeating similar descriptions.

Use negative prompts to eliminate negative effects in images.

Avoid using ambiguous words that have multiple meanings.

Avoid using connectors like "with" and "and".

Keep descriptions of poses as concise as possible.

Avoid overly long prompts; the weight of the prompt words decreases from the front to the back, so words placed especially at the back have minimal impact on the actual image generation.

## Input Techniques

First, conceptualize what needs to be depicted; you can refer to dataset tags on websites like Danbooru.

Group similar prompt words together, using English commas as separators, arranged from most important to least important.

Template Example

```python
(quality), (subject)(style), (action/scene), (artist), (filters)
```

`(quality)` represents the quality of the image, for instance, 'low res' combined with 'sticker' to leverage more datasets, '1girl' combined with 'high quality' to obtain high-quality images.

`(subject)` anchors the content of the image, a fundamental component of any prompt.

`(style)` is optional and pertains to the style of the image.

`(action/scene)` describes what the subject is doing and where.

`(artist)`  can be the name of an artist or a production company.

`(filters)` are additional details. You can use terms related to artists, studios, photography, character names, styles, effects, etc.

## Prompt Syntax

### Weight Coefficients

`(word)`  - Increases the weight by 1.1 times.

`((word))` - Increases the weight by 1.21 times (= 1.1 * 1.1), multiplicative relationship.

`[word]`  - Reduces the weight by 90.91%.

`(word:1.5)` - Increases the weight by 1.5 times.

`(word:0.25)`  - Reduces the weight to 25% of the original.

`\(word\)`  - Uses the literal meaning of () characters in the prompt.

When specifying weights numerically, you must use () brackets. If no numerical weight is specified, it is assumed to be 1.1.

```
> ( n ) = ( n : 1.1 )
> (( n )) = ( n : 1.21 )
> ((( n ))) = ( n : 1.331 )
> (((( n )))) = ( n : 1.4641 )
> ((((( n )))) = ( n : 1.61051 )
> (((((( n )))))) = ( n : 1.771561 )
```

### Tag Replacement

You can start with one prompt and switch to another during generation. The basic syntax is:

`[to:when]` adds 'to' to the prompt after a specified number of steps.

`[from::when]` removes 'from' from the prompt after a specified number of steps.

`[from:to:when]` replaces 'from' with 'to' after a specified number of steps.

`from`  and `to`  are the prompts before and after the replacement, and `when`  indicates the timing of the replacement.

If  `when`  is a number between 0 and 1, it refers to the percentage of steps at which the switch occurs. If it is a positive integer, it represents the literal number of steps.

### Common Templates

**Positive Prompt**

Universal Quality Requirement

```python
(masterpiece,best quality),
```

**Negative Prompts**

Avoid Poor Portraits

```python
ugly, fat, obese, chubby, (((deformed))), [blurry], bad anatomy,disfigured, poorly drawn face, mutation, mutated, (extra_limb),(ugly), (poorly drawn hands fingers), messy drawing, morbid,mutilated, tranny, trans, trannsexual, [out of frame], (bad proportions),(poorly drawn body), (poorly drawn legs), worst quality, low quality,normal quality, text, censored, gown, latex, pencil,
```

Avoid Generating Watermarks and Text Content

```python
lowres, bad anatomy, bad hands, text, error, missing fingers,extra digit, fewer digits, cropped, worst quality, low quality,normal quality, jpeg artifacts, signature, watermark, username, blurry,
```

General

```python
lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,
```

Avoid Deformed Hands and Extra Hands

```python
extra fingers,fused fingers,too many fingers,mutated hands,malformed limbs,
extra limbs,missing arms,poorly drawn hands,
```