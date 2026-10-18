# Marking Scheme

You will receive a mark out of 100 for this coursework, and it is worth 70% of the total unit mark.

## How your submission is judged

Think of your submission as being analogous to a **CV**. Your code, your report and your recorded prompts are *claims* about what you have done, what you understand, and what you are prepared to defend in the [viva](/viva).

There is a great deal of latitude in the marking scheme below. Where your mark lands depends heavily on your performance in the viva, so being able to **explain and discuss what you have submitted is critical**. Submit only what you understand and are ready to talk about: a claim you cannot defend is worth little.

The percentages in the sections below are the percentage of that section's marks.

## Parallel Implementation (35 marks)

20% - Single-threaded implementation.

30% - Parallel implementation implementation with the number of workers hardcoded to a non-1 value.

40% - Parallel Game of Life implementation (see Step 2).
The number of threads *cannot* be hardcoded but it may be the case that only some configurations are working
(e.g it's only working if the number of threads is a power of 2).

50% - Parallel Game of Life implementation, all configurations working.

Additional marks are available for satisfying further success criteria, up to:

65% - Satisfy *all* [success criteria](/golang/parallel/success-criteria) for this stage with your **primary implementation**.
This is the single implementation that you submit for correctness and expect to discuss primarily in the viva (see [Submission](/submission#submission-folder-structure)).

70%+ - In addition, implement and analyse the **three extensions** described in [Three Memory Strategies](/golang/parallel/approaches/):
heap allocation, double buffering and map-reduce.
Submit them in `extensions.zip`, and compare them in your benchmarking and analysis.

## Distributed Implementation (35 marks)

40% - You must be able to demonstrate a distributed Game of Life implementation.
It must be running a single AWS Gol Engine Node that is controlled by a locally running controller (see Step 1).

65% - Satisfy *all* [success criteria](/golang/distributed/success-criteria) for this stage with your **primary implementation**.
This is the single implementation that you submit for correctness and expect to discuss primarily in the viva.

70%+ - In addition, attempt one or more of the [extensions](/extensions).
Your primary implementation may itself incorporate extensions. Only additional extensions that are not part of it go in `extensions.zip`.
Be prepared to explain and defend all of them in the viva.

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
