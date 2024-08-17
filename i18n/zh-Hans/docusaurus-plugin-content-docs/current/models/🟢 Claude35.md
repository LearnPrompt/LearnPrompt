---
sidebar_position: 55
title: 实测Claude 3.5 新功能Artifacts，三句话做出“魂斗罗”几何限定版
description: An overview of Anthropic's new model, Claude 3.5, its features, performance, and how it compares to GPT-4.
keywords: [Claude 3.5, Anthropic, GPT-4, AI models, AI advancements, Artifacts, AI comparison]
slug: /models/claude-3-5-launch/
---

# 🟢 实测Claude 3.5 新功能Artifacts，三句话做出“魂斗罗”几何限定版

AI界果然没有夜晚，Anthropic又又又又悄咪咪上线了新模型 - Claude3.5

不同于gpt4o要等两周，这次是直接免费试用

开心没多久，北京时间下午3点，Claude崩了😭，这篇文章要晚点才能跟大家见面了

![Claude Update](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004833334)

如果大家对于上一次Claude更新不了解的话，可以看看这篇

简单来说，Claude目前有3个不同大小的模型，Opus、Sonnet、Haiku

![Model Comparison](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004851043)

大家可以大致对应成gpt4，gpt4o，gpt3.5

不出意料，Claude3.5 Sonnet 在 MMLU，MATH等文本数据集，全面超越了它的老大哥Claude3 Opus，跟GPT4o打得有来有回。

![Performance Data](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004904428)

而在多模态视觉上的各项能力达到了SOTA（state-of-the-art：用于描述机器学习中取得某个任务上当前最优效果的模型）。

这些数据并没有给我带来多大的惊喜

毕竟作为OpenAI老对手，Claude没有超过GPT系列的话也不会放出来👍

不过，新模型还带来了新的交互方式！

## Artifacts

在Claude3.5眼中，Artifacts代表了考古学文物、艺术作品，科学和工程中的人工痕迹，又或者是在软件开发中生成的任何文档、设计图纸、源代码、测试计划等，看来这个名字比Opus、Sonnet、Haiku好懂👍

当用户要求 Claude 生成代码、文本或网站时，Artifacts会出现在右侧窗口，提供实时预览、修改，请看VCR📹：

<iframe src="https://player.bilibili.com/player.html?isOutside=true&aid=112978460411920&bvid=BV1hVWFeqEhW&cid=500001653027989&p=1&high_quality=1&autoplay=0"  style={{width: "100%", height: "500px"}} scrolling="no" border="0" frameborder="no" framespacing="0" allowFullScreen={true}></iframe>

这个功能不相当于GPT的上一代版本之子 - 代码解释器的pro max版本吗？

不过这个功能不是默认开启的，最近几天访问Claude的朋友们，应该都能在主界面看到 Artifacts 的小窗，点击后选择打开就行！

![Enable Artifacts](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004920460)

如果你没看到的话，也可以点击头像，选择 Feature Preview，并把 Artifacts 打开。

在写这篇文章的过程中，我看到有人用 Claude 3.5 做出了马里奥。既然简单的避障能做到，四舍五入是不是也能做成射击小游戏🏃‍♀️。

愤怒的小鸟？俄罗斯方块？头脑风暴了一下后，

回忆起每次使用Claude，总有一种莫名的“偷感”，感觉下一秒就会被封号。

那我为什么不做一个魂斗罗来致敬这个“封号斗罗”呢？🎮

![Contra Design](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004931931)

首先是设计主角，截图魂斗罗的经典形象，让Claude用代码复刻人物的色块，做出几何版本的主角Contra（跟Claude都是C字辈）

代码写完后，就会出来一个左侧代码右侧预览的界面。

![Code Preview](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818004948976)

很好，很有精神！

然后，我们让Claude进一步补充细节，包括背景、需要攻击的对手，需要跳跃通过的障碍等等。

![Claude 3.5 in Action](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818005000559)

下面是见证奇迹的时刻，

“现在，请帮我做一个横版的跳跃游戏，可操控的主角是8-bit的战士，需要跳过的障碍物是不断迎面而来的迷彩色火柴人，背景是黑色色天空、树丛。每次按空格键就是跳跃。“ 

过程远没有想象中顺利，

反复生成到我的额度用完后（血条是有了，但是攻击系统毛都没有），

才找出了生成失败的核心原因。

这类游戏基本都是用React写的，Artifacts不支持引用react-us之类的库，所以你需要让它用原生React hooks 来实现相同的功能。

![Game in Progress](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818005012586.gif)

老话说得好， 不到5分钟，代码就写好了。

我们在Artifacts是可以直接玩这个游戏，你也可以下载到本地运行！

这种交互上的更新

不亚于我第一次看到GPT支持代码解释器的兴奋感！🎉

更别提Anthropic宣布，将在今年晚些时候，会发布Claude 3.5 Haiku 和 Opus。

要是顺带把Artifacts做更好玩，也是可以的🧮

![Anthropic Update](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818005021509)

GPT快跟上啊！

今天晚上就给GPT4o加上这功能

不然我还有一天就要更新订阅了，

这次的Claude3.5真的很难忍住不剁手啊！！

最后给大家送上官方指南传送门

[Official Guide](https://www.anthropic.com/news/claude-3-5-sonnet)
