---
sidebar_position: 25
title: MetaGPT - A New Framework for Multi-Agent Collaboration
description: This page introduces MetaGPT, a framework integrating workflows with multi-agent collaboration, ensuring a structured approach to problem-solving.
keywords: [MetaGPT, multi-agent collaboration, AI framework, structured problem-solving, SOP in AI, MetaGPT software development]
slug: /llm-agents/metagpt/
---
# 🟡 MetaGPT

MetaGPT是一项引起广泛关注的研究成果，它引入了一个将人工工作流程与多智能体协作无缝集成的框架。通过将标准化操作（SOP） 程序编码为提示，MetaGPT确保解决问题时采用结构化方法，从而减少出错的可能性。

🎉开始阅读前，如果你对其他文章感兴趣，可以到欢迎页关注我们！「卡尔的AI沃茨」开源中文社区实时获得后续的更新和最新的教程🎉

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7af15669de3dc92e1ab81759c67349c3.jpg)

当前Agent的解决方案存在一个问题：尽管这些语言模型驱动的 Agent 在简单的对话任务上取得了显著进展，但在面对复杂任务时，LLM 会陷入困境，仿佛看到了并不存在的事物（幻觉）。当将这些 Agent 串联起来时，就会引发混乱的连锁反应。

现在MetaGPT引入了标准化操作程序。这些操作程序就像作弊码一样，用于顺利协调工作。它们告诉代理们发生了什么事，以有条不紊的方式指导他们。借助这些操作程序，代理几乎可以像领域专家一样熟悉他们的工作，并验证输出以避免错误。就像高科技流水线一样，每个代理都扮演着独特的角色，共同理解复杂的团队合作。

## 为什么 MetaGPT 很重要

在人工智能驱动的解决方案正在成为常态的世界中，MetaGPT 提供了一个全新的视角。这就是它掀起波澜的原因：

- 出众的解决方案：借助SOP，与其他 Agents 相比，MetaGPT 已被证明可以生成更一致和正确的解决方案。
- 多样化的角色分配：为LLM分配不同角色的能力确保了解决问题的全面性。

## MetaGPT 软件开发过程

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/930ae342a827adafc396fb9431f9bed7.jpg)

1. 需求分析：收到需求后，该过程开始。这一阶段致力于明确软件所需的功能和要求。
2. 扮演产品经理：产品经理以需求和可行性分析为基础，开启整个流程。他们负责理解需求，并为项目制定明确的方向。
3. 扮演架构师：一旦需求明确，架构师将为项目创建技术设计方案。他们负责构建系统接口设计，确保技术实现符合需求。在MetaGPT中，架构 Agent 可以自动生成系统界面设计，如内容推荐引擎的开发。
4. 扮演项目经理：项目经理使用序列流程图来满足每个需求。他们确保项目按计划前行，每个阶段都得到适时执行。
5. 扮演工程师：工程师负责实际的代码开发。他们使用设计和流程图，将其转化为功能完备的代码。
6. 扮演质量保证（QA）工程师：在开发阶段结束后，QA工程师进行全面的测试。他们确保软件符合所需标准，不存在任何错误或问题。

## Examples

举个例子，当你输入 python startup.py “Design a RecSys like Toutiao”，MetaGPT会为你提供多个输出，其中之一是有关数据和API设计的指导。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fd9943921040731012b93fd892a17d1f.jpg)

生成一个包含分析和设计示例的成本大约为0.2美元（使用GPT-4 API），而完整项目的成本约为2.0美元。通过这种方式，MetaGPT提供了低廉的解决方案，让你能够快速获取所需的信息和指导。

## 快速体验

目前MetaGPT暂无在线体验版本。这里我会列出docker的安装方法，最大程度减少大家安装面对的环境难度：

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

> 将"Write a cli snake game"更换成你喜欢的命令试试吧！

更多安装的教程建议看[官方指南](https://github.com/geekan/MetaGPT)

> 下一节我们将介绍AI小镇，欢迎关注「卡尔的AI沃茨」🧙

# Reference

- [MetaGPT: The Multi-Agent Framework](https://github.com/geekan/MetaGPT)
- [MetaGPT: Meta Programming for Multi-Agent Collaborative Framework](https://arxiv.org/abs/2308.00352)
- [MetaGPT: Multi-Agent Harmony for Complex Problem Solving](https://medium.com/mlearning-ai/metagpt-multi-agent-harmony-for-complex-problem-solving-97bcb8f3fe94)
- [MetaGPT: The Future of Multi-Agent Collaboration in AI (A Brief Guide)](https://levelup.gitconnected.com/metagpt-the-future-of-multi-agent-collaboration-in-ai-a-brief-guide-fd4b4429336d)