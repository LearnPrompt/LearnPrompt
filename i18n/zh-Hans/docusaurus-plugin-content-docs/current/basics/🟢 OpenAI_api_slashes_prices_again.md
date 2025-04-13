---
sidebar_position: 41
title: OpenAI又降价50%，我用上了十个称霸月榜的“天价”AI应用（上）
description: A review of ten popular AI applications that have become more accessible with OpenAI's recent price cut, featuring GPT-4o mini's impressive cost-performance ratio.
keywords: [OpenAI, GPT-4o mini, AI applications, API, price reduction, AI tools, cost-effective AI]
slug: /basics/openai-price-cut-10-ai-apps/
---

# 🟢 OpenAI又降价50%，我用上了十个称霸月榜的“天价”AI应用（上）

作为一个API用“电”大户，

我习惯于在各项工作流里加入GPT，

沉浸式翻译、浏览器插件、第三方应用、个人博客、开源项目等等

遇事不决，加点API魔法🪄往往有奇效！比如我现在已经不太担心有资料翻译不到位了。

懂得都懂，API带来的不仅是方便，还有如约而至的费用账单。

号称三年内会干掉传统搜索的 AI搜索、无限记忆的 MemGPT、学术神器 GPT Academic、文件阅读助手 ChatFile等等

一次调用就接近几块钱的感觉有点肉疼💔，

好在前段时间，我的好 homie OpenAI发布了GPT-4o mini，

昨天还再降价了50%，

我说停停，那么便宜不要mean啦？

![GPT-4o mini price chart](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001030408.jpeg)

表面上看 4o mini 并没有像之前的其他模型那样，上来就拉爆所有指标，

但某种程度它也掀起了某个领域的风浪，那就是：

💰💰 性价比 💰💰

就像电车与油车对我的吸引力来说：日常使用中足够便宜大碗～

所以就有了这篇文章，我就带大家来盘点一下，有哪些token消耗量大的项目，

我们可以直接上 4o mini 把性价比拉到最满！

性价比之王 GPT-4o mini
首先，用50个字来快速带大家用回顾一下，然后再来介绍具体的项目。我们先直接上一个价格表！

![GPT-4o mini cost-performance](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001109263.png)

大家可以直观的看到 GPT-4o mini的价格到底有多低！

输出速度拉满

![High output quality](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001135216.png)

输出质量也是TOP水平

很多好用的API项目依赖GPT4的先进性能，

如果直接替换成免费的API，反而成了浪费时间。

![API project comparison](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001205899.png)

注：因为文章限制，我们将推荐项目的地址都放到了文末彩蛋，大家记得领取～


## 文档对话 - ChatFile （1/10）

提到 Token 消耗大户，我第一个想应该就是大模型对文档的处理了！

ChatFiles - 基于文档的Chatbot

它是一个可以上传文件并与之对话的应用，使用了 llama_index 拆分大文本，

![ChatFiles interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001235268.png)

基于 chatbot-ui 构建的页面

![ChatFiles on Vercel](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001244558.png)

优势是可以在本地运行，或者一键托管到Vercel上，保护你的隐私。

支持上传的文档格式包括TXT、PDF和EPUB（电子书格式）

## AI搜索 - MindSearch（2/10）

就在这两周，书生·浦语团队开源了一款具有 Perplexity.ai Pro 性能的AI搜索框架 - MindSearch，采用multi-agent框架模拟人类思维，先规划再搜索。

跟低价APi一结合，我就随时用上 SearchGPT 的开源平替，

关键是不需要月费，搜多少花多少～

MindSearch的性能也是经过实验对比的，开发团队根据 ChatGPT-Web、Perplexity.ai (Pro) 和 MindSearch 生成的响应的深度、广度和真实性对人类偏好进行比较。

结果是根据 100 个人工设计的现实问题获得的，并由 5 名人类专家进行评估。

![MindSearch performance](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001259329.png)

MindSearch亮点在于信息搜索+信息整合过程全部可视化

![MindSearch visualization](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001315689.png)

目前已经成了我常用搜索引擎Top2了！

## 解锁各类 GPT 网页版 （3/10）

ChatGPT-Next-Web 是老牌三方了。

你可以部署到电脑上，客户端大小也就5MB，我手机里任意一个APP安装包的大小都是它的50倍。。。

![ChatGPT-Next-Web interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001348428.png)

本地部署带来的体验就是能自动压缩聊天历史记录，

本来API价格就不贵，压缩后还能进一步节省Tokens，爽！

此外，还支持了 Claude 特有的Artifacts，通过分窗口能预览生成的网页。

第二个我用最多的就是 lobechat，

很多找到我想体验体验AI的朋友，我都是直发网址，然后用 one-api 分一定额度给他们玩，

![lobechat interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001407439.png)

lobechat 自带52个插件：

- 社交搜索
- 专属于LLMs的搜索聚合服务
- 管理日历事件的插件
- Bilibili 的内容搜索
- 播客、论文搜索引擎
- 从 视频 URL 生成摘要
- 还有助手市场GPTs
- 同时还支持你将本地数据库连接到 lobechat

从去年成千上百的三方API网站卷到剩两个，它们的含金量和更新速度可想而知👍

## 多平台对话机器人 - Chatbots （4/10）

多亏了开源社区，在 Slack、Wechat、飞书、钉钉、Teams等我日常用的软件基本都能用上开源版的GPT小助手。

这基本都成了我的习惯了，

毕竟很多时候我需要的就一个单轮对话，我问它答，还不需要来回切换界面，很爽！

![Multi-platform chatbot](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818001426905.jpeg)

关键是这类场景，你甚至不需要使用高级模型，

一个月用下来，还没我微信读书会员贵😏

## 代码助手 - gpt-engineer （5/10）

又一个能“避免”10刀月费的项目，GPT-Engineer 走了一条目前其他的Copilot们不同的道理，别家代码助理想的是修改代码、讲解代码、根据需求生成代码块，GPT-Engineer 大手一挥，给自己插了一面旗，“一句话生成一个代码库”

![gpt-engineer code generation](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818002335240.jpeg)

关键是它吹出去的牛还真实现了，在main_prompt文件中给出提示，GPT-Engineer根据这些提示生成代码。这些提示可以涵盖你期望生成项目的所有相关信息，比如项目功能、技术选型、项目结构等。

在代码生成的过程中，GPT-Engineer会将每一步的交互历史存储在logs文件夹中。这意味着你可以随时查看每一步的输入和输出，同时在生成代码的过程中进行调试和修改。

它还可以接受具有视觉功能的模型的图像输入，有时候想要复刻一个网页或者APP界面相当实用。

写在最后
好啦，今天先带大家盘点5个项目，
剩余的项目我们放到下期来讲，大家记得关注一下哦！

API价格整体下滑，

带来的不仅仅是开发者利好，

更多的是，

我们脱离了网页端，游离出手机端，

而是能无处不在地使用GPT Power，

越来越像穿越到异世界的我随身带着系统的感觉了。

试想一下，

如果有人穿越过来，告诉你GPT4还会便宜100倍！

你第一时间会做什么？