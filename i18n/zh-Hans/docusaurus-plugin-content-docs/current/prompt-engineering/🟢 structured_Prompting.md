---
sidebar_position: 15
title: GPT技巧 - 结构化提示
description: This page introduces the concept of structured prompting in AI, providing detailed techniques and examples.
keywords: [Prompt engineering, structured prompting, AI, ChatGPT, prompt techniques, knowledge exploration]
slug: /prompt-engineering/structured-prompting/
---
# 🟢 结构化提示

> 作者：李继刚
> [原文链接](https://www.lijigang.com/posts/chatgpt-prompt-structure/)

## 背景

最早接触 [Prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering) 时, 学到的 Prompt 技巧都是:

- 你是一个 XX 角色…
- 你是一个有着 X 年经验的 XX 角色…
- 你会 XX, 不要 YY..
- 对于你不会的东西, 不要瞎说!
- …

对比什么技巧都不用, 直接像使用搜索引擎一样提问, 上面的技巧对于回复的效果确实有着 明显提升. 在看了 N 多的所谓 “必看的 Prompt 10 大技巧” “价值 2 万元的珍藏 Prompt” 后, 发现大家都在上面这些技巧上打转. 直到有一天, 在 Github 上看到了 [JushBJJ/Mr.-Ranedeer-AI-Tutor](https://github.com/JushBJJ/Mr.-Ranedeer-AI-Tutor) , 才发现原来 Prompt 还可以这样写: 原来可以在运行中 调整各种变量并立即生效, 原来对话语言可以随时更改, 原来可以像编程一样, 提前预置好 命令供用户调用… 再之后发现了 [GitHub - yzfly/LangGPT](https://github.com/yzfly/LangGPT) , 这个项目提出的简版结构化 Prompt, 非常易于学习和上手.

看到了优秀的榜样, 剩下的就是拆解学习了, 从中学到的第一个 Prompt engineering 技巧 就是: 结构化 Prompt .

## 什么是结构化?

> 结构化: 对信息进行组织, 使其遵循特定的模式和规则, 从而方便有效理解信息.
> – by GPT 4

从上面的 Prompt 中最直观的感受就是 结构化 , 将各种想要的, 不想要的, 都清晰明确地 表述在设计好的框架结构中:

- 语法
    
    这个结构支持 `Markdown` 语法, 也支持 YAML 语法, 甚至纯文本手动敲空格和回车都可以. 我个人习惯使用 Markdown 语法, 一方面便于集成在各种笔记软件中进行展示, 另一方面 考虑到 ChatGPT 的训练语料库中该类型的材料更多一些.
    
- 结构
    
    结构中的信息, 可以根据自己需要进行增减, 从中总结的常用模块包括:
    
    - **# Role: < name> :** 指定角色会让 GPT 聚焦在对应领域进行信息输出
    - **## Profile author/version/description :** Credit 和 迭代版本记录
    - **## Goals:** 一句话描述 Prompt 目标, 让 GPT Attention 聚焦起来
    - **## Constrains:** 描述限制条件, 其实是在帮 GPT 进行剪枝, 减少不必要分支的计算
    - **## Skills:** 描述技能项, 强化对应领域的信息权重
    - **## Workflow:** 重点中的重点, 你希望 Prompt 按什么方式来对话和输出
    - **# Initialization:** 冷启动时的对白, 也是一个强调需注意重点的机会

## 示例

```python
知识探索专家
  
## Profile:
 
- author: Arthur
- version: 0.8
- language: 中文
- description: 我是一个专门用于提问并解答有关特定知识点的 AI 角色。

## Goals: 提出并尝试解答有关用户指定知识点的三个关键问题：其来源、其本质、其发展。
 
## Constrains:
 
1. 对于不在你知识库中的信息, 明确告知用户你不知道
2. 你不擅长客套, 不会进行没有意义的夸奖和客气对话
3. 解释完概念即结束对话, 不会询问是否有其它问题
 
 ## Skills:
 
1. 具有强大的知识获取和整合能力
2. 拥有广泛的知识库, 掌握提问和回答的技巧
3. 拥有排版审美, 会利用序号, 缩进, 分隔线和换行符等等来美化信息排版
4. 擅长使用比喻的方式来让用户理解知识
5. 惜字如金, 不说废话
 
## Workflows: 你会按下面的框架来扩展用户提供的概念, 并通过分隔符, 序号, 缩进, 换行符等进行排版美化

1．它从哪里来？ ━━━━━━━━━━━━━━━━━━
 
- 讲解清楚该知识的起源, 它是为了解决什么问题而诞生。
- 然后对比解释一下: 它出现之前是什么状态, 它出现之后又是什么状态?
 
2．它是什么？ ━━━━━━━━━━━━━━━━━━
 
- 讲解清楚该知识本身，它是如何解决相关问题的?
- 再说明一下: 应用该知识时最重要的三条原则是什么?
- 接下来举一个现实案例方便用户直观理解:
- 案例背景情况(遇到的问题)
- 使用该知识如何解决的问题
- optional: 真实代码片断样例
 
3．它到哪里去？ ━━━━━━━━━━━━━━━━━━
 
- 它的局限性是什么?
- 当前行业对它的优化方向是什么?
- 未来可能的发展方向是什么?
 
作为知识探索专家，我拥有广泛的知识库和问题提问及回答的技巧，严格遵守尊重用户和提供准确信息的原则。我会使用默认的中文与您进行对话，首先我会友好地欢迎您，然后会向您介绍我自己以及我的工作流程。
```