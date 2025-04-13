---
sidebar_position: 42
title: OpenAI又降价50%，我用上了十个称霸月榜的“天价”AI应用（下）
description: This article dives into five more premium AI tools that dominated the charts, showcasing their powerful capabilities, especially with OpenAI's recent price cut.
keywords: [OpenAI, AI tools, GPT-4, AI applications, MemGPT, GraphRAG, MiGPT, academic AI, translation AI]
slug: /basics/openai-50percent-price-cut-part2/
---

# OpenAI又降价50%，我用上了十个称霸月榜的“天价”AI应用（下）

我们书接上回，

OpenAI又降价50%，我用上了十个称霸月榜的“天价”AI应用（上）

这一篇为大家带来了更加干货满满的个工具。

不知道上篇推荐到五个工具，大家的体验怎么样？

这一篇，继续就带你用低级API 全面打通

学术、翻译、agent、知识图谱，甚至带你爆改小爱同学！

靠着GPT-4o mini的性价比放心开冲！！！

### GPT Academic 6/10

同时作为一个追求日更的博主，大量的写作产出，也是Token吞金兽。

尤其是写作过程中，遇到需要深入理解的研究工作还会进一步加重 token 消耗。

![GPT Academic Overview](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821225908700)

ChatGPT Academic 就是专门针对科研工作的ChatGPT应用

功能非常的强大！

![GPT Academic Features](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821225920832)

可以说是解决科研的过程中的一站式服务， 润色、翻译、代码解释，还支持mermaid图像渲染。

写作帮助

GPT学术优化可以帮助修改文章中的语法错误，和润色，

![Editing Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821225933074)

并且它的润色不仅仅只是帮你修改，而是用表格的形式将修改的语句逐个列出并给出修改后的句子和修改的原因。

包括 tex 格式的公式输出也不在话下

![LaTeX Support](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230001865)

直接读工程代码

懒得看项目代码？直接把整个工程炫ChatGPT嘴里。

这功能放在GPT4 API时代，也就半年前的话，我都有点不敢用。

![Code Interpretation](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230013008)

Latex/Arxiv论文翻译功能

GPT Academic 甚至可以帮你解决论文翻译问题， 输入 arxiv 文章链接就可以直接翻译！

![Arxiv Translation](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230025257)

基于mermaid的流图、脑图绘制，论文画图人的谁懂

![Mermaid Diagram](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230036290-20240821230115153)

总之，这个在我电脑积灰了几个月的项目再次复活了

### Immersive Translation 7/10

上面我也提到了论文翻译，但更多的时候我们每天都要阅读大量的网页内容。

沉浸式翻译，可以说是网页翻译优化做的最好的一款插件了！

![Immersive Translation Interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230128055)

最好的一点就是，它可以提供双语对照翻译！

![Bilingual Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230136940)

当然也支持视频字幕翻译和PDF翻译。

如果想用更好的翻译体验，我们就要使用大模型作为翻译引擎，但可想而知 token 的消耗量有多大！一个网页就上千，一天少几十个页面没跑了～

但用上了 4o mini 后根本没在怕的。

接下来是两个大神级别应用，MemGPT和GraphRAG

### Long-Term Memory and Custom Tool Agent - MemGPT 8/10

还记得当时 MemGPT破圈是因为提出了一个新奇的想法，它要将大语言模型转变为操作系统，进而创造出无限上下文的体验！

![MemGPT Interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230153166)

当时我体验了一周MemGPT，基本上就没新建过对话，

模型还能一直记得我想要的内容，

当时因为内存管理、记忆压缩等一系列操作都要接入API，

这个高价神器就积灰在我电脑，

现在我又重新拿了出来做我长期任务的对话机器人，

不需要反复新建对话，或者将你的文件塞到GPTs中，它使用起来更加无感，

大家看到这篇文章里的项目关键信息就是MemGPT辅助总结的👍

### Enterprise-Level Knowledge Graph - GraphRAG 9/10

GraphRAG最近真的是超火！是RAG玩家们不容错过的一个项目

被誉为下一代 RAG ！上个月开源的时候，还因为构建图谱费用过高被吐槽普通人用不起😂

大家应该多多少少听说过RAG，这种结合信息检索和文本生成的技术，可以显著提升生成内容的准确性和相关性，广泛用于智能问答和内容生成等领域。

![GraphRAG Interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230204523)

它一定程度上解决了大模型上下文长度有限的问题，同时也可以避免幻觉。

与依赖向量相似性进行信息检索的标准 RAG 不同，GraphRAG 使用大语言模型（LLMs）从非结构化文本中构建知识图谱。这种基于图的方式允许对数据进行更结构化和全面的理解，支持局部和全局的查询回答。

![GraphRAG Diagram](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230222175)

### 爆改小爱同学 10/10

![MiGPT Interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230232636)

相信不少爱折腾的小伙伴们，都早早的给自己家装备了上了智能家居！

平时可能也会用小爱同学，来为自己开关灯等操作！

有时无聊可能也想把小爱同学叫出来逗逗它🤣

如果小爱同学，也能像GPT那样”通人性“ 就好了！

MiGPT 就带你爆改小爱同学！

![MiGPT Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240821230244196)

甚至还可以使用豆包去自定义音色！

变身吧！小爱同学！（hhh

甚至相当于你拥有了一个私人外教，小爱同学帮我练口语！

### 写在最后

这十个项目是目前我使用频率最高的项目了，

期待后续发现更多的新的有趣的“天价”项目，

给大家持续更新这个系列！（欢迎来爆料

API的性价比拉高，

也让更多的产品和工具有了实际性，

说不定再过段时间，

苹果智能还没更新，

手机端的GPT API自由就先实现了。
