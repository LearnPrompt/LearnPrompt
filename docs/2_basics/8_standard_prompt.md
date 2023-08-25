---
sidebar_position: 40
---

# "标准"提示

在前面的教程中，我们介绍了**指令+输入**的简单提示，**提供实例**的提示和**角色扮演**类的提示，那么是否有一个公式来列出提示的各个部分，并将其组合成一个标准化的提示？答案是肯定的。

**角色扮演（Role）+ 指令/任务（Instruction）+ 示例（Few-shot） + 语境（Context） + 问题（Question）**

:::note
- 语境（Context）就是我们希望ChatGPT生成的时候读取到的相关信息，可以是对任务的补充说明，也可以是对输出格式做出限制
:::

回顾我们上次使用的提示语，你会发现并不是所有的提示语都包含上述的所有部分。你可以用

- **Instruction+Question**
- **Role+Context+Question**
- **Few-shot+Question**

在实践中，我们不需要严格按照上面给出的顺序来写提示语，这个公式本身是为了让你更容易地思考构建提示语而设计的。

下面我们通过拆解一个复杂的prompt提示语来说明各个部份：

我们课程不仅是支持ChatGPT的，Midjourney也会有对应的学习模块。那我们不妨提前看看，如何用 ChatGPT 生成 Midjourney 提示词。

这里我想生成一只带着剑的被机械化改造的猫，“I want a mechanically modified cat with a sword”

:::note
**//**:这个符号是注释，如果你想要使用这个prompt的话，需要把**//**连同跟它在同一行的文字删除。
:::


```
// 角色扮演
You will now act as a prompt generator for a generative AI called "Midjourney". Midjourney AI generates images based on given prompts. 

// 指令：生成图片 
I will provide a concept and you will provide the prompt for Midjourney AI.

// 语境：解释指令，提出输出的格式要求
You will never alter the structure and formatting outlined below in any way and obey the following guidelines:

You will not write the words "description" or use ":" in any form. Never place a comma between  [ar] and [v]. 

You will write each prompt in one line without using return.

// 语境：使用Midjourney生成图像，你可以定制图像的场景、风格、方向、景深等。
// 在这里，图像生成所需的元素被逐步确定，并定义为[1][2]等符号。这样就无需在同一个提示中反复提起。
// 这里使用了一个思维链技术，将复杂的任务分解成较小的任务。我们将在下一节中进一步讨论这个问题。
Structure:
[1] = I want a mechanically modified cat with a sword
[2] = a detailed description of [1] that will include very specific imagery details.
[3] = with a detailed description describing the environment of the scene.
[4] = with a detailed description describing the mood/feelings and atmosphere of the scene.
[5] = A style, for example: photography, painting, illustration, sculpture, Artwork, paperwork, 3d and more).[1] 
[6] = A description of how [5] will be realized. (e.g. Photography (e.g. Macro, Fisheye Style, Portrait) with camera model and appropriate camera settings, Painting with detailed descriptions about the materials and working material used, rendering with engine settings, a digital Illustration, a woodburn art (and everything else that could be defined as an output type)
[ar] = "--ar 16:9" if the image looks best horizontally, "--ar 9:16" if the image looks best vertically, "--ar 1:1" if the image looks best in a square. (Use exactly as written)
[v] = If [5] looks best in a Japanese art style use, "--niji". Otherwise use, "--v 5" (Use exactly as written)

// 示例Few-shot: 抽象得到不同的模块后，我们可以主动举例来指导 ChatGPT 生成对应的格式
Formatting: 
What you write will be exactly as formatted in the structure below, including the "/" and ":"
This is the prompt structure: "/imagine prompt: [1], [2], [3], [4], [5], [6], [ar] [v]".

This is your task: You will generate 4 prompts for each concept [1], and each of your prompts will be a different approach in its description, environment, atmosphere, and realization.

Please pay attention:
- Concepts that can't be real would not be described as "Real" or "realistic" or "photo" or a "photograph". for example, a concept that is made of paper or scenes which are fantasy related.
- One of the prompts you generate for each concept must be in a realistic photographic style. you should also choose a lens type and size for it. Don't choose an artist for the realistic photography prompts.
- Separate the different prompts with two new lines
```

那么这个提示实际的效果是什么样子的呢？

![Generate_Cat](./img/Generate_Cat.png)


在实践中，你可以在生成自己的提示时，通过添加、删除和改变现有开源提示的部分来缩短优化的时间。
