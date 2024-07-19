---
sidebar_position: 40
title: Training LoRa
description: A comprehensive guide on training LoRa using tools and tutorials from popular online resources.
keywords: [LoRa, AI training, Python scripts, stable diffusion, image preprocessing, AI model training]
slug: /stable-diffusion/train-lora/
---

# 🟢  训练LoRa

根据用户反馈，有的朋友想了解自己训练LoRa，为了方便不同背景的用户实操，因此这里我们使用了B站 Up主秋叶aaaki的整合包进行示范。

训练包下载： [https://pan.quark.cn/s/d81b8754a484](https://pan.quark.cn/s/d81b8754a484)

程序员可通过Git直接clone [https://github.com/Akegarasu/lora-scripts](https://github.com/Akegarasu/lora-scripts)

```python
git clone --recurse-submodules https://github.com/Akegarasu/lora-scripts
```

## 环境配置

1. 安装python 3.10版本

记得勾选add python.exe to PATH

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ea42beb5e657c0a0ddaa46b0789a8a6c.png)

点这个

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7ba72d367d7710059fdce55cf455e2ab.png)

1. 以管理员身份运行powershell

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e1df1d0940a8da0b064388b4adb01e6b.png)

输入 Set-ExecutionPolicy -ExecutionPolicy RemoteSigned 敲回车，然后弹出以下信息属于 y，敲回车

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/873d4e318513fb5228ad7d64cd13ed7a.png)

完成后，属于python，敲回车，出现如图所示则完成此步骤。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/966822446f8ed626b76b284bee2efb51.png)

如果输入python遇到报错找不到python或者跳出微软商店的

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b95f05aef428190187ccd3268b2ae112.png)

请重新安装python，这次我们选择customize install

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3015ba4c3ce4a7280cafdd1da20162ce.png)

点击下一步

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/183d78d413ef6bf3fdbb574a69f443b7.png)

这一步我们勾选这个

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/02e2ec9acc2bf033ae2c6a90346df90f.png)

安装完毕后即可正常使用。

1. 安装依赖 我们去到下载好的lora-scripts路径下，右键install-cn，使用powershell运行
   
    ![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9be5b149e341b95ba5bdeb8dda5b0a09.png)
    

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/2b683dbfabd24bac34921eb644bf886d.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6c14594a11b3a8eeb5e5e2ba07070577.png)

然后安装完成后，笔者这里powershell的窗口会自己消失，如果有报错，窗口会显示错误信息，笔者这步没有遇到报错。

## 准备训练图片

启动Stable diffusion web ui应用，参考前面的章节，选择训练->图像预处理, 我们事先在一个文件夹中放了训练的图片，笔者这里用了迪丽热巴的图片作为实验，在webUI的源目录中把图片所在文件夹的路径粘贴上去。

目标目录把某个空文件夹的路径粘贴上去。

勾选自动面部焦点裁剪和使用Deepbooru生成标签，点击预处理。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/dd8747742c5e748426946ce59f45dc8f.png)

完成后，我们的目标文件夹以及标签如下图所示

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9c4981a4940d64f772f3b82edfcb6012.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/73707355a04087b5f62552b7329f53e7.png)

**关闭WebUI应用！！！**

然后在lora-scripts目录下新建一个文件夹，笔者这里取名为train_graph

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/479949ad4c47cd8cf2bed5bd06acef8b.png)

进入刚新建的这个文件夹，再新建一个文件夹

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fb1ca68758992da64ede294cd93b0c18.png)

再进入刚新建的文件夹，再新建一个文件夹，这个文件夹取名为 `[数字]_[名字]` 笔者这里为6_dilireba

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/21bef6d4ec135170a64ca56cd3ec086f.png)

把我们之前预处理好的图片数据都放入到这个文件夹中

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e2bd0e87032d501ff46780caeec4943a.png)

然后我们在lora-scripts路径下，使用文本编辑器（记事本、VScode、notepade++等）打开train.ps1这个文件

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c39821fe63f101354a4bcfd462276ac7.png)

内容如下所示

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/19d9c14dbb41ef45784759ebc0525bda.png)

这里我们注意的这两处地方，第一个为底模型的路径，也就是Stable Diffusion大模型的路径。 这里笔者在

[https://huggingface.co/runwayml/stable-diffusion-v1-5/tree/main](https://huggingface.co/runwayml/stable-diffusion-v1-5/tree/main)

上下载了v1-5-pruned.ckpt作为实验，并把它改名为model.ckpt放在lora-script/sd-models路径下，也就是第一个红框对应的路径。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a6352a5bc8c72face27833817feac0a9.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/356430a32e3a7b82899ad13cfc963501.png)

然后把第二个红框的数据路径修改为我们前面创建的/train_graph/dilireba这个路径

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b54d60e538b72e5d9a20615bcf5e403c.png)

找到 output_name这个地方，模型名字自己命名

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3db3993a80b17e300da0fa95729beaee.png)

**保存修改！保存修改！保存修改！**

## 训练

回到lora-scripts路径下，右键train.ps，使用powershell运行

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/84dc934f9d095bc48f93c5e7390d28db.png)

这里笔者遇到一个报错如下图所示

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/94296e1a4e82f6f4336acf427644508a.png)

我们再次使用文本编辑器打开lora-scripts路径下的train.ps，**如果没有出现同款报错，可忽略这步**

找到optimizer_type,它默认为AdamW8bit，笔者修改成AdamW如下图所示，**保存修改！保存修改！保存修改！**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1f722e5d9ac9799513b707776931012f.png)

然后回到lora-scripts，[右键train.ps](http://xn--train-iw8hn010b.ps/)，使用powershell运行，即可正常训练如下图所示。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7f53f9cc2c9a41ca000c1045a5e69719.png)

## 完成训练

训练完成后，lora-scripts/output路径下可以看到我们训练好的lora模型。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6b90a8bd0f689b22e5d27bba9d937f22.png)

然后我们就可以使用自己训练好的lora模型了，具体使用方法参考前面Stable Diffusion模型介绍章节里的Lora部分

使用lora前后对比。笔者这里只使用了6张图片来训练，也没有调参之类的，所以效果有限，但风格的变化对比起来还是比较明显的。

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a2cddde73d05c0d05c931e7f87267e23.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/babc524c101e8a19444f76253687a0e0.png)