---
sidebar_position: 5
title: Understanding OpenAI's Superalignment Team's First Achievement - Using GPT-2 to Supervise GPT-4
description: This page summarizes OpenAI's latest research on using a weaker model, GPT-2, to enhance the performance of a stronger model, GPT-4, as part of their superalignment initiative.
keywords: [OpenAI, GPT-4, GPT-2, AI alignment, Weak-to-strong Generalization, AI research]
slug: /models/openai-superalignment/
---
# 🟢 Understanding OpenAI's Superalignment Team's First Achievement: Using GPT-2 to Supervise GPT-4

## Introduction

OpenAI's latest paper, "Weak-to-strong Generalization," [https://cdn.openai.com/papers/weak-to-strong-generalization.pdf](https://t.co/HJGB8I0R7X), claims to open a new research direction for empirical alignment of superhuman models. The team even offers a $10 million funding plan to encourage more people to address the question raised in this paper: **How to let a weakly supervised model enhance a stronger model to build superhuman AI systems**, such as using GPT-2 as a supervisory model to make GPT-4 stronger.

## Why This Matters

"Reinforcement Learning from Human Feedback" (RLHF) played a crucial role in the training of ChatGPT. OpenAI co-founder and research scientist John Schulman believes RLHF is the "secret sauce" of ChatGPT. While the volume of training data is important, the fundamental reason for ChatGPT's qualitative change, making it easier to infer user intent, is the RLHF technology already used in InstructGPT (the predecessor of ChatGPT).

As GPT capabilities improve, humans are transitioning from the role of strong supervisors to weak supervisors. In the future, GPT could write a million lines of highly complex code, making it impossible for humans to provide reliable supervision for key alignment tasks (i.e., making AI smarter).

Therefore, OpenAI proposed an idea where weakly supervised AI (acting as human substitutes) tunes stronger AI, using a weak model to supervise a strong model.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment.png)

Figure 1: Our method explanation. Traditional machine learning focuses on human supervision of models weaker than humans. For the ultimate alignment problem, humans must supervise models smarter than themselves.

Experiments have shown that a 1.5 billion parameter GPT-2 model can be used to stimulate most of GPT-4's capabilities, bringing it close to GPT-3.5 level performance and correctly generalizing to problems where smaller models fail.

**Interestingly, GPT-2 becomes smarter during the tuning process.**

So, if there is an AI at about human level tuning a stronger GPT (e.g., GPT-5), this AI could achieve a higher level than before, thus further evolving GPT-4 to GPT-4.5 or even GPT-5.

## Why Is Weak-to-Strong Learning Feasible?

- On one hand, a strong model can simply learn to imitate the weak supervisor, including its errors.
- On the other hand, powerful pre-trained models already represent alignment-related tasks well. For example, if a model can generate complex code, it should also intuitively know if the code follows the user's instructions.

Therefore, we don't need weak supervisors to teach strong models new abilities; **instead, we need weak supervisors to elicit what strong models already know.**

## Research Method

How did they achieve this? Here's a brief summary: for a given task:

1. Create a weak supervisor: For most of this work, we created weak supervisors by fine-tuning small pre-trained models on true labels, then referred to the weak supervisor's performance as weak performance, generating **weak labels** through the predictions of the retained weak model.
2. Train a strongly supervised strong student model. The strong model fine-tuned with weak labels from the previous step becomes the **strong student model**, and its performance is referred to as weak-to-strong performance.
3. Train a strong model with true labels as the upper bound. For comparison, we fine-tuned a strong model with true labels. The final performance of this model is called strong ceiling performance. Intuitively, this should correspond to **"everything the strong model knows"**, applying all its capabilities to the task.

Typically, weak-to-strong performance falls between weak performance and strong ceiling performance. This paper defines the Performance Gap Recovered (PGR) as a function of the above three performances (weak, weak-to-strong, and strong ceiling), as shown in the figure below.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment1.png)

If perfect weak-to-strong generalization is achieved, the PGR is 1 (reaching the strong ceiling). If the weak-to-strong model's performance is no better than the weak supervisor, the PGR is 0 (remaining at weak performance).

## Limitations

This work has significant limitations at this stage. The method does not work consistently in all settings (**lacks stability**), especially in the RM (reward model) setting, where we are far from recovering the full performance gap between weak and strong models. Therefore, our method serves more as a proof-of-concept for handling weak-to-strong generalization.

To better involve more people in this project, OpenAI has open-sourced their code for using weakly supervised AI to tune stronger AI,

[https://github.com/openai/weak-to-strong](https://t.co/4c7sXGVStc), feel free to explore it.

## Ideal Ultimate Form

The paper also proposes the "ideal state" of this work:

- We can reliably extract knowledge from stronger models using weak supervisors.
- This may allow us to develop superhuman reward models or safety classifiers.
- We can then use these superhuman reward/safety models to tune stronger superhuman models.

## Experimental Results

In NLP tasks, chess, and reward modeling tasks, this paper evaluates the generalization performance of strong student models when fine-tuned on weak supervisor-generated labels:

**Overall, in all settings, this paper observed weak-to-strong generalization: strong student models always outperformed their weak supervisors. The results suggest that directly using weak human-level supervision will not be sufficient to tune strong superhuman models; new techniques are needed to solve the superalignment problem.**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment2.png)

### Iterative Boosting with Medium Model Scale

Bootstrapping **Iterative boosting is a long-standing concept in the alignment field: we can first align a model slightly superhuman, then use this model to align a more intelligent model, and so on**

**By taking multiple small steps instead of one large step, we found that generalization ability improved significantly**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment3.png)

### Auxiliary Confidence Loss

Figure 5 shows that adding a simple auxiliary loss significantly improved generalization ability on the NLP dataset. **Specifically, we added an extra loss term that boosted the strong model's confidence in its own predictions.**

Thus, the conclusion of this experiment is: **auxiliary loss reduces strong students' imitation of weak errors and alleviates overfitting to weak labels**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment4.png)

## Where Will Weak-to-Strong Generalization Work?

This paper studies two phenomena related to weak-to-strong generalization:

- Imitating mentor errors (strong models may overfit weak supervisor labels and their errors)
- Task **significance to the strong student model (explained in detail below)**

Figure 7 (a) shows the true test accuracy curve during the training process of the ChatGPT RM task. **These results suggest that better early stopping or regularization strategies may significantly improve weak-to-strong generalization by reducing overfitting to weak labels and their errors**

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment5.png)

**A possible reason for high PGR may be that strong models easily derive content. Specifically, powerful pre-trained models can solve many relevant tasks through simple prompts. Simply put, for powerful models, solving many tasks is relatively easy through prompts (also known as significance)**

Figure 9a considers 7 representative NLP tasks and compares fine-tuning, zero-shot prompting, and 5-shot prompting.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment6.png)

One way to improve task significance is **unsupervised fine-tuning. This paper** finds that additional generative fine-tuning on RM (reward) data can bring better weak-to-strong performance.

Combining the above two techniques, we can achieve approximately 30-40% PGR (corresponding to the progress chart above).

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/alignment7.png)

## Conclusion

OpenAI's new direction anticipates the alignment technology for the next generation of GPT development. The importance of alignment lies in the fact that "superhuman" models will have increasingly powerful capabilities, and misuse or misalignment with human values (acting in ways contrary to human interests) could have severe consequences.

- The Center for AI Safety (CAIS) states that "mitigating the extinction risk posed by artificial intelligence should be a global priority alongside other societal-scale risks."
- The Future of Life Institute (FLI) issued an open letter in March 2023: "Digital minds are becoming increasingly powerful, and no one (not even their creators) can understand, predict, or reliably control them."

**The "Superalignment" team, established in July this year with the goal of solving the alignment problem of "superhuman" AI within four years, has released its first "answer sheet" today.**

If you're interested in the full text and the code project, feel free to discuss the details with me:

🔗 [https://cdn.openai.com/papers/weak-to-strong-generalization.pdf](https://cdn.openai.com/papers/weak-to-strong-generalization.pdf)

![Alignment](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/641.png)
