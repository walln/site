---
title: Loadax - High-Performance Data Loading for JAX
publishDate: 2024-10-03 CST
description: A JAX-native dataloading library with prefetching, multi-worker support, and distributed loading for ML training pipelines.
tags: ["machine-learning", "jax", "python", "performance", "distributed-computing"]
---

## About Loadax

[Loadax](https://github.com/walln/loadax) is a high-performance dataloading library designed specifically for the JAX ecosystem. When scaling up some of my training runs, I found that existing dataloading solutions weren't optimized for JAX's unique features like XLA compilation, device sharding, and distributed training. Loadax fills this gap by providing utilities for feeding data into training loops with automatic batching, shuffling, prefetching, and JAX-native distributed data loading.

The key insight behind Loadax is that data loading shouldn't be the bottleneck in your training pipeline. By leveraging background workers, intelligent prefetching, and JAX's sharding primitives, Loadax ensures your accelerators stay busy while handling the complexities of distributed training.

## Core Features

Let's explore how Loadax simplifies data loading in JAX:

```python title="basic_usage.py"
from loadax import Dataloader, SimpleDataset

# Create a dataset from any indexable data
dataset = SimpleDataset([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
loader = Dataloader(dataset, batch_size=2)

# Iterate through batches
for batch in loader:
    print(batch)
# Output: [1, 2], [3, 4], [5, 6], [7, 8], [9, 10]
```

### Prefetching and Background Workers

One of Loadax's strengths is keeping your training loop fed with data without blocking on IO operations:

```python title="prefetching.py"
from loadax import Dataloader, SimpleDataset, MappedDataset
import time

def slow_preprocessing(x):
    time.sleep(0.1)  # Simulate expensive preprocessing
    return x * 2

# Chain transformations lazily
dataset = MappedDataset(SimpleDataset(list(range(10))), slow_preprocessing)

# Use multiple workers and prefetching to hide latency
loader = Dataloader(dataset, batch_size=2, workers=2, prefetch=3)

for batch in loader:
    # Data is ready immediately - preprocessing happened in background
    print(batch)
```

### Distributed Data Loading

Loadax truly shines in distributed training scenarios. It automatically handles data sharding across JAX processes and devices:

```python title="distributed_training.py"
from loadax import Dataloader, SimpleDataset
from loadax.sharding.placement import host_to_global_device_array
from loadax.sharding.presets import make_fsdp_sharding_config
import jax.numpy as jnp

# Create mesh for distributed training
config = make_fsdp_sharding_config(
    axis_names=("data", "model"), 
    batch_axis_name="data"
)
mesh = config.create_device_mesh()

# Loadax automatically shards data across hosts
dataset = SimpleDataset(list(range(128)))
dataloader = Dataloader(dataset, batch_size=8, workers=2, prefetch=2)

with mesh:
    for local_batch in dataloader:
        # Convert host-local batch to globally sharded array
        # No data movement needed - loadax ensures correct placement
        global_batch = host_to_global_device_array(local_batch)
        
        # Use in your distributed training step
        loss = train_step(model, optimizer, global_batch)
```

## Technical Implementation

Loadax leverages several key design decisions to achieve high performance:

1. **Lazy Transformations**: Dataset transformations are applied lazily during iteration, allowing for efficient memory usage and JIT compilation of preprocessing functions.

2. **Type Safety**: Full type hints flow from dataset definition through to your training loop, catching shape mismatches early.

3. **JAX-Native Sharding**: Built-in understanding of JAX's sharding primitives ensures data is loaded directly to the correct devices without unnecessary transfers.

4. **Deterministic Loading**: Even in distributed settings, Loadax guarantees reproducible data loading order for debugging and experiment reproducibility. While [Google's Grain](https://github.com/google/grain) is a more complete and mature dataloading solution for JAX, it requires knowing the dataset size upfront to ensure determinism. Loadax takes a different approach, allowing for more flexible dataset definitions while still maintaining reproducibility through its sharding and iteration strategies.

## What's Next

Loadax is under active development with several exciting features on the roadmap:

- **Streaming Datasets**: Support for datasets too large for memory or disk
- **More Integrations**: PolarsDataset, SQLiteDataset, and more data sources
- **Performance Optimizations**: Further improvements to prefetching and caching strategies
- **Enhanced Distributed Features**: Better support for heterogeneous device layouts

The goal is to make Loadax the go-to solution for anyone doing serious machine learning with JAX, removing data loading as a bottleneck and letting researchers focus on their models.

## Getting Started

You can install Loadax with pip:

```bash
pip install loadax
```

Check out the [documentation](https://walln.github.io/loadax/) for more examples and the full API reference. The source code is available on [GitHub](https://github.com/walln/loadax), and contributions are welcome! 
