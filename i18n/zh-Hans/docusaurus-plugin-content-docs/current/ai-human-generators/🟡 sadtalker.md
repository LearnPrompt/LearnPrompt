---
sidebar_position: 15
title: SadTalker - 让照片说话
description: Explore how SadTalker leverages photos and audio to create speaking images, including installation guides and troubleshooting.
keywords: [SadTalker, photo animation, speech synthesis, AI communication, setup guide, troubleshooting]
slug: /ai-human-generators/sadtalker-speaking-photos/
---

# 🟡 [实战] SadTalker：让照片说话

项目地址（内含详细说明文档）：[https://github.com/OpenTalker/SadTalker](https://github.com/OpenTalker/SadTalker)

先上效果：输入一张照片和一段音频，实现让照片中的人说话

<iframe src="https://player.bilibili.com/player.html?isOutside=true&aid=112808540834692&bvid=BV1Yn8peXE1U&cid=500001619761125&p=1&high_quality=1&autoplay=0"  style={{width: "100%", height: "500px"}} scrolling="no" border="0" frameborder="no" framespacing="0" allowFullScreen={true}></iframe>

## 运行方式一：Windows直接安装

### 零、前置工作

需要git，科学上网， python3.8+ 环境。如果你不知道这些是什么的话，那这个方法不适合你。

### 一、下载ffmpeg

**1. 登录 [https://ffmpeg.org/download.html，点击Windows，选gyan.dev](https://ffmpeg.org/download.html%EF%BC%8C%E7%82%B9%E5%87%BBWindows%EF%BC%8C%E9%80%89gyan.dev)**

![step1.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/70adf706909677a866014a3fd4831878.png)

**2. 下载Windows构建全版本的FFmpeg**

![step2.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ccd461840f72886e072604852938f7a2.png)

**3. 解压，重命名解压后文件夹为FFmpeg**

p.s. 解压需要[安装7zip](https://www.7-zip.org/download.html)，好用的轻量级压缩工具。

![step3.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/48305d9d5925172752d9719f54d66781.png)

**4. 配置PATH环境变量，添加完后记得点确定**

![step4.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/50cc7c4ba5d1cab72adbb088806419c1.png)

![step5.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/31cbdd2fec0c17cadf4bae904dccf55d.png)

**5. 检查是否安装成功**

```python
打开【命令提示符】，输入ffmpeg，如图所示
```

![step6.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ddda6669079739da2426c645f0b7fd49.png)

### **二、下载SadTalker代码**

git clone [https://github.com/Winfredy/SadTalker.git](https://github.com/Winfredy/SadTalker.git)

![step7.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/4dc6b6f297a44b889573c5b0a2d8da78.png)

### 三、下载SadTalker模型文件

参照[《官方文档》](https://github.com/OpenTalker/SadTalker)有三种方式，其中百度网盘是不用翻墙的，模型文件涉及以下两个文件夹：

- [checkpoints](https://pan.baidu.com/s/1P4fRgk9gaSutZnn8YW034Q?pwd=sadt), 提取码: sadt
- [gfpgan](https://pan.baidu.com/s/1kb1BCPaLOWX1JJb9Czbn6w?pwd=sadt), 提取码: sadt

把下载好的模型文件放到checkpoints和weights下面

![step8.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5f60301930bd63fd73946a98db7f891c.png)

![step9.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ab758dfd3077041accb14b6e3b98560e.png)

### 四、启动webUI

第一次运行需要下载依赖，会有点慢

![step10.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/f152dae559b5baa471e354b6c532cb58.png)

### 五、浏览器运行demo

默认地址为 127.0.0.1:7860，拖入图像和语音，点击Generate即可进行合成（注：SadTalker/example下有样例可以拖进来试

![step11.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/069c237b94a61ddf283f86ba40ffa4f3.png)

### 常见问题

1. 点击Generate后右上角提示【Expecting value: line 1 column 1 (char 0) 】

关掉代理服务器，请参考[[Bug]: Something went wrong Expecting value: line 1 column 1 (char 0) #9174](https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/9174)

**2. 脚本内拉取模型文件失败**

解决方法：手动下载好模型文件，放在weights下面。模型文件下载请参考[这里](https://github.com/OpenTalker/SadTalker)。

![step12.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/72a14609d260bf3f41163e1f30d70566.png)

## 运行方式二：Colab（需科学上网）

1. 访问 [SadTalcker 的Colab链接](https://colab.research.google.com/github/Winfredy/SadTalker/blob/main/quick_demo.ipynb)，复制到自己的云端硬盘
   
    ![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ae8615e5f266e99aa1a11dc718255bde.png)
    
2. 点击不同单元格，依次运行

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/040fd77ba5a4138e2caefcf79f79772e.png)

- 选择图片，运行，即可完成合成

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/60d287486ea2cea4b2c13db1b656025f.png)

- 运行

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fdd7ad3203c314b204ca1024e7476418.png)

- 预览结果

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/56bb96eaea3d5724dab83072f70da185.png)

### 常见问题

**1. pip install 时提示 python3.8: command not found**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/f1e64c198c1d1db0ef9e6315360d9ddb.png)

解决方法：手动安装下python3.8

```python
!wget -O mini.sh https://repo.anaconda.com/miniconda/Miniconda3-py38_4.8.2-Linux-x86_64.sh
!chmod +x mini.sh
!bash ./mini.sh -b -f -p /usr/local
```

![
![img6.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/8471bc0679da77ac3676583678a5cab3.png)](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/8471bc0679da77ac3676583678a5cab3.png)