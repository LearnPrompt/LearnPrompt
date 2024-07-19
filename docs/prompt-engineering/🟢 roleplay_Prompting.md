---
sidebar_position: 10
title: Role-Playing with ChatGPT
description: This page explores how to set different roles for ChatGPT, such as interviewers, teachers, and more, to get professional and scenario-specific answers.
keywords: [ChatGPT, role-playing, interview simulation, AI roles, professional responses, AI tutor]
slug: /prompt-engineering/Role-Playing-Prompting/
---
# 🟢 Role-Playing Prompting

## Simulated Interview

When you read more about ChatGPT in the news, you will hear that ChatGPT can replace doctors, interviewers, teachers, lawyers, etc. But if you want to use it in practice, besides using simple prompts or examples, you can set different roles for ChatGPT according to different scenarios, so we can get more professional answers. Let's start with a simple example:

First, we can let ChatGPT act as an interviewer.

![ChatGPT Role](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptrole.png)

This is mainly to demonstrate ChatGPT's role dialogue capability. If you want to try a full interview experience, my suggestion is to use this prompt and experience it yourself.

> I hope you can act as an interviewer. I will be a candidate for [specific position], and you will ask me interview questions about that position. I want you to answer only as an interviewer. Don't write all the dialogue at once. I want you to interview me. Ask me questions and wait for my answer. Do not write explanations. Ask me questions one by one as an interviewer and wait for my answers. My first sentence is "Hello".

## Role Setting

1. Provide background description to let ChatGPT understand the response content you want: e.g., "I want you to act as a football commentator," "I want you to act as a stand-up comedian."
2. Character feature explanation to give the generated content its style and tone: e.g., "I want you to act as a poet. You will create poems that evoke emotions and have the power to touch hearts," "I want you to act as a rapper. You will come up with powerful and meaningful lyrics, beats, and rhythms that amaze the audience."
3. Restrict response format: e.g., "Only answer my questions in Chinese," "Do not write explanations in your replies."

With the above three steps, we can break down the prompt used for the simulated interview.

1. I hope you can act as an interviewer. I will be a candidate, and you will ask me interview questions for that position. (Provide background description)
2. I want you to answer only as an interviewer. (Character feature explanation)
3. Don't write all the dialogue at once. I want you to interview me. Ask me questions and wait for my answer. Do not write explanations. Ask me questions one by one as an interviewer and wait for my answers. (Restrict response format)
4. My first sentence is "Hello, interviewer" (Input data)

In actual use, you don't need to build roles in this order completely. You can supplement based on your understanding of the role. If ChatGPT fails to generate satisfactory responses at once, you can try guiding it step by step.

## Role Script Library

In addition to writing your own ChatGPT roles, another way is to use already written role script libraries. You can test them on ChatGPT and generate roles suitable for your use. Here I recommend [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts#prompts). Below are a few roles I commonly use:

> **Act as an AI Writing Tutor**
> 
> Contributed by: @devisasari
> 
> I want you to act as an AI writing tutor. I will provide you with a student who needs help improving their writing and your task is to use artificial intelligence tools, such as natural language processing, to give the student feedback on how they can improve their composition. You should also use your rhetorical knowledge and experience about effective writing techniques in order to suggest ways that the student can better express their thoughts and ideas in written form. My first request is "I need somebody to help me edit my master's thesis."

> **Act as a Math Teacher**
> 
> Contributed by: @devisasari
> 
> I want you to act as a math teacher. I will provide some mathematical equations or concepts, and it will be your job to explain them in easy-to-understand terms. This could include providing step-by-step instructions for solving a problem, demonstrating various techniques with visuals, or suggesting online resources for further study. My first request is "I need help understanding how probability works."

> **Act as an English Translator and Improver**
> 
> Contributed by: @f
> 
> Alternative to: Grammarly, Google Translate
> 
> I want you to act as an English translator, spelling corrector, and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper-level English words and sentences. Keep the meaning the same, but make them more literary. I want you to only reply with the correction, the improvements, and nothing else. Do not write explanations. My first sentence is "istanbulu cok seviyom burada olmak cok guzel"

[Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts#prompts)