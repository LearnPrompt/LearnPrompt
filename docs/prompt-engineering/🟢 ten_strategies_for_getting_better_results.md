---
sidebar_position: 20
title: Ten Strategies for Getting Better Results with ChatGPT
description: This page outlines key strategies to effectively use ChatGPT and achieve optimal results.
keywords: [ChatGPT, AI strategies, prompt engineering, chatbot tips, effective prompts, AI guidelines]
slug: /prompt-engineering/ten-strategies-chatgpt/
---
# 🟢 Ten Strategies for Getting Better Results with ChatGPT

Do you remember the three rules of thumb we mentioned in "Basic Usage"?

1. Try multiple phrasing of prompts to get the best results.
2. Use clear and concise prompts, avoiding unnecessary words.
3. Reduce imprecise descriptions.

Now, after a few pages of learning, I think it's time to introduce some new principles.

### 3. One topic per chat

ChatGPT is a chatbot, and during generation, it refers to previous chat history. Different topics in the same conversation can affect downstream results. Therefore, my suggestion is to open a new chat window for each new topic.

### 4. Provide complete examples

As much as possible, provide ChatGPT with complete examples of what you need. This way, it can easily replicate the format you require.

### 5. Reduce the use of negative terms

For example, replace "do not need a lengthy response" with "generate a one-sentence response." ChatGPT is a generative model, and the elements mentioned in the prompt will influence the final generated result.

### 6. Actively ask ChatGPT to simplify output

If you don't want ChatGPT to give you too much information in each round, this is a good choice.

### 7. Generated results may contain factual errors

The regular version of ChatGPT does not support internet access and will not cite sources. When asked for answers it may not know, it is likely to give responses that appear correct but are actually wrong.

![ChatGPT Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/17fec2f9f9df1962006e4ad7a30d2b1a.png)

### 8. Place instructions at the beginning of the prompt, separating instructions and context with **##** or **""**

<AIInput>
Summarize the text below as a bullet point list of the most important points.

Text: """
{text input here}
"""

</AIInput>

### 9. Use "trigger words"

<AIInput>
Write a simple python function that
#1. Ask me for a number in mile
#2. It converts miles to kilometers

import

</AIInput>

In the code example above, adding **"import"** to the model prompts it to start writing in Python. (Similarly, **"SELECT"** can serve as a prompt to start a SQL statement.)

I hope these ten rules of thumb can help you generate better prompts.