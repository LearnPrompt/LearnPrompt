---
sidebar_position: 10
title: AutoGPT - AI实现任务自动化
description: An overview of AutoGPT, its components, capabilities, and quick start guide for task automation using AI.
keywords: [AutoGPT, AI, task automation, GPT-4, langchain, Toran Richards, AI tools]
slug: /llm-agents/autogpt/
---
# 🟢 AutoGPT

AutoGPT 是一个由Toran Richards创建的流行开源项目。它利用GPT4作为大脑，结合langchain的链接思想，连接各种工具和互联网资源，来完成人类给予的任务。您只需要设定一个目标，AutoGPT就会自主规划并逐步执行任务。如果遇到问题，它会自主拆分任务并逐步解决。

🎉开始阅读前，如果你对其他文章感兴趣，可以到欢迎页关注我们！「卡尔的AI沃茨」开源中文社区实时获得后续的更新和最新的教程🎉

![AutoGPT Workflow](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3f627c8c6e2d3fda5ee85f68909774e0.png)

AutoGPT 所做的事情就是把电脑的控制权、向量空间的云存储、各种工具的API交给了AI。借此，它可以分析市场并提出交易策略、客户服务、营销、财务或其他需要持续更新的任务。

这就是为什么 Karpathy 最近说“AutoGPT 是提示工程的下一个前沿”

AutoGPT 相当于给基于 GPT 的模型赋予了内存和主体。您现在可以将任务交给 AI 代理，让它自主制定计划、执行计划、浏览网页并使用新数据修改策略，直到任务完成。

AutoGPT由以下三个组成部分构成：

1. 架构：它通过 API 调用 GPT-4 和 GPT-3.5。
2. 自主迭代：AutoGPT通过自我评估改进其输出，利用以前的工作和提示历史以获得更准确的结果。
3. 内存管理：与 @pinecone 的集成让 AutoGPT能够长期内存存储，支持上下文保存和改进决策。

此外，AutoGPT还具备多功能性，例如文件操作、网页浏览和数据检索等功能，使其应用范围更广。

## 快速体验

- AI平台Hugging Face还提供了托管版本的[AutoGPT](https://huggingface.co/spaces/aliabid94/AutoGPT)。您只需要提供OpenAI API密钥，为AI指定角色和一些目标即可
- 对于Replit用户，您还可以分叉此[repl](https://replit.com/@nathanwchan/Auto-GPT)并为其提供您的OpenAI API密钥
- [godmode](https://godmode.space/)也允许您输入OpenAI API密钥，然后简单地给AutoGPT一个任务来完成
- [Cognosys](https://www.cognosys.ai/):一款类AutoGPT 的在线工具;不需要绑定OpenAI 的API Key

这里我们使用Cognosys为例，再现我们上一节提到的总结最新新闻的agent运用例子！

让我们以Cognosys为例，看看如何使用他们的平台来应用AgentGPT来总结最新新闻。

![Cognosys Platform](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/62b36bd633cbaa752d56531ea8ed091b.png)

1. 首先，访问Cognosys网站。
2. 输入Agent的名称和您想要达到的目标，让AgentGPT知道你的需求。
3. 选择模式为Browsing，让AgentGPT拥有联网能力
4. 点击提交，AgentGPT会利用其强大的自然语言处理能力来搜索最新的新闻，并呈现出相关的摘要。
5. 您可以阅读并评估生成的新闻摘要，如果需要，还可以对其进行修改或完善，让摘要更贴合您的需求。

![News Summarization Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/26f452900b6d7279c60effdc889f724e.png)

恭喜你掌握了第一个 Agent！欢迎关注「卡尔的AI沃茨」🧙