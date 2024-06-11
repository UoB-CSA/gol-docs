<!--@include: index.md-->
#

## Step 6

![Step 6](/assets/cw_diagrams-Distributed_6.png)

Reducing coupling between the "Local Controller" and the "Gol workers" is desirable.
To initiate communication, the "Local Controller" connects to the broker machine via RPC.
This allows the "Local Controller" to start the game by calling the main "Broker" method, which returns the final game state once it is finished.
Likewise, the "Broker" connects to the "Gol workers".
It is then able to give them slices of the game world and ask them to return the result of iterating on it.

It is fine to have the Broker and Local Controller running on the same machine to get around firewall / port forwarding issues.

::: info Largest Image
We created a [5120x5120 pgm file](http://seis.bristol.ac.uk/~sh1670/5120x5120.pgm) if you wish to test or benchmark your solution with a very large image.
:::
