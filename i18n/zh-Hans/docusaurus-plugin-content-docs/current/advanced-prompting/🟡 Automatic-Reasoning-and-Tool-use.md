---
sidebar_position: 25
title: 自动推理并使用工具 (ART)
description: This article introduces the concept of Automatic Reasoning and Tool-use (ART) and its applications in using LLMs for task completion.
keywords: [ART, Automatic Reasoning and Tool-use, LLM, CoT, task completion, Paranjape et al., 2023]
slug: /advanced-prompting/automatic-reasoning-and-tool-use/
---
# 🟡 自动推理并使用工具 (ART)

> 😀 使用 LLM 完成任务时，交替运用 CoT 提示和工具已经被证明是一种即强大又稳健的方法。这类方法通常需要针对特定任务手写示范，还需要精心编写交替使用生成模型和工具的脚本。[Paranjape et al., (2023)](https://arxiv.org/abs/2303.09014)提出了一个新框架，该框架使用冻结的 LLM 来自动生成包含中间推理步骤的程序。

ART（Automatic Reasoning and Tool-use）的工作原理如下：

- 接到一个新任务的时候，从任务库中选择多步推理和使用工具的示范。
- 在测试中，调用外部工具时，先暂停生成，将工具输出整合后继续接着生成。

ART 引导模型总结示范，将新任务进行拆分并在恰当的地方使用工具。ART 采用的是零样本形式。ART 还可以手动扩展，只要简单地更新任务和工具库就可以修正推理步骤中的错误或是添加新的工具。这个过程如下：

![ART Workflow](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ART.webp)

在 BigBench 和 MMLU 基准测试中，ART 在未见任务上的表现大大超过了少样本提示和自动 CoT；配合人类反馈后，其表现超过了手写的 CoT 提示。

下面这张表格展示了 ART 在 BigBench 和 MMLU 任务上的表现：

![ART Performance](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ART2.webp)

## **Reference**
- [Prompt Engineering Guide](https://www.promptingguide.ai/zh)