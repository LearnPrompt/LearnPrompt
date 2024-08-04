---
sidebar_position: 30
title: Differences Between Sora and Runway in Architecture
description: This article explores the architectural differences between Sora and previous models like Runway.
keywords: [Sora, Runway, Diffusion Model, Diffusion Transformer, AI, machine learning]
slug: /models/sora-vs-runway/
---
# 🟢 Sora and Runway: Architectural Differences

> 😀 Author: [Baoyu](https://baoyu.io/blog/ai/sora-vs-runway)

- Question: What are the architectural differences between Sora and previous models like Runway?

Answer: In simple terms, Runway is based on a Diffusion Model, while Sora is based on a Diffusion Transformer.

Runway and Stable Diffusion are based on Diffusion Models. The training process of a Diffusion Model involves gradually adding noise to an image over multiple steps until the image becomes completely noisy. When generating an image, it starts from a completely noisy image and progressively reduces the noise until a clear image is restored.

Text models like GPT-4, on the other hand, are Transformer models. Transformers use an encoder-decoder architecture to convert text into numerical vectors and then decode those vectors back into text.

Sora combines both approaches as a Diffusion Transformer model. It processes noisy input images using the encoder-decoder architecture of Transformers, predicting a clearer version of the image at each step. The encoder handles encoding the noisy input, while the decoder generates predictions of the clearer image.

GPT-4 is trained to process a sequence of tokens and predict the next token in the sequence. Sora, instead of predicting the next text token, predicts the next "Patch" in the sequence.

In text prediction, the basic unit is a token, which can be a word or part of a word. The concept of a Patch is harder to grasp, but here's a good example from a recent article.

Imagine a film reel of "The Dark Knight," wound on a metal reel and mounted on an old cinema projector.

You unwind the film reel and cut off the first 100 frames. You take each frame—here's the Joker laughing maniacally, there's Batman's pained expression—and perform the following unusual operation:

You take an X-acto knife and cut out an amoeba-shaped pattern from the first frame. Carefully, with tweezers, you extract the amoeba-shaped film piece and save it. Then you repeat the process for the next frame: cutting out the same amoeba-shaped pattern in the same position. Again, you carefully extract this new amoeba-shaped piece and place it precisely on top of the first one. You continue this process for all 100 frames.

You now have a colorful amoeba extended along the Y-axis. This is a small segment of film that can be played through the projector, like someone holding a fist in front of the projector, allowing only a small part of the movie to pass through.

This stack of film is then compressed and converted into a "Patch"—a block of changing colors over time.

The innovation of Patches—and why Sora is so powerful—is that they allow OpenAI to train Sora on massive amounts of image and video data. Imagine every video ever made being cut into Patches—endless film stacks—fed into the model.

Previous text-to-video methods required all images and videos used in training to be the same size, necessitating extensive preprocessing to crop videos to the appropriate size. However, since Sora trains on Patches rather than full video frames, it can handle videos or images of any size without cropping.

This allows for more training data, resulting in higher output quality. For example, preprocessing videos to a new aspect ratio often results in losing the original composition. A video centered on a character might only partially show the character after cropping. Because Sora can take any video as training input, its output is not affected by poor input composition.

Combining this with the Diffusion Transformer architecture, OpenAI can leverage more data and computational resources in training Sora, achieving stunning results.

When Sora first released videos, it could simulate the fluid dynamics of coffee splashing in a cup, leading some to think it was connected to a game engine. But Sora is still based on generative models, capable of simulating fluid dynamics due to being trained on a vast amount of video data containing physical rules. Similarly, GPT-4 generates code because it was trained on a large amount of code.

Two papers provide more technical details:

- [Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748)
- [Patch n' Pack: NaViT, a Vision Transformer for any Aspect Ratio and Resolution](https://arxiv.org/abs/2307.06304)

Interestingly, both papers seem to come from Google, and it appears the Sora project started after their publication.

The film reel + amoeba example comes from [How Sora Works (And What It Means)](https://every.to/chain-of-thought/sora-and-the-future-of-filmmaking).
