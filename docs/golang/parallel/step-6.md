<!--@include: index.md-->
#

## Step 6

Implement logic to visualise the state of the game using SDL.

You will need to utilise `CellFlipped`, `CellsFlipped` and `TurnComplete` events to achieve this.
Check out `gol/event.go` and `sdl/loop.go` for details.

> *Don't forget to send `Cell(s)Flipped` events for every initially alive cells before processing any turns.*
>
> *You can collect many flipped cells and send `CellsFlipped` at a time instead of sending `CellFlipped` for every flipped cell.
> You can send many times of `CellsFlipped` event in a turn, i.e., each worker could send `CellsFlipped`.
> Please be careful not to send `CellFlipped` and `CellsFlipped` at the same time, as they may conflict.*

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
