# Extension: Three Memory Strategies for the Parallel Engine

In this extension you will implement the parallel Game of Life **three times**, then benchmark and compare the designs and explain your findings.
All three use the decomposition from [Step 2](../step-2): `gol.Params.Threads` worker goroutines, each responsible for a **horizontal strip** of the board.
They differ only in how memory for the next generation is managed.

| | Approach | Summary |
|---|---|---|
| 1 | [Heap allocation](heap-allocation) | Each worker allocates fresh memory for its strip in every iteration. |
| 2 | [Double buffer](double-buffer) | Source and destination grids are allocated once; the pointers are switched after each iteration. |
| 3 | [Map-reduce](map-reduce) | Workers push the coordinates of cells to be flipped into a buffered channel, which is processed to update the board. |

Then complete [Benchmarking and Testing](benchmarking), which sets out how to verify and measure the implementations, and contains the analysis questions and report guidance for each approach.

## Overview

<div class="diagram">
<svg viewBox="0 0 900 330" role="img" aria-label="Three memory strategies side by side" style="width:100%;height:auto;font-family:var(--vp-font-family-base);font-size:13px">
<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-2)"/></marker></defs>
<g transform="translate(10,0)">
<text x="140" y="22" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">1 · Heap allocation</text>
<rect x="20" y="40" width="90" height="46" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/>
<text x="65" y="68" text-anchor="middle" style="fill:var(--vp-c-text-1)">world t</text>
<rect x="170" y="40" width="90" height="46" rx="6" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/>
<text x="215" y="68" text-anchor="middle" style="fill:var(--vp-c-text-1)">world t+1 (new)</text>
<line x1="110" y1="63" x2="168" y2="63" style="stroke:var(--vp-c-text-2)" marker-end="url(#arr)"/>
<text x="140" y="108" text-anchor="middle" style="fill:var(--vp-c-text-2)">workers: make() every turn</text>
<rect x="20" y="130" width="240" height="30" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider);stroke-dasharray:4 3"/>
<text x="140" y="150" text-anchor="middle" style="fill:var(--vp-c-text-2)">world t → garbage → GC</text>
<text x="140" y="190" text-anchor="middle" style="fill:var(--vp-c-text-2)">Memory: grows then collected</text>
<text x="140" y="210" text-anchor="middle" style="fill:var(--vp-c-text-2)">Sync: your design</text>
</g>
<g transform="translate(310,0)">
<text x="140" y="22" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">2 · Double buffer</text>
<rect x="20" y="40" width="90" height="46" rx="6" style="fill:var(--vp-c-brand-soft);stroke:var(--vp-c-brand-1)"/>
<text x="65" y="68" text-anchor="middle" style="fill:var(--vp-c-text-1)">src (A)</text>
<rect x="170" y="40" width="90" height="46" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/>
<text x="215" y="68" text-anchor="middle" style="fill:var(--vp-c-text-1)">dst (B)</text>
<line x1="110" y1="63" x2="168" y2="63" style="stroke:var(--vp-c-text-2)" marker-end="url(#arr)"/>
<path d="M215,92 C215,130 65,130 65,92" fill="none" style="stroke:var(--vp-c-text-2)" marker-end="url(#arr)"/>
<text x="140" y="150" text-anchor="middle" style="fill:var(--vp-c-text-2)">swap pointers after barrier</text>
<text x="140" y="190" text-anchor="middle" style="fill:var(--vp-c-text-2)">Memory: constant (2 grids)</text>
<text x="140" y="210" text-anchor="middle" style="fill:var(--vp-c-text-2)">Sync: your design</text>
</g>
<g transform="translate(610,0)">
<text x="140" y="22" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">3 · Map-reduce</text>
<rect x="10" y="40" width="70" height="46" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/>
<text x="45" y="68" text-anchor="middle" style="fill:var(--vp-c-text-1)">workers</text>
<rect x="105" y="40" width="70" height="46" rx="6" style="fill:var(--vp-c-warning-soft);stroke:var(--vp-c-warning-1)"/>
<text x="140" y="68" text-anchor="middle" style="fill:var(--vp-c-text-1)">chan Cell</text>
<rect x="200" y="40" width="70" height="46" rx="6" style="fill:var(--vp-c-brand-soft);stroke:var(--vp-c-brand-1)"/>
<text x="235" y="68" text-anchor="middle" style="fill:var(--vp-c-text-1)">reducer</text>
<line x1="80" y1="63" x2="103" y2="63" style="stroke:var(--vp-c-text-2)" marker-end="url(#arr)"/>
<line x1="175" y1="63" x2="198" y2="63" style="stroke:var(--vp-c-text-2)" marker-end="url(#arr)"/>
<rect x="60" y="130" width="160" height="30" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/>
<text x="140" y="150" text-anchor="middle" style="fill:var(--vp-c-text-2)">one world, flipped in place</text>
<text x="140" y="190" text-anchor="middle" style="fill:var(--vp-c-text-2)">Memory: 1 grid + flip list</text>
<text x="140" y="210" text-anchor="middle" style="fill:var(--vp-c-text-2)">Sync: your design</text>
</g>
<text x="450" y="290" text-anchor="middle" style="fill:var(--vp-c-text-2)">All three: identical strips, identical kernel, identical Engine interface.</text>
</svg>
</div>

## Ground rules

- **All three implementations must be correct.** Each must pass every test your parallel implementation is marked against (`TestGol`, `TestAlive`, `TestPgm`, `TestKeyboard`, `TestSdl`) and be free of data races (`go test ./tests -race`).
- **Keep the comparison fair.** The only thing that should differ between approaches is the memory strategy. Use the same cell-update logic, the same way of splitting the board into strips, and the same inputs in all three; otherwise you cannot attribute a performance difference to the design.
- **Respect the full set of features.** Each approach must still support the ticker, PGM output, keyboard controls and SDL events from Steps 3 to 6. Think about what each design means for producing `CellFlipped` / `CellsFlipped` events and for saving a snapshot while the game is running.

## Suggested order of work

1. Get your single design from Steps 1 to 6 working and passing the tests; this is your baseline.
2. Implement each approach in turn, running the full test-suite before moving on.
3. Build the correctness and benchmarking harness described in [Benchmarking and Testing](benchmarking).
4. Measure, profile, and answer the analysis questions in [Benchmarking and Testing](benchmarking#_2-design-and-analysis-by-approach).
