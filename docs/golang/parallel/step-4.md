<!--@include: index.md-->
#

## Step 4

![Step 4](/assets/cw_diagrams-Parallel_4.png)

Implement logic to output the state of the board after all turns have completed as a PGM image.

The output logic is very similar to the input logic from Step 1. Again, look at the file `gol/io.go` for the implementation details.

To test your code, type the following in the terminal.

``` bash
go test -v -run TestPgm
```
