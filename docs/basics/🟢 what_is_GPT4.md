---
sidebar_position: 25
title: What is GPT-4?
description: This page introduces GPT-4, the latest milestone in deep learning by OpenAI, explaining its capabilities, limitations, and training process.
keywords: [GPT-4, OpenAI, AI, artificial intelligence, deep learning, multimodal model, text generation, image recognition]
slug: /basics/what-is-gpt4/
---
# 🟢 What is GPT-4?

![GPT4](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b9f61c61fc75088fc5e80ccf9d8b5d63.webp)

## Introduction

"GPT-4 is the latest milestone in OpenAI's efforts to scale up deep learning. GPT-4 is a large multimodal model (accepting image and text inputs, emitting text outputs) that, while less capable than humans in many real-world scenarios, exhibits human-level performance on various professional and academic benchmarks." --OpenAI

GPT-4, as the name suggests, is the next generation model following GPT-3 and GPT-3.5. Compared to the previous models, GPT-4 includes multimodal capabilities. In simple terms, GPT-4 not only understands and generates text but also recognizes images. Thus, it can be understood as GPT-3.5 (the language model behind the initial version of ChatGPT) with added visual capabilities and enhanced language understanding.

When GPT-4 was first released, many people were amazed, but some were also a bit disappointed. The disappointment was not due to the model's lack of strength but because the wait was long, and expectations were high. Detailed information about GPT-4 had already been released last year. According to OpenAI's official technical report, the GPT-4 model was completed in August of last year, and it was undergoing safety and reliability testing since then. Before GPT-4 was released, it was known that the GPT-3 model had 175 billion parameters, while GPT-4 would have trillions of parameters. Given the hype around AIGC last year, especially in text-to-image and video generation, there were speculations that GPT-4 would also have image generation capabilities. On the eve of GPT-4's official release, Microsoft published two papers on multimodal models (with text and image generation capabilities), and the CTO of Germany mentioned that GPT-4 could handle videos. This led to high expectations for GPT-4 being a behemoth capable of handling images, text, speech, and video. However, upon its release, it was revealed that it could only accept image and text inputs and output text.

To get back on track, GPT-4 has significant improvements over GPT-3 in terms of text capabilities. Apart from daily conversations, it has greatly improved its exam-taking and coding abilities. One notable moment during GPT-4's release was when OpenAI's co-founder Greg Brockman hand-drew a web interface on a piece of paper, uploaded the image to the model, and GPT-4 generated the working code for the UI he drew. In exams, GPT-4 not only passed the bar exam but ranked in the top 10% of test takers, while GPT-3.5 ranked in the bottom 10%.

OpenAI deployed computing clusters specifically to train GPT-4 more efficiently, accurately, and stably. One significant feature is their framework's ability to predict model performance accurately. In AI research, due to the large scale of models, verifying parameters on large models is time-consuming and costly, so experiments are generally conducted on smaller models first. However, some improvements effective on small models may not work on large models, and some unique emergent abilities of large models cannot be observed on small models. OpenAI's system can accurately predict model performance during training on a small scale, effectively addressing the above issues.

## Capabilities

In terms of reliability, creativity, and detailed instruction handling, GPT-4 has improved over the previous model, GPT-3.5.

OpenAI tested the model on various benchmarks, including human-designed simulation exams, and found that GPT-4 outperformed existing large language models.

It also performs well in languages other than English, including low-resource languages like Latvian, Welsh, and Swahili.

### Visual Input

GPT-4 can accept text and image inputs, enabling it to generate text outputs based on inputs consisting of text and images.

Although the visual input capability of the model is still in the research preview phase, it has demonstrated functionalities similar to pure text input.

## Controllability

In previous versions of ChatGPT, the response style and tone were consistent. GPT-4 introduces a feature called System Message, which allows setting a role or defining the personality of the model, enabling it to respond in the desired tone.

This feature carries certain risks. OpenAI has implemented several safety mechanisms to control what the model cannot say. However, in the community, some users managed to "hypnotize" the model using the System Message feature, making the model say anything it wanted, bypassing OpenAI's safety mechanisms. This bug has been fixed, so there's no need to attempt it.

## Limitations

Despite being powerful, GPT-4 has several limitations. First, GPT-4 is still a generative model, meaning it can generate inaccurate content, fabricate facts, and make reasoning errors. Unlike search engines, the content generated by language models is not entirely reliable. For example, some students have used ChatGPT to write papers, and many of the references it generated were fabricated. Therefore, in sensitive areas, users should be cautious when using ChatGPT.

Despite these issues, GPT-4 has undergone adversarial training within OpenAI, improving its safety and reliability by over 40% compared to GPT-3.5.

In addition to these issues, GPT-4 still exhibits some biases and lacks knowledge of events after September 2021 (its training data cut-off date). New data is used in instruction fine-tuning and reinforcement learning from human feedback, so the model can answer some post-2021 questions correctly. Although GPT-4 excels in many tests, it can make simple logical errors. ChatGPT is easily deceived; for example, repeatedly telling it that 1+1 equals 3 can trick it into believing it made a mistake.

## Training

During pre-training, GPT-4's training data included a large amount of web-crawled data, containing numerous mathematical problems with correct and incorrect answers, strong and weak reasoning, contradictions, consistent statements, and various ideologies and thoughts.

The pre-trained model has been trained on some incorrect answers, so some initial responses may not be what we want. To align the model with human intentions and ensure safe and controllable responses, reinforcement learning based on human feedback (RLHF) was used to fine-tune the model, teaching it to understand human input and generate corresponding outputs.

Despite the fine-tuning process, OpenAI's paper indicates that RLHF does not improve the model's exam performance, and improper tuning can even reduce its capabilities. Therefore, the model's strong text abilities are built upon vast data and significant computation (brute force). Human intervention is to guide and control it to correctly demonstrate its capabilities, answering human questions in a preferred manner.

## Predictable Scaling

A major focus of the GPT-4 project is building a predictable deep learning stack.

OpenAI developed infrastructure and optimizations with multiple scales of predictable behavior, allowing accurate prediction of GPT-4's final loss during training.
