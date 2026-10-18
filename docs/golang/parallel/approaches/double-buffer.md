# Approach 2: Double Buffering

## Task

Implement the parallel Game of Life using **two boards that are allocated once**: a *source* and a *destination*.
In every iteration the workers read from the source and write their results into the destination.
After the iteration, the pointers to source and destination are **switched**, so the destination becomes the source for the next iteration.
No board is allocated or copied during the run.

## Visualisation

Step through one iteration. Colours show which worker wrote each cell of the destination board.

<div class="widget">
<div class="controls">
<label>Workers <input type="range" min="1" max="8" v-model.number="threads" @input="reset"> <b>{{ threads }}</b></label>
<button @click="advance">{{ phaseButton }}</button>
<button @click="runTurn">Run whole turn</button>
<button class="ghost" @click="reset">Reset</button>
<span class="turn">turn {{ turn }}</span>
</div>
<div class="boards">
<div v-for="k in [0, 1]" :key="k" class="board">
<div class="label" :class="role(k)">Buffer {{ k === 0 ? 'A' : 'B' }} · {{ role(k) }}</div>
<div class="grid" :style="gridStyle">
<span v-for="(v, i) in bufs[k]" :key="i" class="cell" :class="{ on: v }" :style="cellStyle(k, i, v)"></span>
</div>
</div>
</div>
<p class="caption"><b>Phase {{ phase + 1 }}/3.</b> {{ caption }}</p>
</div>

## Requirements

- Both boards are allocated up front; steady-state iterations perform no per-iteration board allocations.
- Exactly `gol.Params.Threads` workers, each responsible for a horizontal strip of the destination.
- The source and destination pointers are switched once per iteration.
- Correct handling of the board edges (the world wraps around), including rows that lie in a neighbouring worker's strip.
- All of the features from Steps 3 to 6 keep working: the ticker, PGM output, keyboard controls and SDL events.
- Passes all tests, including with `-race`.

## Components to build

| Component | Responsibility |
|---|---|
| Two boards | Allocated once, before the first iteration. One is the source, the other the destination. |
| Distributor | Starts each iteration, waits for it to finish, and performs the switch. |
| Workers | Compute their strip of the destination from the source. |
| Communication | Whatever you need to start an iteration and to learn that it has finished. You choose the mechanism. |

## Suggested steps

1. Allocate the two boards and copy the initial state into the source.
2. Give each worker access to both boards and a strip to be responsible for.
3. Run one iteration with a single worker and compare against your baseline.
4. Add the switch and run many iterations; then increase the number of workers.
5. Re-run the full test-suite, including `-race`, after each change.

Analysis questions, benchmarks and report guidance for this approach are in [Benchmarking and Testing](benchmarking#_2-2-approach-2-double-buffer).

<script setup>
import { ref, computed } from 'vue'
const N = 16
const blank = () => new Array(N * N).fill(0)
function seed() {
  const g = blank()
  ;[[1, 0], [2, 1], [0, 2], [1, 2], [2, 2], [9, 11], [10, 11], [11, 11], [7, 3], [8, 3], [7, 4], [8, 4]].forEach(([x, y]) => { g[y * N + x] = 1 })
  return g
}
const threads = ref(4)
const bufs = ref([seed(), blank()])
const src = ref(0)
const phase = ref(0)
const turn = ref(0)
const writer = ref(new Array(N).fill(-1)) // which worker wrote each row of dst this turn

const rowOwner = computed(() => {
  const n = Math.min(threads.value, N)
  const base = Math.floor(N / n), extra = N % n
  const owner = []
  for (let i = 0; i < n; i++) {
    const size = base + (i < extra ? 1 : 0)
    for (let k = 0; k < size; k++) owner.push(i)
  }
  return owner
})
const gridStyle = { gridTemplateColumns: `repeat(${N}, 1fr)` }
const captions = [
  'Turn begins. Workers will read SRC (everything) and write only their own rows of DST. DST currently holds stale data.',
  'Each worker has filled its strip of DST. Rows were written by exactly one worker each, so no locks were needed. Everyone now waits at the barrier.',
  'Barrier passed (all done signals received). Swap the two pointers: DST becomes the new SRC. Nothing is copied.'
]
const caption = computed(() => captions[phase.value])
const phaseButton = computed(() => ['1 · Workers compute', '2 · Pass barrier', '3 · Swap pointers'][phase.value])
const role = (k) => (src.value === k ? 'SRC' : 'DST')

function rule(g, x, y) {
  let n = 0
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    if (dx || dy) n += g[((y + dy + N) % N) * N + ((x + dx + N) % N)]
  }
  const cur = g[y * N + x]
  return (cur && (n === 2 || n === 3)) || (!cur && n === 3) ? 1 : 0
}
function advance() {
  if (phase.value === 0) {
    const s = bufs.value[src.value], d = bufs.value[1 - src.value]
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) d[y * N + x] = rule(s, x, y)
    writer.value = rowOwner.value.slice()
    phase.value = 1
  } else if (phase.value === 1) {
    phase.value = 2
  } else {
    src.value = 1 - src.value
    writer.value = new Array(N).fill(-1)
    turn.value++
    phase.value = 0
  }
}
function runTurn() { do { advance() } while (phase.value !== 0) }
function reset() {
  bufs.value = [seed(), blank()]
  src.value = 0; phase.value = 0; turn.value = 0
  writer.value = new Array(N).fill(-1)
}
function cellStyle(k, i, v) {
  if (!v) return {}
  const isDst = src.value !== k
  const w = writer.value[Math.floor(i / N)]
  if (isDst && phase.value > 0 && w >= 0) return { background: `hsl(${(w * 47) % 360} 70% 55%)` }
  return {}
}
</script>

<style scoped>
.widget { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 12px 16px; margin: 16px 0; background: var(--vp-c-bg-soft); }
.controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 10px; }
.controls button { background: var(--vp-c-brand-3); color: #fff; border: 0; border-radius: 6px; padding: 4px 12px; cursor: pointer; }
.controls button.ghost { background: transparent; color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); }
.turn { margin-left: auto; font-variant-numeric: tabular-nums; color: var(--vp-c-text-2); }
.boards { display: flex; flex-wrap: wrap; gap: 20px; }
.board { flex: 1 1 220px; max-width: 320px; }
.label { font-weight: 600; font-size: 0.85em; margin-bottom: 4px; padding: 2px 8px; border-radius: 4px; display: inline-block; }
.label.SRC { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.label.DST { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); }
.grid { display: grid; gap: 1px; background: var(--vp-c-divider); border: 1px solid var(--vp-c-divider); aspect-ratio: 1; }
.cell { background: var(--vp-c-bg); }
.cell.on { background: var(--vp-c-text-1); }
.caption { font-size: 0.9em; margin: 10px 0 0; }
.diagram { margin: 16px 0; }
</style>
