---
sidebar_position: 10
title: What are AI Tokens and Context Windows (and Why You Should Care)?
description: An introduction to AI tokens and context windows in large language models, explaining their significance and how they impact AI performance.
keywords: [AI tokens, context windows, large language models, GPT, AI, artificial intelligence, OpenAI, language processing]
slug: /basics/what-are-ai-tokens-and-context-windows/
---
# 🟢 什么是 AI Tokens 和上下文窗口（Context Windows）（以及为什么你应该关心）？

> 😀 它们是大型语言模型（LLM）工作原理的基础。

作者：Dharmesh Shah
翻译：卡尔的AI沃茨

如果你经常使用ChatGPT或其他大型语言模型（LLM）工具，你最终会碰到“Tokens”和“上下文窗口”这样的术语。这通常发生在你复制/粘贴大量文本到输入框时，如果你超过了允许的Tokens数量，就会出现错误提示，这可能会稍微打乱你原本可能很美好的一天。

那么，什么是“Token”呢？

技术上讲，它是一串文本字符。当大型语言模型（LLM）运行时，它们会将文本拆分成“Token”。这些“Token”几乎是单词——还包括标点符号和其他符号。

例如，我们来看看文本：“I don’t like flying。”

GPT是如何将其拆分成Tokens的：

![Tokenization example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/637da0d52eeab2dc6b91aa81bb684666.jpg)

你可以使用OpenAI的[Tokens化工具](https://platform.openai.com/tokenizer?utm_source=simple.ai&utm_medium=referral&utm_campaign=what-are-ai-tokens-and-context-windows-and-why-should-you-care)自己试一试。

因此，Token几乎相当于一个单词，但又不完全相同。从统计学角度来看，它大约是一个单词的三分之二。

现在，如果你和我一样好奇，可能会问：为什么不直接使用完整的单词，而要创造出一个相当于三分之二单词的新概念呢？

这是个好问题，但答案可能相当复杂。这里给出一个简化的解释：

**大型语言模型通常使用事物（包括文本）的数字表示形式，因为这样处理起来更高效。因此，文本被转换为向量（一系列数字）。为此，模型需要将单词与数字相对应。但给每一个可能的单词分配一个独立的数字是相当低效的（因为可能性太多）。通过取单词的部分（或其他序列）作为一个Token，可以减少可能的项。例如，在我们的例子中，单词“don't”被拆分为“don”和“‘t”（两个Token）。**

假设我们有四个单词：“can”、“can’t”、“don”、“don’t”。这是四种可能性。但如果我们将“‘t”视为独立的一个Token，我们只需要三个：“can”、“don”和“‘t”。这样从四个减少到三个，节省了25%。

不过，实际情况比这更复杂，**Token的使用背后还有其他理由**。

那么，你为什么应该关心呢？主要是因为Token是大型语言模型领域的标准度量单位。而且，上下文窗口的限制通常以Token的形式表达。

不同模型支持不同Token限制的上下文窗口。远在2023年11月，当GPT-3非常流行的时候，限制大约是4000Token。后来，这个限制增加到了8000、32000甚至更多Token。Anthropic的Claude支持高达200000Token的上下文窗口。有传言称Google的最新Gemini模型支持高达一百万Token。

![Context window illustration](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/73a40a610062d4e17372ec54c65fc03e.jpg)

让我们退一步来看。

到底什么是“上下文窗口”？

## 理解上下文窗口

好的，既然我们已经大概了解了什么是Token，现在让我们谈谈上下文窗口。

上下文窗口是大型语言模型用来跟踪输入提示（你输入的内容）和输出（生成的文本）的。

![Context window example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a6dafd38483c9cd4d9f09b71d4dacb9c.jpg)

通常，大型语言模型有一个限制，用Token数量来表示，这个限制决定了上下文窗口的大小。通常情况下，上下文窗口越大越好，因为大型语言模型可以处理更多关于其正在尝试完成的任务的“上下文”。

如果上下文窗口非常短，比如仅仅一句话，你就无法向大型语言模型提供足够的上下文，这会限制输出的质量。有了更大的上下文，你可以传递数页的背景信息和指令。

## 模糊中间问题

我们正在进入一个上下文窗口越来越大的世界。足够大，以至于在调用大型语言模型时，你可以传递整本书的数据/知识。

但，并非所有的大型语言模型都是一样的，许多在处理大量Token时，难以详细理解所有的上下文。

让我们以《悲惨世界》（我最喜欢的书）为例。假设我们要将整本书的内容传递给一个大型语言模型，然后提出问题。那是超过600,000个Token（545,000+词）。大型语言模型经常遇到的问题是，它们有时会忽视大量文本中的一些细节。通常，这没关系，它们只是试图抓住事物的大意。但如果你有一个特定的提示，需要引用文本的一小部分，那么大型语言模型可能就无法捕捉到那一点。

但有一个好消息。

像往常一样，随着AI技术的进步，情况正在变得更好。最近，Google推出了他们的Gemini模型的最新版本，它在避开模糊中间问题方面做得更好。我猜OpenAI、Anthropic以及其他大型语言模型提供商也即将跟上。

# 上下文窗口与检索增强生成（RAG）

当你想“教”大型语言模型大量特定于你的情况的东西，而这些不是它原始训练数据的一部分时，上下文窗口（及其大小限制）就显得非常重要。

例如，假设你有100,000封电子邮件或文档，你希望大型语言模型理解并在你提问时使用。这些数据是大型语言模型未经训练的。问题在于，鉴于这些内容的巨大规模，它们不适合大多数今天的大型语言模型的上下文窗口。

解决这个问题的一个常见方法是实现检索增强生成（RAG）。

但我们将把这个话题留到《凡人指南系列之AI》的下一集。敬请期待。