---
sidebar_position: 15
title: Anime Design Techniques 2023
description: Explore the innovative methods and tools in anime design with a focus on Midjourney's Niji model advancements in 2023.
keywords: [Anime Design, Midjourney Niji, Anime Art, Digital Illustration, Anime Characters, 2023 Design Techniques]
slug: /midjourney-applications/anime-design/
---

# 🟢 Anime Design

There are two methods to generate anime using Midjourney: the Niji mode and the standard Midjourney model. Niji V5, launched on April 1, 2023, is Midjourney's dedicated anime model. It is built on a new architecture over the standard Midjourney model and excels in generating named anime characters. Niji V4 was released in December 2023.

## Control Programmability

We can use **--stylize** to achieve a range of interesting variations, from --s 0 to --s 1000. The default is 100. By lowering the stylization value, you can obtain more diverse and intriguing results.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5d5d80b838751c89cd4316a67290cf6e.webp)

**Using "Quality Tags"**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/8f88fb0c546e2bd1fb44da3c7c934b33.png)

```python
girl with black hair, masterpiece, best quality, ultra-detailed, cinematic beautiful lighting, intricate details, looking at viewer, depth of field
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/cec1539d36bed3bb7496be4e9f5245ec.png)

```python
girl with black hair, looking at viewer, depth of field
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/08f6e92366634456c83187be4adbc538.png)

You can try using parts of these prompts but avoid overuse as their benefits diminish over time.

## Character Generation

A large dataset for AI anime models (NAI Diffusion, Anything, etc.) originates from  [Danbooru](https://danbooru.donmai.us/tags?commit=Search&search%5Bcategory%5D=4&search%5Bhide_empty%5D=yes&search%5Border%5D=count) images, making the Danbooru character tag count a good method to check if Niji can generate a character.

Here are some pages featuring Danbooru tag counts:

- [Popular Characters](https://danbooru.donmai.us/tags?commit=Search&search%5Bcategory%5D=4&search%5Bhide_empty%5D=yes&search%5Border%5D=count)
- [Top Artists](https://danbooru.donmai.us/artists?commit=Search&search%5Border%5D=post_count)

```python
90s anime still, asuka langley soryu wearing a red, neon genesis evangelion, watercolor illustration --ar 2:3 --niji 5
```

![image-20240625015058175](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/4cddbc6740494f8cf94b8e25dcee99d5.png)

```python
In the center of a huge cloud swirl there is an anime beautiful girl in jk uniform and miniskirt, midscape, Son of Weather, Shinkai Makoto style, daub oil painting texture and Chinese painting style mix, braids, bangs, acrylic thick paint, intricate details, art oil painting, anime characters, comic style, Pixar style, abstract, flat, two-dimensional, Particle crushing effect, simple painting style --ar 2:3 --uplight --q
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a5b7cedda58b6e1942cef71f94b07621.png)

## Retro Anime

You can try the following designers and directors to give your images a retro anime style:

- Yoshiyuki Sadamoto - founder of Neon Genesis Evangelion
- Hayao Miyazaki
- Tsukasa Hojo - creator of City Hunter
- Naoko Takeuchi - creator of Sailor Moon

Directly using era-related keywords can also achieve a similar effect:

- 1970s anime, 1980s anime, 1990s anime
- retro anime
- retro anime screencap

![Anime5.png](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/47c1ffed029a4000572db5f9d71b64d2.png)

```python
80s anime still, girl fixing a mech, retro fashion, muted retro colors, 
style of Dragons Heaven --ar 3:2
```

## Character Design and Concept Sheets

Character design and concept sheets help designers maintain consistency of a character across different poses, angles, and expressions.

expression sheet
character design sheet
character turnaround sheet
dress-up sheet / fashion sheet
items sheet / accessories
character pose sheet
concept art sheet
These keywords can be paired in twos for effective use.

![Anime6](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b720f2d34cdd08677f00d37537b9150a.webp)

```python
character design sheet, magical girl blue hair --ar 3:2

```

## Image Prompts

If you have a favorite design, composition, theme, pose, or color of an illustration, you can use it as part of your prompt, and Niji will apply appealing elements to the new image.

![Anime7](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/8664a2efc97a2ccd103b2b16a13879aa.webp)

If you like the colors and style of this image, and want to create a similar one, like Rei from Evangelion:

![Anime8](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/642685d1241784cbf281b1e93166e19b.png)

```python
[LINK TO ORIGINAL IMAGE] Rei from Evangelion --ar 3:2
```

To perform img2img, paste the image link as the first part of your prompt. If you have the original image locally, you need to send it to Midjourney. Then right-click the image > "Copy Link". Paste this link as the first part of your prompt.

## Photo to Anime

You can also input real-world photos into Niji to output images with an anime style.

![Anime9](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/cb0acc5b5ad044e0c729c07cd8a7a13c.png)

```python
gold color theme, masterpiece, stylish anime girl with long blonde hair, 
facing the camera, detailed pupils, depth of field --ar 3:2
```