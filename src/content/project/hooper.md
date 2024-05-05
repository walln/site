---
title: Hooper
description: An AI chatbot with generative UI built to discuss the NBA with realtime news and stats.
publishDate: 2024-05-02
tags: ["machine-learning", "llms", "performance", "python" , "web-development", "backend-development"]
---
## What is Hooper?

[Hooper](https://hooper.walln.dev ) is a large project I have been working on for a while now. Sports discourse and especially NBA discourse has grown to become lazy and stale. I am a huge basketball fan, and I think that there are too few resources and places of discourse for educated hoops fans. Hooper is an AI chatbot that is trained on NBA data to enable discussion about basketball. Hooper has access to realtime stats, scores, and news. Additionally, Hooper leverages generative UI to stream in custom UI elements to make certain interactions feel smoother.

Hooper has been a good opportunity to put together my range of skills from model training, dataset curation and cleaning, backend development, frontend development, and even infrastructure. I also have gotten to explore and experiment with cool new toys and features from some of my favorite tools like [SST ion](https://ion.sst.dev) and [Vercel's](https://vercel.com) [AI SDK](https://sdk.vercel.ai).

<!-- TODO: Insert images and examples from Hooper here -->

## Tech Stack

The Hooper service runs on [Next.js](https://nextjs.org) with streaming using the [AI SDK](https://sdk.vercel.ai). The site is hosted on AWS, Cloudflare, and Vercel and uses [SST ion](https://ion.sst.dev) to manage the infrastructure. I also host vLLM on [Modal](https://modal.com) with my own hosted LLM that I have tuned for the specific NBA jargon. Also on Modal is training for the model and some background services for the realtime data. I use [Turso](https://turso.tech) for my database because SQLite is underrated and awesome. I also use [Upstash](https://upstash.com) for redis that backs my rate limiting.

### Try it out

You can find [Hooper](https://hooper.walln.dev) as a project on my site and the code is publicly available on [GitHub](https://github.com/walln/hooper).
