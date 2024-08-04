---
sidebar_position: 20
title: HuggingGPT - Solving AI Tasks with ChatGPT
description: An overview of HuggingGPT, an agent framework leveraging ChatGPT and Hugging Face for task execution.
keywords: [HuggingGPT, ChatGPT, AI tasks, Hugging Face, AI models, JARVIS, AI framework]
slug: /llm-agents/hugginggpt/
---
# 🟢 HuggingGPT

**HuggingGPT** is an agent framework that utilizes ChatGPT as a task planner, selecting available models on the HuggingFace platform based on their descriptions, and finally generating a summary response based on the execution results. This project is currently open-sourced on GitHub under the name JARVIS (Iron Man's assistant). The research involves two main entities: the well-known ChatGPT and the AI community's Hugging Face.

🎉Before you start reading, if you're interested in other articles, you can follow us on the welcome page! Stay updated with the latest tutorials and updates in the "Carl's AI Watts" open-source Chinese community.🎉

![HuggingGPT Overview](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7ca6eb5ab3c279326c17883c62759906.png)

The system comprises four stages:

1. **Task Planning**: Using LLM as the brain, it parses the user's request into multiple tasks. Each task has four attributes: task type, ID, dependencies, and parameters. The system uses some examples to guide the LLM in task parsing and planning.

Specific instructions are as follows:

```json
[{"task": task, "id", task_id, "dep": dependency_task_ids, "args": {"text": text, "image": URL, "audio": URL, "video": URL}}]
```

- The "dep" field indicates the ID of the previous task that generated new resources required for the current task.
- The “-task_id” field refers to the task ID of the dependent task that generated the text, image, audio, and video.

The chat log between the user and HuggingGPT is recorded and displayed on the screen showing resource history.

2. **Model Selection**: LLM assigns tasks to specialized models, constructing these requests into a multiple-choice question. LLM provides a list of models for the user to choose from. Due to the context length limitation, filtering is required based on the task type.

Specific instructions are as follows:

Based on the user's request and command, the Agent helps the user select a suitable model from the list of models to handle the user's request. The Agent outputs only the model ID of the most suitable model. The output must be in strict JSON format: {"id": "model ID", "reason": "Detailed reason for selecting the model"}.

Subsequently, HuggingGPT ranks the models based on download count, as it is considered a reliable indicator of model quality. The selected models are from the "Top-K" in this ranking. Here, K is a constant representing the number of models, e.g., if set to 3, it selects the top 3 models by download count.

3. **Task Execution**: Expert models execute on specific tasks and record the results.

Specific instructions are as follows:

Based on the input and inference results, the Agent needs to describe the process and results. The previous stages can form the following input:

> User input: {{user input}}, Task planning: {{tasks}}, Model selection: {{model assignment}}, Task execution: {{prediction results}}.

To improve the efficiency of this process, HuggingGPT can run different models simultaneously, as long as they do not require the same resources. For example, if prompted to generate images of cats and dogs, separate models can run in parallel to execute this task. However, sometimes models may require the same resources, which is why HuggingGPT maintains a property to track resources, ensuring they are efficiently utilized.

4. **Response Generation**: LLM receives the execution results and provides a summarized response to the user.

However, to apply HuggingGPT to real-world scenarios, we need to address several challenges:

- Improving efficiency: LLM's inference rounds and interactions with other models slow down the processing speed.
- Reliance on long context windows: LLM needs to use lengthy contextual information to convey complex task content.
- Enhancing stability: Improving the quality of LLM's output and the stability of external model services.

Now, let's assume you want the model to generate audio from an image. HuggingGPT would sequentially execute this task in the most suitable way. You can see more detailed response information in the image below:

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3b89f6421e3308e5a44aa806f22ce852.png)

## What is Hugging Face?

In simple terms, Hugging Face is an open-source community platform focused on artificial intelligence, where users can publish and share pre-trained models, datasets, and demonstration files. Currently, over 100,000 pre-trained models and more than 10,000 datasets have been shared on Hugging Face. Companies from various industries, including Microsoft, Google, Bloomberg, and Intel, are using Hugging Face products.

In HuggingGPT, ChatGPT acts as the "operating brain," automatically parsing user requests and performing automatic model selection, execution, and reporting within Hugging Face's AI model library, providing great convenience for developing more complex AI programs.

## Quick Experience

Experiencing HuggingGPT is very simple; you just need to input the OpenAI API key and HuggingGPT token:

![HuggingGPT](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/af53066a65068691424d1e0c06342ddf.png)

[https://huggingface.co/spaces/microsoft/HuggingGPT](https://huggingface.co/spaces/microsoft/HuggingGPT)

> In the next section, we will learn about MetaGPT, using SOP thinking to take the Agent a step further. Stay tuned to 「卡尔的AI沃茨」

## Reference

- [HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in Hugging Face](https://arxiv.org/abs/2303.17580)
- [HuggingGPT: The Secret Weapon to Solve Complex AI Tasks](https://www.kdnuggets.com/2023/05/hugginggpt-secret-weapon-solve-complex-ai-tasks.html)