---
title: Menagerie
description: A menagerie of deep learning models and techniques.
publishDate: 2024-05-02 CST
tags: ["machine-learning", "llms", "performance", "python"]
updatedDate: 2024-05-31 CST
---

## What is Menagerie?

[Menagerie](https://github.com/walln/menagerie) is a collection of models and techniques I find interesting. It is similar to [scratch](/projects/scratch) but more focused on quick exploration rather than well designed and readable implementations. 

## Current Exhibits

- Sparse Autoencoders for Mechanistic Interpretability. An ongoing project to train SAEs to identify circuits inside large models. The training is ongoing and inside this exhibit is a set of tools to generate activation datasets on any given PyTorch model and hidden layer. Going forward I intend to do more experiments comparing the activations across layers, and the activations across different architectures. I personally find the idea of exploring how SSMs ([State Space Models](https://huggingface.co/blog/lbourdois/get-on-the-ssm-train)) behave. I could also see the experiments across the architectures and layers shining more light on how to perform effective interventions similarly to [Representation Engineering](https://github.com/andyzoujm/representation-engineering) and [Control Vectors](https://github.com/vgel/repeng).
- QLoRA Supervised Fine Tuning of gemma-2b (chat tuned on OpenHermes) for contextual SQL-qa. This is an ongoing experiment as I am working on dynamic statistics retrieval in [hooper](/projects/hooper).
- An extremely optimized ResNet training implementation using PyTorch. I am still working on this as I want to try to compete with the MLPerf record. 
- Transformer pretraining on the CodeParrot dataset. This implementation trains a tiny model but trains it to be good for its class and uses the new PyTorch Lightning `Fabric` api as I explore how it fares.

## What am I working on?

Menagerie is a playground for me and I am experimenting with many things. Lately I have been working on extending Llama 3's context length (why was it so small at release Meta???) and model merging. I want to release a better version of some of my VLM experiments with something that could be competitive with some of the top VLMs. I also have been working on Mechanistic Interpretability because its a great research direction for the GPU-poor and it is very important for AI safety. There is surprisingly little public research on MI for multimodal llms. This is something I have tinkered with and will likely dive into much further.
