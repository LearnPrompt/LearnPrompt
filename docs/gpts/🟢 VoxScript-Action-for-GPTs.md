---
sidebar_position: 0
title: VoxScript Action for GPTs - Unlimited URL Integration!
description: Learn how to integrate multiple URLs into GPTs using VoxScript action modules, enhancing your AI's capabilities with access to various search engines and full-text documents.
keywords: [VoxScript, GPTs, URL integration, AI tools, action modules, Pubmed, Google patents, PMC, Zapier]
slug: /gpts/voxscript-action-for-gpts/
---

# 🟢 VoxScript Action for GPTs: Unlimited URL Integration!

> 😀 Author: [goldengrape](https://quail.ink/u/231)

## **Introduction: Background of GPTs Action**

Learn a new method to build GPTs using VoxScript to create action modules. The benefits of this approach are:

> 🚀 VoxScript can specify URLs to visit. GPT can access Pubmed, Google patents, and other search engines, or directly access the full-text page of a PMC document.

Previously, we also released related tutorials on actions. At that time, it was quickly pointed out that current actions cannot access multiple valid URLs. Some proposed solutions included setting up your server or using Zapier to link to the services you need.

We tried all the corresponding solutions above. Using your server is fully feasible but not flexible enough for tutorials or personal use. Setting up your services on Zapier is costly, and combining your services with other Zapier interfaces also involves a lot of work.

🎉 So this time, **VoxScript action** can be set up, loaded into GPTs, and successfully published in no more than a few steps. Enjoy!

> Early access: [https://chat.openai.com/g/g-ORXA1LTQG-yan-jiu-xiao-zhu-shou/c/4e00b7f6-d2ce-4413-a796-6597cb78b99d](https://chat.openai.com/g/g-ORXA1LTQG-yan-jiu-xiao-zhu-shou/c/4e00b7f6-d2ce-4413-a796-6597cb78b99d)

This tutorial mainly explains the combination of VoxScript and GPTs. For basic GPT configuration and publishing details, you can refer to our previous articles. 👏

## **Register VoxScript API Key**

First, go to [https://voxscript-api.awt.icu/](https://voxscript-api.awt.icu/) to register an account.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e1927c40d3317f957170ecd46e5edc97.png "VoxScript Registration")

Click to generate an API Key.

> VoxScript's interface is very simple (one could say crude). Just operate normally. The API key is currently free but has a one-month validity limit.

## **Create New GPTs**

We directly jump to [https://chat.openai.com/gpts/discovery](https://chat.openai.com/gpts/discovery).

After entering the new GPTs setup interface, go straight to the bottom of **"Configure"** and find **"Create new action"**, which is our main focus today.

Copy the example provided by VoxScript:

“https://github.com/Voxscript/voxscript-demos/blob/main/GPTs/Voxscript-GPT-API-Definition.json”

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7defa12932604ae1cb2aaf92071daeb1.png)

At this point, you will see many actions. Scroll down to the bottom, find **"Authentication"**, and click the gear ⚙️.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d791ae6d8f31f01a87e80a42493b66fd.png "Authentication Settings")

Fill in the API Key you just generated in VoxScript according to the above settings.

## **Set Instructions**

Now our Action is set up, and your GPT can access the web using VoxScript action. Return to **"Configure"** to set up the remote control for calling the tool.

There are two points to note when writing instructions:

1. Explicitly tell GPT to **"use the GetWebsiteContent function of VoxScript to access the URL"**. Although VoxScript can also call regular search engines and sometimes complete tasks, it is not as useful as Pubmed/PMC or Google patents. So specify the function.

2. Construct the search URL or full-text link URL. You can use your usual professional search engine to try, then copy the URL as an example. For example, searching for myopia in IEEE explore gives: [https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=myopia](https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=myopia). Put this example in the instructions, and GPT can understand the construction rules.

Instructions structure:

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

## **All Set**

Finally, set the name, logo, etc., for this GPT, save it, and you can get a GPT that seamlessly accesses multiple URLs!

> You can also try this enhanced GPT to see if it surprises you: [https://chat.openai.com/g/g-ORXA1LTQG-yan-jiu-xiao-zhu-shou/c/4e00b7f6-d2ce-4413-a796-6597cb78b99d](https://chat.openai.com/g/g-ORXA1LTQG-yan-jiu-xiao-zhu-shou/c/4e00b7f6-d2ce-4413-a796-6597cb78b99d)

![VoxScript Enhanced GPT](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3e2af0d11ff5e6962517dd884eb6514f.png)

# **Next Preview**

We plan to select cracked GPTs from the TOP100 according to GPTs, and then combine the above VoxScript to see if we can create a viral GPT! Bookmark and follow for updates.