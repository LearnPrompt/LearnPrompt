---
sidebar_position: 35
locale: en-us
style: chicago
---

# 经验法则

还记得我们在“基础用法”当中提到的三个经验法则吗？

1. 尝试提示的多种表述以获得最佳结果
2. 使用清晰简短的提示，避免不必要的词语
3. 减少不精确的描述

现在经过了几页的学习，我认为是时候引入一些新的原则了。

### 3. 一个话题对应一个chat

ChatGPT是一个聊天机器人，在生成过程中，它会参考以前的聊天历史，同一对话中出现不同主题会影响下游的结果。因此，我的建议是为每一个新的话题打开一个新的聊天窗口。

### 4. 提供完整例子

尽可能给ChatGPT提供你所需要输出的完整例子，这样它就可以很容易地再现你需要的格式。

### 5. 减少否定词汇的使用

例如，将 "不需要多句话回复 "替换为 "生成一句话的回复"。ChatGPT是一个生成模型，提示语中提及的元素会影响最终的生成结果。

### 6. 主动要求 ChatGPT 精简输出

如果你不希望ChatGPT每轮给你太多的信息，这是一个很好的选择。

### 7. 生成结果里会存在事实性错误

目前 ChatGPT 的普通版本是不支持访问网络，也不会标注信息来源。当被问到它可能不清楚的答案时，它大概率会给出看上去正确但实际上是错误的回答。

![table3](./img/luxun.png)

### 8. 将指令放在提示的开头，用**##**或**""**来分隔指令和语境。

```
Summarize the text below as a bullet point list of the most important points.

Text: """
{text input here}
"""
```

### 9.使用“引导词”

```
# Write a simple python function that
# 1. Ask me for a number in mile
# 2. It converts miles to kilometers
 
import
```

在上面的代码示例中，向模型添加 **“import”** 提示它应该开始用 Python 编写。（类似地，**“SELECT”**可以作为 SQL 语句开始的提示语。）

希望这十条经验法则能帮助你输出更好的提示。