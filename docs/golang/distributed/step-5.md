<!--@include: index.md-->
#

## Step 5 (Consider going straight to Step 6)

![Step 5](/assets/cw_diagrams-Distributed_5.png)

Split up the computation of the Gol board state (from the Gol server) across multiple worker machines (AWS nodes).

You will need some means of distributing work between multiple AWS machines and gathering results together in one place
while avoiding any errors in the collected board state.

Try to design your solution so it takes advantage of the possible *scalability* of many worker machines.

Make sure to keep the communication between nodes as efficient as possible.
For example, consider a [halo exchange](/extensions#halo-exchange) scheme where only the edges are communicated between the nodes.
