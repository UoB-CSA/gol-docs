<!--@include: index.md-->
#

## Step 2

![Step 2](/assets/cw_diagrams-Parallel_2.png)

Parallelise your Game of Life so that it uses worker threads to calculate the new state of the board.

You should implement a distributor that tasks different worker threads to operate on different parts of the image in parallel.

The number of worker threads you should create is specified in `gol.Params.Threads`.

You are free to design your system as you see fit, however, we encourage you to primarily use channels.

### Test

To test your implementation, type the following in the terminal.
You can use tracing to verify the correct number of workers was used this time.

``` bash
go test -v -run TestGol
```
