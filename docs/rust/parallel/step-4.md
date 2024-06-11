<!--@include: index.md-->
#

## Step 4

![Step 4](/assets/cw_diagrams-Parallel_4.png)

Implement logic to output the state of the board as a PGM image after all turns have completed.

Send an `ImageOutputComplete` event after the PGM image is saved.

To test your code, type the following in the terminal.

``` bash
cargo test --release --test pgm
```
