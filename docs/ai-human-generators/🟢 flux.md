---
sidebar_position: 40
title: 4 steps for AI-generated influencer creation - Flux with Kling AI
description: An exploration of the latest AI tools like FLUX Dev and Runway Gen3 that are making AI-generated videos indistinguishable from real-life speeches.
keywords: [AI, Flux, Runway Gen3, digital humans, AI-generated video, LoRA, Stable Diffusion]
slug: /ai-human-generators/flux-kling-ai-influencer-guide/
---

## 🟢 4 steps for AI-generated influencer creation - Flux with Kling AI

This weekend, I was bombarded with "real" speeches all over my feed.

<iframe src="https://player.bilibili.com/player.html?isOutside=true&aid=112975977450935&bvid=BV1pApoemEmr&cid=500001652417609&p=1&high_quality=1&autoplay=0"  style={{width: "100%", height: "500px"}} scrolling="no" border="0" frameborder="no" framespacing="0" allowFullScreen={true}></iframe>

At first, when I saw the "100% AI-generated" label, I thought HeyGen had released an update. But then, I encountered a new combination of terms: "FLUX Dev + Runway Gen3."

Well, it seems that AI-generated images and videos are now competing with digital humans.

If AI applications are competing to break through with various features, AI-generated digital humans are definitely outliers—because their breakthrough lies in becoming more human-like.

How human-like? The image quality has been compressed more than twice.

![Example of AI-generated image using Runway Gen3](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240817154305325.gif)

Runway is an old friend, and the character movements didn't surprise me. So, the technical provider behind these "real" speeches is a new player, Flux.

In the first week after Flux's release, it left me with the impression of being a much stronger AI image generation model than SD (Stable Diffusion).

But in just one week, with the addition of a real-life version of LoRA, TED talks started using Flux to launch a "real speech" competition.

![AI-generated image for a speech video](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640.gif)

Previously, when I tested digital humans, I would check stability under different lighting and camera angles. This time, however, the competition felt like a creative challenge—how to make a speech video indistinguishable from the real thing.

Today, I'll guide you through the process 💪

The entire workflow is divided into four steps, and each tool involved has alternatives, allowing you to unleash your creativity and produce even more speeches.

Image generation -> Video generation -> Lip-syncing -> Speed up and enhance the video (optional)

Let's get started.

### Step 1: Generate a Believably Fake Image

To replicate the original video, I used:

**FLUX Dev + XLabs AI Realism**

![Example of AI-generated image using FLUX Dev and XLabs AI Realism](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240817144948562.jpeg)

Earlier, I mentioned FLUX, a new AI image generation model. The latter half, XLabs AI Realism, is the "cheat code" that Stable Diffusion enthusiasts have been longing for—LoRA.

In short, this module allows you to generate more realistic images without repeatedly tweaking different prompts.

It's very user-friendly. Simply access the Notebook (link in the comments), click the black play button on the left, and once the output URL ending with Gradio appears, you can open it and start using it.

![Notebook interface for generating images](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240817145013736.png)

The prompt is quite long, so I'll include it as a special bonus at the end of this post.

### Step 2: Generate the Speech Video

This step is about animating the character and making the background look less like a PowerPoint slide.

It doesn’t matter if the mouth doesn’t move, because in the first step, making the character’s mouth open instead of closed will ensure successful lip-syncing later.

![AI-generated video showing a woman giving a speech](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240817145027436.gif)

The prompt is very simple: "A woman giving a speech on stage."

### Step 3: Make the Character Speak

Here, I used Sync Labs.

However, without a subscription, Sync will place a large watermark in the center of the screen.

Portal: [https://synclabs.so/](https://synclabs.so/)

The operation is equally simple: upload the image and select a suitable voice for the character.

<iframe src="https://player.bilibili.com/player.html?isOutside=true&aid=112975994161777&bvid=BV1cMpoe5EYd&cid=500001652419299&p=1&high_quality=1&autoplay=0"  style={{width: "100%", height: "500px"}} scrolling="no" border="0" frameborder="no" framespacing="0" allowFullScreen={true}></iframe>

### Step 4: Speed Up or Enhance the Video

This step can make the final product more realistic, especially since:

- AI-generated videos tend to have slower character movements
- Lip-syncing tools can affect the original video’s clarity

<iframe src="https://player.bilibili.com/player.html?isOutside=true&aid=112975994292302&bvid=BV1rMpoe5EHi&cid=500001652419454&p=1&high_quality=1&autoplay=0"  style={{width: "100%", height: "500px"}} scrolling="no" border="0" frameborder="no" framespacing="0" allowFullScreen={true}></iframe>

With these steps, you too can create a series of "real" speeches.

So, can AI 100% replace real humans?

From my experience, there are still some limitations:

- A 10-second video takes 5 minutes to generate.
- The average length of trending short videos is 1 minute, which means it takes 30 minutes to generate.
- With sufficient data, AI-generated voices can be nearly indistinguishable from real ones.
- Lip-syncing quality hasn’t yet caught up with other aspects.

### In Conclusion

It seems humans have always longed to replicate themselves.

Sometimes, I find myself wishing for a clone to help me with work, and I even wonder if I might be a digital human—if all my experiences are fabricated.

So, when I can create a "real" person to give a speech, I get excited.

This person feels so real, as if they’re really speaking to me.

So, what would this person’s first words be?

"Hello World," perhaps?

![AI-generated image of a digital human saying "Hello World"](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240817145053131.gif)
