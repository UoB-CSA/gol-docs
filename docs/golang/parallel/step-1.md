<!--@include: index.md-->
#

## Step 1

Implement the Game of Life logic as it was described in the [task introduction](../overview#introduction).

We suggest starting with a single-threaded implementation that will serve as a starting point in subsequent steps.

Your Game of Life should evolve for the number of turns specified in `gol.Params.Turns`.
Your Game of Life should evolve the correct image specified by `gol.Params.ImageWidth` and `gol.Params.ImageHeight`.

The skeleton code starts three goroutines.
The diagram below shows how they should interact with each other.

Note that not all channels linking IO and the Distributor have been initialised for you.
You will need to make them and add them to the `distributorChannels` and `ioChannels` structs.
These structs are created in `gol/gol.go`.

![Step 1](/assets/cw_diagrams-Parallel_1.png)

### IO

You are not able to call methods directly on the IO goroutine.
To use the IO, you will need to utilise channel communication.\
To read the initial PGM image, you will need the `command`, `filename` and `input` channels.
Look at the file `gol/io.go` for their implementation details.\
The functions `io.readPgmImage` and `startIo` are particularly important in this step.

### Events

Your Game of Life code will interact with the user or the unit tests using the `events` channel.
All events are defined in the file `gol/event.go`.
In this step, you will only be working with the unit test `TestGol`.
Therefore, you only need to send the `FinalTurnComplete` event, with the list of alive cells.

::: details Tips on improving the performance - counting neighbours
We have provided you with a basic solution that uses modulo operations (%) to calculate the coordinates of neighbours, but it can still be further optimised because modulo usually takes more CPU cycles - they are slow.

You need to optimise the calculation of neighboring coordinates manually and strive to minimise the use of modulo operations (%).

It is recommended to back up your various implementations; this will be helpful for analysing how well you did in the later stages.
:::

### Test

To test your serial, single-threaded implementation, type the following in the terminal, all the tests ran should pass.

``` bash
go test -v -run TestGol/-1$
```

### Troubleshooting

If the zero turn tests pass, then you are reading the input file correctly and are giving the right list of alive cells in `FinalTurnComplete`.

If they fail, check your input and `FinalTurnComplete` logic **before** you start debugging your Game of Life turn logic.
