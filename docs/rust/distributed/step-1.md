<!--@include: index.md-->
#

## Step 1

Begin by ensuring you have a working single-threaded, single-machine implementation.
You should be able to test your serial code using `cargo test --release --test gol -- --threads 1` and all tests should pass.

![Step 1](/assets/cw_diagrams-Distributed_1.png)

Migrate and separate your implementation into the two components provided in the new distributed skeleton:

- The local controller (controller folder), will be responsible for IO and capturing keypresses.
- The Gol Engine (server folder), will be responsible for actually processing the turns of Game of Life.

You must be able to run the local controller as a client on a local machine, and the Gol engine as a server on an AWS node.

Start by implementing a basic controller which can tell the logic engine to evolve Game of Life for the number of turns specified in `Params.turns`.
You can achieve this by implementing a single, blocking RPC call to process all requested turns.

### Test

To test your implementation, type the following in the terminal of your **local controller** (cd to the controller folder first).

``` bash
cargo test --release --test gol -- --threads 1
```

If you want to specify the server address, simply by adding `--server_addr "<server_ip>:<server_port>"`
(127.0.0.1:8030 in this case)

``` bash
cargo test --release --test gol -- --threads 1 --server_addr "127.0.0.1:8030"
```

This applies to the later tests as well.
