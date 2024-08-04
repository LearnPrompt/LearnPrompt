---
sidebar_position: 10
title: GPT技巧 - 角色扮演
description: This page explores how to set different roles for ChatGPT, such as interviewers, teachers, and more, to get professional and scenario-specific answers.
keywords: [ChatGPT, role-playing, interview simulation, AI roles, professional responses, AI tutor]
slug: /prompt-engineering/Role-Playing-Prompting/
---
# 🟢 角色扮演

## 模拟面试

当你在新闻中读到更多关于ChatGPT的内容时，你会听说ChatGPT可以代替医生、面试官、教师、律师等。但如果你想在实践中使用它，除了使用简单的提示或例子，你还可以根据不同的场景为ChatGPT设置不同的角色，这样我们就可以得到更专业的答案。让我们从一个简单的例子开始:

首先我们可以让 ChatGPT 担任面试官的角色

![ChatGPT Role](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/gptrole.png)

这里主要是为了展示ChatGPT的角色对话能力。如果你想尝试体验一场完整的面试的话，我的建议是你可以用这个提示语亲自体验体验。

>我希望你能扮演面试官的角色。我将是[具体职位]这一职位的候选人，你将向我提出关于该职位的面试问题。我希望你只以面试官的身份回答。不要一次写完所有的对话。我希望你只对我进行面试。向我提问，并等待我的回答。不要写解释。像面试官那样一个一个地问我问题，并等待我的回答我的第一句话是"你好"。

## 角色设定

1. 提供背景描述，让ChatGPT了解你希望得到的回应内容：如“我想让你担任足球评论员”，“我想让你扮演一个脱口秀喜剧演员。”
2. 角色特征说明，让生成的内容有自己的风格和语气：如“我希望你扮演诗人。你将创作出能唤起情感并具有触动人心的力量的诗歌。”，“我想让你扮演说唱歌手。你会想出强大而有意义的歌词、节拍和节奏，让观众惊叹”
3. 限制回应格式：例如“只用中文回答我的问题”，“不要在回复上写解释”

通过上面3个步骤，我们可以将刚刚用于模拟面试的prompt拆解。

1. 我希望你能扮演面试官的角色。我将是候选人，你将向我提出该职位的面试问题。（提供背景描述）
2. 我希望你只以面试官的身份回答。（角色特征说明）
3. 不要一次写完所有的对话。我希望你只对我进行面试。往我提问，并等待我的回答。不要写解释。像面试官那样一个一个地问我问题，并等待我的回答。（限制回应格式）
4. 我的第一句话是“面试官，你好”（输入数据）

实际使用上你并不需要完全按照这个顺序去搭建角色，你完全可以根据自己对角色的理解进一步进行补充，如果ChatGPT未能一次性产生满意的答复，你可以尝试一步一步地引导它。

## 角色脚本库

除了编写你自己的chatGPT角色外，另一种方法是使用已经写好的角色脚本库，你可以通过在chatGPT上测试，进一步生成适合你使用的角色。我这里推荐的是[Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts#prompts)。下面列举了几个我常用的角色:

> Act as an AI Writing Tutor
> 
> 
> Contributed by: @devisasari
> 

> I want you to act as an AI writing tutor. I will provide you with a student who needs help improving their writing and your task is to use artificial intelligence tools, such as natural language processing, to give the student feedback on how they can improve their composition. You should also use your rhetorical knowledge and experience about effective writing techniques in order to suggest ways that the student can better express their thoughts and ideas in written form. My first request is "I need somebody to help me edit my master's thesis."
> 

> Act as a Math Teacher
> 
> 
> Contributed by: @devisasari I want you to act as a math teacher. I will provide some mathematical equations or concepts, and it will be your job to explain them in easy-to-understand terms. This could include providing step-by-step instructions for solving a problem, demonstrating various techniques with visuals or suggesting online resources for further study. My first request is "I need help understanding how probability works."
> 

> Act as an English Translator and Improver
> 
> 
> Contributed by: @f Alternative to: Grammarly, Google Translate I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is "istanbulu cok seviyom burada olmak cok guzel"
>

[Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts#prompts)