<!--@include: index.md-->
#

## Step 3

![Step 3](/assets/cw_diagrams-Distributed_3.png)

The local controller should be able to output the state of the board after all turns have completed as a PGM image.

### Test

To test your implementation, type the following in the terminal of your **local controller**.

``` bash
cargo test --release --test pgm -- --threads 1
```
