---
sidebar_position: 0
---

# 背景介绍


## 什么是提示工程（Prompt engineering）?

人工智能正在迅速改变各个行业，包括新闻业、医疗保健和教育，如果你还没有在工作场所或课堂上遇到人工智能，那么你极有可能很快就会遇到。尽管人工智能有巨大的效用，但它仍然需要人类的指导才能有效运作。从本质上讲，人工智能就像高智商的孩子--它们可以做很多事情，但它们需要明确的提示（Prompt）才能很好地完成。

那么，我们要如何向它们传达我们的指令呢？我们通常可以用最简单的语言来描述我们希望它们执行的任务。例如，我们可以指示人工智能 "解释什么是提示工程（Prompt engineering）"，它就会生成对应的答案。

简单来说提示工程是为 AI 模型创建输入以改进给定任务的输出的过程。提示（prompt）是触发 AI 模型生成内容的宽泛指令；它可以是一条语句、一段代码或一串单词。收到提示或输入后，AI 模型会产生输出作为响应。输出质量很大程度上受到提示的影响。

我们直接开始吧! 在下面的输入框中，你可以任意输出你想问的问题。点击 "generate "以获得答案。
本课程接下来的内容你同样可以通过Dyno embed来尝试运行你自己的prompt。

<hr/>
Embed here:
<div trydyno-embed="" openai-model="text-davinci-003" initial-prompt="What is Prompt Engineering?" initial-response="Prompt engineering is a process that involves analyzing the user’s input and providing a prompt that can help guide the user to their desired outcome. It is a form of natural language processing that can be used to create more intuitive user interfaces. Prompt engineering can help reduce the cognitive load on the user by providing more meaningful and helpful prompts and suggestions." max-tokens="256" box-rows="3" model-temp="0.7" top-p="1">
    <noscript>Failed to load Dyno Embed: JavaScript must be enabled</noscript>
</div>
<hr/>

如果没有正常显示，你可能需要启用JavaScript或使用不同的浏览器。同样如果你是第一次使用Dyno的话，你需要输入[OpenAI API key](https://platform.openai.com/account/api-keys)。如果你没有OpenAI账户的话可以通过来注册OpenAI账户来获得一个免费密钥。


## 现在我们可以用prompt完成什么？

ChatGPT目前仍以文字方式交互，但除了与人类自然对话外，它还可以用于非常复杂的语言任务，包括但不限于文本生成、概念问答、文本总结和许多其他任务。例如，对于文本生成，ChatGPT可以根据你的要求自动生成文本（脚本、歌曲、计划等）。

我可以简单罗列现包含的领域：

- 写作辅助
- SEO
- IT编程
- 百科工具
- 行业顾问
- 智能翻译
- 模拟面试
- 语言学习

ChatGPT可以将目前消耗你大量时间的任务自动化。正如前面所讨论的，有各种情况可以采用人工智能来简化你的工作流程。写邮件、生成报告甚至编码等任务都可以用人工智能完成。只要向人工智能描述任务，它就可以为你执行任务，或为你的工作提供基础。这种可能性是巨大的，人工智能可以大大帮助优化你的生产力。

## 未来我们可以用prompt做到什么？

2023 年 3 月 14 日，GPT 4 具备接收图像输入的能力。与其前身 GPT 3 和 GPT-3.5 不同，GPT 3 和 GPT-3.5 仅限于纯文本输入，GPT 4 为不再仅仅支持文本输入查询，它扩展了图片对话方式。

- GPT 4 现在可以接受最长 25,000 个单词的超长文本输入
- 可以智能通过 HTML 和 JavaScript 技术 ，将小型网站的手绘原型照片，转换为实际网站
- GPT 4 现在允许用户上传图片并对其进行分析和描述
- 能够管理比 GPT 3.5 复杂得多的指令
- 可以在浏览器中编写整个视频游戏
- 将作为 API 供开发人员构建应用程序和服务

继发布GPT4后，OpenAI开始联网+引入插件构建生态。ChatGPT的插件系统允许它跟外界实时交互，此前ChatGPT已经吸引了很多知名企业接入，OpenAI公司提前给了他们开发插件的权限，比如Shopify、Slack、Speak、Wolfram和Zapier等。这些企业的服务就可以接入ChatGPT，实现实时信息检索、订机票、在线点餐、交通导航、企业办公、流程优化等功能。因此在本课程中，我们不仅会持续追踪GPT4的最新发展，还会演示如何开发插件。

事不宜迟，我们马上开始！