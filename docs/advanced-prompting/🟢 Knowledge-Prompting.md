---
sidebar_position: 15
title: Knowledge Prompting in AI
description: This page explains how integrating external knowledge can improve commonsense reasoning through knowledge prompting, without needing task-specific supervision or access to structured knowledge bases.
keywords: [knowledge prompting, AI, commonsense reasoning, language model, knowledge integration]
slug: /advanced-prompting/knowledge-prompting/
---
# 🟢 Knowledge Prompting

Whether incorporating external knowledge can enhance commonsense reasoning remains an open question. A series of studies have shown that the integration of external knowledge can improve the performance of models on tasks. Knowledge Prompting does not require supervision for the specific task of knowledge integration, nor does it need access to structured knowledge bases. Instead, Knowledge Prompting can directly generate knowledge from the language model and then use this knowledge as additional input when answering questions.

As the authors put it, "We propose a simple yet effective method to obtain knowledge statements (i.e., knowledge expressed in natural language) from general language models in a few-shot scenario."

![Knowledge Prompting](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/4e3e1fe9d3ed4fbf396cefbb6f230411.png)

Knowledge Prompting mainly consists of two stages:

1. Generating knowledge statements related to the question from the language model using a small number of demonstrations.
2. Using a second language model to make predictions for each knowledge statement, then selecting the prediction with the highest confidence.

## Knowledge Generation

Here we intend to use ChatGPT to respond to commonsense questions:

![Commonsense Questions](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/85d760f59c8d5795459c9d7f3e7f3e22.png)

ChatGPT thinks that penguins do not have wings.

![wiki.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/21a72038ab77798cbd8803247e839acb.png)

Next, we let ChatGPT generate some knowledge about penguins:

![Penguin Knowledge](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c4a0c84ed76062ea31b3ed2e1a5f6236.png)

## Knowledge Injection

At this point, we re-ask ChatGPT the question by injecting external knowledge:

![Corrected Penguin Knowledge](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/bc5827a7b96493e048f18b486fe0259b.png)

This time, the penguin finally got back its two wings. 😂