<!--@include: index.md-->
#

## In Your Report

- Discuss the concurrent methods you used and how they work together.
- Explain and analyse the benchmark results obtained. You may want to consider using graphs to visualise your benchmarks.
- Analyse how your implementation scales as more workers are added.
- Briefly discuss your methodology for acquiring any results or measurements.
- Discuss the differences between Rust's async/await mechanism and Golang's goroutines.

:::warning Note on measurements
You might notice that the program displays the average computation turns per second in the console.

> Completed Turns 5883 &emsp;&emsp; Alive Cells 5567 &emsp;&emsp; **Avg  980 turns/sec**

This is intended to give you a **general sense** of how the program is performing compared to previous runs.

**However, this measurement is informal and should NOT be used or cited in your report.**

For formal analysis, please refer to the benchmark results.
:::
