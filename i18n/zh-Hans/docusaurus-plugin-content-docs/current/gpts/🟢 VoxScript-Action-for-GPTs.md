---
sidebar_position: 0
title: VoxScript action版GPTs - 无限URL都能包进gpts
description: Learn how to integrate multiple URLs into GPTs using VoxScript action modules, enhancing your AI's capabilities with access to various search engines and full-text documents.
keywords: [VoxScript, GPTs, URL integration, AI tools, action modules, Pubmed, Google patents, PMC, Zapier]
slug: /gpts/voxscript-action-for-gpts/
---
# 🟢 VoxScript action版GPTs = 无限URL都能包进gpts！

> 😀 作者：[goldengrape](https://quail.ink/u/231)

## **前言：GPTs Actoin背景**

学习到一个新的搭建gpts的方法，用VoxScript搭建GPTs的action模块，这样做的好处是：

> 🚀 VoxScript可以指定要访问的URL。GPT能够访问Pubmed、Google patents等搜索引擎，或者直接去访问某个PMC文献的全文页面

之前我们也出过action的相关教程，当时很快就有人提出了现阶段action并不能访问多个有效url，一部分提出的解决方案是用自己服务器搭建，一部分是用Zapier链接自己所需要的服务。

以上对应的解决方法我们都进行了尝试，用自己服务器的路子是充分可行的，但是要做成教程或者是个人使用的话是不够灵活；在Zapier上搭建自己的服务的调用成本是较高的，而且将自己的服务跟其他zapier已有的接口组合起来也是件工作量较大的改动。

🎉所以这次 **VoxScript action** 从设置到加载到GPTs后成功发布，不会超过x步，Enjoy！

> 抢先体验：https://chat.openai.com/g/g-ORXA1LTQG-yan-jiu-xiao-zhu-shou/c/4e00b7f6-d2ce-4413-a796-6597cb78b99d

这次教程主要是讲解voxscrpit跟gpts的组合，对gpts基础配置和发布细节可以回看我们之前的文章👏

## **注册voxscrpit api key**

首先去https://voxscript-api.awt.icu/注册一个账户

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e1927c40d3317f957170ecd46e5edc97.png)

点击生成API Key

> voxscrpit的界面非常简单（可以说是简陋），大家正常操作即可。api key目前是免费的，但有有效期一个月的限制

## **新建GPTs**

我们直接跳转到**“https://chat.openai.com/gpts/discovery”**

进入到新的gpts设置界面后，我们直奔**Configure**的最下方**“Create new action”**，也就是我们今天的主角

复制Voxscript给的示例

“https://github.com/Voxscript/voxscript-demos/blob/main/GPTs/Voxscript-GPT-API-Definition.json”

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7defa12932604ae1cb2aaf92071daeb1.png)

这时候你会看到多了很多action，向下滑动到最底部，我们找到“Authentication”后，点击齿轮⚙️

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d791ae6d8f31f01a87e80a42493b66fd.png)

按照上图的设置填写刚刚你登陆Vox生成的API Key

## **设置Instructions**

这时候我们的Action已经设置完毕，您的GPT已经具备了用VoxScript action访问网络的能力。这时候我们返回到"Configure"设置我们调用工具的**遥控器**

编写Instructions有两个需要注意的点

1. 明令GPT **“使用voxscript的GetWebsiteContent功能访问该URL”**，因为voxscript也能够调用常规的搜索引擎，有时候也能完成任务，但并没有pubmed/PMC或者google patents好用。所以要指明功能函数。

2. 构建检索URL，或者全文链接URL。您可以用自己常用的专业搜索引擎检索试试，然后复制url作为样例即可。比如，IEEE explore里搜索myopia，可以得到：https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=myopia 把这个例子放在Instructions里，GPT是能够理解构建规则的。

Instructions结构

```
你是研究助理GPT
你能够根据用户的要求，从学术和专利搜索引擎检索文献或者专利。在检索时，你应当参考下面“构建检索URL的方法”，构建检索URL，用voxscript的GetWebsiteContent功能访问该URL，并取回内容。
你能够帮助用户阅读文献或者专利，向用户解释文献或者专利，帮助用户理解。
你应当使用中文和英文检索，然后用中文回答

# 构建检索URL的方法

## PMC：
https://www.ncbi.nlm.nih.gov/pmc/?term=myopia
### 复杂检索式举例：
https://www.ncbi.nlm.nih.gov/pmc/?term=(((%22myopia%22%5BMeSH+Terms%5D+OR+%22myopia%22%5BAll+Fields%5D)+AND+(%222010%22%5BPubDate%5D+%3A+%223000%22%5BPubDate%5D))+AND+MICK%5BFull+Author+Name%5D)+NOT+JACK%5BAuthor%5D
### 检索说明
https://www.ncbi.nlm.nih.gov/pmc/about/userguide/#search
### 其他
* 每个搜索结果包含一个PMCID，如PMC10153577
* 可以通过PMCID提取全文：https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10153577/

....

## google PDF
https://www.google.com/search?q=filetype%3Apdf+myopia

```

## **大功告成**

最后，您再设定好这个GPT的名称、logo之类，保存就可以能得到一个多url无缝访问的gpts了！

> 你也可以尝试看看这个加强后的gpts能不能惊艳你一下！https://chat.openai.com/g/g-ORXA1LTQG-yan-jiu-xiao-zhu-shou/c/4e00b7f6-d2ce-4413-a796-6597cb78b99d
> 

![VoxScript Enhanced GPT](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3e2af0d11ff5e6962517dd884eb6514f.png)

# **下节预告**

我们计划根据GPTs的TOP100来选取被破解的gpts，然后结合上文的VoxScript，看看我们能不能做出爆火gpts！点个收藏追更吧