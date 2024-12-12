# Marking Scheme

You will receive a mark out of 100 for this coursework, and it is worth 80% of the total unit mark.

## Parallel Implementation (35 marks)

20% - Single-threaded implementation.

30% - Parallel implementation implementation with the number of workers hardcoded to a non-1 value.

40% - Parallel Game of Life implementation (see Step 2).
The number of threads *cannot* be hardcoded but it may be the case that only some configurations are working
(e.g it's only working if the number of threads is a power of 2).

50% - Parallel Game of Life implementation, all configurations working.

Additional marks are available for satisfying further success criteria, up to:

70% - Satisfy *all* [success criteria](/golang/parallel/success-criteria) for this stage.

## Distributed Implementation (35 marks)

40% - You must be able to demonstrate a distributed Game of Life implementation.
It must be running a single AWS Gol Engine Node that is controlled by a locally running controller (see Step 1).

70% - Satisfy *all* [success criteria](/golang/distributed/success-criteria) for this stage.

## Report (30 marks)

You need to submit a CONCISE (**strictly** max 6 pages) report which should cover the following topics:

- **Functionality and Design:**\
    Outline what functionality you have implemented, which problems you have solved with your implementations and how your program is designed to solve the problems efficiently and effectively.

- **Critical Analysis:**
  - Describe the experiments and analysis you carried out.
  - Provide a selection of appropriate results.
  - Keep a history of your implementations and provide benchmark results from various stages.
  - Explain and analyse the benchmark results obtained.
  - Analyse the important factors responsible for the virtues and limitations of your implementations.

Make sure your team member’s names and user names appear on page 1 of the report.\
**Do not include a cover page.**
