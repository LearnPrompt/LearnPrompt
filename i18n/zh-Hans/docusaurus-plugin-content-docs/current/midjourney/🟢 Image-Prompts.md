---
sidebar_position: 20
title: 图片提示
description: This page provides guidelines on how to use image prompts effectively for AI art generation, including uploading images, using V5 effects, and applying weight parameters.
keywords: [AI art, image prompts, art generation, V5 effects, weight parameters, image upload]
slug: /midjourney/image-prompts-ai-art/
---
# 🟢 图片提示Image Prompts

你可以使用图像作为提示的一部分来影响生成图片的构图、风格和颜色。

图像提示可以单独使用，也可以与文本提示一起使用

**要将图像添加到提示中，请键入或粘贴在线存储图像的网址。地址必须以 .png、.gif 或 .jpg 等扩展名结尾。**

## 上传图像

1. 上传图像，要先单击消息输入框旁边的加号。选择上传文件，选择图像，然后发送消息。
2. 要将此图像添加到提示中，首先输入**/imagine**。出现提示框后，将图片文件拖入提示框，添加图片的URL。
3. 或者右键单击图像，选择复制链接，然后将链接粘贴到提示框中

![upload_example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6bf9a52c45ef37c4acb11696af678a63.gif)

## V5效果

![v5_effects](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/dec7a737ba6072de7073484e4d4ea9b4.png)

:::takeaways
- 每一个链接复制之后，必须空格一下，然后再复制第二个链接
- 图片上传完成后，还需要输入提示文本
- **/blend** 指令是针对移动用户优化的简化图像提示过程
:::

## 权重参数

![weight_parameters](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1005c67ce1d49bf5e1907ba37a8a3f32.png)

```python
/imagine prompt flowers.jpg birthday cake --iw .5
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fac505109953b9791afa0a02b8e8ca7c.png)