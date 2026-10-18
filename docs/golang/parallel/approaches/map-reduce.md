# Approach 3: Map-Reduce over Flipped Cells

## Task

Implement the parallel Game of Life using a **map-reduce** structure:

- **Map:** each worker examines its strip of the board and, for every cell whose state will change this iteration, pushes that cell's coordinates into a **buffered channel**.
- **Reduce:** the coordinates are collected from the channel and used to update the board, so that it holds the next generation.

The board is not copied between iterations; it is updated using only the cells that changed.
You may process the channel at the end of each iteration, or concurrently with the workers if you believe that can work.

## Pipeline

<div class="diagram">
<svg viewBox="0 0 900 250" role="img" aria-label="Map reduce pipeline for one turn" style="width:100%;height:auto;font-family:var(--vp-font-family-base);font-size:13px">
<defs><marker id="a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-2)"/></marker></defs>
<rect x="10" y="20" width="160" height="150" rx="8" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/>
<text x="90" y="42" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">world t</text>
<text x="90" y="60" text-anchor="middle" style="fill:var(--vp-c-text-2)">read-only this phase</text>
<rect x="25" y="72" width="130" height="28" style="fill:hsl(210 70% 60% / .35)"/><rect x="25" y="100" width="130" height="28" style="fill:hsl(150 60% 45% / .35)"/><rect x="25" y="128" width="130" height="28" style="fill:hsl(35 85% 55% / .35)"/>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#a3)"><line x1="172" y1="86" x2="230" y2="60"/><line x1="172" y1="114" x2="230" y2="114"/><line x1="172" y1="142" x2="230" y2="168"/></g>
<text x="300" y="14" text-anchor="middle" style="fill:var(--vp-c-text-2)">MAP</text>
<rect x="232" y="36" width="140" height="44" rx="6" style="fill:hsl(210 70% 60% / .35);stroke:hsl(210 70% 50%)"/><text x="302" y="63" text-anchor="middle" style="fill:var(--vp-c-text-1)">worker 0</text>
<rect x="232" y="92" width="140" height="44" rx="6" style="fill:hsl(150 60% 45% / .35);stroke:hsl(150 60% 40%)"/><text x="302" y="119" text-anchor="middle" style="fill:var(--vp-c-text-1)">worker 1</text>
<rect x="232" y="148" width="140" height="44" rx="6" style="fill:hsl(35 85% 55% / .35);stroke:hsl(35 85% 45%)"/><text x="302" y="175" text-anchor="middle" style="fill:var(--vp-c-text-1)">worker 2</text>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#a3)"><line x1="374" y1="58" x2="440" y2="104"/><line x1="374" y1="114" x2="440" y2="114"/><line x1="374" y1="170" x2="440" y2="124"/></g>
<rect x="442" y="84" width="130" height="60" rx="6" style="fill:var(--vp-c-warning-soft);stroke:var(--vp-c-warning-1)"/>
<text x="507" y="108" text-anchor="middle" style="fill:var(--vp-c-text-1)">chan util.Cell</text><text x="507" y="126" text-anchor="middle" style="fill:var(--vp-c-text-2)">buffered, cap B</text>
<line x1="574" y1="114" x2="620" y2="114" style="stroke:var(--vp-c-text-2)" marker-end="url(#a3)"/>
<text x="690" y="14" text-anchor="middle" style="fill:var(--vp-c-text-2)">REDUCE</text>
<rect x="622" y="84" width="130" height="60" rx="6" style="fill:var(--vp-c-brand-soft);stroke:var(--vp-c-brand-1)"/>
<text x="687" y="108" text-anchor="middle" style="fill:var(--vp-c-text-1)">collector</text><text x="687" y="126" text-anchor="middle" style="fill:var(--vp-c-text-2)">store / process</text>
<line x1="754" y1="114" x2="790" y2="114" style="stroke:var(--vp-c-text-2)" marker-end="url(#a3)"/>
<rect x="792" y="60" width="100" height="110" rx="8" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/>
<text x="842" y="86" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">apply</text><text x="842" y="106" text-anchor="middle" style="fill:var(--vp-c-text-2)">update the</text><text x="842" y="124" text-anchor="middle" style="fill:var(--vp-c-text-2)">board from</text><text x="842" y="142" text-anchor="middle" style="fill:var(--vp-c-text-2)">the flips</text>
<text x="450" y="226" text-anchor="middle" style="fill:var(--vp-c-text-2)">Which parts of the reduce step may overlap with the workers is for you to decide and justify.</text>
</svg>
</div>

## Requirements

- Exactly `gol.Params.Threads` workers, each responsible for a horizontal strip.
- Workers communicate *which cells flip* through a **buffered** channel; they do not return whole strips or boards.
- The board used by the workers for neighbour counting must always be the previous generation, for every cell, in every iteration.
- The same list of flipped cells should be what you use for the `CellFlipped` / `CellsFlipped` events.
- All of the features from Steps 3 to 6 keep working: the ticker, PGM output, keyboard controls and SDL events.
- Passes all tests, including with `-race`, and **does not deadlock** for any buffer size you choose (including very small ones).

## Components to build

| Component | Responsibility |
|---|---|
| Distributor | Starts each iteration and ensures the board holds the next generation before the following one begins. |
| Workers (map) | Find the cells that flip in their strip and send their coordinates. |
| Reducer | Receives the coordinates and updates the board. You decide when and in which goroutine. |
| Channel | Buffered; you choose its capacity. |

## Suggested steps

1. Start with a single worker and the simplest correct reduce step; confirm the board matches your baseline every iteration.
2. Add more workers.
3. Try several channel capacities, including very small ones, to check the design cannot stall.
4. Re-run the full test-suite, including `-race`, after each change.

Analysis questions, benchmarks and report guidance for this approach are in [Benchmarking and Testing](benchmarking#_2-3-approach-3-map-reduce).

<style scoped>
.diagram { margin: 16px 0; }
</style>
