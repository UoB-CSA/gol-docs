# Before Start

## Learning materials

- [The Rust Book](https://doc.rust-lang.org/book/), by Steve Klabnik and Carol Nichols, with contributions from the Rust Community
  \
  This book is for Rust beginners, the part of asynchronous Rust is in [Async Book](https://rust-lang.github.io/async-book/index.html).
- [Programming Rust](https://www.oreilly.com/library/view/programming-rust-2nd/9781492052586/) by Jim Blandy, Jason Orendorff, Leonora F. S. Tindall
  \
  This book is friendly to Rust beginners.

- [Rust for Rustaceans](https://rust-for-rustaceans.com/) by Jon Gjengset
  \
  This book is for Rust masters.

## Benchmarking

The cousework skeleton provides you a basic benchmark under `benches/bench.rs`.

You can modify the benchmark parameters yourself.

To run benchmark on your implementation, type

``` bash
cargo bench
```

The result will be collected under `target/criterion`.
You can open the report with a browser, the webpage is located at `target/criterion/report/index.html`

## Profiling

See [The Rust Performance Book](https://nnethercote.github.io/perf-book/profiling.html)
