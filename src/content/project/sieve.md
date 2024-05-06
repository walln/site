---
title: Sieve - Approximate Nearest Neighbors index in Rust
publishDate: 2024-05-01 CST
description: An in-memory approximate nearest neighbors vector search index built with Rust.
tags: ["machine-learning", "performance" ,"rust"]
---

## About Sieve

[Sieve](https://github.com/walln/sieve) is a toy implementation of Approximate Nearest Neighbors search. This index works by building an in-memory tree of the vectors randomly selecting vectors during the construction of the index and creating hyperplanes to use to quickly search the vector space. Vectors can then be queried using squared euclidean distance to find similar vectors within the vector space.

Lets look at an example of using Sieve to query a vector space.

```rust title="main.rs"
fn main() -> Result<(), Error> {
  let vectors = vec![Vector::new([1.0, 2.0]), Vector::new([3.0, 4.0])];
  let ids: Vec<i32> = (0..vectors.len()).map(|i| i as i32).collect();

  let num_trees = 2;
  let max_size = 2;

  let index = ApproximateNearestNeighborsIndex::build(
    num_trees, 
    max_size, 
    &vectors, 
    &ids
  );

  let query = Vector::new([1.0, 2.0]);
  let top_k = 1;
  let results = index.search(query, top_k);
}

```

This code will create an index, with a few vectors and search for the closet one to the query vector using squared euclidean distance. In this case, the first vector `[1.0, 2.0]` already exists so it will be a perfect match.


## Sieve's future

Going forward I would like to experiment more with this project. This is the closest I have been to writing a database (although I have toyed with writing a multi-node Redis implementation many times) and I would like to get this to support on disk formats rather than just in memory. I also want to implement more distance metrics and also automatic hyperparameter tuning to find the most optimal values for the data in the index.

The code for Sieve can be found on [GitHub](https://github.com/walln/sieve).
