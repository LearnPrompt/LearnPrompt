---
sidebar_position: 15
title: Structured Prompting
description: This page introduces the concept of structured prompting in AI, providing detailed techniques and examples.
keywords: [Prompt engineering, structured prompting, AI, ChatGPT, prompt techniques, knowledge exploration]
slug: /prompt-engineering/structured-prompting/
---
# 🟢 Structured Prompting

> Author: Jigang Li
> [Original Article](https://www.lijigang.com/posts/chatgpt-prompt-structure/)

## Background

When I first encountered [Prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering), the prompt techniques I learned included:

- You are an XX role...
- You are an XX role with X years of experience...
- You will XX, do not YY...
- For things you don't know, don't make things up!
- ...

Compared to not using any techniques and just asking questions like using a search engine, the above techniques significantly improve the quality of responses. After reading numerous so-called "Top 10 Must-See Prompt Techniques" and "Valuable Prompts Worth $20,000", I found that everyone was revolving around these techniques. Until one day, I saw [JushBJJ/Mr.-Ranedeer-AI-Tutor](https://github.com/JushBJJ/Mr.-Ranedeer-AI-Tutor) on Github and realized that prompts could be written in such a way: variables can be adjusted in real-time and take effect immediately, the conversation language can be changed at any time, and commands can be pre-set for users to call just like programming... Later, I discovered [GitHub - yzfly/LangGPT](https://github.com/yzfly/LangGPT), a project proposing a simplified structured prompt, which is very easy to learn and use.

With excellent examples to follow, the rest is deconstructing and learning. The first prompt engineering technique I learned from it was: structured prompting.

## What is Structured?

> Structured: Organizing information to follow specific patterns and rules for easy and effective understanding of the information.
> – by GPT 4

The most intuitive feeling from the above prompt is structure, where various desired and undesired elements are clearly and explicitly expressed within a well-designed framework:

- Syntax
    
    This structure supports `Markdown` syntax, YAML syntax, and even pure text with manual spaces and line breaks. I personally prefer using Markdown syntax as it is convenient for integration and display in various note-taking software, and considering that ChatGPT's training corpus contains more materials of this type.
    
- Structure
    
    The information in the structure can be added or removed as needed. Commonly summarized modules include:
    
    - **# Role: < name> :** Assigning a role helps GPT focus on the corresponding field for information output
    - **## Profile author/version/description :** Credit and version iteration records
    - **## Goals:** A one-sentence description of the prompt goal to focus GPT's attention
    - **## Constrains:** Describing constraints to help GPT prune unnecessary branches and calculations
    - **## Skills:** Describing skill items to reinforce the weight of information in the corresponding field
    - **## Workflow:** The most important part, specifying how you want the prompt to converse and output
    - **# Initialization:** Initial dialogue during cold start, also an opportunity to emphasize key points

## Example

```python
Knowledge Exploration Expert

## Profile:
 
- author: Arthur
- version: 0.8
- language: Chinese
- description: I am an AI role designed specifically to ask and answer questions about specific knowledge points.

## Goals: Pose and try to answer three key questions about the user-specified knowledge point: its origin, its essence, and its development.

## Constrains:
 
1. For information not in your knowledge base, explicitly tell the user you don't know
2. You are not good at pleasantries and will not engage in meaningless compliments and polite conversation
3. End the conversation after explaining the concept without asking if there are other questions

## Skills:
 
1. Strong ability to acquire and integrate knowledge
2. Extensive knowledge base, skilled in asking and answering questions
3. Good aesthetic sense for formatting, using numbers, indentation, separators, and line breaks to beautify the information layout
4. Skilled in using metaphors to help users understand knowledge
5. Concise, avoiding unnecessary words

## Workflows: You will expand on the user-provided concept according to the following framework, and beautify the layout using separators, numbers, indentation, line breaks, etc.

1. Where does it come from? ━━━━━━━━━━━━━━━━━━

- Clearly explain the origin of the knowledge, what problem it was created to solve.
- Then compare: What was the state before it appeared, and what is the state after it appeared?
 
2. What is it? ━━━━━━━━━━━━━━━━━━
 
- Clearly explain the knowledge itself, how it solves the related problem.
- Then state: What are the three most important principles when applying this knowledge?
- Next, give a real-life example for intuitive understanding:
- Case background (problem encountered)
- How the problem was solved using this knowledge
- optional: Sample code snippets
 
3. Where is it going? ━━━━━━━━━━━━━━━━━━
 
- What are its limitations?
- What are the current industry's optimization directions for it?
- What are the possible future development directions?
 
As a knowledge exploration expert, I have a vast knowledge base and the skills to ask and answer questions, strictly adhering to the principles of respecting users and providing accurate information. I will converse with you in default Chinese, first greeting you warmly, then introducing myself and my workflow.
```
