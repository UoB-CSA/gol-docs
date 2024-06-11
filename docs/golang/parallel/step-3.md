<!--@include: index.md-->
#

## Step 3

![Step 3](/assets/cw_diagrams-Parallel_3.png)

The lab sheets included the use of a timer.

Now using a ticker, report the number of cells that are still alive *every 2 seconds*.

To report the count use the `AliveCellsCount` event. Also send the `TurnComplete` event after each complete iteration.

To test your code, type the following in the terminal.

``` bash
go test -v -run TestAlive
```
