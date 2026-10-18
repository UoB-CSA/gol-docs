# Benchmarking and Testing the Three Approaches

This page sets out how you should **verify** and **measure** your three implementations. You are expected to write the test and benchmark code yourselves.

## 1. Questions to investigate

Write down what you expect *before* you measure, then compare. A result that contradicts your expectation is a finding; explain it.

- How do the three approaches compare in run time as the board size increases?
- How does each approach scale as workers are added? Where does it stop improving, and why?
- How much memory does each approach allocate, and how much time is the garbage collector responsible for?
- Does the pattern being simulated (how many cells change per turn) change which approach is best?
- What is the cost, in each approach, of producing the flipped-cell information the visualiser needs?

## 2. Design and analysis by approach

The implementation pages tell you *what to build*. This section is where you reason about *why it behaves as it does*; your report should answer these questions using evidence from the rest of this page.

### Comparing the approaches

As you work, fill in your own version of this table with evidence (benchmark output, profiles, reasoning).

| Dimension | 1 · Heap | 2 · Double buffer | 3 · Map-reduce |
|---|---|---|---|
| Memory allocated per iteration | | | |
| Which goroutine writes to which memory | | | |
| Synchronisation needed, and when | | | |
| Is a snapshot of the board safe to hand to another goroutine? | | | |
| Cost of reporting flipped cells | | | |
| Behaviour as the number of workers grows | | | |
| Behaviour as the board size grows | | | |
| Behaviour when few cells change per turn | | | |
| Main risks / failure modes | | | |

### 2.1 Approach 1: Heap allocation

**Design questions**

1. Are your worker goroutines long-lived or created per iteration? What are the trade-offs, and which did you choose?
2. How do the workers and the distributor communicate, and how do you know no goroutine reads memory another is writing?
3. How does the distributor build the next board from the strips? Does it copy cell data, or can it avoid doing so?
4. What happens to the previous iteration's memory? Which part of the Go runtime is now involved?
5. How would you confirm whether a given allocation lives on the heap or the stack?
6. Does it matter for your design whether the previous board can still be used after the next iteration has been computed?

**Things to investigate**

- How much memory is allocated per iteration, and how does that scale with board size and with the number of workers?
- How many individual allocations does one iteration perform? Can that number change without changing the number of bytes?
- How much of the run time is spent on allocation and garbage collection rather than computing cells? Which tools tell you?
- What happens to the results if you change how often the garbage collector runs?

**Optional extensions**

- Create worker goroutines per iteration instead of reusing them, and measure the difference.
- Reduce the *number* of allocations each worker makes per iteration without changing the number of *bytes*.

### 2.2 Approach 2: Double buffer

**Design questions**

1. How does each worker obtain access to the source and destination boards? What does it hold, and what does it get told each iteration?
2. At what point is it safe to switch the pointers? What guarantees that no worker is still using the old ones?
3. Workers need the rows just above and below their strip. Where do they read them from, and why is that safe?
4. What would go wrong if a worker read neighbouring rows from the destination board instead? Would your tests detect it for every number of workers?
5. The `s` key, the `q` key and pausing all need the current board. What can you safely hand to another goroutine, and when?
6. How do you produce `CellFlipped` / `CellsFlipped` events in this design, and what does that cost?
7. How do you make sure the race detector can verify your synchronisation argument?

**Things to investigate**

- Memory allocated per iteration compared with Approach 1.
- How performance changes as the board grows, and as the number of workers grows. Does the board eventually become too big for your machine's caches?
- Whether the way you synchronise the end of an iteration affects performance.

**Optional extensions**

- Compare channel-based signalling with other synchronisation primitives from the standard library for the end-of-iteration step.
- Store each board in a single contiguous block of memory and compare against a slice per row.
- Remove the modulo operations used for wrap-around, and measure what that is worth on small boards.

### 2.3 Approach 3: Map-reduce

**Design questions**

You are free to process the channel at the end of each iteration, or concurrently with the workers if you believe that can work. Whichever you choose, your report must justify it.

1. When can the board be updated from the collected coordinates? What would go wrong if cells were flipped while other workers were still counting neighbours? Be precise about what could happen, including whether it would be deterministic.
2. Which parts of the reduce step (receiving coordinates, storing them, applying them to the board) could safely overlap with the workers, and which could not?
3. What size does the channel's buffer need to be? What happens if nothing receives from the channel until all workers have finished and the buffer is smaller than the number of flips?
4. How does the reducer know that every worker has finished and that the channel has been fully drained?
5. Is the reduce step serial in your design? What does that imply for how the approach scales as workers are added?
6. How does the amount of work done after the map phase depend on the pattern being simulated?
7. What does this design give you for the visualiser that the other two do not?

**Things to investigate**

- Run time as a function of the number of workers, compared with Approaches 1 and 2.
- The effect of the channel's buffer size.
- How the approach behaves on boards where many cells change per turn compared with boards that have settled down.
- Where the time goes: use a CPU profile and an execution trace to look for the serial section.

**Optional extensions**

- Reduce channel traffic by having workers send cells in batches rather than one at a time, and measure the effect.
- Remove the serial part of the reduce by letting workers retain their own flip lists and apply them in parallel.
- Skip work in regions of the board that cannot change.

### 2.4 What to say in your report

| Approach | Your report should |
|---|---|
| 1 · Heap | Describe the design, state which costs you expect, and support or refute that with measurements. |
| 2 · Double buffer | Explain the synchronisation between workers and distributor, argue why the design is free of data races, and compare with Approach 1 using your evidence. |
| 3 · Map-reduce | State whether you process the channel concurrently or at the end of each iteration, and justify it with a correctness argument and measurements. |

## 3. Keep the experiment controlled

Only the thing you are studying should change between measurements.

- Same cell-update logic, strip splitting and starting board for all three approaches.
- Same number of iterations in every measured run. (Activity in Game of Life changes over time, so letting the benchmark framework choose the number of iterations would make different configurations simulate different workloads.)
- Same machine, same power settings, same Go version, no other heavy programs running, no SDL window during benchmarks.
- Record your hardware (CPU model, physical and logical cores), operating system and `go version`.

## 4. Testing for correctness

A fast wrong answer is not a result. Before benchmarking, show that **all three** implementations are correct.

1. Run the course tests against each approach, with the race detector:
   ```bash
   go test ./tests -v -race
   ```
2. Write your own tests that compare each approach against an **independent, deliberately simple reference implementation** of the rules. Think about what the reference should *not* share with your parallel code.
3. Choose test inputs that stress the edges of your design. Consider at least:
   - square and non-square boards, and very small ones;
   - board heights that are not divisible by the number of workers;
   - more workers than rows;
   - one worker;
   - patterns with known behaviour (still lifes, oscillators, a glider crossing the edge of the board);
   - random boards at several densities and many iterations.
4. Check more than the final board: compare after every iteration, and check the flipped-cell information as well as the board.
5. Check that the caller's starting board is not modified, and that no goroutines are left running after the game finishes.
6. For Approach 3, test small channel buffer sizes so that a design flaw cannot hide behind a large buffer. Run with a timeout so that a deadlock fails the test instead of hanging it:
   ```bash
   go test ./... -race -timeout 120s
   ```
7. **Show your tests can fail.** Deliberately introduce a bug into each approach (for instance reading from the wrong board, or updating the board too early) and confirm that your tests catch it.

## 5. Benchmarking

Use Go's `testing` package benchmarks, as described in the [report guidance](/report-guidance.md#example-benchmark-function), but adapt the structure for this comparison.

- Benchmark each approach at several **board sizes** and **worker counts** (include counts beyond your number of physical cores).
- Report allocation behaviour as well as time (look at the options of `go test -bench`).
- Decide and justify what one benchmark operation measures: a fixed number of iterations from the same starting board is recommended, and a metric of *time per iteration* makes configurations with different iteration counts comparable.
- Consider whether set-up costs (starting goroutines, allocating boards) belong inside or outside the timed region, and say what you chose.
- Benchmark at two levels if you can: the computation engine alone, and the full program via `gol.Run` including events. Compare, and explain the difference.
- Measure the cost of producing flipped-cell information separately from the cost of computing the next generation.

### Running benchmarks

- Repeat every configuration several times (for example `-count=10`) and use the median. One run says nothing about noise.
- Run all approaches in the same session so that thermal throttling or background activity affects them equally.
- Use [`benchstat`](https://pkg.go.dev/golang.org/x/perf/cmd/benchstat) to decide whether a difference is larger than the noise.
- Make your own conversion from benchmark output to a simple CSV with the columns `engine,size,threads,ns_per_turn` (one row per run) so that you can paste it into the explorer below or into any plotting tool you prefer.

## 6. Results explorer

Paste CSV in the form `engine,size,threads,ns_per_turn` (a header line is optional; `#` starts a comment). The explorer plots time per turn and speedup, and tabulates efficiency and the **Karp–Flatt metric**, an experimentally determined serial fraction: `e = (1/S − 1/n) / (1 − 1/n)` for speedup `S` on `n` workers.
Think about what the metric tells you if it stays roughly constant as workers are added, and what it tells you if it grows. The "placeholder" button loads formula-generated numbers purely to demonstrate the charts; they are **not** measurements.

<div class="widget">
<div class="controls">
<label>Board size
<select v-model="selSize"><option v-for="s in sizes" :key="s" :value="s">{{ s }} × {{ s }}</option></select></label>
<button @click="loadPlaceholder">Load placeholder (not real data)</button>
<button class="ghost" @click="raw = ''">Clear</button>
</div>
<textarea v-model="raw" rows="6" spellcheck="false" placeholder="engine,size,threads,ns_per_turn   e.g.   double,512,4,123456"></textarea>
<p v-if="!series.length" class="caption">Paste your <code>results.csv</code> above to draw the charts.</p>
<div v-if="series.length" class="charts">
<svg :viewBox="`0 0 ${W} ${H}`" class="chart" role="img" aria-label="Time per turn versus workers">
<text :x="W / 2" y="16" text-anchor="middle" class="ct">Time per turn (lower is better)</text>
<g v-for="t in yTicksTime" :key="'ty' + t.v"><line :x1="L" :x2="W - R" :y1="t.y" :y2="t.y" class="grid" /><text :x="L - 6" :y="t.y + 4" text-anchor="end" class="tick">{{ t.label }}</text></g>
<g v-for="t in xTicks" :key="'tx' + t.v"><text :x="t.x" :y="H - B + 16" text-anchor="middle" class="tick">{{ t.v }}</text></g>
<polyline v-for="s in series" :key="'tl' + s.name" :points="s.timePath" fill="none" :stroke="s.color" stroke-width="2" />
<g v-for="s in series" :key="'td' + s.name"><circle v-for="p in s.pts" :key="p.th" :cx="xs(p.th)" :cy="yTime(p.t)" r="3" :fill="s.color" /></g>
<text :x="W / 2" :y="H - 4" text-anchor="middle" class="tick">workers</text>
</svg>
<svg :viewBox="`0 0 ${W} ${H}`" class="chart" role="img" aria-label="Speedup versus workers">
<text :x="W / 2" y="16" text-anchor="middle" class="ct">Speedup vs own 1-worker time (higher is better)</text>
<g v-for="t in yTicksSpeed" :key="'sy' + t.v"><line :x1="L" :x2="W - R" :y1="t.y" :y2="t.y" class="grid" /><text :x="L - 6" :y="t.y + 4" text-anchor="end" class="tick">{{ t.label }}</text></g>
<g v-for="t in xTicks" :key="'sx' + t.v"><text :x="t.x" :y="H - B + 16" text-anchor="middle" class="tick">{{ t.v }}</text></g>
<polyline :points="idealPath" fill="none" stroke="currentColor" stroke-dasharray="4 4" opacity=".5" />
<polyline v-for="s in series" :key="'sl' + s.name" :points="s.speedPath" fill="none" :stroke="s.color" stroke-width="2" />
<g v-for="s in series" :key="'sd' + s.name"><circle v-for="p in s.pts" :key="p.th" :cx="xs(p.th)" :cy="ySpeed(p.speedup)" r="3" :fill="s.color" /></g>
<text :x="W / 2" :y="H - 4" text-anchor="middle" class="tick">workers (dashed = ideal)</text>
</svg>
</div>
<div v-if="series.length" class="legend"><span v-for="s in series" :key="'lg' + s.name"><i :style="{ background: s.color }"></i>{{ s.name }}</span></div>
<table v-if="series.length" class="results">
<thead><tr><th>Engine</th><th>Workers</th><th>ns / turn</th><th>Speedup</th><th>Efficiency</th><th>Karp–Flatt e</th><th>vs heap (same workers)</th></tr></thead>
<tbody><template v-for="s in series" :key="'r' + s.name"><tr v-for="p in s.pts" :key="s.name + p.th"><td>{{ s.name }}</td><td>{{ p.th }}</td><td>{{ Math.round(p.t).toLocaleString() }}</td><td>{{ p.speedup.toFixed(2) }}×</td><td>{{ (100 * p.speedup / p.th).toFixed(0) }}%</td><td>{{ p.kf === null ? '–' : p.kf.toFixed(3) }}</td><td>{{ p.vsHeap === null ? '–' : p.vsHeap.toFixed(2) + '×' }}</td></tr></template></tbody>
</table>
<p class="caption" v-if="series.length">Speedup is relative to each engine's own smallest worker count (ideally 1). &quot;vs heap&quot; above 1× means faster than the heap engine at that worker count.</p>
</div>

## 7. Explaining your results

A benchmark tells you *which* is faster; a profile tells you *why*. Use at least some of the following tools and say what each told you:

- CPU and memory profiles with `go tool pprof` (`-cpuprofile`, `-memprofile` with `go test`).
- The garbage collector's trace output (`GODEBUG=gctrace=1`).
- The execution tracer (`-trace` and `go tool trace`) to see scheduling, waiting at barriers and any serial sections.
- Changing one factor at a time (an *ablation*): the garbage-collection setting (`GOGC`), the number of available cores (`GOMAXPROCS`), the channel buffer size, the density of the starting board.

::: warning Be careful with `GOGC=off`
Approach 1 allocates roughly the size of the board every iteration. Turning off the collector on a large board for many iterations can exhaust your machine's memory.
:::

## 8. Threats to validity

Say a sentence about each of these in your methodology.

- **Workload dependence:** a few hundred iterations from a random board is not representative of a long run or of the provided images. Which inputs did you use, and why?
- **Hardware:** core counts, hyper-threading, cache sizes and memory bandwidth shape every curve.
- **Noise:** thermal throttling, background load, garbage-collection timing. How did you control it?
- **Implementation quality:** a weaker implementation of one approach makes it look worse. How did you make sure each was a fair attempt?
- **Small boards:** synchronisation can dominate; more workers may make things slower. That is a valid result.

## 9. Mapping to *In Your Report*

| Report bullet | Evidence you should bring |
|---|---|
| Discuss the goroutines you used and how they work together | A diagram per approach; include the IO, ticker and key-handling goroutines, not just the workers |
| Explain and analyse the benchmark results | Charts of time and speedup per approach, backed by profiles that explain the differences |
| Analyse how your implementation scales as more workers are added | Speedup, efficiency and a serial-fraction estimate for each approach, and your explanation of the shapes |
| Briefly discuss your methodology | Sections 3, 5 and 8 of this page |

<script setup>
import { ref, computed } from 'vue'

const raw = ref('')
const selSize = ref('')
const W = 420, H = 270, L = 58, R = 14, T = 28, B = 40
const palette = ['#e5484d', '#3e63dd', '#30a46c', '#f76b15', '#8e4ec6', '#0090a7']

const rows = computed(() => {
  const out = []
  for (const line of raw.value.split(/\r?\n/)) {
    const s = line.trim()
    if (!s || s.startsWith('#')) continue
    const f = s.split(',').map((x) => x.trim())
    if (f.length < 4) continue
    const size = Number(f[1]), th = Number(f[2]), v = Number(f[3])
    if (!Number.isFinite(size) || !Number.isFinite(th) || !Number.isFinite(v)) continue // skips header
    out.push({ e: f[0], size, th, v })
  }
  return out
})
const sizes = computed(() => [...new Set(rows.value.map((r) => r.size))].sort((a, b) => a - b))
const size = computed(() => (sizes.value.includes(Number(selSize.value)) ? Number(selSize.value) : sizes.value[0]))
const median = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }

const base = computed(() => {
  const groups = new Map()
  for (const r of rows.value) {
    if (r.size !== size.value) continue
    if (!groups.has(r.e)) groups.set(r.e, new Map())
    const g = groups.get(r.e)
    if (!g.has(r.th)) g.set(r.th, [])
    g.get(r.th).push(r.v)
  }
  return groups
})
const maxTh = computed(() => Math.max(1, ...rows.value.filter((r) => r.size === size.value).map((r) => r.th)))
const minTh = computed(() => Math.min(...rows.value.filter((r) => r.size === size.value).map((r) => r.th)))
const maxT = computed(() => Math.max(1, ...rows.value.filter((r) => r.size === size.value).map((r) => r.v)))

const xs = (th) => L + ((th - 1) / Math.max(maxTh.value - 1, 1)) * (W - L - R)
const yTime = (t) => H - B - (t / (maxT.value * 1.05)) * (H - B - T)
const maxSpeed = computed(() => Math.max(2, maxTh.value))
const ySpeed = (s) => H - B - (s / maxSpeed.value) * (H - B - T)

const series = computed(() => {
  const heap = base.value.get('heap')
  const heapMed = heap ? new Map([...heap].map(([k, v]) => [k, median(v)])) : null
  let i = 0
  const out = []
  for (const [name, g] of base.value) {
    const pts = [...g].map(([th, v]) => ({ th, t: median(v) })).sort((a, b) => a.th - b.th)
    const t0 = pts[0].t, n0 = pts[0].th
    for (const p of pts) {
      p.speedup = t0 / p.t
      p.kf = n0 === 1 && p.th > 1 ? (1 / p.speedup - 1 / p.th) / (1 - 1 / p.th) : null
      p.vsHeap = heapMed && heapMed.has(p.th) ? heapMed.get(p.th) / p.t : null
    }
    out.push({
      name, pts, color: palette[i++ % palette.length],
      timePath: pts.map((p) => `${xs(p.th)},${yTime(p.t)}`).join(' '),
      speedPath: pts.map((p) => `${xs(p.th)},${ySpeed(p.speedup)}`).join(' ')
    })
  }
  return out
})
const idealPath = computed(() => `${xs(1)},${ySpeed(1)} ${xs(maxTh.value)},${ySpeed(maxTh.value)}`)
const xTicks = computed(() => {
  const n = maxTh.value, step = n > 8 ? 2 : 1, out = []
  for (let v = 1; v <= n; v += step) out.push({ v, x: xs(v) })
  return out
})
const yTicksTime = computed(() => [0, 0.25, 0.5, 0.75, 1].map((f) => {
  const v = f * maxT.value * 1.05
  return { v, y: yTime(v), label: v >= 1e6 ? (v / 1e6).toFixed(1) + ' ms' : v >= 1e3 ? (v / 1e3).toFixed(0) + ' µs' : v.toFixed(0) + ' ns' }
}))
const yTicksSpeed = computed(() => [0, 0.25, 0.5, 0.75, 1].map((f) => {
  const v = f * maxSpeed.value
  return { v, y: ySpeed(v), label: v.toFixed(1) + '×' }
}))

function loadPlaceholder() {
  // Generated from simple formulas purely to demonstrate the charts. NOT measurements.
  const lines = ['# ILLUSTRATIVE PLACEHOLDER: formula-generated, NOT measured. Replace with your results.csv', 'engine,size,threads,ns_per_turn']
  const model = { heap: [1.0, 0.18, 0.012], double: [0.8, 0.08, 0.002], mapreduce: [1.0, 0.30, 0.020] }
  for (const [e, [work, serial, over]] of Object.entries(model)) {
    for (const th of [1, 2, 4, 8, 16]) {
      lines.push(`${e},512,${th},${Math.round(1e6 * (work * ((1 - serial) / th + serial) + over * th))}`)
    }
  }
  raw.value = lines.join('\n')
  selSize.value = ''
}
</script>

<style scoped>
.widget { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 12px 16px; margin: 16px 0; background: var(--vp-c-bg-soft); }
.controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 10px; }
.controls button { background: var(--vp-c-brand-3); color: #fff; border: 0; border-radius: 6px; padding: 4px 12px; cursor: pointer; }
.controls button.ghost { background: transparent; color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); }
.controls select { background: var(--vp-c-bg); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 2px 6px; }
textarea { width: 100%; box-sizing: border-box; font-family: var(--vp-font-family-mono); font-size: 0.85em; background: var(--vp-c-bg); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 8px; }
.charts { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
.chart { flex: 1 1 300px; max-width: 100%; height: auto; color: var(--vp-c-text-2); }
.chart .grid { stroke: var(--vp-c-divider); }
.chart .tick { fill: var(--vp-c-text-2); font-size: 11px; }
.chart .ct { fill: var(--vp-c-text-1); font-size: 12px; font-weight: 600; }
.legend { display: flex; gap: 16px; flex-wrap: wrap; margin: 8px 0; font-size: 0.9em; }
.legend i { display: inline-block; width: 12px; height: 12px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
.results { display: table; width: 100%; font-size: 0.85em; }
.caption { font-size: 0.85em; color: var(--vp-c-text-2); margin: 8px 0 0; }
</style>
