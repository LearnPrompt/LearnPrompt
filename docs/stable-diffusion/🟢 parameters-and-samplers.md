---
sidebar_position: 25
title: Parameters and Sampling Techniques in Image Generation
description: This page details different parameters and samplers used in image generation, explaining their effects and optimal settings.
keywords: [Image generation, samplers, Euler, DDIM, LMS, PLMS, DPM2, tiling, high-resolution, CFG scale, random seed]
slug: /stable-diffusion/parameters-and-samplers/
---

# 🟢 Parameters

Different settings result in different images.

## Sampler

Euler, Euler a (more detailed), Euler is the simplest, hence it generates images faster. Euler a is more creative, producing different images with varying step counts. However, setting steps greater than 30 does not improve the results.

DDIM converges quickly but is relatively less efficient, requiring more steps to achieve good results, suitable for redrawing.

LMS and PLMS are derivatives of Euler. They generally produce stable results at around 30 steps.

DPM2, an improved sampler from DDIM, reduces steps to achieve better outcomes. It undergoes denoising twice per step, approximately twice as fast as DDIM. However, if the prompt is still being adjusted, this sampler's performance is average.

DPM++2M and DPM++2M Karras are suitable for generating realistic human images; DPM adaptive and DPM++ SDE Karras are ideal for producing realistic portraits.

## Sampling Iteration Steps

The number of steps required during image generation generally ranges from 20 to 50. Too few steps result in poor quality, while too many can distort the image. Increasing the steps also increases the generation time.

## Restore Faces

Restores facial details for portrait image generation.

## Tiling

Generates images that are tiled together, similar to a mosaic.

## High Resolution Fix (Hires.fix)

Used for generating high-definition images in large sizes, requires high device performance and is time-consuming.

## Width and Height

The width and height of the image in pixels. Larger values require more VRAM, the default is 512 x 512. These values are multiples of 8.

## Total Batches

The number of batches executed per image generation session, with the output being the product of total batches and batch size.

## Batch Size

The number of images generated per batch, increasing this value can enhance performance but requires more VRAM, typically set to 1 by default.

## Prompt Guidance Coefficient (CFG scale)

Determines how strictly the AI follows the prompt in generating images. A smaller value allows more AI freestyle, while too large or too small a value can deteriorate the image quality, generally set between 7 to 10.

## Random Seed

A value set at the initial state during image generation, producing identical images under the same prompts, parameters, and seed; -1 means a random value is chosen each time, resulting in different images.
