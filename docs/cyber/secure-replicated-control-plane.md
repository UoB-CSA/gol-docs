# Secure and Fault-Tolerant Replicated Control Plane

The distributed implementation currently relies on a central distributor or broker to coordinate workers. This creates a single point of failure: if that process becomes unavailable, the system may no longer be able to allocate work, track workers, or control execution.

<div class="vg">
<div class="vgt">Visual guide: what is changing</div>
<svg viewBox="0 0 900 370" role="img" aria-label="Single broker replaced by a replicated control plane" style="width:100%;height:auto;font-family:var(--vp-font-family-base);font-size:13px">
<defs><marker id="p1a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-2)"/></marker></defs>
<text x="190" y="24" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Today: one broker</text>
<rect x="130" y="50" width="120" height="36" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="190" y="73" text-anchor="middle" style="fill:var(--vp-c-text-1)">Controller</text>
<line x1="190" y1="88" x2="190" y2="138" style="stroke:var(--vp-c-text-2)" marker-end="url(#p1a)"/>
<rect x="120" y="140" width="140" height="48" rx="6" style="fill:var(--vp-c-danger-soft);stroke:var(--vp-c-danger-1);stroke-width:2"/><text x="190" y="170" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Broker</text>
<text x="190" y="210" text-anchor="middle" style="fill:var(--vp-c-danger-1)">single point of failure</text>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#p1a)"><line x1="160" y1="190" x2="85" y2="262"/><line x1="190" y1="190" x2="190" y2="262"/><line x1="220" y1="190" x2="295" y2="262"/></g>
<rect x="40" y="264" width="90" height="34" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="85" y="286" text-anchor="middle" style="fill:var(--vp-c-text-1)">Worker 1</text>
<rect x="145" y="264" width="90" height="34" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="190" y="286" text-anchor="middle" style="fill:var(--vp-c-text-1)">Worker 2</text>
<rect x="250" y="264" width="90" height="34" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="295" y="286" text-anchor="middle" style="fill:var(--vp-c-text-1)">Worker 3</text>
<text x="190" y="330" text-anchor="middle" style="fill:var(--vp-c-text-2)">If it stops: no allocation, no tracking, no control.</text>
<line x1="400" y1="20" x2="400" y2="350" style="stroke:var(--vp-c-divider);stroke-dasharray:4 4"/>
<text x="650" y="24" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Proposed: replicated control plane</text>
<rect x="590" y="40" width="120" height="34" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="650" y="62" text-anchor="middle" style="fill:var(--vp-c-text-1)">Controller</text>
<text x="722" y="62" style="fill:var(--vp-c-warning-1);font-weight:600">B1</text>
<line x1="620" y1="76" x2="540" y2="126" style="stroke:var(--vp-c-text-2)" marker-end="url(#p1a)"/>
<rect x="420" y="108" width="460" height="124" rx="10" style="fill:none;stroke:var(--vp-c-warning-1);stroke-dasharray:6 4;stroke-width:1.5"/>
<text x="430" y="124" style="fill:var(--vp-c-warning-1)">Control-plane cluster: 2f+1 replicas</text>
<text x="868" y="124" text-anchor="end" style="fill:var(--vp-c-warning-1);font-weight:600">B2</text>
<rect x="445" y="138" width="120" height="70" rx="6" style="fill:var(--vp-c-brand-soft);stroke:var(--vp-c-brand-1);stroke-width:2"/><text x="505" y="164" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Replica A</text><text x="505" y="184" text-anchor="middle" style="fill:var(--vp-c-brand-1)">LEADER</text><text x="505" y="200" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">term t</text>
<rect x="620" y="138" width="120" height="70" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="680" y="164" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Replica B</text><text x="680" y="184" text-anchor="middle" style="fill:var(--vp-c-text-2)">follower</text>
<rect x="755" y="138" width="110" height="70" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="810" y="164" text-anchor="middle" style="fill:var(--vp-c-text-1);font-weight:600">Replica C</text><text x="810" y="184" text-anchor="middle" style="fill:var(--vp-c-text-2)">follower</text>
<line x1="567" y1="165" x2="618" y2="165" style="stroke:var(--vp-c-text-2)" marker-end="url(#p1a)"/><line x1="742" y1="165" x2="753" y2="165" style="stroke:var(--vp-c-text-2)"/>
<path d="M505,210 C505,226 810,226 810,210" fill="none" style="stroke:var(--vp-c-text-2)" marker-end="url(#p1a)"/>
<text x="650" y="224" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">replicate the log</text>
<g style="stroke:var(--vp-c-text-2)" fill="none" marker-end="url(#p1a)"><line x1="470" y1="234" x2="470" y2="302"/></g>
<rect x="420" y="304" width="300" height="48" rx="10" style="fill:none;stroke:var(--vp-c-warning-1);stroke-dasharray:6 4"/><text x="430" y="320" style="fill:var(--vp-c-warning-1)">Workers</text><text x="710" y="320" text-anchor="end" style="fill:var(--vp-c-warning-1);font-weight:600">B3</text>
<rect x="432" y="326" width="70" height="20" rx="4" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="467" y="340" text-anchor="middle" style="fill:var(--vp-c-text-1);font-size:11px">W1</text>
<rect x="512" y="326" width="70" height="20" rx="4" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="547" y="340" text-anchor="middle" style="fill:var(--vp-c-text-1);font-size:11px">W2</text>
<rect x="592" y="326" width="70" height="20" rx="4" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="627" y="340" text-anchor="middle" style="fill:var(--vp-c-text-1);font-size:11px">W3</text>
<rect x="760" y="296" width="120" height="56" rx="6" style="fill:var(--vp-c-bg-soft);stroke:var(--vp-c-divider)"/><text x="820" y="318" text-anchor="middle" style="fill:var(--vp-c-text-1)">Checkpoint store</text><text x="820" y="336" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:11px">generation + hash</text>
<text x="868" y="292" text-anchor="end" style="fill:var(--vp-c-warning-1);font-weight:600">B4</text>
</svg>
<p class="vgn"><b>B1 to B4</b> mark trust boundaries: places where data crosses between parties that should not automatically trust each other. The cluster agrees on the authoritative state (leader, workers, job and generation, allocation, commands, latest valid checkpoint), so losing one replica does not lose the state, and a surviving majority can carry on.</p>
</div>

Replace the single broker with a small replicated control-plane cluster based on the **Raft consensus algorithm**. The cluster should maintain authoritative state for:

- the current control-plane leader;
- registered worker nodes;
- the current Game of Life job and generation;
- work allocation or scheduling information;
- pause, resume, checkpoint, and termination commands; and
- the location and generation number of the latest valid checkpoint.

<div class="vg">
<div class="vgt">Visual guide: try a Raft cluster</div>
<p class="vgn">A deliberately simplified model for building intuition. Crash nodes, cut them off from the network, send commands, and watch terms, elections and the replicated log. It is not a Raft implementation and leaves out timers, randomised timeouts and many details.</p>
<div class="controls">
<label>Cluster size <select v-model.number="size" @change="reset"><option :value="3">3 replicas</option><option :value="5">5 replicas</option></select></label>
<button class="ghost" @click="reset">Reset</button>
<span class="quorum" :class="{ bad: !hasLiveLeader }">Quorum = {{ cluster.quorum }} of {{ cluster.n }} · {{ reachable }} reachable now · {{ hasLiveLeader ? 'can make progress' : 'cannot elect a leader / commit' }}</span>
</div>
<div class="cards">
<div v-for="x in cluster.nodes" :key="x.id" class="card" :class="[x.role, { isolated: x.isolated }]">
<div class="chead"><b>Node {{ x.id }}</b><span class="badge" :class="x.role">{{ x.role === 'down' ? 'crashed' : x.role }}</span></div>
<div class="meta">term {{ x.term }} · committed {{ x.commit }}<span v-if="x.isolated" class="iso"> · cut off</span></div>
<div class="log"><span v-for="(e, i) in x.log" :key="i" class="chip" :class="{ unc: i >= x.commit, noop: e.cmd === '∅' }" :title="'term ' + e.term">{{ e.cmd }}</span><span v-if="!x.log.length" class="empty">empty log</span></div>
<div class="btns">
<button v-if="x.alive" @click="act(crash, x.id)">Crash</button>
<button v-else @click="act(restart, x.id)">Restart</button>
<button v-if="x.alive && !x.isolated" @click="act(isolate, x.id)">Cut off</button>
<button v-if="x.isolated" @click="act(heal, x.id)">Reconnect</button>
<button v-if="x.alive && x.role === 'leader'" class="primary" @click="act(sendCommand, x.id)">Send command</button>
</div>
</div>
</div>
<div class="legend"><span><i class="chip"></i> committed entry</span><span><i class="chip unc"></i> not committed (must not be acted on)</span><span><i class="chip noop"></i> leader no-op</span></div>
<ul class="events"><li v-for="(m, i) in cluster.events" :key="i + m">{{ m }}</li></ul>
<details class="tryit"><summary>Things to try</summary>
<ol>
<li>Crash the leader. Who wins, and what happens to the term?</li>
<li>Cut off the leader (it keeps running). Send a command to the old leader, then to the new one. Reconnect the old leader. What happens to its entry?</li>
<li>Crash a node, send several commands, restart it. Can it become leader straight away? Why or why not?</li>
<li>Crash a majority. What can and can't the cluster still do? Is that the behaviour you want for a control plane?</li>
<li>Compare 3 and 5 replicas: how many failures does each tolerate, and what does each extra replica cost you?</li>
</ol></details>
</div>

Your system should continue to operate, or recover predictably, when the current leader fails. A remaining replica should be elected as leader and resume coordination without allowing conflicting control decisions or silently reverting to stale state.

Add suitable security controls to protect communication with the control plane. Your design should address:

- authentication of control-plane replicas and workers;
- prevention of unauthorised cluster membership;
- integrity protection for control messages;
- detection of duplicated, delayed, or replayed commands;
- rejection of commands from a stale former leader; and
- detection of corrupted or tampered checkpoint metadata.

<div class="vg">
<div class="vgt">Visual guide: where each security requirement bites</div>
<p class="vgn">Pick a requirement to see where in the architecture it applies, and some questions your design and threat model should answer. These are prompts, not answers.</p>
<div class="two">
<div class="reqs">
<button v-for="(r, i) in reqs" :key="r.key" :class="{ on: sel === i }" @click="sel = i"><span class="num">{{ i + 1 }}</span>{{ r.title }}</button>
</div>
<div class="stage">
<svg viewBox="0 0 520 300" role="img" aria-label="Architecture with security hot-spots" class="sec">
<g class="lk" :class="{ hl: on('l-ctrl') }"><line x1="130" y1="42" x2="205" y2="124"/></g>
<g class="lk" :class="{ hl: on('l-rep') }"><line x1="260" y1="152" x2="260" y2="220"/></g>
<g class="lk" :class="{ hl: on('l-work') }"><line x1="130" y1="222" x2="205" y2="146"/></g>
<g class="lk" :class="{ hl: on('l-stale') }"><line x1="390" y1="132" x2="315" y2="132"/></g>
<g class="lk" :class="{ hl: on('l-store') }"><line x1="390" y1="240" x2="315" y2="152"/></g>
<g class="lk" :class="{ hl: on('l-unk') }"><line x1="390" y1="48" x2="315" y2="116"/></g>
<g class="nd" :class="{ hl: on('n-ctrl') }"><rect x="20" y="20" width="110" height="44" rx="6"/><text x="75" y="46">Controller</text></g>
<g class="nd" :class="{ hl: on('n-leader') }"><rect x="205" y="110" width="110" height="44" rx="6"/><text x="260" y="136">Leader replica</text></g>
<g class="nd" :class="{ hl: on('n-follower') }"><rect x="205" y="220" width="110" height="44" rx="6"/><text x="260" y="246">Follower replica</text></g>
<g class="nd" :class="{ hl: on('n-stale') }"><rect x="390" y="110" width="110" height="44" rx="6" class="ghost"/><text x="445" y="130">Former leader</text><text x="445" y="146" class="sm">(stale, lower term)</text></g>
<g class="nd" :class="{ hl: on('n-worker') }"><rect x="20" y="200" width="110" height="44" rx="6"/><text x="75" y="226">Worker</text></g>
<g class="nd" :class="{ hl: on('n-store') }"><rect x="390" y="220" width="110" height="44" rx="6"/><text x="445" y="238">Checkpoint</text><text x="445" y="254" class="sm">metadata</text></g>
<g class="nd" :class="{ hl: on('n-unk') }"><rect x="390" y="26" width="110" height="44" rx="6" class="ghost"/><text x="445" y="52">Unknown node</text></g>
</svg>
<div class="qs"><b>{{ reqs[sel].title }}</b>
<ul><li v-for="q in reqs[sel].qs" :key="q">{{ q }}</li></ul></div>
</div>
</div>
</div>

Before implementing the extension, produce a lightweight threat model containing:

- the assets that require protection;
- the main trust boundaries;
- plausible threats and failure scenarios; and
- security requirements derived from those threats.

<div class="vg">
<div class="vgt">Visual guide: the threat model as a chain of evidence</div>
<div class="chain">
<div class="step"><b>1 · Assets</b><span>What would hurt if it were lost, altered or leaked?</span></div>
<div class="arrow">→</div>
<div class="step"><b>2 · Trust boundaries</b><span>Where does data cross between parties with different levels of trust?</span></div>
<div class="arrow">→</div>
<div class="step"><b>3 · Threats</b><span>What could go wrong at each crossing, and what failures are plausible?</span></div>
<div class="arrow">→</div>
<div class="step"><b>4 · Requirements</b><span>One testable statement per threat that you intend to address.</span></div>
<div class="arrow">→</div>
<div class="step"><b>5 · Controls and tests</b><span>The mechanism you built, and the experiment that shows it works.</span></div>
</div>
<p class="vgn">Aim for traceability in both directions: every requirement should come from a threat, and every claim in your evaluation should point back to a requirement. The brief also asks you to say which threats are <b>out of scope</b>; a threat model that shows what you chose <i>not</i> to defend against, and why, is stronger than one that claims everything.</p>
</div>

Conduct experiments to demonstrate the behaviour of your system under at least the following conditions:

- failure of a follower replica;
- failure of the current leader;
- restart of a failed replica;
- delayed or duplicated control messages;
- an attempted connection by an unauthorised node; and
- stale or modified checkpoint metadata.

<div class="vg">
<div class="vgt">Visual guide: what each experiment should demonstrate</div>
<table class="mx">
<thead><tr><th>Condition</th><th>The question it answers</th><th>Evidence to think about collecting</th></tr></thead>
<tbody>
<tr><td>Follower fails</td><td>Does the cluster keep making decisions with one replica fewer?</td><td>Commands still commit; generation progress; any change in message traffic</td></tr>
<tr><td>Leader fails</td><td>Is a new leader elected, and does nothing already committed get lost or contradicted?</td><td>Election time; the job's generation before and after; no duplicated or skipped control decisions</td></tr>
<tr><td>Failed replica restarts</td><td>Does it rejoin safely and catch up without disturbing the current leader?</td><td>Its state before and after; time to catch up; confirmation it did not become a competing leader</td></tr>
<tr><td>Delayed or duplicated messages</td><td>Is a repeated or late command acted on at most once, or rejected?</td><td>What the receiver logs; the final state compared with a run without interference</td></tr>
<tr><td>Unauthorised node connects</td><td>Is it refused, and how do you know the cluster membership did not change?</td><td>Rejection evidence on both sides; membership view before and after</td></tr>
<tr><td>Stale or modified checkpoint metadata</td><td>Is it detected before it is used to restore the job?</td><td>The check failing; what the system does next; a control case with valid metadata</td></tr>
</tbody></table>
</div>

Measure the performance overhead introduced by replication and the security controls. Compare the extended implementation with the original single-broker design. You may consider:

- total execution time;
- control-message traffic;
- leader-election time;
- recovery time; and
- the effect of failures on completed generations.

<div class="vg">
<div class="vgt">Visual guide: defining your timing metrics</div>
<svg viewBox="0 0 900 300" role="img" aria-label="Timeline of a leader failure" style="width:100%;height:auto;font-family:var(--vp-font-family-base);font-size:13px">
<defs><marker id="p1b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-2)"/></marker></defs>
<rect x="40" y="46" width="170" height="28" style="fill:var(--vp-c-green-soft)"/><text x="125" y="65" text-anchor="middle" style="fill:var(--vp-c-text-1)">leader coordinating</text>
<rect x="210" y="46" width="170" height="28" style="fill:var(--vp-c-danger-soft)"/><text x="295" y="65" text-anchor="middle" style="fill:var(--vp-c-text-1)">no leader</text>
<rect x="380" y="46" width="130" height="28" style="fill:var(--vp-c-warning-soft)"/><text x="445" y="65" text-anchor="middle" style="fill:var(--vp-c-text-1)">re-attaching</text>
<rect x="510" y="46" width="350" height="28" style="fill:var(--vp-c-green-soft)"/><text x="685" y="65" text-anchor="middle" style="fill:var(--vp-c-text-1)">new leader coordinating</text>
<g style="stroke:var(--vp-c-text-2);stroke-dasharray:3 3"><line x1="210" y1="30" x2="210" y2="120"/><line x1="320" y1="30" x2="320" y2="120"/><line x1="380" y1="30" x2="380" y2="120"/><line x1="510" y1="30" x2="510" y2="120"/></g>
<g style="fill:var(--vp-c-text-1);font-weight:600" text-anchor="middle"><text x="210" y="24">t0</text><text x="320" y="24">t1</text><text x="380" y="24">t2</text><text x="510" y="24">t3</text></g>
<g style="fill:var(--vp-c-text-2);font-size:12px"><text x="204" y="96" text-anchor="end">leader fails</text><text x="326" y="96" text-anchor="end">new leader elected</text><text x="386" y="112">first command committed</text><text x="516" y="96">job progress resumes</text></g>
<line x1="210" y1="140" x2="320" y2="140" style="stroke:var(--vp-c-text-2)" marker-start="url(#p1b)" marker-end="url(#p1b)"/><text x="265" y="158" text-anchor="middle" style="fill:var(--vp-c-text-1)">election time</text>
<line x1="210" y1="176" x2="510" y2="176" style="stroke:var(--vp-c-text-2)" marker-start="url(#p1b)" marker-end="url(#p1b)"/><text x="360" y="194" text-anchor="middle" style="fill:var(--vp-c-text-1)">recovery time</text>
<polyline points="40,272 210,252 510,252 860,214" fill="none" style="stroke:var(--vp-c-brand-1);stroke-width:2"/>
<text x="40" y="236" style="fill:var(--vp-c-text-2)">completed generations</text>
<text x="360" y="244" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:12px">flat: no progress during the outage</text>
<text x="450" y="290" text-anchor="middle" style="fill:var(--vp-c-text-2);font-size:12px">time</text>
</svg>
<p class="vgn">These are suggested definitions. Your report should state exactly <b>when</b> each timestamp is taken (and by which process) so that your numbers can be reproduced. Consider also what happens to generations if the job has to resume from a checkpoint: are any generations repeated, and how do you show the result is still correct?</p>
</div>

In your report:

- explain the architecture and replicated state model;
- present your threat model and derived security requirements;
- explain how leader election, state replication, authentication, and recovery operate;
- provide evidence that control decisions remain consistent during the tested failures;
- evaluate which threats your implementation addresses and which remain outside its scope; and
- analyse the trade-offs between availability, consistency, security, performance, and implementation complexity.

<div class="vg">
<div class="vgt">Visual guide: a suggested path through the work</div>
<ol class="road">
<li><b>Threat model first</b><span>Assets, boundaries, threats, requirements (the brief asks for this before implementing).</span></li>
<li><b>Decide the architecture</b><span>How many replicas, what is replicated, how workers find the leader, and whether you build consensus or adopt an implementation (justify either).</span></li>
<li><b>Replicate state, no security yet</b><span>Get leader election and a replicated log working with a plain connection. Test failover.</span></li>
<li><b>Move the job onto the cluster</b><span>Registration, allocation, pause, resume, checkpoint and terminate all go through the leader and the log.</span></li>
<li><b>Add identity and integrity</b><span>Authenticate replicas and workers; refuse unknown nodes; protect control messages.</span></li>
<li><b>Add freshness protections</b><span>Handle duplicated, delayed or replayed commands and reject a stale former leader.</span></li>
<li><b>Protect checkpoint metadata</b><span>Make tampering or staleness detectable before restore.</span></li>
<li><b>Run the six experiments</b><span>Against the original single-broker baseline, with metrics defined up front.</span></li>
<li><b>Write the evaluation</b><span>Including what remains out of scope and the trade-offs.</span></li>
</ol>
<div class="vgt" style="margin-top:12px">Report map</div>
<table class="mx">
<thead><tr><th>Report bullet</th><th>Evidence to bring</th></tr></thead>
<tbody>
<tr><td>Architecture and replicated state model</td><td>An architecture diagram with trust boundaries; a table of what state is replicated</td></tr>
<tr><td>Threat model and security requirements</td><td>Assets, boundaries, threats, requirements, with traceability</td></tr>
<tr><td>How election, replication, authentication and recovery operate</td><td>Sequence diagrams for a normal command, a failover, and a rejected node</td></tr>
<tr><td>Control decisions stay consistent during failures</td><td>Experiment logs and state comparisons from the six conditions</td></tr>
<tr><td>Threats addressed and not addressed</td><td>A table linking each threat to a control and a test, or to an explicit scope decision</td></tr>
<tr><td>Trade-offs</td><td>Overhead measurements against the baseline, and discussion of availability, consistency, security, performance and complexity</td></tr>
</tbody></table>
</div>

<script setup>
import { ref, reactive, computed } from 'vue'
// Simplified Raft model for teaching: terms, elections, replicated log, quorum commit, stale-leader fencing.
function makeCluster(n) {
  const c = {
    n, quorum: Math.floor(n / 2) + 1, seq: 0, events: [],
    nodes: Array.from({ length: n }, (_, i) => ({ id: i + 1, role: 'follower', term: 0, alive: true, isolated: false, log: [], commit: 0 }))
  }
  maybeElect(c)
  c.events = ['Cluster started: node 1 won the first election (term 1).']
  return c
}
const say = (c, m) => { c.events.unshift(m); if (c.events.length > 40) c.events.pop() }
const clone = (log) => log.map((e) => ({ ...e }))
// nodes that can talk to each other: alive and not isolated
const mainGroup = (c) => c.nodes.filter((x) => x.alive && !x.isolated)
const lastInfo = (x) => ({ term: x.log.length ? x.log[x.log.length - 1].term : 0, len: x.log.length })
const moreUpToDate = (a, b) => { const A = lastInfo(a), B = lastInfo(b); return A.term !== B.term ? A.term > B.term : A.len > B.len }

function syncFrom(c, leader, group) {
  for (const f of group) {
    if (f === leader) continue
    f.log = clone(leader.log); f.term = leader.term; f.commit = leader.commit; f.role = 'follower'
  }
}
function maybeElect(c) {
  const G = mainGroup(c)
  if (G.length === 0) return
  const maxTerm = Math.max(...G.map((x) => x.term))
  const existing = G.find((x) => x.role === 'leader' && x.term >= maxTerm)
  if (existing) return
  if (G.length < c.quorum) {
    G.forEach((x) => { if (x.role !== 'leader') x.role = 'candidate' })
    say(c, `No quorum: only ${G.length} of ${c.n} nodes can talk to each other (need ${c.quorum}). No leader can be elected, so the cluster stalls rather than risk conflicting decisions.`)
    return
  }
  let cand = G[0]
  for (const x of G) if (moreUpToDate(x, cand)) cand = x
  const term = maxTerm + 1
  G.forEach((x) => { if (x.role === 'leader') x.role = 'follower' })
  cand.role = 'leader'; cand.term = term
  cand.log.push({ term, cmd: '∅' }) // no-op entry lets the new leader commit earlier entries safely
  syncFrom(c, cand, G)
  cand.commit = cand.log.length; G.forEach((x) => { x.commit = cand.commit })
  say(c, `Election: node ${cand.id} became leader for term ${term} with votes from ${G.length} of ${c.n} nodes.`)
}
function crash(c, id) {
  const x = c.nodes[id - 1]; if (!x.alive) return
  x.alive = false; x.role = 'down'
  say(c, `Node ${id} crashed.`)
  maybeElect(c)
}
function recover(c, x) { // after restart or healing: catch up with a reachable leader, else try election
  const G = mainGroup(c)
  const leader = G.filter((y) => y.role === 'leader' && y !== x).sort((a, b) => b.term - a.term)[0]
  if (leader) {
    if (x.role === 'leader' && x.term < leader.term) {
      const lost = x.log.length - x.commit
      say(c, `Node ${x.id} was a stale leader (term ${x.term}). It sees term ${leader.term}, steps down, and discards ${lost} uncommitted entr${lost === 1 ? 'y' : 'ies'}.`)
    } else {
      say(c, `Node ${x.id} catches up from leader node ${leader.id}.`)
    }
    x.role = 'follower'; x.log = clone(leader.log); x.term = leader.term; x.commit = leader.commit
  } else {
    maybeElect(c)
  }
}
function restart(c, id) {
  const x = c.nodes[id - 1]; if (x.alive) return
  x.alive = true; x.role = 'follower' // log, term and commit index are persistent
  say(c, `Node ${id} restarted with its saved log (term ${x.term}).`)
  if (x.isolated) return
  recover(c, x)
}
function isolate(c, id) {
  const x = c.nodes[id - 1]; if (!x.alive || x.isolated) return
  x.isolated = true
  say(c, `Node ${id} lost its network connection (it is still running and still believes it is ${x.role === 'leader' ? 'the leader' : 'a ' + x.role}).`)
  maybeElect(c)
}
function heal(c, id) {
  const x = c.nodes[id - 1]; if (!x.isolated) return
  x.isolated = false
  say(c, `Node ${id} reconnected.`)
  if (x.alive) recover(c, x)
}
function sendCommand(c, id) {
  const x = c.nodes[id - 1]
  if (!x.alive || x.role !== 'leader') return say(c, `Node ${id} is not a leader, so it rejects the command and tells the client to retry elsewhere.`)
  const cmd = `c${++c.seq}`
  const G = x.isolated ? [x] : mainGroup(c)
  const higher = G.find((y) => y !== x && y.term > x.term)
  if (higher) { x.role = 'follower'; x.term = higher.term; return say(c, `Node ${id} tried to replicate "${cmd}" but a peer has a higher term (${higher.term}). Stale leader rejected; it steps down.`) }
  x.log.push({ term: x.term, cmd })
  G.forEach((y) => { if (y !== x) { y.log = clone(x.log); y.term = x.term; y.role = 'follower' } })
  if (G.length >= c.quorum) {
    x.commit = x.log.length; G.forEach((y) => { y.commit = x.commit })
    say(c, `"${cmd}" replicated to ${G.length} of ${c.n} nodes (quorum is ${c.quorum}): COMMITTED.`)
  } else {
    say(c, `"${cmd}" is only on ${G.length} of ${c.n} nodes (quorum is ${c.quorum}): NOT committed. It must not be acted on.`)
  }
}

const size = ref(3)
const cluster = reactive(makeCluster(3))
function reset() { Object.assign(cluster, makeCluster(size.value)) }
function act(fn, id) { fn(cluster, id) }
const reachable = computed(() => cluster.nodes.filter((x) => x.alive && !x.isolated).length)
const hasLiveLeader = computed(() => {
  const g = cluster.nodes.filter((x) => x.alive && !x.isolated)
  return g.length >= cluster.quorum && g.some((x) => x.role === 'leader')
})
const sel = ref(0)
const reqs = [
  { key: 'auth', title: 'Authenticate replicas and workers', hl: ['l-rep', 'l-work', 'n-leader', 'n-follower', 'n-worker'],
    qs: ['Who has to prove who they are to whom, in each direction?', 'How are identities created, distributed and revoked?', 'What happens to a node whose identity is revoked while it is running?'] },
  { key: 'member', title: 'Prevent unauthorised cluster membership', hl: ['n-unk', 'l-unk', 'n-leader'],
    qs: ['What stops a new node from adding itself, or being added by an attacker?', 'Who is allowed to change the membership, and how is that change itself authorised?', 'How will you demonstrate a refused connection?'] },
  { key: 'integrity', title: 'Protect control-message integrity', hl: ['l-ctrl', 'l-work', 'l-rep', 'n-ctrl'],
    qs: ['Which messages can change the state of the job if altered in transit?', 'Is integrity protection per connection, per message, or both? Why?', 'What does the receiver do with a message that fails the check?'] },
  { key: 'replay', title: 'Detect duplicated, delayed or replayed commands', hl: ['l-work', 'l-ctrl', 'n-worker'],
    qs: ['Which commands are harmful if applied twice, or late?', 'What does a receiver need to remember to recognise a repeat?', 'How long does a command stay valid, and what clock or counter does that rely on?'] },
  { key: 'stale', title: 'Reject commands from a stale former leader', hl: ['n-stale', 'l-stale', 'n-leader'],
    qs: ['How can a receiver tell that a leader is out of date?', 'Where does that check live: in workers, in followers, or both?', 'Try the simulator: what does the old leader still believe after it is cut off?'] },
  { key: 'ckpt', title: 'Detect tampered or stale checkpoint metadata', hl: ['n-store', 'l-store'],
    qs: ['What would an attacker gain by changing the generation number, or by pointing to an old checkpoint?', 'What does a valid piece of metadata need to be bound to?', 'What should the system do when the check fails: stop, fall back, or ask?'] }
]
const on = (id) => reqs[sel.value].hl.includes(id)
</script>

<style scoped>
.vg { border: 1px solid var(--vp-c-divider); border-left: 4px solid var(--vp-c-brand-1); border-radius: 8px; padding: 12px 16px; margin: 20px 0; background: var(--vp-c-bg-soft); }
.vgt { font-weight: 600; margin-bottom: 8px; color: var(--vp-c-brand-1); }
.vgn { font-size: 0.88em; color: var(--vp-c-text-2); margin: 8px 0 0; }
.controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 8px 0; }
.controls select { background: var(--vp-c-bg); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 2px 6px; }
button { background: var(--vp-c-bg); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 3px 10px; cursor: pointer; font-size: 0.85em; }
button:hover { border-color: var(--vp-c-brand-1); }
button.primary { background: var(--vp-c-brand-3); color: #fff; border-color: transparent; }
button.ghost { background: transparent; }
.quorum { margin-left: auto; font-size: 0.85em; padding: 2px 10px; border-radius: 999px; background: var(--vp-c-green-soft); color: var(--vp-c-green-1); }
.quorum.bad { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }
.cards { display: flex; flex-wrap: wrap; gap: 10px; }
.card { flex: 1 1 170px; min-width: 160px; border: 2px solid var(--vp-c-divider); border-radius: 8px; padding: 8px 10px; background: var(--vp-c-bg); }
.card.leader { border-color: var(--vp-c-brand-1); }
.card.candidate { border-color: var(--vp-c-warning-1); }
.card.down { opacity: 0.55; border-style: dashed; }
.card.isolated { border-style: dotted; border-color: var(--vp-c-danger-1); }
.chead { display: flex; justify-content: space-between; align-items: center; }
.badge { font-size: 0.72em; padding: 1px 8px; border-radius: 999px; background: var(--vp-c-default-soft); }
.badge.leader { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.badge.candidate { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); }
.badge.down { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }
.meta { font-size: 0.78em; color: var(--vp-c-text-2); margin: 2px 0 6px; }
.iso { color: var(--vp-c-danger-1); }
.log { display: flex; flex-wrap: wrap; gap: 3px; min-height: 24px; }
.chip { display: inline-block; min-width: 22px; text-align: center; font-size: 0.72em; padding: 1px 5px; border-radius: 4px; background: var(--vp-c-brand-3); color: #fff; border: 1px dashed transparent; }
.chip.unc { background: transparent; color: var(--vp-c-text-1); border-color: var(--vp-c-text-2); }
.chip.noop { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }
.empty { font-size: 0.75em; color: var(--vp-c-text-3); }
.btns { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.legend { display: flex; flex-wrap: wrap; gap: 14px; font-size: 0.78em; margin: 8px 0; color: var(--vp-c-text-2); }
.legend .chip { min-width: 14px; height: 12px; padding: 0; vertical-align: -2px; margin-right: 4px; }
.events { list-style: none; padding: 0; margin: 6px 0; max-height: 170px; overflow: auto; font-size: 0.85em; border-top: 1px solid var(--vp-c-divider); }
.events li { margin: 0; padding: 3px 0; border-bottom: 1px solid var(--vp-c-divider); }
.tryit { font-size: 0.9em; margin-top: 6px; }
.two { display: flex; flex-wrap: wrap; gap: 14px; }
.reqs { flex: 1 1 230px; display: flex; flex-direction: column; gap: 6px; }
.reqs button { text-align: left; padding: 6px 10px; }
.reqs button.on { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); }
.num { display: inline-block; width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; background: var(--vp-c-default-soft); margin-right: 8px; font-size: 0.8em; }
.stage { flex: 2 1 320px; }
svg.sec { width: 100%; height: auto; font-family: var(--vp-font-family-base); font-size: 13px; }
.sec .nd rect { fill: var(--vp-c-bg); stroke: var(--vp-c-divider); stroke-width: 1.5; }
.sec .nd rect.ghost { stroke-dasharray: 5 3; }
.sec .nd text { fill: var(--vp-c-text-1); text-anchor: middle; }
.sec .nd text.sm { font-size: 10px; fill: var(--vp-c-text-2); }
.sec .nd.hl rect { fill: var(--vp-c-warning-soft); stroke: var(--vp-c-warning-1); stroke-width: 3; }
.sec .lk line { stroke: var(--vp-c-text-3); stroke-width: 1.5; }
.sec .lk.hl line { stroke: var(--vp-c-warning-1); stroke-width: 4; }
.qs { margin-top: 8px; font-size: 0.9em; }
.qs ul { margin: 4px 0 0; padding-left: 18px; }
.chain { display: flex; flex-wrap: wrap; align-items: stretch; gap: 6px; }
.chain .step { flex: 1 1 130px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.chain .step span { font-size: 0.82em; color: var(--vp-c-text-2); }
.chain .arrow { align-self: center; color: var(--vp-c-text-3); }
.mx { display: table; width: 100%; font-size: 0.85em; }
.road { padding-left: 0; list-style: none; counter-reset: s; display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
.road li { counter-increment: s; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 8px 10px 8px 38px; position: relative; margin: 0; }
.road li::before { content: counter(s); position: absolute; left: 10px; top: 8px; width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; background: var(--vp-c-brand-3); color: #fff; font-size: 0.8em; }
.road li b { display: block; }
.road li span { font-size: 0.82em; color: var(--vp-c-text-2); }
</style>
