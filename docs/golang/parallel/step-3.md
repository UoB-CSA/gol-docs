<!--@include: index.md-->
#

## Step 3

![Step 3](/assets/cw_diagrams-Parallel_3.png)

The lab sheets included the use of a timer.

Now using a ticker, report the number of cells that are still alive *every 2 seconds*.

To report the count use the `AliveCellsCount` event.

To test your code, type the following in the terminal.

``` bash
go test -v -run TestAlive
```

### Troubleshooting

You can check what the correct number of alive cells is by looking at the `.csv` files in the `check/alive/` folder. 

You might find that you are reporting the count for the turn before or turn after. If this happens the `CompletedTurns` might be what is wrong, not the count
