---
title: Outcomes
description: A typescript library adding monadic control flows.
publishDate: 2024-05-02 CST
tags: ["package", "typescript", "rust"]
updatedDate: 2024-05-30 CST
---

## Whats wrong with typescript control flow?

The native support for Errors, and optional values in typescript/javascript is very limited and presents bad patterns. Not all errors are unexpected, an error can often represent a deviation from the *happy-path* rather than some panic. However, using errors to represent these states and having them thrown throughout your code means implicit control flow. Typescript also cannot infer the thrown types so an end user has no way of knowing the possible errors thrown by a function without digging through all of the source code. Languages that support algebraic sum types commonly encourage a pattern of a union Success/Error type that makes clear what are the success and fail states throughout the code.

For example lets compare idiomatic Rust and Typescript side by side.

```ts
function isPositive(x: int) {
  if( x < 0 ) {
    throw new Error("x is less than 0")
  }
  return x
}
```

When using this function the user has no idea that a value could be thrown because the return type is `number`. Compare this to rust where the state transitions are much more explicit.

```rs
use std::num::ParseIntError;

fn main() -> Result<(), ParseIntError> {
    let number_str = "10";
    let number = match number_str.parse::<i32>() {
        Ok(number)  => number,
        Err(e) => return Err(e),
    };
    println!("{}", number);
    Ok(())
}
```

In this code is clear that the returning type is either no value or a `ParseIntError`. This pattern also makes for really clean code patterns as monadic types like this usually are functors that can chain operations only applying when valid.

```rs
fn main() {
    // A function that may return an error
    fn divide(a: f64, b: f64) -> Result<f64, String> {
        if b == 0.0 {
            Err(String::from("Division by zero"))
        } else {
            Ok(a / b)
        }
    }

    // Using the divide function
    let result = divide(10.0, 2.0);

    // Using map to transform the Ok value
    let mapped_result = result.map(|value| value * 2.0);

    match mapped_result {
        Ok(value) => println!("The result is: {}", value), // 10.0
        Err(e) => println!("An error occurred: {}", e),
    }

    // Another example with an error case
    let error_result = divide(10.0, 0.0);

    let mapped_error_result = error_result.map(|value| value * 2.0);

    match mapped_error_result {
        Ok(value) => println!("The result is: {}", value),
        Err(e) => println!("An error occurred: {}", e), // An error occurred: ...
    }
}
```

These patterns are incredible for writing reliable and understandable code.

## Introducing Outcomes

[Outcomes](https://github.com/walln/outcomes) is a typescript library to more explicitly handle common control flow operations. Outcomes implements the `Result` and `Option` types to make dealing with error and null states a breeze. To get started install the package from the [JSR Package Repository](https://jsr.io/@walln/outcomes). The Outcomes library implements common functor operations for `Result` and `Option` types as well as the shorthand constructors for the returnable union types. 

### Explicit Error Handling

Lets look at example of error handling.

```ts
import { type Result, Ok, Err } from '@walln/outcomes';

function myFunction(value: boolean): Result<boolean, Error> {
    return value ? Ok(value) : Err(new Error("Invalid Value"));
}

const result = myFunction(true);
result.match({
 Ok: (value) => console.log(value), // true
 Err: (error) => console.error(error),
});
```

Results are either `Ok` or an `Err` to represent the valid states. You can see that you can still use the standard javascript `Error` class if you wish, or create your own error types. Maybe your function has multiple possible known errors - create a union! The types are irrelevant because the `Result` wraps your values in a tagged union.

### Nullable values can be improved

You can also use `Option` types to represent nullable values.

```ts
import { type Option, Some, None } from '@walln/outcomes';

function myFunction(value: boolean): Option<boolean> {
    return value ? Some(value) : None;
}

const result = myFunction(true)
console.log(result.unwrap()) // true
```

This might not seem as necessary because of first class optional chaining in typescript but having a clear `None` type enables more functionality than just spamming optional chaining and nullish coalescing operators.

```ts

/// Before: 

type User = {
    name?: string;
    age?: number;
    address?: {
        city?: string;
    };
};

const user1: User = {
    name: "Alice",
    age: 30,
    address: {
        city: "Wonderland"
    }
};

const user2: User = {
    name: "Bob"
};

const user3: User = {};

function getCity(user: User): string {
    // Using optional chaining to safely access nested properties
    // Using nullish coalescing to provide a default value if the property is undefined or null
    return user.address?.city ?? "City not available";
}

console.log(getCity(user1)); // Output: Wonderland
console.log(getCity(user2)); // Output: City not available
console.log(getCity(user3)); // Output: City not available

/// After

import { Some, None, Option } from "@walln/outcomes";

// Define the User type
type User = {
    name: Option<string>;
    age: Option<number>;
    address: Option<{
        city: string;
    }>;
};

// Create user instances
const user1: User = {
    name: new Some("Alice"),
    age: new Some(30),
    address: Some<{
        city: "Wonderland"
    }>
};

const user2: User = {
    name: new Some("Bob")
};

const user3: User = {
    name: None,
    age: None
    address: None
};

function getCity(user: User): string {
    // Using the Some type to safely access nested properties and provide default values
    return user.address.unwrapOr("City not available");
}

console.log(getCity(user1)); // Output: Wonderland
console.log(getCity(user2)); // Output: City not available
console.log(getCity(user3)); // Output: City not available
```

## Going forward

The full documentation can be found with the package on the [JSR Package Repository](https://jsr.io/@walln/outcomes).

I will be implementing more features soon primarily for dealing with arrays and async values.
