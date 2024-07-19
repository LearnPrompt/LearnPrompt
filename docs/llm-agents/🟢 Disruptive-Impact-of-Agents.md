---
sidebar_position: 0
title: The Disruptive Impact of Agents
description: This article explores the insights shared by OpenAI's co-founder Andrej Karpathy on the potential and future of AI Agents, comparing past difficulties with new opportunities brought by modern technologies.
keywords: [AI Agents, OpenAI, Andrej Karpathy, AI development, LLM, autonomous agents, AutoGPT, BabyAGI, MetaGPT]
slug: /llm-agents/agents-disruptive-impact/
---
# 🟢 The Disruptive Impact of Agents

OpenAI co-founder Andrej Karpathy spoke at a developer event about his and OpenAI's views on AI Agents. He contrasted the past difficulties of developing AI Agents with new opportunities brought by modern technological tools. Karpathy believes that ordinary people, entrepreneurs, and geeks have more advantages in building AI Agents compared to companies like OpenAI because everyone is in a level playing field. He is optimistic about the outcomes in this field.

![Agent Concept](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a20831c182bc28c495cb3be759f4d1a3.png)

Additionally, Lilian Weng, OpenAI's Director of Applied Research, proposed the concept of Agent = LLM (Large Language Model) + Memory + Planning Skills + Tool Usage in a detailed article. She explained the function of each module of an Agent and expressed confidence in the future applications of Agents, while also acknowledging the challenges ahead.

Existing Agents projects like AutoGPT, BabyAGI, and MetaGPT have validated the potential of LLMs. LLMs are not just text generation tools; they can become powerful general-purpose problem solvers. Whether it’s writing, storytelling, essays, or programming, LLMs can handle it all. They show immense potential in solving real-world problems.

BabyAGI creator Yohei Nakajima once said, “The future of autonomous agents looks like everybody becoming a manager.” This aptly summarizes our outlook on Agents.

🎉 Before you start reading, if you are interested in other articles, feel free to follow our "Karl's AI Watts" open-source AIGC learning community for updates. 🎉

## What is an Agent? How is it different from GPT?

Agents can not only complete specific tasks such as recommending content, writing copy, and answering questions but also help you achieve more complex goals. You can think of it as a teammate rather than just a tool. You can have the Agent think and give it a goal, even a vague one like "create the best ice cream in the world." The Agent will generate a to-do list and continuously add new tasks based on progress until the goal is achieved.

Before diving deeper, let’s explain some terms. In the field of artificial intelligence, understanding these specific terms is essential to grasp accurate concepts.

> GPT = generative pre-trained transformer, which is the core machine learning model architecture driving large language models (LLMs) like ChatGPT.

Next, let's look at what an Agent is:

> Agent = A large language model set with some goals or tasks that can iterate. It differs from the "usual" use of LLMs in tools like ChatGPT. In ChatGPT, you ask a question and get a response. An Agent has a complex workflow and can self-converse without human-driven interactions for each part.

Autonomous Agents are AI-driven programs that, when given a goal, can create tasks, complete tasks, create new tasks, reprioritize the task list, complete new top tasks, and loop until the goal is reached.

ChatGPT handles one task at a time by receiving a single query input and returning an output. However, with the introduction of ChatGPT plugins, this limitation has changed. Now, the model can use external tools to handle up to 10 requests simultaneously. This is a manifestation of the "Agent" concept in ChatGPT, as the model can decide whether to send additional requests to complete tasks.

For those who haven't tried plugins yet, the basic concept is that you can tell ChatGPT how an external tool’s API works, and it can then write and execute code to send requests to the API based on user queries. For example, if you have a weather plugin and a user asks, "What is the temperature in New York?" the model will know it cannot answer this directly and will check the available plugins installed by the user. Suppose it sends a request, and the API returns an error message saying, "New York is not a valid location. Please use a detailed city name, not an abbreviation." The model can actually read this error and send a new request to fix it. This is the simplest example of how an Agent works in production today.

If you haven't tried plugins yet, the basic concept is that you can tell ChatGPT how an external tool’s API works, and the model can write and execute code to send requests to the API to answer user queries. For example, if you have a weather plugin and a user asks, "What is the temperature in the north?" the model will know it cannot answer this directly and will check the available plugins installed by the user. Suppose it sends a request, and the API returns an error message saying, "The north is not a valid location. Please use a detailed city name." The model can actually **read this error message and send a new request to fix it**. This is the simplest example of an Agent working in production today.

A streamlined Agent decision process:

**Perception → Planning → Action**

- Perception refers to the Agent's ability to collect information from the environment and extract relevant knowledge.
- Planning refers to the decision-making process the Agent undertakes to achieve a specific goal.
- Action refers to the actions taken based on the environment and planning.

The Agent collects information and extracts relevant knowledge from the environment through perception. Then, through planning, it makes decisions to achieve a goal. Finally, through action, it performs specific actions based on the environment and planning. Policy is the core decision of the Agent’s actions, and actions provide the premise and foundation for further perception, forming an autonomous closed-loop learning process.

## Agent Diagram

I can further explain the concept of Agents through visualization and examples: Agents enable LLMs to achieve goals through self-motivated cycles.

Rather than linear interaction, it can be **parallel** (using multiple prompts simultaneously to solve the same goal) and **unidirectional** (without human interaction in the conversation).

After creating a goal or main task for the Agent, the process mainly involves the following three steps:

![Agent Workflow](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d396e13790858dc3e0ca0ea8287537ce.png)

1. Get the first unfinished task
2. Gather intermediate results and store them in the vector database
3. Create new tasks and reprioritize the task list

Let’s look at a concrete example. We can start with a task like "write a 1500-word blog post on ChatGPT and what it can do."

The model receives this request and follows these steps:

```python
sub_tasks = openai.ChatCompletion.create(
  model="gpt-4",
  messages=[
    {"role": "system", "content": "You are a world-class assistant designed to help people accomplish tasks"},
    {"role": "user", "content": "Create a 1500-word blog post on ChatGPT and what it can do"},
    {"role": "user", "content": "Take the user's request above and break it down into simple sub-tasks which can be easily done."}
  ]
)
```

In this example, we use the OpenAI API to drive the Agent. Through the system field, you can define your Agent to a certain extent. Then, we add the user content "Create a 1500-word blog post on ChatGPT and what it can do," followed by the next step "Take the user's request above and break it down into simple sub-tasks which can be easily done," adding tasks to decompose the query into sub-tasks.

Next, you can get the sub-tasks and send more calls to the model in a loop, executing all these sub-tasks, each with different system messages (imagine different Agents, maybe one is good at writing, another at academic research, etc.).

Next, you can loop and send more calls to the model, executing each sub-task. Each sub-task can have different system messages, which you can imagine as representing experts in different fields, such as an expert in writing, an expert in academic research, etc. This way, you can have the model think and respond under different roles to better meet user needs.

> Congratulations, you are one step closer to understanding Agents! Follow 「卡尔的AI沃茨」for more updates.

## References

- [What are GPT Agents? A deep dive into the AI interface of the future](https://logankilpatrick.medium.com/what-are-gpt-agents-a-deep-dive-into-the-ai-interface-of-the-future-3c376dcb0824)