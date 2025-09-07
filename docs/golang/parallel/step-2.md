<!--@include: index.md-->
#

## Step 2

![Step 2](/assets/cw_diagrams-Parallel_2.png)

Parallelise your Game of Life so that it uses worker threads to calculate the new state of the board.

You should implement a distributor that tasks different worker threads to operate on different parts of the image in parallel.

The number of worker threads you should create is specified in `gol.Params.Threads`.

You are free to design your system as you see fit, however, we encourage you to primarily use channels.

::: details Tips on improving the performance - worker pool
Unlike the Median Filter in Lab 1, the Game of Life involves rapid, repeated iterations, which requires frequent goroutine creation and destruction.

While goroutines are lightweight, frequent creation and destruction can still incur significant overhead. Hence, our core approach is to reuse goroutines, avoiding recreation in each iteration by implementing a simple worker pool.

<!-- We can abstract the design of the worker pool into four components: distributor, workers (goroutine), tasks (input) and results (output).

Workers are initialised ahead of computation and run continuously, processing tasks from the task channel and sending results back to the result channel.
The distributor is responsible for assigning tasks to workers and collecting results for each iteration. -->

It is important to manage the lifecycle of the workers properly; when the distributor exits, ensure the workers are gracefully terminated.

It is recommended to back up your various implementations; this will be helpful for analysing how well you did in the later stages.
:::

### Test

To test your implementation, type the following in the terminal.
You can use tracing to verify the correct number of workers was used this time.

``` bash
go test ./tests -v -run TestGol
```
