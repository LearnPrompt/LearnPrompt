---
sidebar_position: 5
title: Stable Diffusion 的安装和部署
description: This page provides instructions on how to install and deploy Stable Diffusion on various platforms, including Google Colab, Windows, and Mac.
keywords: [Stable Diffusion, installation, deployment, Google Colab, Windows, Mac, AI tools]
slug: /stable-diffusion/installation/
---

# 🟢  安装与部署

本地安装使用Stable Diffusion 推荐电脑带有显卡，内存在16G以上，显存8G以上。使用Mac的朋友们8G m1及以上配置的朋友们也可本地部署。如果电脑配置不够的朋友可以使用云服务器进行部署使用。在我们的教程中将给出Google Colab的部署示例。

## Colab安装部署

此方法需要科学上网，注册谷歌邮箱账户（已注册的朋友可跳过），[https://colab.research.google.com/drive/1piBCgnoPfiPn8alD6y3_O8mEIaj4d1q1?usp=sharing](https://colab.research.google.com/drive/1piBCgnoPfiPn8alD6y3_O8mEIaj4d1q1?usp=sharing) 点击链接进入脚本，运行所有代码块。

![Google Colab Script](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/383a20ee342f27001d6103dd0ea42c1e.png)

等待所有代码块运行完后，最下方的代码块会给出URL地址，可随意点击两个中的一个访问Stable Diffusion WebUI进行使用。

![Stable Diffusion WebUI](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/2a5d1b43c06a3507f63fbf3b6eb54b7b.png)

![Stable Diffusion WebUI Access](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/25940c92a84a9c95c655acc557faea3e.png)

## Windows本地部署

本地部署的朋友们建议有带有显卡的电脑。笔者实验过因为国内网络问题，本地直接部署代码会有很多坑，因此建议大家通过整合包的方式在本地部署。 通过链接： [https://pan.baidu.com/s/19pYemrQ3tLzq6pPg-2zWwg?pwd=jxau](https://pan.baidu.com/s/19pYemrQ3tLzq6pPg-2zWwg?pwd=jxau) 下载整合包。提取码： jxau

首先运行该应用程序安装依赖。

![Install Dependencies](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c7ea4695dca9de026612eafb522d95d3.png)

解压压缩包后，进入文件夹

![Enter Folder](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c34534e224f79d8eac37c47337ce6f6b.png)

双击A启动器

![A Starter](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/52b1789a52d2b1202d0d2397e4c1dc4e.png)

点击一键启动，等待即可。

![One-click Start](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e6bd91fc29cab80ce3ca3f5f8bb7d1a1.png)

![Deployment Complete](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/944ec46b2650ca575ad11cb79cccb864.png)

## Mac

diffusionBee 提供了一个基于 Stable Diffusion 的应用程序，无需复杂部署，正常安装就可以使用 官网地址：[https://diffusionbee.com/](https://diffusionbee.com/)