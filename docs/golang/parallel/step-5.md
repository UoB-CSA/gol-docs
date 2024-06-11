<!--@include: index.md-->
#

## Step 5

Implement logic to visualise the state of the game using SDL.

You will need to utilise `CellFlipped`, `CellsFlipped` and `TurnComplete` events to achieve this.
Check out `gol/event.go` and `sdl/loop.go` for details.

> *Don't forget to send `Cell(s)Flipped` events for every initially alive cells before processing any turns.*
>
> *You can collect many flipped cells and send `CellsFlipped` at a time instead of sending `CellFlipped` for every flipped cell.
> You can send many times of `CellsFlipped` event in a turn, i.e., each worker could send `CellsFlipped`.
> Please be careful not to send `CellFlipped` and `CellsFlipped` at the same time, as they may conflict.*

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

\
To test the visualisation and control rules, type the following in the terminal.

::: code-group

``` bash [Test with SDL window]
go test -v -run TestSdl -sdl
```

``` bash [Test without SDL window]
go test -v -run TestSdl
```

:::

You can also run the program and test the visualisation and control rules manually by typing the following in the terminal.

``` bash
go run .
```

Finally, type the following in the terminal to make sure all tests are passing.

``` bash
go test -v
```
