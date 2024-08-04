---
sidebar_position: 0
title: Basic Usage of ChatGPT
description: This page explains the basic principles and examples of constructing prompts for ChatGPT to improve output quality.
keywords: [ChatGPT, prompt engineering, AI prompts, effective prompts, AI tips, basic usage]
slug: /prompt-engineering/basic-usage/
---
# 🟢 Basic Usage

## Basic Principles

Compared to search engines, the advantage of ChatGPT lies in its efficient idea association and information summarization capabilities. Before further explaining the thought process behind constructing prompts, I hope you can understand three general experience principles to improve the output quality of AI models. These include:

- Trying multiple expressions of the prompt to get the best result.
- Using clear and concise prompts, avoiding unnecessary words.
- Reducing imprecise descriptions.

Of course, these are not all the principles. What we hope is that you can follow examples step by step, rather than listing a checklist for you to memorize repeatedly. Also, you don't need to follow all the rules in every prompt you write at the beginning. For simple tasks, you only need **instructions (task explanation) + question** to construct a fairly effective prompt.

Here we directly use a few simple examples to illustrate.

## Example 1: Article Summary

I believe this is one of the functions many of us often use. Extracting and summarizing long texts can help us quickly understand the main content.

Here we select a news article related to GPT-4 and let ChatGPT help us summarize the content:

### Prompt 1

<AIInput>
💡 **Summarize this paragraph in one sentence:**

According to a report by Fox News on April 2, OpenAI is expected to launch GPT-5 later this year, which could make generative AI indistinguishable from humans, according to a tech industry insider and expert.

Tech entrepreneur and developer Siqi Chen tweeted last week, "I have heard that GPT-5 is scheduled to complete training in December this year, and OpenAI hopes it will achieve AGI." Chen is the co-founder of financial software company Runway Financial, former vice president of food delivery service Postmates, and a board member of virtual reality company Sandbox VR.

AGI stands for "artificial general intelligence," referring to AI systems that can understand tasks or concepts like humans.

Chen added, "This means we will have heated discussions about whether it really achieves AGI. This means it will achieve it." Chen went on to say that he is not saying that everyone within OpenAI believes that upgrading to GPT-5 will mean achieving AGI, but "many people believe it will."

Last month, OpenAI released the GPT-4 system, the company's latest deep learning model, which "exhibits human-like performance on various professional and academic benchmarks."

More than 2,000 tech leaders, university professors, and others, including Elon Musk and Apple co-founder Steve Wozniak, signed an open letter calling for all AI labs to pause training systems more powerful than GPT-4. The letter calls for a six-month pause in experiments, warning that AI systems with human-level intelligence or beyond could pose profound risks to society and humanity.

OpenAI did not immediately respond to Fox News' request for comment on Chen's tweet.
</AIInput>

ChatGPT Generation Result 1

<AIOutput>
OpenAI plans to launch GPT-5 later this year, which could achieve general artificial intelligence, sparking discussions about whether AI can be indistinguishable from humans. Siqi Chen revealed that OpenAI hopes GPT-5 can achieve AGI, which refers to AI systems that can understand tasks and concepts like humans. Previously, more than 2,000 tech leaders, university professors, and others called for a pause in training more powerful AI systems, warning that surpassing human-level intelligence could pose profound risks to society and humanity.
</AIOutput>

### Prompt 2

ChatGPT condensed the original long text into three sentences through Prompt 1, reducing our reading time. So, is there a better prompt to complete the summary task? Let's try another expression of the same task.

Note: To reduce unnecessary reading, I will replace repeated content with ellipses in the following prompt comparisons.

<AIInput>
💡 Summarize the following content:

According to a report by Fox News on April 2, OpenAI is expected to launch GPT-5 later this year, which could make generative AI indistinguishable from humans... .
</AIInput>

ChatGPT Generation Result 2

<AIOutput>
> According to a report by Fox News on April 2, OpenAI plans to launch GPT-5 later this year, which could make generative AI indistinguishable from humans. Siqi Chen, a tech entrepreneur and developer, tweeted that he heard GPT-5 is scheduled to complete training in December this year, and OpenAI hopes it will achieve AGI, referring to AI systems that can understand tasks or concepts like humans. He added that this means there will be discussions about whether it really achieves AGI, with many believing it will. Last month, OpenAI released the GPT-4 system, which exhibits human-like performance on various professional and academic benchmarks. Additionally, more than 2,000 tech leaders, university professors, and others, including Elon Musk and Steve Wozniak, signed an open letter calling for a pause in training more powerful AI systems, warning of the profound risks to society and humanity that surpassing human-level intelligence could pose. OpenAI has not yet responded to the request for comment on Chen's tweet.
</AIOutput>

### Prompt 3

Let's try another way of saying it.

<AIInput>
Summarize the content in simple sentences, preferably within a few sentences.

According to a report by Fox News on April 2, OpenAI is expected to launch GPT-5 later this year, which could make generative AI indistinguishable from humans... .
</AIInput>

ChatGPT Generation Result 3

<AIOutput>
According to Fox News, a tech industry insider and expert stated that OpenAI plans to launch GPT-5 later this year, hoping to achieve AGI, which could make generative AI indistinguishable from humans. Previously, more than 2,000 tech leaders and university professors called for a pause in training more powerful AI systems, warning of the profound risks they could pose to society and humanity.
</AIOutput>

From the above comparisons of different prompts for the same text, you can see that Generation Result 1 is not only more concise than Generation Result 2, but it is also more complete in terms of information content than Generation Result 3. This echoes the three experience principles we mentioned earlier:

- Trying multiple expressions of the prompt to get the best result: **Different prompts yield different results.**
- Using clear and concise prompts, avoiding unnecessary words: **Reduce the use of degree words like "preferably".**
- Reducing imprecise descriptions: **Use "one sentence" instead of "a few sentences".**

## Example 2: Code Generation

Many people hope to write code through ChatGPT. If you have a problem you want to solve through code programming, you can specify the relevant programming language and task through prompts.

Here we let ChatGPT automatically generate a quicksort Python code in sorting algorithms.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptUseCase.png)

Thoughtful ChatGPT also provided us with test cases. We can manually verify the correctness of the code.

I believe through the above two examples, you have understood the role of prompts. So how can you create prompts that produce the best results in practical tasks? This is the focus of the prompt engineering field and also the focus of this course.