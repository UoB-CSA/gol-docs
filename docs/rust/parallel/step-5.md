<!--@include: index.md-->
#

## Step 5

Implement logic to visualise the state of the game using SDL.

You will need to utilise `CellFlipped`, `CellsFlipped` and `TurnComplete` events to achieve this.
Check out `src/gol/event.rs` and `src/sdl/loop.rs` for details.

Send `TurnComplete` events at the end of each turn, **even if you are about to send `FinalTurnComplete`**.

Send `CellFlipped` events whenever a cell changes from alive to dead or from dead to alive.

> *Don't forget to send `CellFlipped` events for every initially alive cell before the first `StateChange` is sent.*
>
> ***NOTE:** You can collect many flipped cells and send a `CellsFlipped` event with all of them instead of sending `CellFlipped` for every flipped cell.
> You can send more than one `CellsFlipped` event in a turn, i.e., each worker could send `CellsFlipped`.
> Be careful not to send both `CellFlipped` and `CellsFlipped` events for the same cell, or you will flip it twice*

Also, implement the following control rules.
Note that the running SDL provides you with a channel containing the relevant keypresses.

- If `s` is pressed, save the current state of the board as a PGM image.
    > ***NOTE:** Don't forget to send an `ImageOutputComplete` event after a PGM image is saved.*
- If `q` is pressed, stop executing Gol computation, save the current state of the board as a PGM image, then terminate the program.
    > ***NOTE:** Your distributor should behave as following after `q` is pressed:*
    >
    > *Complete the current turn \
    > Send a `FinalTurnComplete` event \
    > Save the final state as PGM image and send an `ImageOutputComplete` event \
    > Send a `StateChange` event and terminate*
- If `p` is pressed, pause the processing and send a `StateChange` event.\
  If `p` is pressed again, resume the processing and send a `StateChange` event.
    > ***NOTE:**
    > It is **necessary** for `q` and `s` to work while the execution is paused.*

### Select statement

- Tokio provides the
[select!](https://tokio.rs/tokio/tutorial/select)
macro that functions similar to golang's select statement in *async* context.

- Flume also provides a
[Selector](https://docs.rs/flume/latest/flume/select/struct.Selector.html)
type to implements select-like behaviour.

### Test

To test the visualisation and control rules, type the following in the terminal.

::: code-group

``` bash [Test with SDL window]
cargo test --release --test sdl -- --sdl
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
