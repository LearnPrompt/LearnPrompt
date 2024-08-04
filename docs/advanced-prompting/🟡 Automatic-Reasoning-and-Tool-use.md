---
sidebar_position: 25
title: Automatic Reasoning and Tool-use (ART)
description: This article introduces the concept of Automatic Reasoning and Tool-use (ART) and its applications in using LLMs for task completion.
keywords: [ART, Automatic Reasoning and Tool-use, LLM, CoT, task completion, Paranjape et al., 2023]
slug: /advanced-prompting/automatic-reasoning-and-tool-use/
---
# 🟡 Automatic Reasoning and Tool-use (ART)

> 😀 Alternating between CoT prompts and tools has been proven to be both a powerful and robust method for completing tasks using LLMs. These methods usually require handwritten demonstrations for specific tasks and carefully crafted scripts for alternating between generation models and tools. [Paranjape et al., (2023)](https://arxiv.org/abs/2303.09014) proposed a new framework that uses a frozen LLM to automatically generate programs with intermediate reasoning steps.

The working principle of ART (Automatic Reasoning and Tool-use) is as follows:

- When receiving a new task, select multi-step reasoning and tool-use demonstrations from the task library.
- During testing, pause generation when calling external tools, integrate the tool output, and then continue generating.

ART guides the model to summarize demonstrations, decompose new tasks, and use tools appropriately. ART operates in a zero-shot manner. It can also be manually extended by simply updating the task and tool library to correct reasoning steps or add new tools. The process is as follows:

![ART Workflow](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ART.webp)

In BigBench and MMLU benchmarks, ART significantly outperformed few-shot prompts and automatic CoT on unseen tasks; combined with human feedback, its performance surpassed handwritten CoT prompts.

The following table shows ART's performance on BigBench and MMLU tasks:

![ART Performance](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ART2.webp)

## **Reference**
- [Prompt Engineering Guide](https://www.promptingguide.ai/zh)