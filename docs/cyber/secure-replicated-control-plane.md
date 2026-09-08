# Secure and Fault-Tolerant Replicated Control Plane

The distributed implementation currently relies on a central distributor or broker to coordinate workers. This creates a single point of failure: if that process becomes unavailable, the system may no longer be able to allocate work, track workers, or control execution.

Replace the single broker with a small replicated control-plane cluster based on the **Raft consensus algorithm**. The cluster should maintain authoritative state for:

- the current control-plane leader;
- registered worker nodes;
- the current Game of Life job and generation;
- work allocation or scheduling information;
- pause, resume, checkpoint, and termination commands; and
- the location and generation number of the latest valid checkpoint.

Your system should continue to operate, or recover predictably, when the current leader fails. A remaining replica should be elected as leader and resume coordination without allowing conflicting control decisions or silently reverting to stale state.

Add suitable security controls to protect communication with the control plane. Your design should address:

- authentication of control-plane replicas and workers;
- prevention of unauthorised cluster membership;
- integrity protection for control messages;
- detection of duplicated, delayed, or replayed commands;
- rejection of commands from a stale former leader; and
- detection of corrupted or tampered checkpoint metadata.

Before implementing the extension, produce a lightweight threat model containing:

- the assets that require protection;
- the main trust boundaries;
- plausible threats and failure scenarios; and
- security requirements derived from those threats.

Conduct experiments to demonstrate the behaviour of your system under at least the following conditions:

- failure of a follower replica;
- failure of the current leader;
- restart of a failed replica;
- delayed or duplicated control messages;
- an attempted connection by an unauthorised node; and
- stale or modified checkpoint metadata.

Measure the performance overhead introduced by replication and the security controls. Compare the extended implementation with the original single-broker design. You may consider:

- total execution time;
- control-message traffic;
- leader-election time;
- recovery time; and
- the effect of failures on completed generations.

In your report:

- explain the architecture and replicated state model;
- present your threat model and derived security requirements;
- explain how leader election, state replication, authentication, and recovery operate;
- provide evidence that control decisions remain consistent during the tested failures;
- evaluate which threats your implementation addresses and which remain outside its scope; and
- analyse the trade-offs between availability, consistency, security, performance, and implementation complexity.
