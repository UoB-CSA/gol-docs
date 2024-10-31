# Report Guidance

::: tip Video Walkthrough of Report Component
[Watch here](https://web.microsoftstream.com/video/b5e8cf95-981c-4c26-8522-cc0210293d51)
:::

## Parallel Implementation report, more details

- Discuss the goroutines you used and how they work together: this is **not** just your workers!
Refer to [step 5](parallel/step-5#step-5)
of the task description as a starting point

- Explain and analyse the benchmark results obtained.
Prescriptive guidance on obtaining benchmarks is described in [Question 1d for concurrency lab 1.](https://github.com/UoB-CSA/concurrency-lab-1#question-1d).
Look at [the code provided](https://github.com/UoB-CSA/concurrency-lab-1/blob/master/filter/medianFilter_test.go) to obtain the graph produced.
To adapt this to your Gol implementation consider basing your code around [func TestGol](https://github.com/UoB-CSA/gol-skeleton/blob/master/gol_test.go#L15) provided in the skeleton code for Gol.
Remember for the benchmark we are concerned with performance **not** correctness.
  - Also refer to [Google's documentation for benchmarking.](https://pkg.go.dev/testing#hdr-Benchmarks)

- You may want to consider using graphs to visualise your benchmarks.
To obtain your graph refer to [Question 1d for concurrency lab 1.](https://github.com/UoB-CSA/concurrency-lab-1#question-1d) Remember you do not have to use Python to plot the graph you can use Excel, MATLAB, Libre Office etc...

- Analyse how your implementation scales as more workers are added.
Remember you have been given a template solution for this in [the solution for concurrency lab 1.](https://www.ole.bris.ac.uk/bbcswebdav/courses/COMS20008_2021_TB-1/CONTENT_2021/solutions/conc_lab1.zip) Adapt the text in README.md in the zip file.

- Briefly discuss your methodology for acquiring any results or measurements. **This will relate directly to how your benchmark code is parameterised**

### A little more advanced

- Consider implementing and benchmarking differently parameterised and differently designed implementations.
For example, a pure channels implementation which does not use shared memory.

- To go a little deeper, look at [question 1g](https://github.com/UoB-CSA/concurrency-lab-1#optional-question-1g) which involves use of [the powerful tool, pprof](https://go.dev/blog/pprof) and [question 1i](https://github.com/UoB-CSA/concurrency-lab-1#optional-question-1i).

- Using these tools for Gol will add extra depth to your report.

- Only a few groups did this last year so do not worry if you do not complete this part

## Distributed Implementation report, more details

- Discuss the system design and reasons for any decisions made.
Consider using a diagram to aid your discussion.
Once again refer to the [diagrams](distributed/step-1.md)
provided in the task description as a starting point.

- Explain what data is sent over the network, when, and why it is necessary.

- Discuss how your system might scale with the addition of other distributed components.

- Briefly discuss your methodology for acquiring any results or measurements.

- Note that **our expectations with respect to empirical tests and benchmarking are far lower for the distributed component on the coursework** and a single graph, showing how performance scales with the number of worker nodes will normally be ample.

- Identify how components of your system disappearing (e.g., broken network connections) might affect the overall system and its results.

## Previous Student Examples

- [Here is a partially complete report from last year](https://uob.sharepoint.com/:f:/r/teams/UnitTeams-COMS20008-2024-25-TB-1-A/Class%20Materials/CONTENT_2024/OTHER/g.pdf) that scored highly

- [Here is an outstanding report from 2018.](https://uob.sharepoint.com/:f:/r/teams/UnitTeams-COMS20008-2024-25-TB-1-A/Class%20Materials/CONTENT_2024/OTHER/e.pdf)
Note that the unit was quite different then and had no distributed component, so the content is not completely relevant to this year. This report was done in Latex using a conference paper template.

## Example Benchmark Function

Name it something like my_benchmark_test.go

``` go
package main

import (
    "fmt"
    "os"
    "testing"
    "uk.ac.bris.cs/gameoflife/gol"
)

const benchLength = 1000

func BenchmarkGol(b *testing.B) {
    for threads := 1; threads <= 16; threads++ {
        os.Stdout = nil // Disable all program output apart from benchmark results
        p := gol.Params{
            Turns:       benchLength,
            Threads:     threads,
            ImageWidth:  512,
            ImageHeight: 512,
        }
        name := fmt.Sprintf("%dx%dx%d-%d", p.ImageWidth, p.ImageHeight, p.Turns, p.Threads)
        b.Run(name, func(b *testing.B) {
            for i := 0; i < b.N; i++ {
                events := make(chan gol.Event)
                go gol.Run(p, events, nil)
                for range events {

                }
            }
        })
    }
}
```
