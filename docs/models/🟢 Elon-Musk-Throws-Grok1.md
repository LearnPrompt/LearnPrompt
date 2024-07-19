---
sidebar_position: 0
title: Grok1 Released by Elon Musk - A 314B Parameter Model
description: This article discusses the release of Grok1 by Elon Musk's xAI, a 314 billion parameter open-source model known for its humor and interactivity.
keywords: [Elon Musk, xAI, Grok1, open-source AI, 314B parameter model, AI humor, real-time information]
slug: /model/grok-1/
---
# 🟢 Ding! Elon Musk Throws a 314B-Parameter Open-Source Model, Grok1🕶️

Good news! Elon Musk's xAI has released Grok. Bad news, it's a 314 billion-parameter model—how do we use it?

![Grok model image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/97d406ebec308849b235ff3609fa1af5.png)

Since its inception, Grok has been labeled the humorous version of "Musk." On December 7, 2023, it was officially rolled out to X subscribers. Grok has been highly anticipated for two main reasons:

1. **Humor and interactivity: Does not shy away from sensitive topics and expresses true thoughts.**
2. **Real-time information retrieval: Can understand the world in real-time through the X platform.**

![Musk's tweet image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e9fe0586942170a044be730b82466db0.png)

# OpenAI and Elon Musk

![OpenAI logo](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a4f32e90ffd75787ce23c67e609ee72e.png)

On March 1, Musk officially sued OpenAI and its CEO, Altman. Musk accused OpenAI of violating the agreement established at its inception, which was to develop technology for the benefit of humanity rather than for profit, and demanded that OpenAI revert to an open-source status.

Subsequently, on March 6, 2024, OpenAI responded to Musk's accusations with a long article titled "OpenAI and Elon Musk." In this response, OpenAI released eight years' worth of email exchanges to refute all of Musk's accusations.

So on March 11, Musk made a big move, announcing the upcoming open-source release of Grok. A week later, just when everyone thought it might be delayed, Musk delivered Grok as promised 🎉!

![Elon Musk image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/65a56ca17846afcfd151589ad1e1da9a.png)

# What Does the Open-Source Release of Grok-1 Mean?

The open-source release of Grok-1 is significant because it means Musk has officially chosen to support open-source AI! This is a groundbreaking moment and an important step towards open-source AGI.

Mark Zuckerberg also responded to Grok:

"314 billion parameters are too many. You need a bunch of H100s, and I've bought them all." 😂

![Zuckerberg's response image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/26917ec19e3ec3c7af0d913c66d05956.png)

The CEO of Perplexity also commented:

"We will fine-tune it for conversational search and inference optimization and make it available to all Pro users!"

![Perplexity CEO image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/aedd8f97a138eb4a5d000aca81f385f0.png)

It seems that not only Claude3, but Grok will also challenge GPT's "dominance" 🫅

# Quick Overview of Grok

The open-sourced Grok-1 is the original base model checkpoint completed in October 2023. The base model was trained on a large corpus of text data and is not fine-tuned for any specific task. This means the model is not fine-tuned for any particular application (e.g., conversation).

- **Basic Information**: The model size is 314B, composed of 8 expert systems (2 of which are active). The total number of active parameters is 86B. The model uses Rotary Embeddings instead of traditional fixed positional embeddings.
- **Efficiency**: Grok is a mixture of experts model with 314 billion parameters, of which about 25% are active when processing each token, allowing the model to run more efficiently.
- **Training Architecture**: This model was built and trained by the xAI team using a custom training architecture based on JAX and Rust.
- **Open-Source License**: The model weights and architecture are released under the Apache 2.0 open-source license, allowing anyone to use these resources under the terms of the license.
- **314B Parameter Challenge 🍺**: To run the entire model, you might need 5 H100 GPUs.

## Model Architecture Introduction

This part requires some prior knowledge. For those planning to fine-tune Grok-1, you can use the key information below to quickly locate the parts you need:

1. The tokenizer vocabulary size is 131,072 (similar to GPT-4), which is 2^17. The size of the embedding vector is 6,144 (48*128).
2. The model consists of 64 layers of Transformer structures (a relatively high number of layers). Each layer contains a decoder layer composed of a Multihead Attention Block and a Dense Block. The key-value size is 128.
3. In the Multihead Attention Block: the number of heads for queries is 48, while the number of heads for keys/values (KV) is 8, with a KV size of 128.
4. The Dense Block characteristics include: an expansion factor of 8, and a hidden layer size of 32,768.
5. Each token will be processed by 2 out of 8 experts.
6. The size of the Rotary Positional Embeddings is 6,144, matching the model's input embedding size.
7. The model can handle a context length of 8,192 tokens. The computation precision is bf16.

Code: [https://github.com/xai-org/grok-1](https://github.com/xai-org/grok-1)

# In Conclusion

The open-source release of Grok-1 will spark a new wave in the open-source community, with continuous updates expected. Various forms of Grok, such as quantized, distilled, fine-tuned, and localized versions, will soon emerge.

Let us welcome

this humor-infused

🕶️ youngster -- Grok!

![Grok image](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/f682ce7b2bf00b004162ed3b25283155.png)
