---
sidebar_position: 20
title: Claude3 深夜“奇袭” GPT
description: This page details the launch of the Claude3 family and compares its features and performance to GPT-4.
keywords: [Claude3, GPT-4, AI models, AI comparison, Anthropic, machine learning]
slug: /models/claude3-vs-gpt4/
---
# 🟢 Claude3深夜“奇袭”GPT，OpenAI半天就更新了这？

> 🥯 Claude3 家族上线，剑指GPT4

![Claude3 Family](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c35e0c89ed749b01f00f87546295524a.png)

Claude 终于有动静了，这次又是深夜发布 😭，文案没有写 GPT4，但是图片 GPT4 和 GPT3.5 都是**重点关注对象**。怀疑是不是都在学 OpenAI 突然发布 Sora 的“营销学思路”。

建议大家给 X 上所有 AI 产品的官方号都拉邮件通知里去，不然随时深夜给你个失眠大礼包 🥱

> 🎹 一句话总结：Claude公司新推出的Claude3 模型系列。这一系列包括 Claude 3 Haiku、 Claude 3 Sonnet和 Claude 3 Opus 三款模型。以高性能、多语言能力和突破性速度、视觉识别、减少错误率等特点，三款不同性能与成本的模型，满足不同领域的智能化需求。

（GPT4总结得出😏）

- 现已上线： Opus 和 Sonnet 模型，在 claude.ai 及 Claude API 上对全球 159 个国家开放，免费用户也能使用 Claude 3 Sonnet 模型
- 即将推出：Haiku 模型，敬请期待。

可能因为文本能力是 Claude 的强项，这次命名很有创意。Haiku 是俳句「日本的三行短诗」，Sonnet 是十四行诗，Opus 指的是就是史诗级乐章。

## 价格如何？

**作为 GPT4 订阅用户，我第一时间去看的反而不是性能而是这波更新 Claude 3 的定价如何？**

![Pricing](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3bfbd3802238788dd4f28022ce729de8.png)

- 网页端：，体验 Opus 需要订阅 20 刀一个月的 pro 套餐，跟 GPT4 价格一致！
- API 方面：Opus 定价高于 GPT-4 Turbo, 明显低于 GPT-4 32K，Sonnet 比所有 GPT-4 版本(包括 GPT-4 Turbo)便宜, Haiku(尚未发布到 Claude API)甚至比 GPT-3.5 Turbo 还便宜。

## 核心优势

大家看到最多的一定是这张图了

![Core Advantages](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a6f0c640577c9f45717399a6923ab249.png)

简单解读一下这些指标里面最值得关注的是什么？

- 👍👍👍 推理能力：Claude3 Opus 在多语言数学推理测试集（MGSM）上，以 0-shot（未提供任何示例）的方式达到了 90.7% 的准确率，而 GPT-4 在 8-shot（提供了 8 个示例）的情况下，只达到了 74.5%**（-16.2）**的准确率。这一点也体现在 MATH（数学问题解决）和 GPQA（研究生水准的推理数据集）
- 👍👍 与 GPT4 同级别的语言处理能力：在 MMLU、GSM8K 和 HumanEval 测试集上，Claude3 与 GPT-4 的表现相似

# Claude 3 实测！

说的那么厉害，那当然要直接上手测测！

我用 Claude3 Opus 给大家总结了官方的技术文档中强调的“改进点”

1. 智能新标准（强大的推理能力）：Claude 3系列在多个评估基准上超越同行，特别是Opus模型，以其接近人类的理解和流利度引领通用智能前沿。
2. 近瞬时结果：Claude 3模型支持即时客户服务和数据提取，其中 Haiku 模型以其极速响应著称。
3. 强大的视觉能力：Claude 3模型具备处理各种视觉格式的能力，适合解码企业知识库中的视觉信息。
4. 更少的拒绝：与早期版本相比，Claude 3模型在处理边缘案例时拒绝的可能性显著降低，展现出更细腻的理解能力。
5. 提高准确性：Claude 3模型在保持高准确率方面取得了显著进步，特别是在处理复杂问题时。
6. 长篇幅上下文与近乎完美的回忆：所有三个模型都能处理超过100万令牌的输入，Opus模型在信息回忆上几乎达到完美。

这六点里面最吸引我，能让我订阅 Claude 的特点是

**推理能力，多模态，全系模型均能处理超过 100 万个 tokens**

1. 瞬时结果虽然也很吸引我，但真正能达到3倍速+就是目前还是只有Haiku，推理能力超越GPT4的Opus响应的速度和上一版大致相同

2. **更少的拒绝，也意味着模型不会动不动拒绝你的问题，但这一情况在我目前使用GPT API和GPT网页端都较少遇到，反而是Gemini遇到比较多**

## 推理能力

放几个我觉得 X 上很有代表性的例子（让 Claude & GPT 一起玩脑筋急转弯）

*“在一间屋里，有三个杀手，然后来了一个人，把其中一个杀手杀了，问，现在屋里有几个杀手？”*

GPT4 vs Claude 3 第一局：打平

![Round 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d831b400df1eae0ed2014b053b4cf52a.png)

![Round 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d9bca234d8a448c4787ea8f0cf3a3144.jpeg)

*“我有 6 个鸡蛋，碎了 2 个，煎了 2 个，吃了 2 个，还剩下几个？”*

GPT4 vs Claude 3 第二局：GPT4 胜

![Round 2](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/4b1936205136917d602ec03ca30d8b8a.png)

![Round 2](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/2099ddd2bb4b7961a7eb75290b2512e5.png)

第三局决胜局：

*“一个微波炉,一个电磁炉,额定功率都是 800w,要把 500g ,25 度的水烧开,哪个快,快多少?”*

![Final Round](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ece898efba26c51911e20e763309aea0.png)

![Final Round](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7835bad9ed2ac599aab54f64e01ec5ea.png)

所以这局谁胜了？大家快看看 👀

## 多模态实测

和前代模型相比，Claude3 最突出的新增能力在于其视觉识别能力。这意味着它能处理包括照片、图表、图形以及技术图纸等多种视觉资料态能力。

日常使用多模态较多的场景就是视频&图文

- Emmanuel Ameisen 和 Erik Schluntz 挑战用 Claude 3 Opus 将 Andrej Karpathy 的 2 小时 13 分钟的视频转换成一篇博客文章，仅通过一次提示，Claude 3 Opus 就成功完成了任务。

[https://player.bilibili.com/player.html?aid=1651256618&bvid=BV11j421m7fT&cid=1459630707&p=1&high_quality=1&autoplay=0](https://player.bilibili.com/player.html?aid=1651256618&bvid=BV11j421m7fT&cid=1459630707&p=1&high_quality=1&autoplay=0)

- 歸藏大佬找了一个论文的一部分让 Claude 3 Opus 解读，分析的也很清楚，但给出的信息没有 GPT-4 丰富。
    
    ![Paper Analysis](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3f5fc6e8b938e245514443b234f99bde.png)
    

## 大海捞针

Claude 3 全系模型均能处理超过 100 万个 tokens 的输入。衡量上下文窗口能力的试金石，依然是我们熟悉的「大海捞针」测试。

> 🤑 “大海捞针”，也就是通过将一个特定的句子（即“针”）隐藏在一堆看似杂乱无章的文档（即“大海”）中，然后询问一个只有通过找到那个“针”才能回答的问题，从而考察模型的信息回忆能力。

Claude3 Opus 不仅以超过 99% 的准确率实现了信息检索的近乎完美表现，而且在某些情况下，它能识别出那些作为「针」的句子是由人为刻意插入的。这种程度的意识真的非常 Cooooool

![Needle in a Haystack](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/0f23260f71b64e8d13f2aec2aa703b7d.png)

如果大家想了解更加详细的 Claude 3 性能，不妨和我共读完整的技术报告

![Technical Report](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9a59f9b6ca95c7cd407fe83446ba0d8c.png)

同时，NVIDIA 科学家 Jim Fan 发表了对 Claude-3 的看法，他最喜欢 Claude-3 发布的两件事刚好是对 Claude 其他方面“改进点”优势的补充

1. **领域专家基准。**我对饱和的 MMLU 和 HumanEval 不那么感兴趣。Claude特别挑选了金融、医学和哲学作为专家领域并报告性能。我建议所有 LLM 模型卡都遵循这一点，这样不同的下游应用程序就会知道该期待什么。

2. **拒绝率分析。**LLMs'对无辜问题过于谨慎的回答正在成为一种流行病。Anthropic 通常处于极端安全的一端，但他们认识到了这个问题，并强调了他们在这方面的努力。好极了！

我喜欢Claude在 GPT 和Gemini占主导地位的舞台上掀起热潮。不过请记住，GPT-4V，这个每个人都拼命想打败的高水位标杆，已经在 2022 年完成了训练。这是暴风雨前的宁静。

## 官方彩蛋

看得出来，官方非常想要吸引新的用户，Anthropic 还推出了一个包含多样化创意 prompt 的 prompt 库。这非常适合那些想要深入了解和充分利用 Claude 3 新功能的朋友们

[https://docs.anthropic.com/claude/prompt-library](https://docs.anthropic.com/claude/prompt-library)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9af7bf20fb9bacb7808c4e93495b9e85.png)

有一说一，这个界面是不是有点眼熟

![Familiar Interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/339db17db42f096709f87fd47b0124c9.png)

# 写在最后

实际体验下来，Claude 3 真的可以说是超越了 GPT4，但大家别忘记 GPT4V 都已经是 2022 年训练完成 ✅ 的了，OpenAI 会不会有什么秘密大招马上出！

截止到今天的中午两点 OpenAI 全量发布了两个小功能：记忆能力和朗读能力来反应 Claude3 的大招。

![Memory Feature](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/2b18944651ddb2b4402f3064d868d838.png)

![Reading Feature](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/efb8031e18e03e0bc734ebe90eff6e03.PNG)

但这完全不够看啊！我最近是不是要深夜看看有没有 GPT5 突然出现 🏃

![Late Night](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/97fbec6bda8dc037ade5a56bf1e4247e.JPG)

💡 24年，AI模型竞争势头依然强劲，这下我已经迫不及待要订阅了
目前Claude 网页端已经被“卡爆”，无法体验Sonnet。想体验新版Claude3，需要订阅Pro
那普通用户是否应该订阅Claude 3呢？如果你不是 推理能力 & 长文本重度需求用户，我的建议是先等一等，等OpenAI大招，等更全的Claude3评测。