---
sidebar_position: 55
title: The Nightless AI World - Claude 3.5 Launch by Anthropic
description: An overview of Anthropic's new model, Claude 3.5, its features, performance, and how it compares to GPT-4.
keywords: [Claude 3.5, Anthropic, GPT-4, AI models, AI advancements, Artifacts, AI comparison]
slug: /models/claude-3-5-launch/
---

# 🟢 The Nightless AI World: Claude 3.5 Launch by Anthropic

Different from GPT-4o's two-week wait, this time Anthropic has directly offered a free trial.

Not long after the excitement, at 3 PM Beijing time, Claude crashed 😭, delaying the publication of this article.

![Claude Update](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004833334)

If you're not familiar with the last Claude update, you can check out this article.

In short, Claude currently has three models of different sizes: Opus, Sonnet, and Haiku.

![Model Comparison](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004851043)

These can roughly be compared to GPT-4, GPT-4o, and GPT-3.5.

As expected, Claude 3.5 Sonnet outperformed its predecessor, Claude 3 Opus, in text-based datasets like MMLU and MATH, competing head-to-head with GPT-4o.

![Performance Data](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004904428)

In terms of multimodal vision capabilities, it has reached SOTA (state-of-the-art: the best performance in machine learning tasks).

These results didn't surprise me much.

After all, as OpenAI's old rival, Claude wouldn't be released if it didn't surpass the GPT series. 👍

However, the new model also brings a new interactive feature!

## Artifacts

In Claude 3.5's eyes, Artifacts represent archaeological artifacts, artworks, traces in science and engineering, or any documentation, design drawings, source code, and test plans generated in software development. This name seems more understandable than Opus, Sonnet, or Haiku. 👍

When users ask Claude to generate code, text, or websites, Artifacts will appear in the right-hand window, providing a real-time preview and modifications. Check out this video 📹:

<iframe src="https://player.bilibili.com/player.html?isOutside=true&aid=112978460411920&bvid=BV1hVWFeqEhW&cid=500001653027989&p=1&high_quality=1&autoplay=0"  style={{width: "100%", height: "500px"}} scrolling="no" border="0" frameborder="no" framespacing="0" allowFullScreen={true}></iframe>

This feature seems like the pro max version of GPT's previous code interpreter.

However, this feature is not enabled by default. Those who have accessed Claude recently should see a small Artifacts window on the main screen, which you can click to enable.

![Enable Artifacts](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004920460)

If you don't see it, you can click on the avatar, choose Feature Preview, and turn on Artifacts.

While writing this article, I saw someone make Mario using Claude 3.5. Since it can handle simple obstacle avoidance, it might as well be able to create a shooting game. 🏃‍♀️

Angry Birds? Tetris? After some brainstorming,

I remembered that whenever I use Claude, I always have a strange "sneaky" feeling, as if I might get banned at any moment.

So why not create a Contra game to pay tribute to this "Ban-Triggering Contra"? 🎮

![Contra Design](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004931931)

First, design the protagonist by capturing the classic Contra image, then let Claude recreate the character using code, creating a geometric version of the protagonist, Contra (both names start with C).

After the code is written, a left-side code and right-side preview interface will appear.

![Code Preview](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004948976)

Great, looks good!

Next, let's have Claude add more details, including the background, enemies to attack, and obstacles to jump over.

![Claude 3.5 in Action](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818005000559)

Now, the moment of truth:

"Now, please help me create a side-scrolling jump game. The controllable character is an 8-bit warrior, and the obstacles to jump over are camouflage stickmen coming at you. The background is a black sky and bushes. Pressing the space bar triggers a jump."

The process was far from smooth.

After repeatedly generating until my quota ran out (the health bar was there, but the attack system was missing),

I discovered the core reason for the failure.

These types of games are mostly written in React, and Artifacts doesn't support referencing libraries like react-us, so you need to implement similar functions using native React hooks.

![Game in Progress](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818005012586.gif)

As the saying goes, the code was written in under 5 minutes.

We can directly play this game in Artifacts, or download it locally to run!

This update in interactivity

is as exciting as when I first saw GPT support the code interpreter! 🎉

Not to mention, Anthropic announced that later this year, they will release Claude 3.5 Haiku and Opus.

It would be great if Artifacts became more fun too. 🧮

![Anthropic Update](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818005021509)

GPT, keep up!

Add this feature to GPT-4o tonight,

or I might just renew my subscription tomorrow.

This Claude 3.5 is really hard to resist!

Finally, here's the official guide:

[Official Guide](https://www.anthropic.com/news/claude-3-5-sonnet)
