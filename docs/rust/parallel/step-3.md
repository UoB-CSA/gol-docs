<!--@include: index.md-->
#

## Step 3

![Step 3](/assets/cw_diagrams-Parallel_3.png)

Now using a ticker, report the number of cells that are still alive *every 2 seconds*.

To report the count by sending the `AliveCellsCount` event. Also send the `TurnComplete` event after each complete iteration.

<!-- ::: details Concurrency with asynchronous programming -->

You might create a dedicated thread to send `AliveCellsCount` event periodically,
**or** complete this step using *async* Rust.

### Using Async Rust (OPTIONAL, recommended)

If you're not familiar with Async Rust,
you can start by reading the "Getting Started" chapter of the
[Async book](https://rust-lang.github.io/async-book/01_getting_started/02_why_async.html)
or following this [tutorial](https://tokio.rs/tokio/tutorial) provided by tokio.
However, be careful not to go too deep if you find it getting too difficult!

At this stage, `distributor` is a *blocking* function, designed to make it easier for you to write a simple implementation at the starting point.

You can complete this step using async Rust by either:

- Remain `distributor` a *blocking* function and use `tokio::runtime::Handle::current()` to get the handle of tokio async runtime, then create an *async* task inside your *blocking* distributor.

    ``` rust
    pub fn distributor(...) { // In a blocking function
        ...
        let handle = tokio::runtime::Handle::current();
        handle.spawn(async {
            async_task.await; // Do some asynchronous tasks // [!code ++]
        });

        async_task.await; // `await` is only allowed inside `async` functions and blocks // [!code --]
        ...
    }
    ```

- **Or** change `distributor` to an *async* function, and use `tokio::spawn()` to create an *async* task for sending `AliveCellCount` events periodically.
    Your invocation should look something like this:

    ``` rust
    // in `src/gol/mod.rs`
    {
        ...
        tokio::task::spawn_blocking(move || // [!code --]
            distributor(params, distributor_channels)).await??; // [!code --]
        tokio::spawn(distributor(params, distributor_channels)).await??; // [!code ++]
        Ok(())
    }


    // in `src/gol/distributor.rs`
    pub fn distributor( // [!code --]
    pub async fn distributor( // [!code ++]
        params: Params,
        mut channels: DistributorChannels
    ) -> Result<()> {
        ...
    ```

::: warning Note on flume channels in Async Rust

You should use `send` or `recv` for channels in *blocking* context, and
`send_async` or `recv_async` in *async* context.

If you change your `distributor` to an *async* function,
make sure to replace `send` and `recv` with `send_async` and `recv_async`.
Otherwise, your program will be blocked when calling the `recv` on the channel.

``` rust
async { // In async context
    ...
    io_input.recv()?; // [!code --]
    io_input.recv_async().await?; // [!code ++]
    ...
}
```

:::

::: warning Note on Locks in Async Rust

If you choose *async* Rust for this step, you should replace `std::sync::Mutex` or `std::sync::RwLock`
with `tokio::sync::Mutex` or `tokio::sync::RwLock` as well.

Use `mutex.lock().await` in *async* context,
and use `mutex.blocking_lock()` in *blocking* context.

:::

### Creating a ticker

- Creating a ticker for a periodic task is easy in *async* context.

    ``` rust
    async { // In async context
        let mut ticker = tokio::time::interval(Duration::from_secs(2)); // Create a ticker
        loop {
            ticker.tick().await; // Tick every two seconds
            // Do your periodic tasks here
        }
    }

    ```

- If you are using threads and not doing async, you can `sleep` in a loop

    ``` rust
    // In a new thread with blocking context
    loop {
        std::thread::sleep(Duration::from_secs(2));
        // Do your periodic tasks here
    }
    ```

### Run your implementation

When running your implementation, you will get the average Game of Life iteration turns per second (Avg turns/s).

You can use this data to evaluate your performance and compare it with your various implementations. However, we do not recommend directly using this data in your report.
**We recommend using formal [benchmarking](../before-start.md#benchmarking) instead**, and don't forget to analyse your methods and results in your report.

To run your implementation, type the following in the terminal.

To stop the program, press CTRL+C **twice** in the terminal.

``` bash
cargo run --release -- --headless --threads 4
```

> The `--headless` argument disables the SDL visualiser for this run, as we haven't implemented it yet.
>
> The `--threads` argument stands for the number of threads passed to struct `Params` for this run; you can specify this number yourself.

### Test

To test your implementation, type the following in the terminal.

``` bash
cargo test --release --test count
```
