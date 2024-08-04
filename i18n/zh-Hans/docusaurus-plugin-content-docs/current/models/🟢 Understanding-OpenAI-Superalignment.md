---
sidebar_position: 5
title: 一文读懂 OpenAI超级对齐团队首个成果 - 用GPT2监督GPT-4
description: This page summarizes OpenAI's latest research on using a weaker model, GPT-2, to enhance the performance of a stronger model, GPT-4, as part of their superalignment initiative.
keywords: [OpenAI, GPT-4, GPT-2, AI alignment, Weak-to-strong Generalization, AI research]
slug: /models/openai-superalignment/
---
# 🟢 一文读懂 OpenAI超级对齐团队首个成果：用GPT2监督GPT-4

## 前言

OpenAI 最新论文《Weak-to-strong Generalization》，[https://cdn.openai.com/papers/weak-to-strong-generalization.pdf…](https://t.co/HJGB8I0R7X)，声称开辟了对超人类模型进行实证对齐的新研究方向。团队甚至提供了 1000 万美元的资助计划，期望更多人参与进来解决这篇论文提出的问题：**如何让弱监督模型强化比它更强的模型，以构建超人类人工智能系统**，例如，如何使用 GPT-2 作为监督模型让 GPT-4 变得更强。

## 为什么这件事很重要

“人类反馈的强化学习”（RLHF）在 ChatGPT 的训练过程中起到了至关重要的作用。OpenAI 联合创始人、研究科学家 John Schulman 认为，RLHF 才是 ChatGPT 的秘密武器（secret sauce）。训练数据的体量固然重要，但是让 ChatGPT 更容易推断出用户的意图，产生质变的根本原因是已在 InstructGPT（ChatGPT 前身）使用的 “人类反馈的强化学习（RLHF）” 技术。

随着 GPT 能力的提升，人类也开始从强监督者角色转变成了弱监督者。GPT 未来能够编写一百万行极其复杂的代码，这时候人类将无法对关键对齐相关任务提供可靠的监督（也就是无法让AI更加智能）

因此 OpenAI 提出了一个让弱监督 AI（替代人类身份）来调优更强的 AI 的想法，也就是使用弱模型来监督强模型。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment.png)

图 1：我们的方法说明。传统的机器学习侧重于人类监督比人类弱的模型的环境。对于最终的超对齐问题，人类将必须比他们更聪明地监督模型。

通过实验证明，15 亿参数的 GPT-2 模型可以被用来激发 GPT-4 的大部分能力，使其达到接近 GPT-3.5 级别的性能，甚至可以正确地泛化到小模型失败的难题上。

**而有趣的现象是: GPT-2 在调优的过程中变得更加聪明了。**

因此假设有一个跟人类差不多水平的 AI 去调优一个更强的 GPT（如 GPT-5），在调优的过程中，这个 AI 可以获得比当前更强的水平，从而就可以更进一步让 GPT-4 演化到 GPT-4.5 甚至是 GPT-5 了

## 为什么从弱到强的学习是可用的？

- 一方面，强模型可以简单地学习模仿弱监督者，包括其错误。
- 另一方面，强大的预训练模型已经能够很好地表示我们关心的对齐相关任务。例如，如果一个模型可以生成复杂的代码，那么它还应该直观地知道该代码是否遵循用户的指令。

因此，我们不需要弱监督者来教授强模型新能力；**相反，我们只需要弱监督者来引出强模型已经知道的东西。**

## **研究方法**

所以他们是如何实现的呢？这里我简单概要了一下：对于一个给定的任务：

1. 创建弱监督者：在这项工作的大部分时间里，我们是通过在真值标签上微调小型预训练模型来创建弱监督者，然后将弱监督者的性能称为弱性能，并通过保留的弱模型的预测来生成**弱标签。**
2. 训练弱监督的强学生模型。使用上一步生成的弱标签微调强模型后得到**强学生模型**，并将其产生的性能称为从弱到强的性能。
3. 训练一个以真值标签为上限的强模型。为了进行比较，我们用真实标签微调了一个强大的模型。我们将此模型的最终性能称为强大的上限性能。直观上，这应该对应于**“强模型知道的一切”**，即强模型将其全部功能应用于任务

通常，从弱到强的表现将介于弱表现和强上限表现（strong ceiling）之间。本文将 恢复的性能差距 PGR（performance gap recovered）定义为上述三种性能（弱、弱到强和强上限）的函数，如下图所示。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment1.png)

如果实现完美的弱到强泛化，则 PGR 为 1（达到strong ceiling）。如果弱到强模型的表现并不比弱监督者更好，则 PGR 为 0（停留在weak performance）。

## 局限性

这阶段的工作有重要的局限性。本文的方法并在所有设置中始终如一地工作（**不够稳定**），特别是在 RM （奖励模型）的设置中，我们还远远没有恢复弱模型和强模型之间的全部性能差距。因此，我们的方法更多地作为弱到强泛化易于处理的概念证明。

为了让大家可以更好地参与到这个项目中，OpenAI 开源了他们使用弱监督 AI 调优更强 AI 的代码，

[https://github.com/openai/weak-to-strong](https://t.co/4c7sXGVStc)，感兴趣的可以去学习下。

## 理想的终极形态

同样，本文也提出了这项工作的“理想状态”

- 我们可以使用弱监督者从更强大的模型中可靠地获取知识。
- 这可能使我们能够开发出超人的奖励模型或安全分类器
- 而我们又可以用这些超人的奖励/安全模型来调整更强的超人模型。

## 实验结果

在 NLP 任务、国际象棋和奖励建模任务中，本文评估了强学生模型在对弱监督者生成的标签进行微调时的概括能力表现：

**总的来说，在所有的设置中，本文观察到从弱到强的泛化：强学生模型始终胜过他们的弱监督者。结果表明，直接使用弱的、人类水平的监督将不足以调整强大的、超人类的模型；我们需要全新的技术来解决超对齐问题。**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment2.png)

### 使用中等模型规模的迭代式提升

Bootstrapping **迭代式提升是对齐领域中一个长期存在的概念：我们可以首先对齐一个仅略超人类智能的模型，然后使用这个模型来对齐一个更加智能的模型，依此类推**

**通过采取多个小步骤而不是一个大步骤，我们发现泛化能力得到了显着提高**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment3.png)

### 辅助置信度损失

图 5 表明，通过简单的辅助损失显着提高了 NLP 数据集的泛化能力。**具体来说，我们添加了一个额外的损失项，它增强了强模型对其自身预测的信心。**

因此，这次实验得到的结论是：**辅助损失减少了强学生对弱错误的模仿，并减轻了弱标签过度拟合**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment4.png)

## 弱到强泛化会在哪些阶段起到作用？

本文研究了与弱到强泛化相关的两个现象：

- 模仿导师错误 （强模型可能会过度拟合弱监督者标签及其错误）
- 任务对强学生模型的**显著性（在下面内容有详细解释）**

图 7 (a) 显示了 ChatGPT RM 任务训练过程中的真值测试准确度曲线。**这些结果表明，更好的早期停止或正则化策略可能能够通过减少对弱标签及其错误的过度拟合来显着改善弱到强的泛化**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment5.png)

**高 PGR 的一个可能原因可能是强模型很容易得出内容。特别是，强大的预训练模型可以通过简单的提示地解决许多相关任务。简单来说对于强大的模型来说通过提示可以相当容易地获得解决许多任务所需的知识（也被称为显著性）**

图 9a 考虑了 7 个有代表性的 NLP 任务，并比较了微调、零样本提示和 5-shot 提示

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment6.png)

提高任务显着性的一种方法**进行无监督微调。本文**发现，对 RM（奖励） 数据进行额外的生成微调可以带来更好的从弱到强的性能。

当结合上述两种技术时，我们可以实现大约 30-40% 的 PGR（对应上面的进度图）

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment7.png)

## 阅后感

OpenAI提出的这个新方向可以说是提前预见了下一代GPT开发的对齐技术。对齐的重要性在于“超人”模型将会拥有越来越强大的功能，如果误用或者是对人类价值观不一致的时候（与人类相反的方式进行行动），会造成严重后果

- 人工智能安全中心（CAIS）更是将“减轻人工智能带来的灭绝风险应该与其他社会规模风险一起成为全球优先事项”
- 生命未来研究所 (FLI) 于 2023 年 3 月发出的公开信：“数字思维变得越来越强大，没有人（甚至是其创造者）能够理解、预测或可靠控制”

**而这个成立于今年7月，目标是在四年内解决“超人” AI 的对齐问题的“超级对齐”团队，今天发出了第一份“答卷”**

如果你对全文以及代码项目感兴趣的话，也欢迎跟我一起讨论细节：

🔗 [https://cdn.openai.com/papers/weak-to-strong-generalization.pdf](https://cdn.openai.com/papers/weak-to-strong-generalization.pdf)

![Alignment](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/641.png)