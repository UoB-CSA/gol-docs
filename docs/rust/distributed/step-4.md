<!--@include: index.md-->
#

## Step 4

![Step 4](/assets/cw_diagrams-Distributed_4.png)

Finally, the local controller should be able to manage the behaviour of the Gol engine according to the following rules:

- If `s` is pressed, the controller should generate a PGM file with the current state of the board.

- If `q` is pressed, close the controller client program without causing an error on the Gol server.
    >***NOTE:** Behaviour of new controller connected*
    >
    >*A new controller should be able to take over interaction with the Gol engine.\
    >Note that you are free to define the nature of how a new controller can take over interaction.
    >Most likely the state will be reset.\
    >If you do manage to continue with the previous world this would be considered a form of [fault tolerance](/extensions#fault-tolerance).*

- If `k` is pressed, all components of the distributed system are shut down cleanly, and the system outputs a PGM image of the latest state.

- If `p` is pressed, pause the processing *on the AWS node* and have the *controller* print the current turn that is being processed.\
If `p` is pressed again resume the processing and have the controller print `Continuing`.
    > ***NOTE:**
    > It is **necessary** for `q` and `s` to work while the execution is paused.*

### Test

To run the program and test the control rules manually, type the following in the terminal of your **local controller**.

``` bash
cargo run --release
```

To specify server address, type (127.0.0.1:8030 in this case)

``` bash
cargo run --release -- --server_addr "127.0.0.1:8030"
```
