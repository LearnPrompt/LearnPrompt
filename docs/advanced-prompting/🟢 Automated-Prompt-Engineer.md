---
sidebar_position: 30
title: Automated Prompt Engineer (APE)
description: This page provides an overview of the Automated Prompt Engineer (APE) framework for automatic instruction generation and selection.
keywords: [APE, automated prompt engineer, instruction generation, LLM, CoT prompt, natural language synthesis]
slug: /advanced-prompting/automated-prompt-engineer/
---
# 🟢 Automated Prompt Engineer (APE)

![Automated Prompt Engineer](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/APE.webp)

[Zhou et al. (2022)](https://arxiv.org/abs/2211.01910) proposed the Automated Prompt Engineer (APE), a framework for automatic instruction generation and selection. The instruction generation problem is constructed as a natural language synthesis problem, using LLMs as a black-box optimization solution to generate and search for candidate solutions.

The first step involves a large language model (as an inference model) that receives output demonstrations to generate instruction candidates for the task. These candidate solutions will guide the search process. The target model executes the instructions, and the most suitable instruction is selected based on the computed evaluation score.

APE discovered a better zero-shot CoT prompt than the manually designed "Let's think step by step" prompt ([Kojima et al., 2022](https://arxiv.org/abs/2205.11916)).

**Prompt: "Let's solve this problem step by step to ensure we have the correct answer."**

This triggered chain-of-thought reasoning and improved the performance on the MultiArith and GSM8K benchmarks:

![Zero-shot CoT prompt](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ape-zero-shot-cot.webp)

**Reference**

- [Prompt Engineering Guide](https://www.promptingguide.ai/zh)