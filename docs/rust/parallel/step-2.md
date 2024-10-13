<!--@include: index.md-->
#

## Step 2

![Step 2](/assets/cw_diagrams-Parallel_2.png)

Parallelise your Game of Life so that it uses worker threads to calculate the new state of the board.

You should implement a distributor that tasks different worker threads to operate on different parts of the image in parallel.

The number of worker threads you should create is specified in struct `Params`.

We recommend using
[threads](https://doc.rust-lang.org/std/thread/) or
[rayon](https://github.com/rayon-rs/rayon)
(a data parallelism library), to parallelise the Game of Life computation.

We do **NOT** recommend
[tokio](https://tokio.rs/)
as it is designed for handling IO-bound tasks,
it is not the best choice for the compute-bound tasks for this coursework.

If you use rayon, you can use
`rayon::ThreadPoolBuilder::new().num_threads().build()`
to manually generate a fix-sized thread pool,
allowing you to specify how many threads rayon should use.

### Test

To test your implementation, type the following in the terminal.

``` bash
cargo test --release --test gol
```
