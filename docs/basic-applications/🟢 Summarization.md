---
sidebar_position: 15
title: Summarization
description: This page explains how ChatGPT can summarize text, save time, and provide concise versions of long articles, research papers, or reports.
keywords: [ChatGPT, text summarization, content summary, AI tools, article summarization, research paper summary]
slug: /basic_applications/gpt-summarization/
---
# 🟢 Summarization

ChatGPT can summarize text by analyzing the content and generating a condensed version. This is helpful in saving time and effort, especially when reading long articles, research papers, or reports.

## General Summary

All you need to do is copy and paste the specific text into the prompt and ask ChatGPT to simplify and summarize it. Here, we use an example from OpenAI's website **Summarize for a 2nd grader** to summarize the Wikipedia entry on **Jupiter**.

<AIInput>
💡 Summarize this for a second-grade student: 

Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus.
</AIInput>

<AIOutput>
**Jupiter is a really big planet in our Solar System. It's the fifth planet from the Sun and it's even bigger than all the other planets combined! Jupiter is made mostly of gas and it's really bright in the night sky. People have known about Jupiter for a very long time, even before they wrote things down. It's named after a god from ancient Rome. When we look at Jupiter from Earth, it can be so bright that it makes shadows. It's usually the third-brightest thing we can see in the sky, after the Moon and Venus.**
</AIOutput>

## Conceptual Summary

Ted Chiang once published an article in the New Yorker, calling ChatGPT **the lossy compression of the Internet**. Similarly, we can use prompts to generate summaries without needing to paste extra text.

<AIInput>
💡 Summarize for me what Jupiter is, like I'm 8 years old
</AIInput>

<AIOutput>
Jupiter is the biggest planet in our solar system. It's very far away, but we can see it in the night sky. It's big and bright and looks like a star. Jupiter is a gas giant and is made of mostly gas and liquids, just like Saturn. It has big, swirling storms and colorful stripes on it. It's very interesting and fun to look at.
</AIOutput>

Conceptual summaries are very helpful for quickly understanding a brief summary of a concept when we first want to know about it.

## Outline Summary

Besides abstract summaries, you can also ask ChatGPT to write an outline for a long text. This way, you can see the main lines or framework of the entire article at once.

Here is ChatGPT's outline for the Wikipedia page on [ChatGPT](https://en.wikipedia.org/wiki/ChatGPT#cite_note-guardianpos-4).

I used a role-playing prompt, letting ChatGPT act as a document outline generator, and defined two keyword groups. When I haven't input "generate outline" yet, ChatGPT will output "reading completed" after reading, instead of directly generating the outline.

![Outline](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/4bb5124b4b17ce28e838a52fc38f7a10.png)

![read_complate](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c6d69a92c5a7d9f9ed2f10ac1ed2b7c9.png)

The final generated outline is as follows:

<AIOutput>
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

</AIOutput>

## Wikipedia-style Summary

In addition to outlines and abstracts, there is another format suitable for our daily reading habits, which is Wikipedia. Here I also used role-playing to generate a summary of **AI** (Artificial Intelligence).

<AIInput>
I want you to act as a Wikipedia page. I will give you the name of a topic, and you will provide a summary of that topic in the format of a Wikipedia page. Your summary should be informative and factual, covering the most important aspects of the topic. Start your summary with an introductory paragraph that gives an overview of the topic. My first topic is "Artificial intelligence"
</AIInput>

Below is part of the generated result.

<AIOutput>
Artificial Intelligence (AI) refers to the development of computer systems that can perform tasks that would typically require human intelligence, such as learning, problem-solving, decision making, and natural language processing. AI involves the creation of algorithms and computer programs that can process large amounts of data and make predictions or decisions based on that data.

The history of AI dates back to the 1950s, when researchers began developing computer programs that could play chess and solve mathematical problems. Over the years, AI has advanced significantly, and today, it is used in a wide range of industries, including healthcare, finance, and transportation.

...
</AIOutput>

Personally, I prefer the Wikipedia-style summary, which is of moderate length. Understanding different forms of summaries can help us read long texts and understand concepts more quickly and better.

## PDF&DOC Document Summarization

Here I recommend [ChatPDF](https://www.chatpdf.com/) and [ChatDoc](https://chatdoc.com/).

They can answer questions about the content after uploading the document. Based on your questions, they can find relevant paragraphs in the document and respond to your questions in natural language. Meanwhile, they will also provide corresponding page numbers or chapter information so that you can easily view the original text.

For more useful tools, please follow our **Tool Recommendations** section.