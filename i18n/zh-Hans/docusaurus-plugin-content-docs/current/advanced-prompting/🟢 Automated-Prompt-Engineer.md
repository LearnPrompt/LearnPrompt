---
sidebar_position: 30
title: Automated Prompt Engineer (APE)
description: This page provides an overview of the Automated Prompt Engineer (APE) framework for automatic instruction generation and selection.
keywords: [APE, automated prompt engineer, instruction generation, LLM, CoT prompt, natural language synthesis]
slug: /advanced-prompting/automated-prompt-engineer/
---
# 🟢 自动提示工程师（APE）

![Automated Prompt Engineer](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/APE.webp)

[Zhou等人，（2022）](https://arxiv.org/abs/2211.01910)提出了自动提示工程师（APE），这是一个用于自动指令生成和选择的框架。指令生成问题被构建为自然语言合成问题，使用LLMs作为黑盒优化问题的解决方案来生成和搜索候选解。

第一步涉及一个大型语言模型（作为推理模型），该模型接收输出演示以生成任务的指令候选项。这些候选解将指导搜索过程。使用目标模型执行指令，然后根据计算的评估分数选择最合适的指令。

APE发现了一个比人工设计的“让我们一步一步地思考”提示更好的零样本CoT提示（[Kojima等人，2022](https://arxiv.org/abs/2205.11916)）。

**提示“让我们一步一步地解决这个问题，以确保我们有正确的答案。”**

引发了思维链的推理，并提高了MultiArith和GSM8K基准测试的性能：

![Zero-shot CoT prompt](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ape-zero-shot-cot.webp)

**Reference**

- [Prompt Engineering Guide](https://www.promptingguide.ai/zh)