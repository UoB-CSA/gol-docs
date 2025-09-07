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

::: details Tips on improving the performance - worker pool
Unlike the Median Filter in Lab 1, the Game of Life involves rapid, repeated iterations, which requires frequent thread creation and destruction.

However, frequent creation and destruction of threads can incur significant overhead. Hence, our core approach is to reuse threads, avoiding recreation in each iteration by implementing a simple worker pool.

<!-- We can abstract the design of the worker pool into four components: distributor, workers (thread), tasks (input) and results (output).

Workers are initialised ahead of computation and run continuously, processing tasks from the task channel and sending results back to the result channel.
The distributor is responsible for assigning tasks to workers and collecting results for each iteration. -->

It is important to manage the lifecycle of the workers properly; when the distributor exits, ensure the workers are gracefully terminated.

It is recommended to back up your various implementations; this will be helpful for analysing how well you did in the later stages.
:::

### Test

To test your implementation, type the following in the terminal.

``` bash
cargo test --release --test gol
```
