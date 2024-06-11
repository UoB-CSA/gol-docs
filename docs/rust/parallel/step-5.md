<!--@include: index.md-->
#

## Step 5

Implement logic to visualise the state of the game using SDL.

You will need to utilise `CellFlipped`, `CellsFlipped` and `TurnComplete` events to achieve this.
Check out `src/gol/event.rs` and `src/sdl/loop.rs` for details.

> *Don't forget to send `Cell(s)Flipped` events for every initially alive cells before processing any turns.*
>
> *You can collect many flipped cells to a vector and send `CellsFlipped` at a time instead of sending `CellFlipped` for every flipped cell.
> You can send many times of `CellsFlipped` event in a turn, i.e., each worker could send `CellsFlipped`.
> Please be careful not to send `CellFlipped` and `CellsFlipped` at the same time, as they may conflict (flipped twice == not flipped).*

Also, implement the following control rules.
Note that the running SDL provides you with a channel containing the relevant keypresses.

- If `s` is pressed, save the current state of the board as a PGM image.
    > ***NOTE:** Don't forget to send an `ImageOutputComplete` event after a PGM image is saved.*
- If `q` is pressed, stop executing Gol computation, save the current state of the board as a PGM image, then terminate the program.
    > ***NOTE:** Your distributor should behave as following after `q` is pressed:
    > \
    > Complete current turn and send a `TurnComplete` event ->
    > Send a `FinalTurnComplete` event ->
    > Save the final state as PGM image and send an `ImageOutputComplete` event ->
    > Send a `StateChange` event and terminate.*
- If `p` is pressed, pause the processing and send a `StateChange` event.\
  If `p` is pressed again, resume the processing and send a `StateChange` event.
    > ***NOTE:**
    > It is **necessary** for `q` and `s` to work while the execution is paused.*

::: details The `select!` macro
You might need something similar to golang's `select` statement, the `select!` macro.

``` rust
use tokio::select!;
...
loop {
    select! { // Blocking until one of its branches is ready
        event = channel_a.recv() => {
            ... // May go to this branch if channel_a received event first
            match event {
                ... // Then do something with event
            }
        },
        value = channel_b.recv() => {
            ... // May go to this branch if channel_b received value first
        },
        result = async_task_that_can_be_awaited => {
            ... // May go to this branch if this async task finished first
        }
    }
}
...

```

:::

\
To test the visualisation and control rules, type the following in the terminal.

::: code-group

``` bash [Test with SDL window]
cargo test --release --test sdl -- sdl
```

``` bash [Test without SDL window]
cargo test --release --test sdl
```

:::

You can also run the program and test the visualisation and control rules manually by typing the following in the terminal.

``` bash
cargo run --release
```

Finally, type the following in the terminal to make sure all tests are passing.

``` bash
cargo test --release
```
