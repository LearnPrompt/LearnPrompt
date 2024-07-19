---
sidebar_position: 0
title: Architectural Design in V5
description: Explore key structures and templates for production buildings in V5, including styles and inspirations from renowned architects and photographers.
keywords: [Architectural Design, V5, Production Buildings, Modern Architecture, Photography, Zaha Hadid, Le Corbusier, Kengo Kuma]
slug: /midjourney-applications/architectural-design/
---
# 🟢 Architectural Design

## Basic Structures

This is a highly suitable tip structure for production buildings in V5.

Let's first review the generic template from the last chapter:

**Theme + Background, Environment, Atmosphere + Style + Parameters**

Under the architectural generation setting, we use:

**Detailed Theme Description + Surrounding Environment + Architectural Style or Era, Architects, Designers, and Photographers + Parameters**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/architectural-design-over-cliff.webp)

```python
spiraling massive gothic monolithic structure with arches on a cliff, crashing waves and a sky tinged with the sun, Hellenic, designed by Hidetaka Miyazaki, photography by Hélène Binet --ar 16:9 --c 3
```

The order of the prompt is crucial. The closer a word is to the beginning of the prompt, the stronger its impact. Therefore, if you really want to emphasize an architect's style, you can put their name first:

**Architect Name + Detailed Theme Description + Surrounding Environment + Other Styles, Aesthetics, Designers, and Photographers + Parameters**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/5bc986c5914721b093f24482f4df815d.webp)

```python
Ludwig Mies van der Rohe, house with glass and mirrors and grid columns, light and modern and transcendent, photographed by Ezra Stoller --ar 16:9 --c 2 --s 90
```

## Famous Architects

### Zaha Hadid

The late Zaha Hadid, the first woman to win the architectural Oscar (the Pritzker Prize), is renowned for her futuristic designs featuring curving, swooping lines.

```python
Futuristic skyscraper with a biomorphic design, lush vertical gardens, and soaring glass facade, inspired by Zaha Hadid, photographed by Candida Höfer --ar 16:9 --c 3
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/3c7dfe222a8f9293fb78197f0f1909ef.png)

### Le Corbusier

Le Corbusier, born Charles-Édouard Jeanneret, is a Swiss-French architect, designer, and urban planner, widely regarded as a pioneer of modern architecture.

```python
Minimalist concrete structure with geometric forms and dramatic shadows, inspired by awe, Brutalist style, Le Corbusier, photographed by Ezra Stoller --ar 16:9 --c 2

```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c084cb2279de83ae09b9270b18f7666d.webp)

### Kengo Kuma

Kengo Kuma, a renowned Japanese architect, has won architectural awards in Japan, Italy, Finland, and more. His works radiate Japanese style and Eastern Zen, often referred to as "negative architecture" for their integration of natural landscapes using materials like wood, clay bricks, bamboo, stone slabs, paper, or glass, combined with water, light, and air to create seemingly delicate yet durable and warm traditional structures.

```python
large interior by Kengo Kuma, Harmonious blend of natural elements and modern design, an eco-friendly structure, pools and falling water --ar 16:9 --c 1
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d1167d4d631ed9e225de2ad1d550ad3c.png)

## Architectural Photographers

In addition to architects, photographers are also crucial. If your prompt includes a photographer, I suggest adding the -s styling parameter and setting it lower than 100 (default is 100).

### Hélène Binet

Hélène Binet is a Swiss and French architectural photographer. She is famous for capturing the essence of architectural space through light, shadows and textures.

```python
photo by Hélène Binet, upward angle, delicate balance of light and shadow, rich textures, soul and essence of a space, very visually captivating --ar 16:9
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/32aa49e165ff780a092dcf8fd65a28f5.png)

### Candida Höfer

German photographer Candida Höfer captured large empty public and institutional spaces with majestic wide-angle photography.

```python
Captivating grand interior, a vast architectural space, photography by Candida Höfer, symmetry, color, and intricate details, --ar 16:9 --s 50

```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/44133a0a23db6ac785713a9db0c70b36.webp)

### Julius Shulman

Julius Shulman is a California architectural photographer. He is famous for his photos beautifying the modern Los Angeles lifestyle and is a key figure in documenting the development of American modernism for more than 70 years.

```python
Julius Shulman architectural photography of a house in the LA hills overlooking the city, --ar 16:9 --c 1 --s 90
```

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b1b058e3893f51757dddb55705ac9b2f.png)

## Architectural style

### Modernism

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/b79b5b20f6a62b6fb947cd2461c11878.webp)

```python
Modern Architectural Design, methodical use of space, artistic, Modernism, photographed by Ezra Stoller, color photography --ar 16:9

```

### Gothic architecture

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/c2205bc2be02d14b80c65202ccbdc18f.webp)

```python
Gothic architectural Design, flying exterior buttresses, long stained-glass windows, ribbed vaults, and spires, photo by Hélène Binet --ar 16:9

```

## Style mixing

Use the prompt "Hybrid" to combine the two architectural styles

### Neo-Gothic and Fauvist architecture

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/d0c701f0a6ace79c2abf94b8cf8a7c27.webp)

```python
Hybrid Neo-gothic and brutalist architecture combination style --ar 16:9

```

## Futurism

Tip: hyperrealistic futuristic

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/05c2219ac4ddf7cbd5dd196be0f7ff9c.webp)

```python
hyperrealistic futuristic coffee shop, minimalist, morning sun, drive through, --q 2 --ar 3:2
```