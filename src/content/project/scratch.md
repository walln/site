---
title: Scratch
publishDate: 2023-01-24 CST
description: Machine learning architectures and methods implemented from scratch.
tags: ["machine-learning", "performance", "gpu-kernels", "python"]
updatedDate: 2024-04-30 CST
---

## About Scratch

This is a collection of ML models and methods implemented from scratch for my learning and reference.  I use this project to digest new technologies and research as well as just to implement things for fun. Not all of the implementations are optimized but they are all easy to read and understand. 

[The source code is available on Github.](https://github.com/walln/scratch)

I am always adding new models and methods as I find notable papers or need to implement them myself to fully grok the implementation details.

### Currently Implemented

The following methodologies are currently implemented in the `main` branch:

#### Classical Machine Learning Methods

- Linear Regression (L1 and L2 regularization)
- Logistic Regression


#### Deep Learning Models
- CNN - Training for a ConvNet using Flax with all the bells-and-whistles (parallelized training, weights and biases logging, etc.)
- ResNet 1.5 - Training for a ResNet (all sizes) using Equinox with lots of extra features and performance optimizations.

#### Large Language Models
- BERT - Training BERT with Equinox. Optimized training code with automatic mixed precision.

### In Progress

The following are currently implemented in PRs or on other branches:

- OLMo - Simplified OLMo training and exploring the learnings from that paper with annotated notes
- Support Vector Machine
- XLA acceleration for Linear Regression and Logistic Regression
- KNN


### Triton Kernels

The biggest thing I am currently working on is a set of Triton kernels that are optimized for fused operations for common PyTorch layers. The idea is to tune high performance layers so I do not have to `torch.compile` during experimentation.
