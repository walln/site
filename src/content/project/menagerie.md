---
title: Menagerie
description: A menagerie of deep learning models and techniques.
publishDate: 2024-05-02 CST
tags: ["machine-learning", "llms", "performance", "python"]
updatedDate: 2024-05-31 CST
---

## What is Menagerie?

[Menagerie](https://github.com/walln/menagerie) is a collection of models and techniques I find interesting. It is similar to [scratch](/projects/scratch) but more focused on quick exploration rather than well designed and readable implementations.  The concepts in Menagerie are typically more niche in application and are not as focused on polish, these are experimental artifacts.

## Current Exhibits

Projects that are currently within the Menagerie span a wide range and some are still in progress.

### Sparse Autoencoders for Mechanistic Interpretability

This is an ongoing project to train SAEs to identify circuits inside large models. The training is ongoing and inside this exhibit is a set of tools to generate activation datasets on any given PyTorch model and hidden layer. I am currently stabilizing this training and activation collection framework working with a small GPT-2 model before broadening the model space.

Going forward I intend to do more experiments comparing the activations across layers, and the activations across different architectures. I personally find the idea of exploring how SSMs ([State Space Models](https://huggingface.co/blog/lbourdois/get-on-the-ssm-train)) behave. I could also see the experiments across the architectures and layers shining more light on how to perform effective interventions similarly to [Representation Engineering](https://github.com/andyzoujm/representation-engineering) and [Control Vectors](https://github.com/vgel/repeng).

The tooling being built by the Lens projects like [SAELens](https://github.com/jbloomAus/SAELens) and [TransformerLens](https://github.com/TransformerLensOrg/TransformerLens) and extensions such as [Abliterator](https://github.com/FailSpy/abliterator) are really interesting. I believe that a more holistic and fully featured tool should exist to leverage interventions and activation augmentation. Visualization is definitely a place for growth. I will likely explore a full toolkit would look like.

### QLoRA SFT Text-2-SQL

This exhibit uses QLoRA Supervised Fine Tuning on gemma-2b (chat tuned on OpenHermes) for contextual SQL-qa. This is an ongoing experiment as I am working on dynamic statistics retrieval in [hooper](/projects/hooper). I also would like to build a better evaluation suite as text-2-sql has interesting evaluation dynamics as it can be statically verified for syntactic correctness and evaluated for logical correctness fairly easily.

### Optimized ResNet training

This is an extremely optimized ResNet training implementation using PyTorch. I am still working on this as I want to try to compete with the MLPerf record. 

### Distributed pretraining for code completion

In this exhibit I experiment with the new PyTorch Lightning `Fabric` api by pretraining a tiny LLM on the CodeParrot dataset. I am too GPU poor to fully train this model but from a *few* steps it shows stable training dynamics.

## Going Forward - What am I working on?

Menagerie is a playground for me and I am experimenting with many things. Lately I have been working on extending Llama 3's context length (why was it so small at release Meta???) and model merging. I want to release a better version of some of my VLM experiments with something that could be competitive with some of the top VLMs. I also have been working on Mechanistic Interpretability because its a great research direction for the GPU-poor and it is very important for AI safety. There is surprisingly little public research on MI for multimodal llms. This is something I have tinkered with and will likely dive into much further.
