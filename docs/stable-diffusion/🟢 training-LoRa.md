---
sidebar_position: 40
title: Training LoRa
description: A comprehensive guide on training LoRa using tools and tutorials from popular online resources.
keywords: [LoRa, AI training, Python scripts, stable diffusion, image preprocessing, AI model training]
slug: /stable-diffusion/train-lora/
---

# 🟢 Training LoRa

According to user feedback, some friends are interested in training LoRa themselves. To facilitate practical operations for users of different backgrounds, we are using the integrated package from Bilibili Uploader Autumn Leaves aaaki for demonstration.

Training package download: [https://pan.quark.cn/s/d81b8754a484](https://pan.quark.cn/s/d81b8754a484)

Developers can clone directly via Git at [https://github.com/Akegarasu/lora-scripts](https://github.com/Akegarasu/lora-scripts)

```python
git clone --recurse-submodules https://github.com/Akegarasu/lora-scripts
```

## Environment Setup

1. Install Python version 3.10

Make sure to check 'add python.exe to PATH'

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/ea42beb5e657c0a0ddaa46b0789a8a6c.png)

Click this.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7ba72d367d7710059fdce55cf455e2ab.png)

1. Run powershell as administrator

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e1df1d0940a8da0b064388b4adb01e6b.png)

Enter Set-ExecutionPolicy -ExecutionPolicy RemoteSigned and press Enter, then if the following message pops up, belong to y, press Enter

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/873d4e318513fb5228ad7d64cd13ed7a.png)

After completing, belong to python, press Enter, if as shown then step is complete.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/966822446f8ed626b76b284bee2efb51.png)

If entering python causes an error not finding python or opens the Microsoft Store

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b95f05aef428190187ccd3268b2ae112.png)


Please reinstall python, this time we choose customize install

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3015ba4c3ce4a7280cafdd1da20162ce.png)

Click next

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/183d78d413ef6bf3fdbb574a69f443b7.png)

In this step, we check this

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/02e2ec9acc2bf033ae2c6a90346df90f.png)

Once installed, it can be used normally.

Install dependencies Go to the downloaded lora-scripts path, right-click install-cn, and run with powershell
   
    ![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9be5b149e341b95ba5bdeb8dda5b0a09.png)
    

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/2b683dbfabd24bac34921eb644bf886d.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6c14594a11b3a8eeb5e5e2ba07070577.png)

After installation, the powershell window will disappear on its own. If there is an error, the window will display the error information. There were no errors in this step for me.

## Prepare Training Images

Start the Stable Diffusion web UI application, refer to the previous chapters, select Training->Image Preprocessing. We have placed the training images in a folder beforehand, I used images of Dilireba for the experiment. In the source directory of the webUI, paste the path of the folder containing the images.

Target directory, paste the path of some empty folder.

Check automatic facial focus cropping and generate labels using Deepbooru, then click preprocessing.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/dd8747742c5e748426946ce59f45dc8f.png)


After completion, our target folder and labels are as shown below

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/9c4981a4940d64f772f3b82edfcb6012.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/73707355a04087b5f62552b7329f53e7.png)

Close the WebUI application!!!

Then in the lora-scripts directory, create a new folder, I named it train_graph

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/479949ad4c47cd8cf2bed5bd06acef8b.png)

Enter the newly created folder, then create another folder

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/fb1ca68758992da64ede294cd93b0c18.png)

Then enter the newly created folder and create a new folder. This folder is named `[number]_[name]`. The author is 6_dilireba here.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/21bef6d4ec135170a64ca56cd3ec086f.png)

Put all our previously pre-processed picture data into this folder.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/e2bd0e87032d501ff46780caeec4943a.png)

Then we use the text editor (Notepad, VScode, Notepad++, etc.) under the lora-scripts path to open the file train.ps1.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c39821fe63f101354a4bcfd462276ac7.png)

The content is as follows

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/19d9c14dbb41ef45784759ebc0525bda.png)

The first of these two places we pay attention to here is the path of the bottom model, which is the path of the stable Diffusion large model. Here, the author is here.

[https://huggingface.co/runwayml/stable-diffusion-v1-5/tree/main](https://huggingface.co/runwayml/stable-diffusion-v1-5/tree/main)

Download v1-5-pruned.ckpt as an experiment, and change its name to model.ckpt and put it under the path of lora-script/sd-models, which is the path corresponding to the first red box.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a6352a5bc8c72face27833817feac0a9.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/356430a32e3a7b82899ad13cfc963501.png)

Then modify the data path of the second red box to the /train_graph/dilireba path created in front of us.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b54d60e538b72e5d9a20615bcf5e403c.png)

找到 output_name这个地方，模型名字自己命名

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3db3993a80b17e300da0fa95729beaee.png)

Save and modify! Save and modify! Save and modify!

## Train

Go back to the lora-scripts path, right-click train.ps, and run with powershell.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/84dc934f9d095bc48f93c5e7390d28db.png)

Here, the author encountered an error as shown in the figure below.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/94296e1a4e82f6f4336acf427644508a.png)

We use the text editor to open train.ps under the lora-scripts path again. If there is no error in the same model, you can ignore this step.

Find optimizer_type, it defaults to AdamW8bit, and the author modifies it to AdamW as shown in the figure below, save the modification! Save and modify! Save and modify!

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/1f722e5d9ac9799513b707776931012f.png)

Then go back to lora-scripts, [right-click train.ps] (http://xn--train-iw8hn010b.ps/), run with powershell, and train normally as shown in the figure below.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/7f53f9cc2c9a41ca000c1045a5e69719.png)

## Complete the training

After the training is completed, you can see our trained lora model under the lora-scripts/output path.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/6b90a8bd0f689b22e5d27bba9d937f22.png)

Then we can use the lora model we have trained. For details, please refer to the Lora section in the previous chapter of Introduction to the Stable Diffusion Model.

Compare before and after using lora. The author only used 6 pictures for training, and there was no adjustment, so the effect was limited, but the change of style was relatively obvious.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a2cddde73d05c0d05c931e7f87267e23.png)

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/babc524c101e8a19444f76253687a0e0.png)