---
sidebar_position: 7
---

# 知识提示 Knowledge Prompting

纳入外部知识是否能促进常识性推理仍然是一个开放的问题。一系列的工作表明，外部知识的整合可以提高模型的任务表现。知识提示（ Knowledge Prompting ）不需要对知识整合的具体任务进行监督，也不需要访问结构化的知识库。相反，知识提示可以直接从语言模型中产生知识，然后在回答问题时将这些知识作为附加输入。

用作者的一句话来说“我们提出了一种简单但有效的方法，在few-shot的情况下从通用语言模型中获取知识陈述（即以自然语言陈述形式表达的知识）”。

![know](./img/know.png)

知识提示主要分为两阶段：

1. 使用少量示范从语言模型中生成与问题相关的知识陈述
2. 使用第二个语言模型对每个知识陈述进行预测，然后选择最高置信度的预测。

## 知识生成

这里我们打算通过 ChatGPT 回复常识性问题；“How many wings does a penguin have?”

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="How many wings does a penguin have?" initial-response="Penguins do not have wings; they have flippers." max-tokens="256" box-rows="7" model-temp="0" top-p="0"></div>

ChatGPT认为企鹅是没有翅膀的。

![wiki](./img/wiki.png)

接着我们让 ChatGPT 生成一些跟企鹅有关的知识：

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="Generate 5 facts about penguins" initial-response="1. Penguins are flightless birds found mainly in the Southern Hemisphere.\n\n2. There are 18 species of penguins, ranging in size from the Little Blue Penguin to the Emperor Penguin.\n\n3. Penguins have adapted to living in cold climates and have a layer of insulating feathers and fat to keep them warm.\n\n4. Penguins are social birds and live in colonies of up to several hundred individuals.\n\n5. Penguins are well-known for their ability to toboggan across the ice, using their wings and feet to propel themselves." max-tokens="256" box-rows="7" model-temp="0.7" top-p="1.0"></div>

## 知识注入

这时候我们通过外部知识的注入，重新向 ChatGPT 提问：

<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="1. Penguins are flightless birds found mainly in the Southern Hemisphere.\n\n2. There are 18 species of penguins, ranging in size from the Little Blue Penguin to the Emperor Penguin.\n\n3. Penguins have adapted to living in cold climates and have a layer of insulating feathers and fat to keep them warm.\n\n4. Penguins are social birds and live in colonies of up to several hundred individuals.\n\n5. Penguins are well-known for their ability to toboggan across the ice, using their wings and feet to propel themselves.\n\nHow many wings does a penguin have?" initial-response="A penguin has two wings." max-tokens="256" box-rows="7" model-temp="0.7" top-p="1.0"></div>

这次企鹅终于要回了它的两只翅膀😂