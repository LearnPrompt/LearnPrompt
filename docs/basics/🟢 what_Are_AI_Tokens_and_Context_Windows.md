---
sidebar_position: 10
title: What are AI Tokens and Context Windows (and Why You Should Care)?
description: An introduction to AI tokens and context windows in large language models, explaining their significance and how they impact AI performance.
keywords: [AI tokens, context windows, large language models, GPT, AI, artificial intelligence, OpenAI, language processing]
slug: /basics/what-are-ai-tokens-and-context-windows/
---
# 🟢 What Are AI Tokens and Context Windows (And Why Should You Care)?

> They're fundamental to how Large Language Models (LLMs) work.

If you use AI applications like ChatGPT or other LLM (Large Language Model) tools enough, you will eventually hear terms like token and context window. It often shows up when you copy/paste a large amount of text into the prompt input box and you get an error that you’re exceeded the number of allowed tokens and it ever-so-briefly messes up what might have been a pretty good day.

What the heck is a token anyways?

Technically, it’s a sequence of textual characters. When LLMs (Large Language Models) do their thing, they break up text into tokens. Tokens are almost words (and also punctuation and other symbols).

Example, let’s take the text: I don’t like flying.

Here’s how GPT breaks this up into tokens:

![Tokenization example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/637da0d52eeab2dc6b91aa81bb684666.jpg)

You can play with it yourself using [OpenAI’s tokenizing utility](https://platform.openai.com/tokenizer).

So, a token is almost a word, but not quite. Statistically, it’s about ¾ths of a word.

Now, if you’re like me, you might be wondering: Why make up this whole other thing that’s ¾ths of a word? Why not just, you know, use words.

It’s a good question, but the answer can be a deep rabbit whole. Here’s a simple explanation:

LLMs generally work with numeric representations of things (including text). It’s much more efficient that way. So, text gets converted into vectors (a series of numbers). To do this, the models have to map words to numbers. But, assigning each possible word its own number is kind of inefficient (lots of possibilities). You can reduce the number of possible things by taking parts of words (or other sequences) and making them a token. In our example the word don’t becomes don + ‘t (two tokens).

Let’s say we have four words: can, can’t, don, don’t. Those are four possibilities. But, if we treat ‘t as its own token, we only need three: can, don and ‘t. 3 instead of 4. We saved 25%!

Anyways, it’s more complicated than that, and there are other reasons for tokens (over words).

So, why should you care? Mostly because tokens are the standard unit of measure in LLM Land (which sadly is nothing like La La Land). But also because the limits of context windows are usually stated in tokens.

Different models support context windows with different token limits. Way, way back in Nov 2023 when GPT-3 was all the rage, the limit was about 4k tokens. Then we got increases to 8k, 32k and even more tokens. Claude (from Anthropic) has a context window of up to 200k tokens. There are rumors that Google’s latest Gemini model supports a meeelion tokens.

![Context window illustration](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/73a40a610062d4e17372ec54c65fc03e.jpg)

Let’s take a step back.

What the heck is a context window?

## 理解上下文窗口

Alright, so now that we sort of know what a token is, let’s talk about context windows.

The context window is what the LLM uses to keep track of the input prompt (what you enter) and the output (generated text).

![Context window example](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/a6dafd38483c9cd4d9f09b71d4dacb9c.jpg)

LLMs generally have a limit, stated in tokens, as to how big the context window is. Generally, the larger the context window, the better, because the LLM can process more “context” about the work it is trying to do.

If the context window were super short, like only a single sentence, you wouldn’t be able to provide much context to the LLM, which then limits the quality of the output. With larger context, you can pass pages and pages of background information and instructions.

## The Murky Middle Problem

We’re moving to a world of larger and larger context windows. Big enough that you can pass an entire book’s worth of data/knowledge when invoking an LLM.

But, not all LLMs are created equal and many struggle with truly understanding all of the context, in detail, when there are a bunch of tokens.

Let’s take an example. Let’s say we were going to pass the entirety of the book “Les Miserables'“ (my favorite book) to an LLM and then ask questions. That’s over 600,000 tokens (545,000+ words). A problem LLMs often run into is that they sometimes gloss over some of the finer details in a large body of text. Often, that’s OK, they’re just trying to get the gist of things. But if you had a prompt that specifically needed to reference a tiny portion of the text, it’s possible that the LLM just fails to pick up on that.

But, there’s good news.

As is usually the case with AI, things are getting better. Recently, Google launched the latest version of their Gemini model which does a much better job and mostly avoids the murky middle problem. My guess is that OpenAI, Anthropic and the other LLM providers are not far behind.

# Context Windows and Retrieval Augmented Generation（RAG）

Where context windows (and their size limits) come into play is when you want to “teach” the LLM a bunch of stuff that’s particular to your situation and that wasn’t part of it’s original training data.

For example, let’s say you had 100,000 emails or documents that you wanted the LLM to understand and use when you ask it questions. This is data the LLM didn’t get trained on. The problem is that given the sheer magnitude of that content, it doesn’t fit into most LLMs’ context windows today.

A common approach to solving this is implementing RAG (Retrieval Augmented Generation).

But, we’re going to save that for the next exciting episode of The Mere Mortal’s Guide to AI.

Stay tuned.