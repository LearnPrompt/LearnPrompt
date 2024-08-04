---
sidebar_position: 35
title: API-Bank & AgentBench
description: This article explores the evaluation of Agent capabilities using API-Bank and AgentBench, including key methodologies and performance metrics.
keywords: [API-Bank, AgentBench, AI evaluation, LLM performance, autonomous agents, machine learning]
slug: /llm-agents/api-bank-and-agentbench/
---
# 🟡 API-Bank & AgentBench

Evaluating models is a crucial part of the Agent learning process. By analyzing data to assess the Agent's capabilities, it is possible to objectively measure its performance in specific tasks or domains. Data evaluation forms the basis for continuous iteration and improvement. Through repeated evaluations and data analysis, the Agent can gradually improve itself and continually optimize its abilities. Data evaluation can also compare the Agent with other Agents or standards to understand its relative capabilities in the same task or domain. This helps the Agent understand its position and competitive stance within the ecosystem, clarifying goals for further improving its capabilities.

🎉 Before you start reading, if you are interested in other articles, you can follow us on the welcome page! Stay updated with the latest tutorials and updates from the open-source Chinese community "Karl's AI Watts". 🎉

## API-Bank

**API-Bank** is a benchmark tool designed to evaluate enhanced LLM performance. It includes 53 commonly used API tools, complete tool-enhanced LLM workflows, and 264 annotated dialogues containing 568 API calls. These APIs cover various domains such as search engines, calculators, calendar queries, smart home control, schedule management, health data management, and account authentication workflows.

The LLM first selects the correct API to call through an API search engine and uses the corresponding documentation to make the call. In the API-Bank workflow, the LLM needs to make several decisions, and the accuracy of each decision can be evaluated. These decisions include:

1. Determining whether an API call is needed.
2. Identifying the correct API to call: If not sufficient, the LLM needs to iteratively modify the API input, such as deciding the search keyword for the search engine API.
3. Responding based on API results: If the results are unsatisfactory, the model can choose to improve and make the call again.

    ![API-Bank Workflow](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9bd8c9e80c029433ae8821b09d060f39.png)

This benchmark evaluates the Agent's tool usage capabilities on three levels:

- Level-1: Evaluating the ability to call APIs. Given the API description, the model needs to determine whether to call the API, correctly call it, and appropriately respond to the API return.
- Level-2: Evaluating the ability to retrieve APIs. The model needs to search for APIs that may solve the user's needs and learn how to use them by reading the documentation.
- Level-3: Evaluating the ability to combine APIs. In cases where the user request is unclear, such as scheduling team meetings or booking travel flights/hotels/restaurants, the model may need to make multiple API calls to solve the problem.

## AgentBench

![AgentBench Scenarios](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/77187ded6db764d73773443c9911ca45.png)

AgentBench is also an innovative benchmark designed to evaluate the performance of LLMs as autonomous Agents in different environments. It covers eight different scenarios to comprehensively assess the capabilities of LLMs as Agents. These scenarios include operating systems, databases, knowledge graphs, digital card games, and lateral thinking puzzles. Additionally, there are scenarios recompiled from existing datasets, such as house holding, online shopping, and web browsing. Through these tests, we can gain deeper insights into the performance of LLMs in various contexts and further improve their autonomous operational capabilities.

> In the next section, we will share our insights on the development process of Agents! Follow 「卡尔的AI沃茨」for more updates! 🧙

## Reference
- [API-Bank](https://arxiv.org/abs/2304.0824)