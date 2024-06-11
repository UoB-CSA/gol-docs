<!--@include: index.md-->
#

## Step 2

You should report the number of cells that are still alive *every 2 seconds* to the local controller.

It is anticipated that you will run a ticker on the local controller and make an RPC call to the AWS node (worker/server/broker) every 2 seconds.

The controller should then send an `AliveCellsCount` event to the `events` channel.  

![Step 2](/assets/cw_diagrams-Distributed_2.png)

To test your implementation, type the following in the terminal of your **local controller**.

```bash
cargo test --release --test count
```
