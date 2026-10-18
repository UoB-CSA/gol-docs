# Secure CI/CD and Software Supply-Chain Assurance

Create a continuous integration and delivery pipeline for your Game of Life implementation. The pipeline should provide automated evidence that a submitted version has been built, tested, analysed, and packaged through an identifiable and repeatable process.

<div class="vg">
<div class="vgt">Visual guide: the pipeline at a glance</div>
<p class="vgn">Two layers work together: <b>repository controls</b> decide what is allowed to be merged, and the <b>pipeline</b> produces automated evidence about each change. You choose which stages to include; the brief lists a menu.</p>
<div class="lane"><div class="lname">Repository controls</div>
<div class="flow">
<div class="box">Change proposed<small>push or pull request</small></div><span class="ar">→</span>
<div class="box">Required checks<small>pipeline results</small></div><span class="ar">→</span>
<div class="box">Review<small>before integration</small></div><span class="ar">→</span>
<div class="box gate">Merge to protected branch<small>gate: block merge</small></div>
</div></div>
<div class="lane"><div class="lname">Pipeline stages (each leaves evidence)</div>
<div class="flow">
<div class="box">Build and test<small>tests, results kept</small></div><span class="ar">→</span>
<div class="box">Race / static analysis<small>findings</small></div><span class="ar">→</span>
<div class="box">Dependency scan<small>known vulnerabilities</small></div><span class="ar">→</span>
<div class="box">Secret scan<small>committed credentials</small></div><span class="ar">→</span>
<div class="box">SBOM<small>what is inside</small></div><span class="ar">→</span>
<div class="box">Package artefact<small>versioned</small></div><span class="ar">→</span>
<div class="box">Provenance<small>how it was built</small></div><span class="ar">→</span>
<div class="box">Sign<small>signature</small></div><span class="ar">→</span>
<div class="box">Verify<small>before use</small></div><span class="ar">→</span>
<div class="box gate">Release<small>gate: block release</small></div>
</div></div>
<p class="vgn">Each box should answer a question you can state in the report: <i>what threat or failure does this stage address, and what evidence does it leave behind?</i></p>
</div>

Your pipeline should run when changes are proposed or merged and should include an appropriate selection of the following controls:

- compilation and automated testing;
- race, concurrency, or static analysis;
- dependency and known-vulnerability scanning;
- checks for accidentally committed credentials or secrets;
- production of a Software Bill of Materials (SBOM);
- retention of test and scanning results;
- creation of a versioned deployment artefact;
- generation of build provenance; and
- signing and verification of release artefacts.

Define a security policy that determines which findings should:

- fail the pipeline immediately;
- prevent a change from being merged;
- prevent an artefact from being released;
- generate a warning requiring review; or
- be accepted temporarily as a documented exception.

<div class="vg">
<div class="vgt">Visual guide: design your policy</div>
<p class="vgn">For each controlled problem in the brief, decide what your pipeline should do and why. Click a row to see where in the pipeline it should surface. Your choices appear as a table you can copy into your report. The choices are yours to justify; there is no single right answer.</p>
<div class="strip">
<span v-for="(st, i) in stages" :key="st" class="st" :class="{ hit: scenarios[focus].stage === i }">{{ st }}</span>
<span class="st repo" :class="{ hit: scenarios[focus].stage === -1 }">Repository controls</span>
</div>
<table class="mx pol">
<thead><tr><th>Controlled problem</th><th>Policy outcome</th><th>Why? (and, for exceptions, who approves and when it expires)</th></tr></thead>
<tbody>
<tr v-for="(s, i) in scenarios" :key="s.id" :class="{ sel: focus === i }" @click="focus = i">
<td>{{ s.name }}</td>
<td><select v-model="choice[i]" @click.stop @focus="focus = i"><option value="">choose…</option><option v-for="o in outcomes" :key="o" :value="o">{{ o }}</option></select></td>
<td><input type="text" v-model="why[i]" @click.stop @focus="focus = i" placeholder="your rationale" /></td>
</tr>
</tbody></table>
<div class="controls"><button @click="copy">Copy as Markdown table</button><span v-if="copied" class="ok">Copied</span><span v-if="missing" class="warnmsg">{{ missing }} row(s) still undecided</span></div>
</div>

Configure the repository workflow so that important changes are reviewed before integration. Your design should consider:

- protected branches;
- pull-request review;
- restricted workflow permissions;
- automated dependency updates; and
- secure handling of pipeline secrets.

<div class="vg">
<div class="vgt">Visual guide: a repository workflow with protected paths</div>
<svg viewBox="0 0 900 300" role="img" aria-label="Branching, review and release workflow" style="width:100%;height:auto;font-family:var(--vp-font-family-base);font-size:13px">
<defs><marker id="p2a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-2)"/></marker></defs>
<rect x="20" y="30" width="130" height="44" rx="6" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="85" y="57" text-anchor="middle" style="fill:var(--vp-c-text-1)">Feature branch</text>
<rect x="20" y="110" width="130" height="44" rx="6" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="85" y="132" text-anchor="middle" style="fill:var(--vp-c-text-1)">Dependency update</text><text x="85" y="147" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">(automated)</text>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#p2a)"><line x1="152" y1="52" x2="228" y2="82"/><line x1="152" y1="132" x2="228" y2="102"/></g>
<rect x="230" y="62" width="130" height="60" rx="6" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="295" y="88" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Pull request</text><text x="295" y="106" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">the only way in</text>
<line x1="362" y1="92" x2="418" y2="92" style="stroke:var(--vp-c-text-2)" marker-end="url(#p2a)"/>
<rect x="420" y="30" width="200" height="124" rx="10" style="fill:var(--vp-c-warning-soft);stroke:var(--vp-c-warning-1);stroke-dasharray:6 4"/>
<text x="520" y="52" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Merge conditions</text>
<text x="520" y="78" text-anchor="middle" style="fill:var(--vp-c-text-1);font-size:12px">required pipeline checks pass</text><text x="520" y="98" text-anchor="middle" style="fill:var(--vp-c-text-1);font-size:12px">review before integration</text><text x="520" y="118" text-anchor="middle" style="fill:var(--vp-c-text-1);font-size:12px">no direct pushes</text><text x="520" y="138" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">(who can bypass, if anyone?)</text>
<line x1="622" y1="92" x2="668" y2="92" style="stroke:var(--vp-c-text-2)" marker-end="url(#p2a)"/>
<rect x="670" y="62" width="130" height="60" rx="6" style="fill:var(--vp-c-brand-soft);stroke:var(--vp-c-brand-1);stroke-width:2"/><text x="735" y="88" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Protected main</text><text x="735" y="106" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">history you can trust</text>
<line x1="735" y1="124" x2="735" y2="172" style="stroke:var(--vp-c-text-2)" marker-end="url(#p2a)"/>
<rect x="670" y="174" width="130" height="44" rx="6" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="735" y="201" text-anchor="middle" style="fill:var(--vp-c-text-1)">Version tag</text>
<line x1="672" y1="196" x2="610" y2="230" style="stroke:var(--vp-c-text-2)" marker-end="url(#p2a)"/>
<rect x="400" y="212" width="210" height="66" rx="8" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/><text x="505" y="236" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Release workflow</text><text x="505" y="256" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">the only job that sees signing material</text><text x="505" y="270" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">and write permissions</text>
<rect x="20" y="212" width="340" height="66" rx="8" style="fill:none;stroke:var(--vp-c-divider);stroke-dasharray:4 3"/><text x="30" y="232" style="fill:var(--vp-c-text-1);font-weight:600">Every other workflow</text><text x="30" y="252" style="fill:var(--vp-c-text-2);font-size:12px">minimum permissions by default, no access to</text><text x="30" y="268" style="fill:var(--vp-c-text-2);font-size:12px">secrets, so a malicious change cannot steal them</text>
</svg>
<p class="vgn">Ask of each arrow: <i>who or what can use this path, with which permissions, and what stops it being abused?</i> The brief's list (protected branches, review, restricted permissions, automated dependency updates, secret handling) maps to the boxes above.</p>
</div>

Demonstrate the operation of the pipeline by introducing a controlled set of problems. These may include:

- a failing test;
- a concurrency error detectable by the selected tools;
- a deliberately vulnerable test dependency;
- a simulated secret in a designated test file;
- an unsigned or modified build artefact; and
- a change that attempts to bypass the expected review process.

Do not introduce real credentials or deploy intentionally vulnerable artefacts to a public or production environment.

For each scenario, record:

- whether the pipeline detects the problem;
- where the finding is reported;
- whether the configured policy permits or blocks the change or release; and
- how the issue could be remediated.

Verify that a valid signed artefact can be traced to its source revision, and that modifying the artefact causes signature or integrity verification to fail.

<div class="vg">
<div class="vgt">Visual guide: from source revision to a verifiable release</div>
<svg viewBox="0 0 900 340" role="img" aria-label="Chain of custody from source to verified artefact" style="width:100%;height:auto;font-family:var(--vp-font-family-base);font-size:13px">
<defs><marker id="p2b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-2)"/></marker></defs>
<rect x="10" y="100" width="140" height="64" rx="8" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="80" y="126" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Source revision</text><text x="80" y="146" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">commit identifier</text>
<line x1="152" y1="132" x2="208" y2="132" style="stroke:var(--vp-c-text-2)" marker-end="url(#p2b)"/>
<rect x="210" y="100" width="150" height="64" rx="8" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="285" y="126" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Build</text><text x="285" y="146" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">repeatable, identifiable</text>
<line x1="362" y1="132" x2="418" y2="132" style="stroke:var(--vp-c-text-2)" marker-end="url(#p2b)"/>
<rect x="420" y="100" width="150" height="64" rx="8" style="fill:var(--vp-c-brand-soft);stroke:var(--vp-c-brand-1);stroke-width:2"/><text x="495" y="126" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Artefact</text><text x="495" y="146" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">identified by its digest</text>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#p2b)"><line x1="572" y1="116" x2="628" y2="62"/><line x1="572" y1="132" x2="628" y2="132"/><line x1="572" y1="148" x2="628" y2="202"/></g>
<rect x="630" y="40" width="130" height="44" rx="6" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="695" y="60" text-anchor="middle" style="fill:var(--vp-c-text-1)">SBOM</text><text x="695" y="75" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">what is inside</text>
<rect x="630" y="110" width="130" height="44" rx="6" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="695" y="130" text-anchor="middle" style="fill:var(--vp-c-text-1)">Provenance</text><text x="695" y="145" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">source + process + inputs</text>
<rect x="630" y="180" width="130" height="44" rx="6" style="fill:var(--vp-c-bg);stroke:var(--vp-c-divider)"/><text x="695" y="200" text-anchor="middle" style="fill:var(--vp-c-text-1)">Signature</text><text x="695" y="215" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">binds identity to digest</text>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#p2b)"><line x1="762" y1="62" x2="808" y2="116"/><line x1="762" y1="132" x2="808" y2="132"/><line x1="762" y1="202" x2="808" y2="148"/></g>
<rect x="810" y="100" width="82" height="64" rx="8" style="fill:var(--vp-c-green-soft);stroke:var(--vp-c-green-1);stroke-width:2"/><text x="851" y="128" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Verify</text><text x="851" y="146" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">trace back</text>
<g style="fill:var(--vp-c-danger-1);font-weight:700" text-anchor="middle">
<circle cx="80" cy="88" r="11" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/><text x="80" y="93">1</text>
<circle cx="285" cy="88" r="11" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/><text x="285" y="93">2</text>
<circle cx="495" cy="176" r="11" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/><text x="495" y="181">3</text>
<circle cx="695" cy="238" r="11" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/><text x="695" y="243">4</text>
<circle cx="851" cy="176" r="11" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1)"/><text x="851" y="181">5</text></g>
<text x="450" y="290" text-anchor="middle" style="fill:var(--vp-c-text-1)">A consumer should be able to start from an artefact and walk this chain backwards to the exact source revision.</text>
<text x="450" y="312" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:12px">Modify the artefact and its digest no longer matches the signature and provenance: verification should fail.</text>
</svg>
<ol class="legendn">
<li><b>1</b> A malicious change or compromised dependency enters before the build.</li>
<li><b>2</b> The build service itself is compromised, so it builds something other than the source.</li>
<li><b>3</b> The artefact is altered after it is built.</li>
<li><b>4</b> The signing key or an administrator account is compromised.</li>
<li><b>5</b> Verification is skipped, or checks the wrong thing.</li>
</ol>
<p class="vgn">Which of these does your design stop, which does it only make detectable, and which remain <b>residual risks</b>? The brief asks you to discuss residual risks such as compromised dependencies, build services and administrator accounts.</p>
</div>

Measure the effect of the security checks on the engineering workflow. You may consider:

- total pipeline duration;
- time added by individual assurance stages;
- number and severity of findings;
- false-positive or unactionable findings;
- time required to diagnose and remediate a controlled issue; and
- reproducibility of artefacts across repeated builds.

<div class="vg">
<div class="vgt">Visual guide: what do your checks cost?</div>
<p class="vgn">Enter the time each stage takes (from your pipeline run logs) and mark which are assurance stages. The chart shows where time goes and how much the assurance stages add. The example numbers below are <b>not measurements</b>; replace them with yours.</p>
<div class="controls"><button @click="loadExample">Load example numbers (not real)</button><button class="ghost" @click="clearAll">Clear</button></div>
<table class="mx cost">
<thead><tr><th>Stage</th><th>Seconds</th><th>Assurance stage?</th></tr></thead>
<tbody><tr v-for="r in rows" :key="r.name"><td>{{ r.name }}</td><td><input type="number" min="0" v-model.number="r.secs" /></td><td><input type="checkbox" v-model="r.sec" /></td></tr></tbody>
</table>
<div v-if="total > 0" class="bar"><div v-for="r in rows" :key="'b' + r.name" v-show="r.secs > 0" class="seg" :class="{ sec: r.sec }" :style="{ width: (100 * r.secs / total) + '%' }" :title="r.name + ': ' + r.secs + ' s'"></div></div>
<div v-if="total > 0" class="legend"><span><i class="swatch base"></i> baseline stages ({{ baseSecs }} s)</span><span><i class="swatch sec"></i> assurance stages ({{ secSecs }} s)</span></div>
<p v-if="total > 0" class="sum"><b>Total {{ total }} s.</b> Assurance stages add <b>{{ extraPct }}%</b> to the baseline pipeline time and make up <b>{{ sharePct }}%</b> of the total.</p>
<p v-else class="vgn">Enter some times to see the chart.</p>
<p class="vgn">Time is only one cost. The brief also asks about findings, false positives, time to diagnose and fix, and reproducibility. Consider how you will record those too.</p>
</div>

In your report:

- describe the pipeline stages and the threat or failure each addresses;
- explain the repository permissions and branching strategy;
- justify the selected enforcement policy;
- provide evidence from successful and unsuccessful pipeline executions;
- trace one controlled vulnerability through discovery, triage, remediation, and verification;
- explain how provenance and signing support artefact integrity;
- discuss residual risks, including compromised dependencies, build services, or administrator accounts; and
- evaluate the balance between assurance, usability, execution time, and developer productivity.

<div class="vg">
<div class="vgt">Visual guide: tracing one controlled vulnerability</div>
<div class="chain">
<div class="step"><b>1 · Discovery</b><span>Which stage reported it, where, and how soon after the change?</span></div>
<div class="arrow">→</div>
<div class="step"><b>2 · Triage</b><span>Is it real? How severe? What does your policy say should happen?</span></div>
<div class="arrow">→</div>
<div class="step"><b>3 · Remediation</b><span>What change fixes it, and who made the decision?</span></div>
<div class="arrow">→</div>
<div class="step"><b>4 · Verification</b><span>What evidence shows the problem is gone and nothing else broke?</span></div>
</div>
<p class="vgn">Choose one controlled problem and keep screenshots, logs or run links for all four steps. That single worked example is the evidence the brief asks for.</p>
</div>

<div class="vg">
<div class="vgt">Visual guide: a suggested path through the work</div>
<ol class="road">
<li><b>Baseline pipeline</b><span>Build and test automatically on every proposed change. Get this green first.</span></li>
<li><b>Add analysis</b><span>Race detection and static analysis. See what they report on your real code.</span></li>
<li><b>Add dependency and secret scanning</b><span>Learn what is actionable and what is noise before you set any policy.</span></li>
<li><b>Produce and keep evidence</b><span>SBOM, test results and scan results retained for each run.</span></li>
<li><b>Create the release artefact</b><span>Versioned, with provenance, signed, and verified in a separate step.</span></li>
<li><b>Lock down the repository</b><span>Protected branches, review, minimal permissions, secret handling, dependency updates.</span></li>
<li><b>Write the policy</b><span>Use the findings from steps 2 to 3 to decide what fails, blocks, warns or is excepted.</span></li>
<li><b>Introduce controlled problems</b><span>One at a time, recording detection, location, policy outcome and remediation. Never real secrets, never deploy vulnerable artefacts.</span></li>
<li><b>Measure and write up</b><span>Pipeline cost, findings, reproducibility, residual risks and trade-offs.</span></li>
</ol>
<div class="vgt" style="margin-top:12px">Report map</div>
<table class="mx">
<thead><tr><th>Report bullet</th><th>Evidence to bring</th></tr></thead>
<tbody>
<tr><td>Pipeline stages and the threat each addresses</td><td>A stage-by-threat table, with the pipeline diagram</td></tr>
<tr><td>Repository permissions and branching strategy</td><td>Your workflow diagram and the settings that implement it</td></tr>
<tr><td>Enforcement policy</td><td>The policy table with a justification for each decision</td></tr>
<tr><td>Successful and unsuccessful pipeline runs</td><td>Run links or logs for each controlled problem and for a clean run</td></tr>
<tr><td>One vulnerability traced end to end</td><td>The four-step trace above</td></tr>
<tr><td>Provenance and signing</td><td>Verification success, then failure after modifying the artefact</td></tr>
<tr><td>Residual risks</td><td>The five numbered risks on the chain-of-custody diagram, with your position on each</td></tr>
<tr><td>Assurance versus productivity</td><td>Cost chart and findings data, with your evaluation</td></tr>
</tbody></table>
</div>

<script setup>
import { ref, reactive, computed } from 'vue'
const stages = ['Build and test', 'Race / static analysis', 'Dependency scan', 'Secret scan', 'SBOM', 'Package artefact', 'Provenance', 'Sign', 'Verify', 'Release']
const scenarios = [
  { id: 'test', name: 'A failing test', stage: 0 },
  { id: 'race', name: 'A concurrency error detectable by your selected tools', stage: 1 },
  { id: 'dep', name: 'A deliberately vulnerable test dependency', stage: 2 },
  { id: 'secret', name: 'A simulated secret in a designated test file', stage: 3 },
  { id: 'artefact', name: 'An unsigned or modified build artefact', stage: 8 },
  { id: 'bypass', name: 'A change that attempts to bypass the expected review process', stage: -1 }
]
const outcomes = ['Fail the pipeline immediately', 'Prevent the change from being merged', 'Prevent the artefact from being released', 'Warn: review required', 'Accept temporarily as a documented exception']
const focus = ref(0)
const choice = reactive(scenarios.map(() => ''))
const why = reactive(scenarios.map(() => ''))
const copied = ref(false)
const missing = computed(() => choice.filter((c) => !c).length)
function copy() {
  const esc = (t) => (t || '').replace(/\|/g, '\\|')
  const md = ['| Controlled problem | Policy outcome | Rationale |', '|---|---|---|']
    .concat(scenarios.map((s, i) => `| ${s.name} | ${esc(choice[i]) || '(undecided)'} | ${esc(why[i])} |`)).join('\n')
  const done = () => { copied.value = true; setTimeout(() => { copied.value = false }, 1500) }
  if (navigator.clipboard) navigator.clipboard.writeText(md).then(done, done); else done()
}
const rows = reactive([
  { name: 'Set-up and checkout', secs: null, sec: false },
  { name: 'Build', secs: null, sec: false },
  { name: 'Automated tests', secs: null, sec: false },
  { name: 'Race detection', secs: null, sec: true },
  { name: 'Static analysis', secs: null, sec: true },
  { name: 'Dependency scan', secs: null, sec: true },
  { name: 'Secret scan', secs: null, sec: true },
  { name: 'SBOM generation', secs: null, sec: true },
  { name: 'Package artefact', secs: null, sec: false },
  { name: 'Provenance and signing', secs: null, sec: true },
  { name: 'Verification', secs: null, sec: true }
])
const num = (v) => (Number.isFinite(v) && v > 0 ? v : 0)
const total = computed(() => rows.reduce((a, r) => a + num(r.secs), 0))
const secSecs = computed(() => rows.filter((r) => r.sec).reduce((a, r) => a + num(r.secs), 0))
const baseSecs = computed(() => total.value - secSecs.value)
const extraPct = computed(() => (baseSecs.value > 0 ? Math.round((100 * secSecs.value) / baseSecs.value) : 0))
const sharePct = computed(() => (total.value > 0 ? Math.round((100 * secSecs.value) / total.value) : 0))
function loadExample() { [10, 25, 30, 20, 25, 15, 8, 6, 5, 12, 7].forEach((v, i) => { rows[i].secs = v }) }
function clearAll() { rows.forEach((r) => { r.secs = null }) }
</script>

<style scoped>
.vg { border: 1px solid var(--vp-c-divider); border-left: 4px solid var(--vp-c-brand-1); border-radius: 8px; padding: 12px 16px; margin: 20px 0; background: var(--vp-c-bg-soft); }
.vgt { font-weight: 600; margin-bottom: 8px; color: var(--vp-c-brand-1); }
.vgn { font-size: 0.88em; color: var(--vp-c-text-2); margin: 8px 0 0; }
.lane { margin: 10px 0; }
.lname { font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--vp-c-text-2); margin-bottom: 4px; }
.flow { display: flex; flex-wrap: wrap; align-items: stretch; gap: 4px; }
.box { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 6px 8px; font-size: 0.82em; display: flex; flex-direction: column; min-width: 90px; }
.box small { color: var(--vp-c-text-2); font-size: 0.85em; }
.box.gate { border-color: var(--vp-c-warning-1); background: var(--vp-c-warning-soft); }
.ar { align-self: center; color: var(--vp-c-text-3); }
.strip { display: flex; flex-wrap: wrap; gap: 4px; margin: 10px 0; }
.st { font-size: 0.75em; padding: 3px 8px; border-radius: 999px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); }
.st.repo { border-style: dashed; }
.st.hit { background: var(--vp-c-warning-soft); border-color: var(--vp-c-warning-1); color: var(--vp-c-text-1); font-weight: 600; }
.mx { display: table; width: 100%; font-size: 0.85em; }
.pol tr.sel td { background: var(--vp-c-brand-soft); }
.pol td:nth-child(1) { width: 32%; }
.pol td:nth-child(2) { width: 34%; }
.pol select { min-width: 210px; }
.pol tbody tr { cursor: pointer; }
.pol select, .pol input[type=text], .cost input[type=number] { background: var(--vp-c-bg); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 3px 6px; width: 100%; box-sizing: border-box; }
.cost input[type=number] { width: 90px; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 8px 0; }
button { background: var(--vp-c-bg); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 3px 10px; cursor: pointer; font-size: 0.85em; }
button:hover { border-color: var(--vp-c-brand-1); }
button.ghost { background: transparent; }
.ok { color: var(--vp-c-green-1); font-size: 0.85em; }
.warnmsg { color: var(--vp-c-warning-1); font-size: 0.85em; }
.bar { display: flex; height: 26px; border-radius: 6px; overflow: hidden; border: 1px solid var(--vp-c-divider); margin: 8px 0; }
.seg { background: var(--vp-c-brand-3); min-width: 2px; }
.seg.sec { background: var(--vp-c-warning-1); }
.legend { display: flex; flex-wrap: wrap; gap: 14px; font-size: 0.8em; color: var(--vp-c-text-2); }
.swatch { display: inline-block; width: 12px; height: 12px; border-radius: 2px; margin-right: 4px; vertical-align: -1px; }
.swatch.base { background: var(--vp-c-brand-3); }
.swatch.sec { background: var(--vp-c-warning-1); }
.sum { font-size: 0.9em; margin: 8px 0 0; }
.chain { display: flex; flex-wrap: wrap; align-items: stretch; gap: 6px; }
.chain .step { flex: 1 1 130px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.chain .step span { font-size: 0.82em; color: var(--vp-c-text-2); }
.chain .arrow { align-self: center; color: var(--vp-c-text-3); }
.legendn { list-style: none; padding: 0; margin: 8px 0 0; font-size: 0.88em; }
.legendn li { margin: 2px 0; }
.legendn b { display: inline-block; width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); margin-right: 8px; font-size: 0.85em; }
.road { padding-left: 0; list-style: none; counter-reset: s; display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
.road li { counter-increment: s; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 8px 10px 8px 38px; position: relative; margin: 0; }
.road li::before { content: counter(s); position: absolute; left: 10px; top: 8px; width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; background: var(--vp-c-brand-3); color: #fff; font-size: 0.8em; }
.road li b { display: block; }
.road li span { font-size: 0.82em; color: var(--vp-c-text-2); }
</style>
