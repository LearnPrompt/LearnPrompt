---
sidebar_position: 5
---

# 🟢 ChatGPT基本功：Prompt

ChatGPT 的基本功核心是学会设置 Prompt ， Prompt 您可以理解成「提示语」，它的目的是让ChatGPT进入某种对话模式。

在 ChatGPT 中，prompt 通常指的是一个输入的文本段落或短语，作为生成模型输出的起点或引导。prompt 可以是一个问题、一段文字描述、一段对话或任何形式的文本输入。模型会基于 prompt 所提供的上下文和语义信息，生成相应的输出文本，输出质量很大程度上受到 prompt 的影响。

> 设置 prompt 就是设置您与ChatGPT的对话模式

从本质上讲，ChatGPT 就像高智商的孩子--它们可以做很多事情，但它们需要明确的提示（Prompt）才能很好地完成。在下面的输入框中，您可以任意输出您想问的问题。点击 "generate "以获得答案。
本课程接下来的内容您同样可以通过Dyno embed来尝试运行您自己的prompt。

<hr/>
Embed here:
<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="What is Prompt Engineering?" initial-response="Prompt engineering is a process that involves analyzing the user’s input and providing a prompt that can help guide the user to their desired outcome. It is a form of natural language processing that can be used to create more intuitive user interfaces. Prompt engineering can help reduce the cognitive load on the user by providing more meaningful and helpful prompts and suggestions." max-tokens="256" box-rows="3" model-temp="0.7" top-p="1">
    <noscript>Failed to load Dyno Embed: JavaScript must be enabled</noscript>
</div>
<hr/>

如果没有正常显示，您可能需要启用JavaScript或使用不同的浏览器。同样如果您是第一次使用Dyno的话，您需要输入[OpenAI API key](https://platform.openai.com/account/api-keys)。如果您没有OpenAI账户的话可以通过来注册OpenAI账户来获得一个免费密钥。

> 不知道如何获取OpenAI API Key，或者想在国内站点免费体验，甚至是如何注册并体验ChatGPT？不用担心，下一节将为您提供所有这些的详细指导和便捷链接。

## 现在我们可以用 ChatGPT 完成什么？

ChatGPT正在重塑我们的工作流程，将那些曾消耗您大量时间的任务自动化。写邮件、生成报告、甚至编码等任务，只需简单描述，人工智能就能为您执行或提供基础。这种可能性是巨大的，人工智能将成为优化您生产力的得力助手。

以下是ChatGPT现已涵盖的部分领域：

- 文本生成与理解: ChatGPT可以生成连贯、有逻辑的文本，并理解自然语言输入。
- 多语言支持: 支持多种语言，包括英语、中文、西班牙语等。
- 知识查询: 可以查询概念并解释成通俗易懂的形式。
- 文本转换与翻译: 可以进行文本摘要、翻译等。
- 创意写作: 可以协助进行小说、诗歌等创意写作。
- 编程与数学协助: 可以解释编程概念、协助解决数学问题等。

GPT-4 是目前 OpenAI 的最先进系统，与GPT-3和GPT-3.5的纯文本输入不同，GPT-4的新特性包括：
- 超长文本输入，最长25,000个单词
- 通过HTML和JavaScript技术，将手绘网站原型转化为实际网站
- 允许用户上传图片并进行分析和描述
- 管理比GPT-3.5更复杂的指令
- 在浏览器中编写整个视频游戏
- 作为API供开发人员构建应用程序和服务
- 使用插件: 如WebPilot，用于访问网页内容等。

### 强大的插件体系

插件为GPT-4提供了更广泛的功能集，使其不仅限于文本生成和理解，还可以执行特定任务，如数学计算、图像生成、音乐播放等。

1. Prompt Perfect: 帮助用户编写完美的提示，使AI聊天机器人能够提供更具体和信息丰富的答案。
2. Wolfram: 提供高级计算、数学和实时数据解决方案。
3. Zapier: 与超过5000个不同的工作应用程序交互，简化工作流程。
4. Argil AI: 允许用户在ChatGPT内部生成图像。
5. Link Reader: 读取各种链接的内容，包括网页、PDF、图片等。
6. Speak: 语言教练插件，可以教你如何用其他语言说任何事情。
7. MixerBox OnePlayer: 音乐编译器，可以根据请求收集歌曲并创建播放列表。
8. Show Me: 允许ChatGPT创建几乎所有类型的实时图表。
9. Questmate Forms: 快速轻松地创建各种表格。
10. Image Editor: 提供基本的图像编辑功能，如调整大小、裁剪、模糊等。
11. World News: 提供最新的全球新闻。
12. Chess: 允许用户与ChatGPT下棋。
13. Meme Generator: 生成各种主题的梗图。
14. A+ Doc Maker: 允许你在几秒钟内创建漂亮的PDF。
15. CoderPad: 允许你在ChatGPT中运行30多种编程语言的代码。

### 代码解释器（Code Interpreter）

代码解释器（Code Interpreter）是 GPT-4 中引人注目的新功能，它将大型语言模型的强大分析能力与编程的实用性相结合。通过允许运行Python代码和上传文件，代码解释器极大地拓宽了ChatGPT可以执行的任务范围，从数据分析到图像转换，再到编辑代码文件，无所不能。

**更丰富的交互体验**：您可以上传文件来补充口头说明，为ChatGPT提供更丰富的上下文。这比单纯的文本输入更能精确理解代码和数据，减少了解释的模糊性，降低了出错的可能性。

**如同视频通话的直观性**：想象一下，当您遇到技术问题时，不再是单调的描述和理解文字指导，而是可以直观地共享屏幕和演示问题。这样的丰富理解使技术支持可以提供更精确的解决方案。

**直观的输出反馈**：与默认的GPT-4只提供文本不同，代码解释器会实际运行代码并提供现成的输出。您不仅可以查看结果，还可以理解其如何得出，甚至自行运行代码。

**支持多样化的文件格式**：从文本、图像、文档到代码，再到数据、音频和视频，代码解释器支持各种常见文件格式，包括但不限于：
- 文本（.txt、.csv、.json、.xml等）
- 图像（.jpg、.png、.gif等）
- 文档（.pdf、.docx、.xlsx、.pptx等）
- 代码（.py、.js、.html、.css等）
- 数据（.csv、.xlsx、.tsv、.json等）
- 音频（.mp3、.wav等）
- 视频（.mp4、.avi、.mov等）

代码解释器不仅推动了ChatGPT的功能到新的高度，还为用户提供了前所未有的灵活性和便捷性，使人工智能成为真正的合作伙伴，共同解决复杂任务和问题。

## ChatGPT合作案例

ChatGPT的能力远不止于你想象，它的变现途径也是多种多样。以下是一些引人注目的案例，供您思考和灵感启发🤔️：

1. Duolingo - 深化对话
利用GPT-4的精湛语言处理能力，Duolingo赋予了其语言学习平台更自然、更富挑战性的对话练习体验。

2. Be My Eyes - 改善视觉可访问性
Be My Eyes通过GPT-4的多模态能力理解和解释图像，助力视觉受损人士更好地与世界互动。

3. Stripe - 优化用户体验和打击欺诈
支付平台Stripe运用GPT-4的分析和推理能力，更精准地识别和阻止欺诈活动。

4. Morgan Stanley - 组织庞大的知识库
Morgan Stanley的财富管理部门借助GPT-4的搜索和分类能力，更高效地管理和利用其丰富的金融知识。

5. Khan Academy - 教育试点项目
Khan Academy正在探索GPT-4在个性化学习路径、自动评分和富互动在线学习体验方面的潜力。

6. 冰岛政府 - 保护语言
冰岛政府正在使用GPT-4来保护其语言。通过训练GPT-4理解和生成冰岛语，他们正在努力保护和促进这一独特文化遗产的使用。

这些案例跨足了各个领域，从教育和金融到语言保护和视觉辅助。GPT-4的高级语言处理、推理和多模态能力使其成为推动创新和解决实际问题的强大工具。无论是商业还是社会责任，ChatGPT的潜力都等待着被更多人发现和利用。


### Reference

1. [https://365datascience.com/trending/chatgpt-code-interpreter-what-it-is-and-how-it-works/](https://365datascience.com/trending/chatgpt-code-interpreter-what-it-is-and-how-it-works/)
2. 我的好朋友[GPT-4](https://openai.com/research/gpt-4s)也加入到我的文案优化当中！