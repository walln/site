---
title: Phantom - A Rust based deep learning framework
publishDate: 2024-05-02
description: A forward mode automatic differentiation and deep learning libary written from scrach in rust capable of training neural networks.
tags: ["machine-learning", "performance" ,"gpu-kernels", "rust"]

---
## What is Phantom?

[Phantom](https://github.com/walln/phantom) is a forward mode automatic differentiation and deep learning library I have been working on. It is written from scratch in Rust and implements common deep learning and tensor operations. This was inspired by all of the growth of machine learning in Rust with libraries like [candle](https://github.com/huggingface/candle) and [burn](https://tracel-ai/burn). Burn is a work in progress but backpropogation is functional with common tensor operations. I am working on a GPU backend at the moment.

### Examples

Lets take a look at what Phantom looks like. Starting with a few simple examples of tensor arithmetic. Tensors can be created by allocating a slice of data to put into memory, and specifying the Device type. The Device only specifies where the tensor is stored, not the backend for the program as tensors cna be moved around to different devices as needed. Rust's type system makes tagging the tensor to a specific device really intuitive. If you look closely the tensor also does not specify a data type, it is inferred from the slice of input data. Tensors are generic across types and will support up and downcasting where possible.


```rust title=tensor_arithmetic.rs
fn simple_arithmetic() -> Result<(), Error> {
  let five = Tensor::new(&[5f32, 5., 5.], Device::CPU)?;

  let x = Tensor::var(&[3f32, 1., 4.], Device::CPU)?;
  let y = x.mul(&x)?.add(&x.mul(&five)?)?.add(&five)?;

  assert_eq!(x.to_vector_rank_one::<f32>()?, [3., 1., 4.]);
  assert_eq!(y.to_vector_rank_one::<f32>()?, [29., 11., 41.]);
}

```



Now that we have our tensors and can do some simple math with them lets actually compute the gradients. To compute the gradiens just call `backward` on the specified tensor. The gradients are calculated and returned as a `GradientMap` that supports standard HashMap operations.

```rust title=gradients.rs
fn simple_gradients() -> Result<(), Error> {
  let x = Tensor::var(&[3f32, 1., 4.], Device::CPU)?;
  let y = (((&x * &x)? + &x * 5f64)? + 4f64)?;

  let gradients = y.backward()?;
  let gradient_x = gradients.get(&x.id())?;

  assert_eq!(x.to_vector_rank_one::<f32>()?, [3., 1., 4.]);
  assert_eq!(y.to_vector_rank_one::<f32>()?, [28., 10., 40.]);
  assert_eq!(gradient_x.to_vector_rank_one::<f32>()?, [11., 7., 13.]);

  Ok(())
}
```


## Afterword

Phantom is a really simple framework that is designed to be intuitive and the codebase readable. I am working on other backends like GPU support and would like to one day support multi-device training. If you want to check out Phantom you can find it on [GitHub](https://github.com/walln/phantom).
