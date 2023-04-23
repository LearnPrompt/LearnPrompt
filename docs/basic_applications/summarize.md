---
sidebar_position: 10
---

# 内容总结

ChatGPT 可以通过分析内容并生成一个浓缩版本来总结文本。这对节省时间和精力很有帮助，特别是在阅读长篇文章、研究论文或报告时。

## 通用总结

你所要做的就是把具体的文字复制并粘贴到提示中，并要求ChatGPT对所选文本进行简化总结。这里我们参考openai官网提供的例子**Summarize for a 2nd grader**来总结一下**木星**的维基百科

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="Summarize this for a second-grade student:\n\n Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus." initial-response="Jupiter is the fifth planet from the Sun and is very big and bright. It can be seen with our eyes in the night sky and it has been known since ancient times. Its name comes from the Roman god Jupiter. It is usually the third brightest object in the night sky after the Moon and Venus." max-tokens="64" box-rows="18" model-temp="0.7" top-p="1.0">
    <noscript>Failed to load Dyno Embed: JavaScript must be enabled</noscript>
</div>

## 概念性总结

Ted Chiang曾经在纽约客上发表文章，称ChatGPT为**互联网的有损压缩**。那么我们同样可以通过提示来生成总结，并不需要粘贴额外的文字。

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="Summarize for me what Jupiter is, like I'm 8 years old" initial-response="Jupiter is the biggest planet in our solar system. It's very far away, but we can see it in the night sky. It's big and bright and looks like a star. Jupiter is a gas giant and is made of mostly gas and liquids, just like Saturn. It has big, swirling storms and colorful stripes on it. It's very interesting and fun to look at." max-tokens="256" box-rows="18" model-temp="0.8" top-p="1.0">
    <noscript>Failed to load Dyno Embed: JavaScript must be enabled</noscript>
</div>

概念性总结对于我们一开始想要快速了解某个概念的简要总结来说非常有帮助。

## 大纲式总结

除了摘要这种形式外，你还可以要求 ChatGPT 为长文本写提纲。这样你可以一次性看到整篇文章的主线或框架。

以下是ChatGPT对维基百科上 [ChatGPT](https://en.wikipedia.org/wiki/ChatGPT#cite_note-guardianpos-4) 页面上的提纲。

这里我使用了角色扮演类的提示，让 ChatGPT 扮演一个文档大纲生成器，并且定义了两个关键词组。当我还没输入“生成大纲”时，ChatGPT 会在读取完成后输出“读取完毕”，而不是直接生成大纲。

![outline](./img/outline.png)

![read](./img/read_complate.png)

最终生成的大纲如下：

```text
//highlight-start

Sure, based on the text you provided, here is the outline:

I. Introduction

- Overview of ChatGPT
- Built on GPT-3.5 and GPT-4 models
- Fine-tuned using supervised and reinforcement learning techniques

II. Fine-tuning Process

- Reinforcement learning from human feedback (RLHF)
- Supervised learning and human trainers
- Proximal Policy Optimization (PPO)

III. Infrastructure and Data Collection

- Microsoft Azure supercomputing infrastructure
- User data collection and feedback

IV. Features

- Versatility in various domains
- Ability to remember previous prompts in a conversation
- Attempts to reduce harmful and deceitful responses
- Filtering of potentially offensive queries
- Plugin support for ChatGPT

V. Conclusion

- Speculations on potential uses of ChatGPT
- Continued improvements and upgrades by OpenAI

//highlight-end
```

## 维基百科式总结

除了大纲和概要之外，还有一种适合我们日常阅读习惯的格式，那就是维基百科。这里我同样是使用角色扮演，生成 **AI**（Artificial intelligence）的总结。

>I want you to act as a Wikipedia page. I will give you the name of a topic, and you will provide a summary of that topic in the format of a Wikipedia page. Your summary should be informative and factual, covering the most important aspects of the topic. Start your summary with an introductory paragraph that gives an overview of the topic. My first topic is "Artificial intelligence"

下面是部份的生成结果。

```text
//highlight-start

Artificial Intelligence (AI) refers to the development of computer systems that can perform tasks that would typically require human intelligence, such as learning, problem-solving, decision making, and natural language processing. AI involves the creation of algorithms and computer programs that can process large amounts of data and make predictions or decisions based on that data.

The history of AI dates back to the 1950s, when researchers began developing computer programs that could play chess and solve mathematical problems. Over the years, AI has advanced significantly, and today, it is used in a wide range of industries, including healthcare, finance, and transportation.

...
//highlight-end
```
就个人而言，我会更喜欢维基百科这种长度适中的总结形式。了解不同形式的总结能帮助我们更快更好的阅读长文本和了解概念。

## PDF&DOC文档总结

这里我推荐的是[ChatPDF](https://www.chatpdf.com/)和[ChatDoc](https://chatdoc.com/)。

它们可以在文件上传后回答关于文件内容的问题。根据你的问题，它们可以在文件中找到相关段落，并用自然语言回复你的问题。同时，它们还会提供相应的页码或章节信息，以便你能轻松查看原文。

更多好用的工具请关注我们**工具推荐**章节。