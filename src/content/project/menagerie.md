---
title: Menagerie
description: A menagerie of deep learning models and techniques.
publishDate: 2024-05-02 CST
tags: ["machine-learning", "llms", "performance", "python"]
updatedDate: 2024-05-06 CST
---

## What is Menagerie?

[Menagerie](https://github.com/walln/menagerie) is a collection of models and techniques I find interesting. It is similar to [scratch](/projects/scratch) but more focused on quick exploration rather than well designed and readable implementations. 

## Current Exhibits

- QLoRA Supervised Fine Tuning of gemma-2b (chat tuned on OpenHermes) for contextual SQL-qa. This is an ongoing experiment as I am working on dynamic statistics retrieval in [hooper](/projects/hooper).
- An extremely optimized ResNet training implementation using PyTorch. I am still working on this as I want to try to compete with the MLPerf record. 
- Transformer pretraining on the CodeParrot dataset. This implementation trains a tiny model but trains it to be good for its class and uses the new PyTorch Lightning `Fabric` api as I explore how it fares.

## What am I working on?

Menagerie is a playground for me and I am experimenting with many things. Lately I have been working on extending Llama 3's context length (why was it so small at release Meta???) and model merging. I want to release a better version of some of my VLM experiments with something that could be competitive with some of the top VLMs.
