<!--@include: index.md-->
#

## Step 6

Implement logic to visualise the state of the game using SDL.

You will need to utilise `CellFlipped` and `TurnComplete` events to achieve this.
Check out `gol/event.go` and `sdl/loop.go` for details.

> *Don't forget to send `CellFlipped` events for every initially alive cells before the first `StateChange` is sent.*

> ***NOTE:** You can collect many flipped cells and send `CellsFlipped` with all of them instead of sending `CellFlipped` for every flipped cell.
> You can send more than one `CellsFlipped` event in a turn, i.e., each worker could send `CellsFlipped`.
> Be careful not to send both `CellFlipped` and `CellsFlipped` events for the same cell, or you will flip it twice*

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

You can also run the program and view the visualisation by typing the following in the terminal.

``` bash
go run .
```

Finally, type the following in the terminal to make sure all tests are passing.

``` bash
go test -v
```
