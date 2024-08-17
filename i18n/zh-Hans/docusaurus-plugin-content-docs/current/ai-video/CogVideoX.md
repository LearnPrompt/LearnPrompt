---
sidebar_position: 0
title: 我用智谱「清影」做了100个镜头，Sora们要坐不住了
description: An in-depth review of Zhipu's newly launched video creation agent "Qingying," powered by the CogVideoX model, including comparisons and tests across different video styles.
keywords: [Zhipu, Qingying, AI video creation, CogVideoX, AI video generation, Runway, Luma, Sora]
slug: /ai-video/zhipu-qingying-review/
---

# 🟢 我用智谱「清影」做了100个镜头，Sora们要坐不住了

早上点开视频号，发现智谱正在直播，本以为是GLM-4新版本，

这次却是一个意想不到的新面孔，智谱发布了他们的视频创作智能体：

**清影**

由视频生成大模型 CogVideoX 提供技术支持。

CogVideo 听着很耳熟，一查发现早在两年前就公开了代码，是当时最大的通用领域文本到视频生成预训练模型，含94亿参数。

当时的它生成效果长这样:

![Old CogVideo Output](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020433141.gif)

现在它是这样的：

![New CogVideo Output 1](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020450931.gif)

![New CogVideo Output 2](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020501073.gif)

时间线回到现在， Sora迟迟不出，各家AI视频更新速度恨不得以天为单位的情况下， 显得智谱这次发布诚意满满：

- 上线就是全量，不需要等内测
- 上线就支持文生视频和图生视频
- 多端「PC/APP/小程序」都能使用

这味对了✅，使用方式很简单

手机端点开智谱清言->首页就能看到清影->点击蓝字进入使用界面

![Mobile Interface](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020515702)

完事，不需要等漫长的等待⌛️了

刚好最近同时在做2个片子的新策划， 现在处于是软件不够用的情况，

- 可灵收费全量后生成一个镜头等两小时
- Luma一直都很耐等
- Gen3一直都蛮贵的

作为第一版产品，我对清影要求并不高，能作为我生成镜头的前3名选择，就足以让我继续期待它之后的更新。

先说参数，清影支持生成1440x960的6s视频，这个水平基本与其他几家持平。

不过，几组镜头还不足以代表大家喜欢的视频风格。

所以这次，我选了Runway、Luma、Kling近一个月内大家玩的比较多的，转发人数爆棚的视频，然后把它们分类为：

> 写实镜头、动画风格、科幻玄幻、多人场景，表情包人物玩梗

现在分类有了，就差测试的提示语了。

以前这活是GPT干，

现在智谱清言智能体把活抢去了， 输入场景描述 + 内容描述就能得到一个提示语。让我们看看智能体增强前后的提示语对比：

增强前：一位老年妇女在厨房里烹饪，背景中有各种厨房用具和食材，氛围温馨。

增强后：特写镜头紧随老年妇女在厨房烹饪的画面，傍晚的温暖光线洒在她的脸上，显得格外慈祥。她穿着家庭便装，周围是整齐摆放的厨房用具和新鲜的食材，整个厨房充满了家的温馨和生活的气息。色彩鲜艳，细节丰富，4K高清画质，让人感受到家的温暖。

我搬出了Runway分享的视频提示语公式来作质量对比：

[镜头语言]+[光影]+[主体（主体描述）]+[主体运动]+[场景（场景描述）]+[情绪/氛围/风格]

该有的元素都有了，看来提示语工作可以安心交给它。用清言生成了上百个提示语后，我和阿汤一人一句直接开测！

（下述文章中的测试案例包括了我们个人自测和智谱官方demo视频，供大家对比参考）
由于文章能发的视频数量有限，所有的case我们都放到飞书了， 关注公众号在后台私信"清影"就能拿到

## 写实镜头

写实风格已经是目前 AI 生成视频测试的必测风格了。一般情况下，我会看一下写实风格中人物表情、动物动作以及景色中的光影变化等等效果的展现。

为了更清晰的向大家展现文生视频和图生视频的效果对比，这次测评，我们都会在每一种风格下，同时测试文生视频和图生视频的效果表现。

现在，我们一起来看看清影的功力！

### 文生人物

1、特写镜头，温暖的金色阳光，一位有着鲜艳红发和异想天开的绿叶皇冠的年轻女子，以柔和的敬畏表情凝视着镜头外，背景中是温暖的光线和跳舞的凌乱头发，氛围梦幻而温馨

   ![Young Woman Close-Up](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020541365.gif)

2、特写镜头，刺眼的红光照在一位老人的脸上，他饱经风霜的面庞充满恐惧和震惊，背景中是深邃的阴影和模糊的细节，氛围戏剧性而紧张
   
   ![Old Man Close-Up](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020619596.gif)

可以看到，人物在光影和动作幅度上的表现还可以，对情绪的展现还是稍微弱了一点，但目前来说AI表演做成这样还是可以拿得出手的。
图生人物

3、风吹动女孩的头发，女孩悲伤的看着前方
   
   ![Sad Girl with Wind](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020637024.gif)

4、女人眨眼睛，眼睛中有漂亮的光影流转
   
   ![Blinking Woman](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020658266.gif)

图生视频中，对于图片的想象和补充还可以，人物发丝飘动比较自然，眼皮的细节也描写的不错，但是较比文生视频而言，图生的动态效果就弱了一点。

### 文生动物

1、写实描绘，近距离，猎豹卧在地上睡觉，身体微微起伏
   
   ![Sleeping Cheetah](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020709792.gif)

2、两只小熊猫坐在竹林里吃苹果，超近景，纪实风格
   
   ![Red Pandas Eating](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020722174.gif)

对于写实风格的动物描绘很细节，猎豹耳朵一动一动的细节和熊猫憨态可掬的神情都画的不错，除了突然消失的苹果哈哈哈。

### 图生动物

1、一条鱼在缤纷的海底世界游来游去
   
   ![Fish in Underwater World](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020733440.gif)

2、一只可爱的小动物向前跳跳
   
   ![Fish in Underwater World](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020733440.gif)

图生视频对于模型的想象力还是有些限制，比如上面画的这个没有见过的生物，走起来路来的动作就会有点卡卡的，常见的鱼类游动的效果就会好很多，也会很细节，气泡什么的描绘的都很好。

### 文生风景

1、高角度镜头，正午的明亮阳光，城市天际线下的繁华街道，背景中有高楼大厦和川流不息的车辆，氛围忙碌而现代
   
   ![City Skyline](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020756190.gif)

2、中景镜头，明亮的日光下一块巨石以动态运动坠入湖中，背景中有波纹扩散和水花飞溅，氛围震撼而自然
   
   ![Rock Splash](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020818727.gif)

写实的城市风景对于楼梯玻璃的反光和交通车流的展现都还不错，石头落入水后翻起水花的动态表现也很真实，看来写实风景确实是强项。

### 图生风景

1、男人慢慢向前走，远处的太阳逐渐升起
   
   ![Man Walking with Sunrise](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020832041.gif)

2、太阳缓缓升起，日出，延时摄影
   
   ![Time-Lapse Sunrise](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020857531.gif)

图生视频对于风景中的人物动作处理的还很日然，而且能和图中的草地有交互，即使是人物腿部的草也没有与人物融成一坨，下图对于延时摄影的展现也还可以，就是树木的分层感有一点明显。

总结：整体来说，智谱清影这次在写实风格上的展现是符合我们的预期的，味儿很正，而且对于自然语言的理解还不错，一遍两遍就能得到不错的动态效果，同时文生与图生的对比也和目前普遍结论一致，同样也是文生动态大于图生动态。

## 动画风格

动画风格也是和写实风格对比的必测风格！这次也是对日常使用频次较高的皮克斯风格和经典2D等动画类型进行了效果测试。

### 文生人物

1、特写镜头，夜晚的柔和灯光，一个卡通小女孩在她的卧室里画画，背景中有玩具和书籍，氛围温馨而充满童趣，日常生活动漫风格。
   
   ![Cartoon Girl Drawing](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020941260.gif)

### 图生人物

1、女人惊恐的表情
   
   ![Frightened Woman](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818020951221.gif)

动画风格对于人物的展现有点出乎我的意料，首先是日常动画风格是比较偏向儿童绘本的2D动画，这个应该可以给更加清晰的风格限定词效果会更好。然后图生视频对于人物动态的展现会比预期要夸张很多，但是人物情绪展现的很好，真的有被惊恐到。

### 文生动物

1、动画场景，展示一个粉色的毛绒绒的小怪物抱着一块很大的芝士在吃，3d风格，需要注重画面的细节，小怪物的神情充满喜悦，表现出顽皮天真的样子。温暖的颜色和氛围的灯光
   
   ![Fluffy Monster with Cheese](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021002891.gif)

2、蘑菇变成小熊
   
   ![Mushroom to Bear](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021002891-20240818021014146.gif)

### 图生动物

1、一只小猫摇摇尾巴站起来走远
   
   ![Cat Walking Away](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021028158.gif)

智谱这次对于动画风格的各种动物的展现也很不错，动物拟人说话的神态和蘑菇到小熊逐渐演变的过程都是很自然的。图生视频中对于猫咪动作转换也比较自然，动作和背景都没崩。

### 文生风景

1、高角度镜头，夜晚的星空下，一个魔法小镇的全景，背景中有点点星光和灯火通明的房屋，氛围梦幻而神秘，幻想动漫风格
   
   ![Magical Town at Night](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021040206.gif)

2、广角镜头，正午的阳光，一片充满奇幻色彩的花园，背景中有各种奇花异草和小精灵，氛围绚丽而奇妙，皮克斯风格
   
   ![Fantasy Garden](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021051262.gif)

### 图生风景

1、风吹过，有鸟飞过，天空中云朵飘过
   
   ![Windy Sky with Birds](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021059942.gif)

2、微风吹的池塘中的荷花轻轻晃动
   
   ![Lotus Flowers Swaying](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021111553.gif)

在动画风格中对于风景的展现，个人更喜欢图生大于文生多一点，可能是因为图片可以自己控制住想要的风格。虽然第一张图对于鸟的展现差了一些，但是第二张荷花微微晃动和水波感展现的都很好。

总结：动画风格中，文生视频对于想要的具体风格需要在提示语中限定的很严格才能得到想要的动画效果，对比写实类，动画类型确实更推荐图生视频多一点。

## 科幻玄幻

科幻与玄幻风格，是AI视频兴起时涌现最多作品的风格，也是目前大多数AI生成视频工具生成效果比较优秀的风格之一，现在测试这种风格，主要看其对光影和变换特效的展现能力。

### 文生效果

1、中景镜头，未来都市的霓虹灯光，一位穿着机械装甲的战士在高楼间飞跃，背景中有悬浮的车辆和光速列车，氛围紧张而充满科技感
   
   ![Futuristic City Warrior](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021127806.gif)

2、低角度向上推进，缓缓抬头，冰山上突然出现一条恶龙，然后恶龙发现你，冲向你。好莱坞电影风
   
   ![Astronaut Playing Guitar](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021148649.gif)

### 图生效果

1、An astronaut plays guitar in space, weightlessness, Christopher Nolan style
   
   ![Astronaut Playing Guitar](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021148649.gif)

2、无提示词、赛博美女
   
   ![Cyberpunk Beauty](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021201038.gif)

3、一个法师正在海浪中施展法术，宝石将海水都聚集过来，打开了一道魔法传送门
   
   ![Mage in Waves](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021218646.gif)

总结：科幻和玄幻风格就不多说了，更大视频工具测试都测累了，整体智谱清影对于动作特效的展现还是很棒的，尤其最后这个法师在海上展现魔法这一段，大家可以用相应的提示词试一试，效果还是蛮惊艳的，都能做出来这样的，以后啥影视片还用专门做特效，都上AI就行了（我都不想说那些个仙侠剧……）

## 多人场景镜头

多人大场面的展现往往是AI生成视频的一个劣势。

很多时候想要用AI实现多人场景，会出现人物重叠变形，甚至无法生成出对应画面的情况。这次我们用清影的文生视频来测试一下。

1、广角镜头，黎明时分的战场上，两军对峙，背景中有战旗飘扬和战鼓雷鸣，氛围紧张而庄严
   
   ![Battlefield at Dawn](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021228921.gif)

2、低角度镜头，夜晚的冷光下，一场中世纪城堡攻防战，背景中有火箭飞舞和攻城器械，氛围紧张而激烈
   
   ![Castle Siege at Night](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021239577.gif)

总结：很熟悉，这些场面仿佛在哪些电视剧里见过，就是开篇介绍历史背景的时候……这次对于多人场景的表现也出乎我的意料，很多人在一起，但是没有叠叠乐，也没有融成一坨，如果出了超分，效果肯定更赞。

## 经典名场面

除了上面我们测试的一些镜头之外，还有最近大家都喜欢玩的一种AI视频风格，就是对于经典影视剧的名场面进行玩梗的生成。这种主要是利用了图生视频功能，我们用清影也玩两个试试看。

1、唐僧戴墨镜

   ![Tang Sanzang Sunglasses](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021250477.gif)

2、甄嬛和眉庄贴贴
   
   ![Zhen Huan Hugging](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021259528.gif)

3、名画动起来
   
   ![Famous Painting Animated](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/640-20240818021319301.gif)

## 写在最后

文章有限，没办法都放出来给大家看。大家想看全部的视频与对应提示词的话，关注我公众号后，后台私信"清影"就可以拿飞书文档了。

上百个镜头测试下来， 我觉得清影是一次水到渠成的更新。

从ChatGLM到GLM-4，智谱只用了10个月， 

他们不是在开源，就是在开源的路上，Build in Pubilc需要很大的勇气，但他们似乎从来不担心。

AI视频提示语，比起AI生图还有一段不小的差距，写多了画面元素混乱，漏写了会导致模型天马行空，这种不可控性，也是AI生成视频被嘲笑为抽卡的原因之一。

作为第一版，清影有缺点，

但我们不妨期待这个AI界的实诚孩子，在GLM-4的加持下，超越Sora需要多少时间。

哦，对了，

弄清影是描述月光的，

起舞弄清影，何似在人间🌛