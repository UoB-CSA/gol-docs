# Approach 1: Heap Allocation per Iteration

## Task

Implement the parallel Game of Life so that **in every iteration, each worker goroutine allocates new memory on the heap for the horizontal strip it computes**.
The worker reads the previous state of the board, writes the new state of its strip into the memory it has just allocated, and returns that strip to the distributor.
The distributor assembles the strips into the board for the next iteration.

## How an iteration flows

<div class="diagram">
<svg viewBox="0 0 900 270" role="img" aria-label="Heap allocation turn flow" style="width:100%;height:auto;font-family:var(--vp-font-family-base);font-size:13px">
<defs><marker id="a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-2)"/></marker></defs>
<rect x="20" y="20" width="150" height="150" rx="8" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/>
<text x="95" y="42" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">world t</text>
<text x="95" y="60" text-anchor="middle" style="fill:var(--vp-c-text-2)">shared, read-only</text>
<rect x="35" y="72" width="120" height="28" style="fill:hsl(210 70% 60% / .35)"/><rect x="35" y="100" width="120" height="28" style="fill:hsl(150 60% 45% / .35)"/><rect x="35" y="128" width="120" height="28" style="fill:hsl(35 85% 55% / .35)"/>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#a1)">
<line x1="172" y1="86" x2="300" y2="50"/><line x1="172" y1="114" x2="300" y2="114"/><line x1="172" y1="142" x2="300" y2="178"/></g>
<g style="fill:var(--vp-c-text-1)">
<rect x="302" y="26" width="190" height="48" rx="6" style="fill:hsl(210 70% 60% / .35);stroke:hsl(210 70% 50%)"/><text x="397" y="46" text-anchor="middle" style="fill:var(--vp-c-text-1)">worker 0: make(strip)</text><text x="397" y="63" text-anchor="middle" style="fill:var(--vp-c-text-2)">rows 0..a, new heap memory</text>
<rect x="302" y="90" width="190" height="48" rx="6" style="fill:hsl(150 60% 45% / .35);stroke:hsl(150 60% 40%)"/><text x="397" y="110" text-anchor="middle" style="fill:var(--vp-c-text-1)">worker 1: make(strip)</text><text x="397" y="127" text-anchor="middle" style="fill:var(--vp-c-text-2)">rows a..b, new heap memory</text>
<rect x="302" y="154" width="190" height="48" rx="6" style="fill:hsl(35 85% 55% / .35);stroke:hsl(35 85% 45%)"/><text x="397" y="174" text-anchor="middle" style="fill:var(--vp-c-text-1)">worker 2: make(strip)</text><text x="397" y="191" text-anchor="middle" style="fill:var(--vp-c-text-2)">rows b..H, new heap memory</text></g>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#a1)">
<line x1="494" y1="50" x2="620" y2="86"/><line x1="494" y1="114" x2="620" y2="114"/><line x1="494" y1="178" x2="620" y2="142"/></g>
<text x="557" y="228" text-anchor="middle" style="fill:var(--vp-c-text-2)">result channels</text>
<rect x="622" y="20" width="150" height="150" rx="8" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/>
<text x="697" y="42" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">world t+1</text>
<text x="697" y="60" text-anchor="middle" style="fill:var(--vp-c-text-2)">assembled from strips</text>
<rect x="637" y="72" width="120" height="28" style="fill:hsl(210 70% 60% / .35)"/><rect x="637" y="100" width="120" height="28" style="fill:hsl(150 60% 45% / .35)"/><rect x="637" y="128" width="120" height="28" style="fill:hsl(35 85% 55% / .35)"/>
<text x="810" y="95" style="fill:var(--vp-c-text-2)">world t is now</text><text x="810" y="113" style="fill:var(--vp-c-text-2)">unreferenced →</text><text x="810" y="131" style="fill:var(--vp-c-danger-1);font-weight:600">GC</text>
<text x="450" y="258" text-anchor="middle" style="fill:var(--vp-c-text-2)">The distributor assembles the strips into the next board.</text>
</svg>
</div>

## Requirements

- Exactly `gol.Params.Threads` workers, each owning one horizontal strip. Strip heights should differ by at most one row, including when the height is not a multiple of the worker count.
- New memory for each worker's strip is allocated **inside the iteration loop**, not once at start-up.
- Workers must not modify the board that other workers are reading.
- Correct handling of the board edges (the world wraps around).
- All of the features from Steps 3 to 6 keep working: the ticker, PGM output, keyboard controls and SDL events.
- Passes all tests, including with `-race`.

## Components to build

| Component | Responsibility |
|---|---|
| Distributor | Hands the current board to the workers each iteration, collects their strips, and assembles the next board. |
| Workers | Allocate memory for their strip, compute it from the previous board, and return it. |
| Communication | Channels between the distributor and the workers. You choose what travels over them. |

## Suggested steps

1. Start from your Step 2 worker-pool implementation and note where its output memory is currently allocated.
2. Change the workers so that each iteration they allocate their own output and return it, rather than writing into shared storage.
3. Change the distributor so that the next board is built from the returned strips.
4. Re-run the full test-suite, including `-race`, after each change.

Analysis questions, benchmarks and report guidance for this approach are in [Benchmarking and Testing](benchmarking#_2-1-approach-1-heap-allocation).
