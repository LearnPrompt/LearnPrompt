---
sidebar_position: 25
title: MetaGPT - A New Framework for Multi-Agent Collaboration
description: This page introduces MetaGPT, a framework integrating workflows with multi-agent collaboration, ensuring a structured approach to problem-solving.
keywords: [MetaGPT, multi-agent collaboration, AI framework, structured problem-solving, SOP in AI, MetaGPT software development]
slug: /llm-agents/metagpt/
---
# 🟡 MetaGPT

MetaGPT is a widely recognized research achievement that introduces a framework seamlessly integrating human workflows with multi-agent collaboration. By encoding Standard Operating Procedures (SOPs) as prompts, MetaGPT ensures a structured approach to problem-solving, reducing the likelihood of errors.

🎉 Before you start reading, if you are interested in other articles, you can follow us on the welcome page! Follow「卡尔的AI沃茨」open-source Chinese community for real-time updates and the latest tutorials 🎉

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7af15669de3dc92e1ab81759c67349c3.jpg)

Currently, there's a problem with agent solutions: while these language model-driven agents have made significant progress in simple conversational tasks, they struggle with complex tasks, hallucinating as if seeing things that don't exist. When these agents are linked together, it triggers a chaotic chain reaction.

Now, MetaGPT introduces standardized operating procedures. These procedures act like cheat codes for smooth coordination. They inform the agents of what's happening, guiding them in an orderly manner. With these procedures, agents can almost be as familiar with their tasks as domain experts and validate outputs to avoid errors. Like a high-tech assembly line, each agent plays a unique role, working together to understand complex teamwork.

## Why MetaGPT is Important

In a world where AI-driven solutions are becoming the norm, MetaGPT offers a fresh perspective. Here's why it is making waves:

- Outstanding Solutions: With SOPs, MetaGPT has proven to generate more consistent and accurate solutions compared to other agents.
- Diverse Role Assignment: The ability to assign different roles to LLMs ensures comprehensiveness in problem-solving.

## MetaGPT Software Development Process

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/930ae342a827adafc396fb9431f9bed7.jpg)

1. Requirements Analysis: The process begins upon receiving the requirements. This phase is dedicated to clarifying the necessary functions and demands of the software.
2. Acting as Product Manager: The product manager initiates the process based on requirements and feasibility analysis. They are responsible for understanding the needs and setting a clear direction for the project.
3. Acting as Architect: Once the requirements are clear, the architect creates a technical design for the project. They are responsible for constructing the system interface design, ensuring technical implementation meets the needs. In MetaGPT, the architecture agent can automatically generate system interface designs, such as developing a content recommendation engine.
4. Acting as Project Manager: The project manager uses sequence flowcharts to meet each requirement. They ensure the project proceeds according to plan, with each phase executed timely.
5. Acting as Engineer: Engineers are responsible for the actual code development. They use designs and flowcharts to translate them into fully functional code.
6. Acting as Quality Assurance (QA) Engineer: After the development phase ends, QA engineers conduct comprehensive testing. They ensure the software meets the required standards, free of any errors or issues.

## Examples

For example, when you input `python startup.py "Design a RecSys like Toutiao"`, MetaGPT provides you with multiple outputs, one of which is guidance on data and API design.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fd9943921040731012b93fd892a17d1f.jpg)

Generating an example with analysis and design costs around $0.2 (using GPT-4 API), and a complete project costs about $2.0. In this way, MetaGPT offers a low-cost solution, allowing you to quickly obtain the information and guidance you need.

## Quick Experience

Currently, MetaGPT does not have an online experience version. Here, I will list the Docker installation method to minimize the environmental difficulty faced during installation:

```bash
# Step 1: Download metagpt official image and prepare config.yaml
docker pull metagpt/metagpt:v0.3.1
mkdir -p /opt/metagpt/{config,workspace}
docker run --rm metagpt/metagpt:v0.3.1 cat /app/metagpt/config/config.yaml > /opt/metagpt/config/key.yaml
vim /opt/metagpt/config/key.yaml# Change the config
```

```bash
# Step 2: Run metagpt demo with container
docker run --rm \
    --privileged \
    -v /opt/metagpt/config/key.yaml:/app/metagpt/config/key.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:v0.3.1 \
    python startup.py "Write a cli snake game"
# You can also start a container and execute commands in it
docker run --name metagpt -d \
    --privileged \
    -v /opt/metagpt/config/key.yaml:/app/metagpt/config/key.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:v0.3.1
docker exec -it metagpt /bin/bash
$ python startup.py "Write a cli snake game"
```

> Replace "Write a cli snake game" with your preferred command and try it out!

For more installation tutorials, it is recommended to check the [official guide](https://github.com/geekan/MetaGPT).

> In the next section, we will introduce AI Town. Follow「卡尔的AI沃茨」🧙

# Reference

- [MetaGPT: The Multi-Agent Framework](https://github.com/geekan/MetaGPT)
- [MetaGPT: Meta Programming for Multi-Agent Collaborative Framework](https://arxiv.org/abs/2308.00352)
- [MetaGPT: Multi-Agent Harmony for Complex Problem Solving](https://medium.com/mlearning-ai/metagpt-multi-agent-harmony-for-complex-problem-solving-97bcb8f3fe94)
- [MetaGPT: The Future of Multi-Agent Collaboration in AI (A Brief Guide)](https://levelup.gitconnected.com/metagpt-the-future-of-multi-agent-collaboration-in-ai-a-brief-guide-fd4b4429336d)