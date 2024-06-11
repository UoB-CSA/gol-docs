<!--@include: index.md-->
#

## Step 2

![Step 2](/assets/cw_diagrams-Parallel_2.png)

Parallelise your Game of Life so that it uses worker threads to calculate the new state of the board.

You should implement a distributor that tasks different worker threads to operate on different parts of the image in parallel.

The number of worker threads you should create is specified in struct `Params`.

### Different options for designing parallelism

There are various options available for implementating Game of Life parallelism, such as:

- `std::thread::spawn()` creates a native OS thread
- `rayon::spawn()` uses Rayon, a data parallelism library
- `tokio::spawn()` / `tokio::task::spawn_blocking()` creates an async task

Please research their differences yourself.

However, we recommend using [Native OS threads](https://doc.rust-lang.org/std/thread/) or [Rayon](https://crates.io/crates/rayon) for Game of Life computation.
[Tokio](https://tokio.rs/) is an *asynchronous* runtime and is designed for handling IO-bound tasks, it is not the best choice for the compute-bound tasks in this coursework.

If you use Rayon, you can use `rayon::ThreadPoolBuilder::new().num_threads().build()` to manually generate a fix-sized thread pool,
allowing you to specify how many threads Rayon should use.

### MPMC channels

In other parts of skeleton, `tokio::sync::mpsc::channel` is widely used, where `MPSC` stands for **multi-producer single-consumer**, meaning the channel can have only ***one*** receiver.

In contrast, Golang channels can have multiple receivers and are referred to as `MPMC` (multi-producer multi-consumer).
If your parallel design requires ***multiple*** receivers, consider using the channel provided by [flume](https://crates.io/crates/flume),
which behaves similarly to a Golang channel.

\
To test your code, type the following in the terminal.

``` bash
cargo test --release --test gol
```
