---
sidebar_position: 45
title:  一手测评GPT4o十项能力 - 中文场景下轻松超过GPT4
description: An in-depth assessment of GPT-4o's performance across ten key capabilities in the Chinese context, demonstrating its superiority over GPT-4.
keywords: [GPT-4o, GPT-4, AI capabilities, Chinese language, AI performance, AI evaluation, AI comparison]
slug: /models/gpt4-vs-gpt4o/
---
# 一手测评GPT4o十项能力 - 中文场景下轻松超过GPT4

今天凌晨到现在，无所不能的GPT-4o发布的影响还在不断扩散。除了发布会本身的短短27分钟内容外，官网博客上的一些小彩蛋展示的 GPT-4o 在多个方面的能力提升，让我迫不及待地想要进行实测。碰巧 OpenAI 似乎听到了我的心声，在发布会结束不到一小时内就更新了 GPT-4o，于是我立刻进行了一次十项能力测评。

![GPT-4o Launch](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/cdaba0d67e4c70673d8a16f788d4acc1.jpg)

虽然网页端已经更新了 GPT-4o，但遗憾的是 iOS 端还未配备“眼睛”，也没有更新语音界面，因此实时语音和视觉能力不在这次评测范围内。**（三连催更！收到更新的第一时间我会追加文章🎉）**

![iOS Update](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/0fe24cf68b2b620458eefbe0c18851bb.png)

言归正传，这次GPT-4 turbo 🆚 GPT-4o的十项能力分别是**语义理解与抽取、AI agent（智能体）能力、上下文对话、生成与创作、知识与百科、代码、逻辑与推理、计算、角色扮演、安全。**

## 前情回顾

我这里参考的数据集是中文通用大模型综合性基准SuperCLUE。从23年5月到今年4月，他们持续更新中文榜单。SuperCLUE包含三个子任务：**开放域多轮交互（OPEN），客观题形式的三大能力（SuperCLUE-Opt），以及众包匿名对战形式的基准琅琊榜（SuperCLUE-LYB）**

他们的目标是与真实用户体验目标保持一致，所以纳入了开放主观问题的测评。通过多维度多视角多层次的评测体系以及对话的形式，真实模拟大模型的应用场景。

![SuperCLUE Benchmark](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/782d937ff9854c6762c58287de9b64ef.png)

从他们四月份发布的模型名单来看，GPT4系列模型在总分上还是处于第一梯队。

![Model List](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6365b63a2c17bfd1aab37ea1f8968a67.png)

谢谢开源社区，谢谢SuperCLUE提供如此全的性能对比：https://github.com/CLUEbenchmark/SuperCLUE/

今天我用10组对照对比GPT4和GPT4o，大家自己有有趣的案例欢迎发在评论区，我们一起来挖掘GPT4o的潜能。

下面的对照案例中，存在GPT4o输出比GPT4长不少的情况，为了大家能看得清晰，我会根据排版来展示实测效果🎉

## 能力1：语义理解与抽取

> 是一种语言能力，能够理解并解析输入的文字信息的含义。模型需要能够识别短语、句子、段落的含义，同时还要能从更大的文本块中抽取关键信息和主题。

### GPT4o

![Semantic Ability](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7b1a367cbab70264d0217490190cda26.JPEG)

### GPT4

![Semantic Ability4](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6e024770f560a113f3f1fc874df31c08.JPEG)

个人点评：GPT4o的二级排版我非常喜欢，是能直接复制出来使用的程度

## 能力2：AI agent（智能体）能力

> AI agent（智能体）是当前与大语言模型相关的前沿研究热点，拥有类似贾维斯等科幻电影中人类超级助手的能力，可以根据需求自主的完成任务。
>
> 重点评估AI agent在【工具使用】和【任务规划】两个关键能力上的表现

### GPT4o

![Agent](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3f93921261641e0248ab33ee2721bae9.JPEG)

### GPT4

![Agent4](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c577ae94b3171c66a54591a495cfa86d.JPEG)

个人点评：GPT4o在规划过程中，能给出准确的时间表和价目表，这一点印象深刻

## 能力3：上下文对话

> 这是一种语言能力，需要理解并记住前面的对话信息，以便在回答中保持连贯性。这涉及到理解对话的整体流程和上下文环境，或生成相应的对话。

### GPT4o

![Contextual Dialogue](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/119a97aebbfb5ddce41acf4e564f2327.JPEG)

### GPT4

![Contextual Dialogue4](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/247cd13b03d046b9e2e7423874e56292.JPEG)

个人点评：GPT4o能给出对话轮次，对话轮次增加也能很好记住历史记录。但总体来说我体验跟GPT4相差不大

## 能力4：生成与创作

> 这是一种语言能力，能够创造新的文本内容，如文章、文案、短故事、诗歌。这涉及到创造性地运用语言，同时还要考虑到风格、语境和目标读者。

个人点评：GPT4o更加懂中文了，终于不再是想GPT4在文字中面加入情感词来提升同情度，而是用我们更加熟悉的四字词语，排列句等创作文案。

## 能力5：知识与百科

> 这是一种知识能力，能够像百科全书一样提供知识信息。这涉及到理解和回答关于广泛主题的问题，以及提供准确、详细和最新的信息。

![Knowledge](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1537629ee2217f4cfab3057546e454de.png)

个人点评：GPT4o输出更好，它给物品的介绍内容进行了分段，还引用了参考资料。

## 能力6：代码

> 这是一种专业能力，能够理解和生成编程代码。这涉及到理解多种编程语言的语法、结构和习惯，以及如何解决编程问题。

### GPT4o

![Coding](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3f93921261641e0248ab33ee2721bae9.JPEG)

### GPT-4

![Coding4](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1d2ae22b2d6d9ee102d02a178bc18604.JPEG)

个人点评：GPT4o的优点是生成代码后的解析会带上对应的变量，阅读体感友好👍

## 能力7：逻辑与推理

>这是一种专业能力，能够理解和应用逻辑原则进行推理。这涉及到分析问题、识别问题及推理。

![Reasoning](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5e6a4b171f0c4081b883f896d79d1b5d.png)

个人点评：GPT4o按步骤按点的推理过程非常友好，我们群友基本都是先看懂GPT4o给出的解释，才能理解GPT4的输出。

## 能力8：计算

> 这是一种专业能力，使其能够执行数学运算，如加法、减法、乘法和除法，甚至更复杂的数学问题。这涉及到理解数学问题的表述，以及如何步骤地解决这些问题。

![Computation](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9b5f5f8ab98b40c3b7a5a8ad3c3c7171.png)

个人点评：计算结果两边都正确，GPT4o的显示效果更好，不需要担心排版

## 能力9：角色扮演
>这是一种感知能力，使其能够在特定的模拟环境或情景中扮演一个角色。这涉及到理解特定角色的行为、说话风格，以及在特定情境下的适当反应。

![Role-Playing](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/45649ef5e9394e88ba004b1e60e925f0.png)

个人点评：GPT4o能直接给出我想要的聊天内容，明显更胜一筹

## 能力10：安全
>这是一种安全能力，防止生成可能引起困扰或伤害的内容。这涉及到识别和避免可能包含敏感或不适当内容的请求，以及遵守用户的隐私和安全政策。

![Safety](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6a59f178b9a64768bcaabdfd73e1e635.png)

个人点评：这次GPT4输出内容同时引用了论文，可靠程度比GPT4o要好

# 写在最后

在我测试到第五项能力的时候，GPT-4o的Mac应用已经逐步推送给内测用户。这次更新的速度比以往任何时候都要快。

测试完十项能力后，给我的第一感觉，GPT-4o带来的惊喜不仅仅在于实时语音交流，

它对于**依赖复杂提示语来控制模型输出**硬需求的大幅减少，

让我有一种长舒一口气的感觉，

这不就是我期待的人工智能助手贾维斯。

在日常对话中就能完成复杂任务，

因为使用无门槛，你甚至会忽略它的存在，

期待着随时随地

**“hey， GPT！”“我在！”**的一天！







