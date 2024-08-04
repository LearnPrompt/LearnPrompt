---
sidebar_position: 10
title: 12 Tuning Strategies for RAG Applications
description: This page provides a comprehensive guide on 12 tuning strategies to optimize the performance of Retrieval-Augmented Generation (RAG) applications.
keywords: [RAG, Retrieval-Augmented Generation, tuning strategies, machine learning, data science, performance optimization]
slug: /rag-for-llms/rag-tuning-strategies/
---

# 🟡  12 Tuning Strategies for RAG Applications

> 😀 [Original Article](https://towardsdatascience.com/a-guide-on-12-tuning-strategies-for-production-ready-rag-applications-7ca646833439#a5e2)
> Author: Leonie Monigatti
> Translated by: Xin

Data science is an experimental science. It starts with the "No Free Lunch Theorem," which states that there is no one-size-fits-all algorithm for every problem. Therefore, data scientists use [experiment tracking systems](https://medium.com/@iamleonie/intro-to-mlops-experiment-tracking-for-machine-learning-858e432bd133) to help tune their machine learning projects' hyperparameters for optimal performance.

This article examines a Retrieval-Augmented Generation (RAG) from a data scientist's perspective and discusses some potential "hyperparameters"—you can adjust to improve the performance of RAG workflows. Similar to experiments in deep learning, data augmentation techniques are not hyperparameters but rather knobs you can tweak and experiment with. This article will also cover different strategies you can apply that are not strictly hyperparameters.

The article lists the following "hyperparameters" for the RAG workflow according to its relevant stages. In the **data indexing** stage, you can achieve performance improvements through:

1. Data cleaning
2. Chunking
3. Embedding models
4. Metadata
5. Multiple indices
6. Indexing algorithms

In the **inference stage** (retrieval and generation), you can consider adjusting:

1. Query transformation
2. Retrieval parameters
3. Advanced retrieval strategies
4. Reranking models
5. Language model fine-tuning
6. Prompt engineering

Please note that the use case in this article is based on text-based RAG applications. Different factors might need to be considered for multimodal RAG applications.

## Data Indexing

The data indexing stage is the preparation step for building RAG, similar to data cleaning and preprocessing in machine learning. The data indexing stage usually includes the following steps:

1. **Data collection**
2. **Chunking:** Splitting large amounts of data into smaller chunks to handle and manage data more efficiently.
3. **Vectorization:** Using embedding models to convert each data chunk into vector representations, which helps in processing and analyzing text in subsequent retrieval and generation stages.
4. **Storage:** Storing the generated vectors and corresponding data chunks in a vector database.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/936bcbbc53dfb95e2a2e55ee5446adcb.webp "Data Indexing")

### Data Cleaning

Data quality plays a crucial role in RAG. Before proceeding with any of the following steps, ensure that your data meets the following standards:

- Clean: Apply some common data cleaning methods in natural language processing. For example, ensure all special characters are correctly encoded.
- Correct: Ensure information consistency and accuracy to avoid conflicting information that could confuse the language model.

### Chunking

Chunking documents is an important step in handling external knowledge sources in RAG, affecting performance. Chunking is a technique for generating logically related pieces of information, usually done by splitting long documents into sections (or combining small pieces into paragraphs).

**Chunking technique** affects chunking performance. For example, in LangChain, different text splitters split documents according to different logics, such as by character, token, etc. This depends on your data type. For example, if your input data is code, you might need a different chunking technique; if it's a Markdown file, you might need another technique.

**Chunk length** (chunk_size) also needs to be analyzed case by case: If your use case is Q&A, shorter, more specific chunks might be needed; if it's summarization, longer chunks might be needed. Additionally, if a chunk is too short, it might not contain enough context. On the other hand, if the chunk is too long, it might contain too much irrelevant information.

Moreover, consider introducing some additional context between chunks with a "sliding window" (overlap) to improve coherence.

### Embedding

The embedding model is the core of retrieval. The quality of embeddings directly impacts retrieval results. Generally, the higher the dimension of the generated embeddings, the higher the accuracy of the embeddings.

For alternative embedding models available, refer to the Massive Text Embedding Benchmark (MTEB) leaderboard, which covers 164 text embedding models (as of this writing).

While you can use general embedding models directly, in some cases, it might make sense to fine-tune the embedding model to fit specific use cases to avoid out-of-domain issues later [9]. According to experiments by LlamaIndex, fine-tuning embedding models can lead to a 5-10% improvement in retrieval evaluation metrics [2].

However, not all embedding models can be fine-tuned (e.g., OpenAI's text-embedding-ada-002 cannot be fine-tuned currently).

### Metadata

When storing vector embeddings in a vector database, some vector databases can store them with metadata (or non-vectorized data). Using metadata to annotate vector embeddings can post-process search results, such as metadata filtering [1, 3, 8, 9], or adding metadata like date, chapter, or subsection references.

### Multiple Indices

If metadata is insufficient to logically distinguish different types of context, consider using multiple indices [1, 9]. For example, you can use different indices for different types of documents. Note that you will need some index routing during retrieval [1, 9]. If you are interested in metadata and separate collections, you might also want to check out [native multitenancy](https://www.youtube.com/watch?v=KT2RFMTJKGs).

### Indexing Algorithms

To achieve fast similarity search in large-scale situations, vector databases and vector indexing libraries use Approximate Nearest Neighbor (ANN) instead of k-nearest neighbor (kNN). As the name suggests, ANN algorithms approximate the nearest neighbor, so they might be slightly less accurate than kNN algorithms.

There are many different ANN algorithms, such as Facebook Faiss (clustering), Spotify Annoy (trees), Google ScaNN (vector compression), and HNSWLIB (proximity graphs). These ANN algorithms typically have tunable parameters, such as ef, efConstruction, and maxConnections in HNSW [1].

Additionally, you can enable vector compression for the indexing algorithm. Using vector compression will lose some accuracy. However, you can optimize the choice and adjustment of compression algorithms according to the scenario.

In practice, the parameters of algorithms are usually adjusted by database research teams in benchmark experiments, and RAG system developers generally do not change them. But if you do want to try adjusting these parameters, I suggest starting with this article: [《**An Overview on RAG Evaluation**》](https://weaviate.io/blog/rag-evaluation?source=post_page-----7ca646833439--------------------------------#indexing-knobs)

## Inference Stage (Retrieval and Generation)

The main components of RAG are **retrieval** and **generation**. This section mainly discusses strategies to improve retrieval effectiveness (query transformation, retrieval parameters, advanced retrieval strategies, and reranking models). Because retrieval has a greater impact on results than generation. However, some generation strategies (LLM and prompt engineering) will also be briefly mentioned.

![](https://cdn.jsdelivr.net/gh/donttal/imgbed/img/df169d2835ef8cc082a4df513da05e74.webp)

In RAG, search queries used to retrieve additional context are also embedded into vector space, so the way queries are expressed affects search results. If your search queries do not yield satisfactory results, you can try some query transformation techniques [5, 8, 9], such as:

1. **Rephrasing:** Use a language model (LLM) to rephrase the query and then try again.
2. **Hypothetical Document Embeddings (HyDE):** Use a language model to generate hypothetical responses to the search query and use both for retrieval.
3. **Sub-queries:** Break down longer queries into multiple shorter queries.

### Retrieval Parameters

Retrieval is an important part of RAG. The first thing to consider is whether semantic search is sufficient for your use case or whether you want to use hybrid search.

In the case of hybrid search, you need to adjust the weighted aggregation of sparse and dense retrieval methods in hybrid search [1, 4, 9]. Therefore, adjusting the alpha parameter becomes crucial. (alpha is the parameter controlling the weight of semantic search, alpha=1 indicates purely semantic search, alpha=0 indicates keyword-based search)

Additionally, the number of retrieved results is important. The "number of contexts" retrieved will affect the "length of the context window" used (see the prompt engineering section). Also, if using a reranking model, consider how much context to input into the model (see the reranking model section).

Although the similarity metric for semantic retrieval can be set, it should be modified based on the embedding model used rather than unnecessary experimentation. For example, text-embedding-ada-002 supports cosine similarity, while multi-qa-MiniLM-l6-cos-v1 supports cosine similarity, dot product, and Euclidean distance.

### Advanced Retrieval Strategies

Technically, this section could become a standalone article. In this overview, we will keep it as concise as possible. If you want to delve into the following techniques, refer to this DeepLearning.AI course [**Building and Evaluating Advanced RAG Applications**](https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/?source=post_page-----7ca646833439--------------------------------).

The basic idea is that the chunks used for retrieval do not necessarily have to be the same as those used for generation. Ideally, retrieval would embed smaller chunks to retrieve larger contexts [7].

- **Sentence-window retrieval:** Not only retrieve relevant sentences but also retrieve the window before and after the sentences.
- **Auto-merging retrieval:** Documents are organized in a tree-like structure. When querying, smaller but related chunks can be merged into larger contexts.

### Reranking Models

Semantic search retrieves based on the semantic similarity between the context and the search query, but "most similar" does not necessarily mean "most relevant." Reranking models, such as Cohere's reranker, can eliminate irrelevant search results by scoring each retrieved context's relevance to the query [1, 9].

If using a reranking model, you may need to readjust the **number of search results** input to the reranker and how many reranked results you want to input into the LLM.

Like embedding models, you may want to fine-tune the reranking model based on your use case.

### Large Language Models

LLM is the core component for generating responses. Similar to embedding models, there are various LLMs to choose from based on your needs (e.g., open-source vs. proprietary models, inference costs, context length, etc. [1]).

Like embedding models or reranking models, you may want to fine-tune the LLM to fit specific use cases.

### Prompt Engineering

Prompts significantly impact LLM's generated results [1, 8, 9].

> Please answer the question based solely on the provided search results, without referring to other information!

> This is very important! Your response must be based on the provided search results. Please explain why your answer is based on the search results.

Additionally, using a few examples in the prompt can improve the quality of completions.

Context length is a parameter you should experiment with [1]. While increasing relevant context can improve RAG's performance, if relevant context is placed in the middle of too much context, you may encounter the "middle loss" [6] effect, where the LLM might not recognize the relevant context in the middle position.

## Summary

As more developers gain experience prototyping RAG workflows, discussing how to achieve the performance required for production in RAG workflows becomes more critical. This article outlines different "hyperparameters" and other parameters that can be adjusted during the RAG process:

This article covers strategies in the data indexing stage:

- Data cleaning: Ensure data is clean and correct.
- Chunking: Choose chunking techniques, chunk size (chunk_size), and chunk overlap (overlap).
- Embedding models: Choose embedding models, including dimensions, and whether to fine-tune.
- Metadata: Whether to use metadata and the choice of metadata.
- Multiple indices: Decide whether to use multiple indices for different datasets.
- Indexing algorithms: The choice and adjustment of ANN and vector compression algorithms can be adjusted, but typically not by RAG application developers.

In the inference stage (retrieval and generation), the strategies involve:

- Query transformation: Try rephrasing, HyDE, or sub-queries.
- Retrieval parameters: Choose search techniques (if enabling hybrid search, then alpha) and the number of search results retrieved.
- Advanced retrieval strategies: Whether to use advanced retrieval strategies, such as sentence-window or auto-merging retrieval.
- Reranking models: Whether to use reranking models, the choice of reranking models, the number of search results input to the reranker, and whether to fine-tune the reranking model.
- LLMs: The choice of LLM and whether to fine-tune it.
- Prompt engineering: Try different phrasings and a few examples.

### References

[1] [Connor Shorten](https://medium.com/u/59216259c525?source=post_page-----7ca646833439--------------------------------) and [Erika Cardenas](https://medium.com/u/91b27bdf28df?source=post_page-----7ca646833439--------------------------------) (2023). Weaviate Blog. [An Overview on RAG Evaluation](https://weaviate.io/blog/rag-evaluation) (accessed Nov. 27, 2023)

[2] [Jerry Liu](https://medium.com/u/e76da1c45ef7?source=post_page-----7ca646833439--------------------------------) (2023). LlamaIndex Blog. [Fine-Tuning Embeddings for RAG with Synthetic Data](https://blog.llamaindex.ai/fine-tuning-embeddings-for-rag-with-synthetic-data-e534409a3971) (accessed Nov. 28, 2023)

[3] LlamaIndex Documentation (2023). [Building Performant RAG Applications for Production](https://gpt-index.readthedocs.io/en/stable/optimizing/production_rag.html) (accessed Nov. 28, 2023)

[4] Voyage AI (2023). [Embeddings Drive the Quality of RAG: A Case Study of Chat.LangChain](https://blog.voyageai.com/2023/10/29/a-case-study-of-chat-langchain/) (accessed Dec. 5, 2023)

[5] LlamaIndex Documentation (2023). [Query Transformations](https://gpt-index.readthedocs.io/en/v0.6.9/how_to/query/query_transformations.html) (accessed Nov. 28, 2023)

[6] Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2023). Lost in the middle: How language models use long contexts. *arXiv preprint arXiv:2307.03172*.

[7] DeepLearning.AI (2023). [Building and Evaluating Advanced RAG Applications](https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/) (accessed Dec 4, 2023)

[8] [Ahmed Besbes](https://medium.com/u/adc8ea174c69?source=post_page-----7ca646833439--------------------------------) (2023). Towards Data Science. [Why Your RAG Is Not Reliable in a Production Environment](https://towardsdatascience.com/why-your-rag-is-not-reliable-in-a-production-environment-9e6a73b3eddb) (accessed Nov. 27, 2023)

[9] [Matt Ambrogi](https://medium.com/u/1e23ad8f92c5?source=post_page-----7ca646833439--------------------------------) (2023). Towards Data Science. [10 Ways to Improve the Performance of Retrieval Augmented Generation Systems](https://towardsdatascience.com/10-ways-to-improve-the-performance-of-retrieval-augmented-generation-systems-5fa2cee7cd5c) (accessed Nov. 27, 2023)

### Image Credits

Unless otherwise noted, all images were created by the original author.
