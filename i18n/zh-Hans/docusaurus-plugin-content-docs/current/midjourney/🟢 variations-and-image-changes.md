---
sidebar_position: 55
title: Variations and Image Changes
description: This guide explains how to create subtle or strong variations of generated images using Midjourney's tools.
keywords: [Midjourney, image variations, High Variation Mode, Low Variation Mode, Vary Strong, Vary Subtle, image editing]
slug: /midjourney/variations-and-image-changes/
---
# 🟢 Variations 图片变化

> 🤠 使用每个图像网格下的 `V1` `V2` `V3` `V4` 按钮创建生成图像的微妙或强烈变化，或使用 和 `Vary (Subtle)` 按钮。

使用 **`🎨 High Variation Mode`** 和 **`🎨 Low Variation Mode`** 设置控制使用这些按钮创建的变化量。您还可以使用放大图像下显示的 **`🪄 Vary (Strong)`** 或 **`🪄 Vary (Subtle)`** 按钮创建放大图像的变体。 **`🪄 Vary (Region)`** 修改生成图像中的选定区域，而不更改整个图像。

## **变化比较**

- 对于 **`🎨 High Variation Mode`** 和 **`🪄 Vary (Strong)`** ，使用“变化”按钮将生成新图像，这些图像可能会更改图像中的构图、元素数量、颜色和细节类型。**`High Variation Mode`**对于基于单个生成的图像创建多个概念非常有用。
- **`🎨 Low Variation Mode`** 和 **`🪄 Vary (Subtle)`** 生成的变体保留了原始图像的主要构图，但对其细节进行了细微的更改。此模式有助于细化或对图像进行细微调整。

![Image Example 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a1293add278ce4002c074173a913f4a0.png)

![Image Example 2](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/047def94893f308791af07a7b8f6c868.png)

![Image Example 3](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/50c5469b54131430fdb1411f6732ef02.png)

## **如何控制变化量**

### **使用变化按钮**

使用放大图像下的 **`🪄 Vary (Strong)`** 或 **`🪄 Vary (Subtle)`** 按钮可创建该图像的强烈或微妙变化。

### **使用设置命令**

使用 **`/settings`** 命令并从菜单中选择 **`🎨 High Variation Mode`** 或 **`🎨 Low Variation Mode`** 来设置使用 **`V1`** 时或多或少变化的结果的首选项 **`V2`** **`V3`** **`V4`** 按钮。

### **使用 /prefer 可变性命令**

使用 **`V1`** **`V2`** **`V3`** **`V4`** 按钮时在使用 **`🎨 High Variation Mode`** 和 **`🎨 Low Variation Mode`** 之间切换在图像网格下方。

## 局部变化

> 使用 Midjourney Vary Region 编辑器选择并重新生成放大图像的特定部分。

### **1. 生成图像**

使用 **`/imagine`** 命令创建图像。

![Generated Image Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1aacb174cd90c89f94063f179704d639.png)

### **2. 升级图像**

使用 U 按钮放大所选图像。

![Enlarged Image Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/33f30aec85e9868f86ed9ec2766cc7de.png)

### **3. 选择不同区域**

点击 **`🖌️ Vary (Region)`** 按钮打开编辑界面。

![Vary Region Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c01c25b559af95fe7e29d30c037a8480.png)

### **4. 选择重新生成的区域**

- 选择编辑器左下角的手绘或矩形选择工具。
- 选择要重新生成的图像区域。
    - 您选择的大小将影响您的结果。更大的选择为Midjourney提供了更多空间来生成新的创意细节。较小的选择将导致更小、更微妙的变化。

![Selection Tool Example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/afdd399db6537ab15b5427e3ceb5828e.png)

### **5. 提交您的工作**

单击 **`Submit →`** 按钮将您的请求发送到 Midjourney Bot。现在可以关闭 Vary Region 编辑器，并且在处理作业时您可以返回 Discord。

注意 您可以多次使用放大图像下方的 **`🖌️ Vary (Region)`** 按钮来尝试不同的选择。您之前的选择将被保留。您可以继续添加到此现有选择或使用 **`undo`** 按钮清除您的选择。