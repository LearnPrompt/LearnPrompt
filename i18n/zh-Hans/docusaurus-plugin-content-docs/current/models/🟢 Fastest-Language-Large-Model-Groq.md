---
sidebar_position: 10
title: Who Hasn't Used the Fastest Large Model in History, Currently Free!
description: Explore Groq, the new large model offering super-fast response speeds based on the open-source Mixtral 8x7B-32k model, boasting speeds of 500 tokens per second!
keywords: [Groq, AI model, fast large model, Mixtral 8x7B-32k, 500 tokens per second, AI response speed, free AI model]
slug: /models/groq/
---
# 🟢 看看是谁还没用上史上最快大模型, 目前免费!

> groq 一个新的大模型体验出现, 他是基于开源模型 [Mixtral 8x7B-32k](https://groq.com/), 他的亮点是回答速度超级快, 500T/s!
原因使用自己新研发的 LPU

2024 年刚一开始, AI 就不断有大事发生! 毕竟这帮外国人不过春节 hhh, Google 发布了新一代的模型, Gemini 1.5 pro, 再紧接引爆全球关注的 Sora 也横空出世! 与此同时, 一个 Groq, 一个号称是全球最快的 Groq 的 LLM 模型也出现了! 他的网站十分简单粗暴, 不用注册, 没有付费, 只有一个 Prompt 的输入框, 按下回车键的一瞬间大段文字的回复给你最直接的震撼,  相信这是所有人体验 groq 的感觉! 我也将体验网址放在文末, 接下来我们就一起来看看这个 500 Token/s 的 Groq!

## 超快的回复体验:

Groq 官网十分简单粗暴, 不用注册, 没有付费, 只有一个 Prompt 的输入框, 和模型的选项.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/0d33acee526175ca39eb88a8d4938071.png)

在模型的选项中我们可以看到里面有两个选项: Llama 2 70B-4K 和 Mixtral 8x7B-32K, 你可以任意选择一个开始体验!

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9fedcb2ac533e845b8d1cd0733443f20.jpeg)

下面是官网放出的 groq 和 openai 回复速度的对比,可以看到 groq 的回复速度简直的吊打 openai!

Groq 公布的速度是 500 token/s! 大约 25 倍 ChatGPT（在 GPT4 上平均每秒约 20 个 token）速度和大约 10 倍 Gemini 1.5（以每秒约 50 个 token 运行）！

Groq 也是丝毫不谦虚,直接叫板 Meta 和 OpenAI! (有的朋友会问为啥不说 Google 呢? 埋个小伏笔)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c23895428a3014b74c2b72bd732558a2.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6bfcd51a9450d50cb0dd60f9fffc524e.png)

我在这里也是第一时间去体验了! Groq 的速度, 这里强烈建议大家去体验一下, 按下回车的一瞬间就能体验获得一篇文章的震撼感! 甚至我自己测试的速度比官方公布的 500T/s 还要快!

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c9f755bf30e607ce4f24bfae544e78e2.png)

## Groq 的效果怎么样?

Groq 是使用 Llama 2 70B-4K 和 Mixtral 8x7B-32K 这个开源模型, 这里给大家放出来一个他们和 GPT 3.5 的对比:

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7866a3f012007e0b9e7bad4b37e1dc50.png)

从表中可以看到 Mixtral 8x7B 在这 7 项基准中有 4 项领先与 GPT 3.5, 实力也可以说是比较强了!

同时 Groq 放出 API 价格也比 openAI 的便宜:

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/cb412ee0d301214d76859d4e04681235.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/99ecd2ed8620e32627ff93641f30a982.png)

## Groq 为什么能做到这么快?

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b0afab9b17c0d837b66e138df188b296.png)

Groq 能做到这么快的速度不是依赖 GPU 而靠的是自研的 LPU 售价 2 万美元一张!(可以说是天价了)

这里给大家看一段 Groq 在社交平台对他们 LPU 的介绍, 可以对他们的 LPU 有个大致的了解, 当然领域内的朋友也可以看一下他们的技术报告, 看看能不能收获一些启发!

> 我们的芯片确实专注于矩阵和向量运算，但 GPU 也非常擅长这些。
Token 生成中的一个巨大问题通常是每个代币通过网络所需的时间成为瓶颈。为了加快速度，您需要更快地执行这些计算，在用尽所有明显的选项（更快的加速器、更高的电压等）之后，这是一个难题。
GPU 经常花费大量时间等待正确的数据到达以便继续处理，这一事实进一步加剧了这种情况。他们通过启动多个线程并添加复杂的预测逻辑来缓解这一问题。这种方法效果很好，但代价是浪费能源。
借助 Groq 的确定性芯片和系统，我们可以准确地知道数据在任何给定点的位置，并确保数据在需要时发送到正确的位置。因此，我们可以确保计算逻辑的高利用率，完全删除预测逻辑并浪费更少的能源。此外，您还清楚地知道每次运行需要多长时间。
如果您有兴趣了解更多信息，请查看
[https://www.reddit.com/r/LocalLLaMA/comments/1auxm3q/comment/krb3twr/?utm_source=share&utm_medium=web2x&context=3](https://www.reddit.com/r/LocalLLaMA/comments/1auxm3q/comment/krb3twr/?utm_source=share&utm_medium=web2x&context=3)

**Groq 能替代目前的显卡提供更快的训练速度吗?**

Groq 工程师也非常的诚实表示:

> 它可能会加快训练速度，但由于 CUDA，目前 Nvidia 可能是训练的最佳选择。 Groq 在大规模推理方面确实脱颖而出。

## 世界上最快的推理

与顶级云提供商相比，Groq 在 Anyscale 的 LLMPerf 排行榜上展示了 18 倍快的 LLM 推理性能。运行在 Groq LPU™ 推理引擎上的 Meta AI 的 Llama 2 70B 的输出令牌吞吐量比所有其他基于云的推理提供商快了 18 倍。(这个速度真的是遥遥领先啦!)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e0e7f4b30c048f290d24cff59152012f.png)

而且他们的技术团队正是来自来自 Google 的 TPU 团队(回应一下前面的小伏笔,原来是一家人!)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b241d6ab61cf9bca8a829f24fe15b1ff.png)

## 写在最后

Groq 的出现, 在开年就打响算力变革的第一枪, Google 新模型的 Gemini 1.5 为我们展示了超长的上下文能力(这个我们也会在下一篇文章中为大家介绍), 而 openAI 的 Sora 也让我们看到了 OpenAI 团队在通用人工智能路上的探索!

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/311ed9a86a951d973449fe59c6824785.png)

相信 AI 在 2024 会带给大家更多的惊喜!让我们拭目以待!

Enjoy! Grop 体验地址: [https://groq.com/](https://groq.com/)