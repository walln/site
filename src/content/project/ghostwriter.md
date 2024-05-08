---
title: Ghostwriter
publishDate: 2023-01-25 CST
description: Learning to mimic famous musicians with generative language models.
tags: ["deep-learning", "llms", "python"]
updatedDate: 2024-05-08 CST
---

## What is Ghostwriter?
When a famous artist has someone write songs for them, it is referred to as *ghostwriting*. This practice indicates that there is a pattern and style that is consistent enough to be replicated through the work of a single artist. A friend's joke about Drake's alleged ghostwriting inspired me to try to do the same with LLMs. This repo contains the code for a few different models that I have implemented to mimic the style of famous musicians and the code to scrape the lyrics to generate a dataset for training the models. More than anything, this is an exercise to implement some language models and experiments with emerging techniques in generative AI.

[The source code is available on Github](https://github.com/walln/ghostwriter)

### Update May 2024

The ongoing battle between [Kendrick Lamar](https://en.wikipedia.org/wiki/Kendrick_Lamar) and [Drake](https://en.wikipedia.org/wiki/Drake_(musician)) has rekindled my interest in this project so I have gotten around to fixing some things on my long to-do list for Ghostwriter.

Ghostwriter now leverages [QLoRA](https://arxiv.org/abs/2305.14314) to do [Supervised Fine Tuning](https://klu.ai/glossary/supervised-fine-tuning) of large language models on consumer hardware. The dataset generation, training, and inference scripts have all be revamped to be simpler and ***pretty*** because [rich](https://github.com/Textualize/rich) is incredible.

Here is an example from a model trained on lyrics from [Kendrick Lamar](https://en.wikipedia.org/wiki/Kendrick_Lamar):

```txt
[Hook]
See we live in a world, not ruled by laws
But ruled by money, power and hate for more money and fame
I won't say it ain't tough
When you gotta hustle for every coin
You got to ride hard, jump through hoops just to get on up
It's life (Life) is it worth living?
```

This is pretty good and resembles his lyrical style and subject matter while being able to be prompted to fit the instructions. Going forward I want to continue to improve this by improving my Quantization methods ([HQQ](https://mobiusml.github.io/hqq_blog/) looks promising) as I would like to fit even larger models on consumer hardware. I may look into CPU offloading to help with this as well. I also need to better hyperparameter tune my generation config.

One of the toughest problems with fine tuning and generating lyrics is that you must carefully balance repetition. Songs have structure and it is often common to repeat lines throughout the lyrics but the model during fine tuning may overfit to the repetition which will reduce the lyrical diversity. To combat this, dataset diversity is needed as well as a `presence_penalty` at inference time to reduce the probability of generating tokens and sequences of tokens that are already within the generated result. However, this cannot be overdone as it is important to enable the model to mirror common lyrical structures. This will require more tuning and techniques to nail perfectly.

I also intend to improve the dataset curation process as it is too naive at the moment. I need to implement more advanced methods to clean artifacts from the scraping process and to also ensure there is enough diversity within the dataset.

## Notice

This is merely an experiment and a toy. I do not claim any copyright or encourage monetizing works created by these models.
