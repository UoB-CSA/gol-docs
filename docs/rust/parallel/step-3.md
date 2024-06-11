<!--@include: index.md-->
#

## Step 3

![Step 3](/assets/cw_diagrams-Parallel_3.png)

Now using a ticker, report the number of cells that are still alive *every 2 seconds*.

To report the count by sending the `AliveCellsCount` event. Also send the `TurnComplete` event after each complete iteration.

::: details Concurrency with asynchronous programming

You might create a dedicated thread to send `AliveCellsCount` event periodically.

However, you may realise using a dedicated thread for doing this easy task is heavy.

You can complete this step using asynchronous Rust by either:

- Use `tokio::runtime::Handle::current()` to get the handle of tokio async runtime, then create an async task inside your blocking distributor.

- **Or** change your distributor to an *async* function, and use `tokio::spawn()` to create an async task for sending `AliveCellCount` events periodically.

We more recommend you doing the first way as there will be no breaking change to your distributor.

``` rust
pub fn distributor(...) { // In a blocking function
    ...
    let handle = tokio::runtime::Handle::current();
    handle.spawn(async {
        async_task.await; // Do some asynchronous tasks here is ok // [!code ++]
    });

    async_task.await; // Error! `await` is only allowed inside `async` functions and blocks // [!code --]
    ...
}
```

:::

::: details Note on `distributor` function
You might be noticed how `distributor` functions is called.

``` rust
// in `src/gol/mod.rs`
tokio::task::spawn_blocking(move || distributor(params, distributor_channels)); // [!code highlight]
start_io(params, io_channels).await;
```

Currently, `distributor(...)` is a synchronous function, designed to make it easier for you to write a single-threaded implementation.

However, at this stage, you can decide whether the `distributor(...)` function should be async or sync, depending on your implementation.

We recommend that you keep distributor as *synchronous* function, i.e., remain the invocation unchanged.

Unlike Golang's goroutines, Rust's async/await are stackless and cooperative, you need to manually `await` to yield time for the runtime to execute other tasks.
Therefore, keeping a *synchronous* distributor can help prevent mistakes that might cause other async tasks (such as SDL, IO and event loop) to stall."

If you want to switch `distributor(...)` to an *asynchronous* function, your code should look something like this:

``` rust
// in `src/gol/mod.rs`
    ...
    tokio::task::spawn_blocking(move || distributor(params, distributor_channels)); // [!code --]
    tokio::spawn(distributor(params, distributor_channels)); // [!code ++]
    start_io(params, io_channels).await;
}

// in `src/gol/distributor.rs`
pub fn distributor( // [!code --]
pub async fn distributor( // [!code ++]
    p: Params,
    mut c: DistributorChannels
) {
    ...
```

:::

::: details Creating a ticker in asynchronous environment

To create a ticker for a periodic task is easy in async programming.

``` rust
async { // In an async function or block
    let mut ticker = tokio::time::interval(Duration::from_secs(2)); // Create a ticker
    loop {
        ticker.tick().await; // Tick every two seconds
        // Do your periodic tasks here
    }
}

```

:::

\
To test your code, type the following in the terminal.

``` bash
cargo test --release --test count
```
