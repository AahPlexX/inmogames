# Hollowshift Phase-0 Economy & Content Research

**Date:** 2026-10-09  
**Status:** phase-0 decision evidence; implementation has not started  
**Authoritative game design:** `docs/specs/2026-10-09-hollowshift-design.md`  
**Wayfinder map:** issue #10  
**Research tickets:** issue #12 (first-hour economy), issue #13 (release content budget)

This document records the deterministic phase-0 research/modeling decisions used to refine Hollowshift before gameplay implementation. It does not replace the authoritative game design. Exact live values remain tunable after the core-loop prototype and playtesting, but implementation should begin from these baselines rather than inventing a new economy or content floor ad hoc.

## 1. Evidence basis

The progression model is constrained by the design goal that long-term play should support autonomy and competence rather than coercion. Current Self-Determination Theory summaries from the American Psychological Association and the Center for Self-Determination Theory identify autonomy and competence as core psychological needs associated with higher-quality motivation and persistence. The Federal Trade Commission's dark-pattern guidance identifies manipulative game grinding and confusing purchase-oriented design as harmful patterns. Hollowshift therefore uses transparent progression, visible costs, deterministic reward rules and voluntary challenge multipliers rather than time gates, streak loss, fake scarcity or purchase pressure.

Accessibility constraints remain those already recorded in the authoritative design and repository-wide viewport contract: WCAG 2.2 keyboard/pointer equivalence, non-drag alternatives, visible/unobscured focus and target-size requirements, with InMo's stronger 44×44 CSS-pixel ordinary gameplay target baseline.

Primary sources checked 2026-10-09:
- American Psychological Association, Self-Determination Theory overview.
- Center for Self-Determination Theory, theory overview.
- U.S. Federal Trade Commission, *Bringing Dark Patterns to Light* and Epic Games dark-pattern enforcement materials.
- W3C WCAG 2.2 and WAI guidance.

## 2. First-hour economy baseline

### 2.1 Design targets

The first-hour model must support all of these at the same time:

- first successful extraction around 10 minutes;
- first permanent workshop upgrade by roughly 15 minutes;
- first meaningful tool-family choice around 20–30 minutes;
- visible second-biome goal by 45 minutes;
- Rank 5 / second-biome access around 1.5–3 hours for ordinary play;
- struggling players continue making permanent progress without needing to replay the tutorial;
- strong players progress faster because they complete more objectives and take voluntary risk, not because the game secretly changes odds;
- repeating an already-solved contract remains worthwhile, but loses only novelty/first-clear bonuses rather than having its base rewards heavily nerfed.

### 2.2 Rank thresholds for the opening progression

Use cumulative XP thresholds as the starting implementation baseline:

| Rank reached | Cumulative XP | Intended meaning |
| --- | ---: | --- |
| Rank 1 | 0 | Training / basic survey-shift-extract rules |
| Rank 2 | 120 | First workshop upgrade slot |
| Rank 3 | 360 | Second tool family / meaningful loadout choice |
| Rank 4 | 720 | Challenge Contracts become available |
| Rank 5 | 1,200 | Second biome unlock |

These are implementation baselines, not hard-coded UI constants. They belong in progression data and must remain easy to rebalance after prototype evidence.

### 2.3 XP reward primitives

Opening-game rewards should be assembled from visible components rather than one opaque score:

| Reward event | Baseline XP | Notes |
| --- | ---: | --- |
| Training completion | 40 | One-time; no repeat requirement |
| Primary contract completion | 100 | Core reliable progression source |
| Optional objective | 35 each | Usually 0–2 in early game |
| New Field Guide discovery | 20 | One-time per discovery |
| First-clear contract/parameter combination | 25 | Novelty bonus only; repeat removes this bonus, not base reward |
| Descend-and-extract depth bonus | 20 per extra depth | Visible before committing |
| Challenge modifier | +10% XP per challenge-weight point | Additive/multiplicative implementation may be tuned, but reward must remain monotonic and previewed |
| Failed expedition learning credit | 35–70 | Based on genuinely completed objectives/discoveries; never time-only XP |

Important rule: **the game never reduces primary-contract base XP because the player repeats content.** Diminishing returns are implemented by exhausting first-clear/discovery bonuses and by making new/harder objectives more efficient, not by turning familiar content into near-zero-value grind.

### 2.4 Common-material baseline

Common Materials are the opening workshop currency.

| Event | Common Materials |
| --- | ---: |
| Training completion | 10 |
| First normal successful extraction | 30 target baseline |
| Ordinary early successful expedition | 28–40 |
| Strong early expedition with optional objective/depth push | 38–55 |
| Failed early expedition emergency recovery | 12–24 typical |

Opening costs:

| Purchase | Cost | Purpose |
| --- | ---: | --- |
| First station tier | 20 | Guaranteed meaningful upgrade opportunity after first normal extraction |
| Alternative first station tier | 20–25 | Choice should be strategic, not a fake expensive option |
| First additional tool family unlock | 35 | Affordable around Rank 3 for ordinary play |
| First tool module | 30–40 + small biome-material requirement later | Do not gate the first tool choice on rare drops |
| Second station tier | 45–55 | Creates a visible medium-term goal rather than immediate completion |

The first permanent upgrade should never require a lucky drop. If the player reaches the first workshop with fewer than 20 Common Materials because of an unusual failure path, the debrief may award a one-time training grant sufficient to make one first-tier choice; this is onboarding protection, not recurring pity currency.

## 3. Deterministic player-profile simulation

The research model used three transparent profiles. These are not claims about real player distributions; they are balance probes for whether the proposed numbers satisfy the PRD targets without grind.

### 3.1 Struggling profile

Assumption: slower turns, occasional failed or partial contracts, few optional objectives.

| Cumulative time | Cumulative XP | Common Materials | Milestone |
| ---: | ---: | ---: | --- |
| 4 min | 40 | 10 | Training complete |
| 14 min | 135 | 28 | Rank 2 reached; first station purchase possible |
| 28 min | 245 | 50 | Permanent progression continues after a modest/failed run |
| 44 min | 365 | 74 | Rank 3 reached; tool-family choice possible |
| 60 min | 490 | 98 | Clear second-biome goal visible; no tutorial replay needed |
| ~165 min modeled | ~1,295 | sufficient | Rank 5 / second biome under conservative mature earnings |

Result: even a struggling player is not trapped. They may reach the second biome near the upper end of the 1.5–3 hour target, which is acceptable; permanent unlocks arrive much earlier.

### 3.2 Ordinary profile

Assumption: successful primary objectives, roughly one optional objective on many runs, occasional discoveries.

| Cumulative time | Cumulative XP | Common Materials | Milestone |
| ---: | ---: | ---: | --- |
| 4 min | 40 | 10 | Training complete |
| 13 min | 205 | 40 | Rank 2 + first workshop upgrade |
| 26 min | 380 | 74 | Rank 3 + second tool family |
| 41 min | 570 | 112 | Challenge Contracts visibly approaching |
| 56 min | 765 | 152 | Rank 4 reached |
| ~101 min modeled | ~1,335 | sufficient | Rank 5 / second biome |

Result: ordinary play satisfies every first-hour PRD target while keeping Rank 5 far enough away to feel earned.

### 3.3 Strong profile

Assumption: fast successful contracts, optional objectives, deeper pushes and efficient route play.

| Cumulative time | Cumulative XP | Common Materials | Milestone |
| ---: | ---: | ---: | --- |
| 4 min | 40 | 10 | Training complete |
| 12 min | 260 | 48 | Rank 2 + first upgrade |
| 23 min | 505 | 93 | Rank 3 + tool choice |
| 35 min | 765 | 143 | Rank 4 |
| 48 min | 1,040 | 198 | Rank 5 clearly imminent |
| ~63 min modeled | ~1,300 | sufficient | Rank 5 / second biome |

Result: strong play is meaningfully rewarded, but it does not skip the entire career structure. The model rewards mastery with efficiency rather than exclusive power.

## 4. Economy guardrails for implementation

- Rank thresholds and reward primitives live in data/constants owned by `progression.ts`, not JSX.
- Every reward line in the debrief identifies its source.
- First-clear/discovery bonuses are explicit and finite.
- Repeating a solved contract always retains full primary-contract base reward.
- A player can never lose banked Common Materials or permanent upgrades because of expedition failure.
- No opening upgrade requires a random-only resource.
- Challenge multipliers are monotonic: adding challenge weight can never reduce expected deterministic completion rewards.
- The first tool-family choice must be reachable without choosing a specific first workshop station.
- Mutually exclusive module choices must be freely respecable outside expeditions as defined by the authoritative design.
- If prototype play shows ordinary players deliberately repeating the same easiest contract solely to fill XP, increase novelty/new-objective efficiency before lowering repeat rewards.
- Final lamp drain and emergency-recovery percentages remain prototype-dependent because they affect expedition success rate and therefore earnings velocity.

## 5. Release content budget analysis

The authoritative PRD's content floor is large enough to support a full-length game **if implementation uses reusable rule families and data-driven variants**. It would become wasteful if every contract, relic or biome variation were implemented as bespoke code.

The decision is therefore to retain the overall content floor while defining a strict mechanics-versus-data split.

### 5.1 Biomes

Release floor: **4**.

| Biome | New rule family required | Data-driven variations |
| --- | --- | --- |
| Slate Veins | Base shifting geometry + Crawler pressure | room layouts, resource distributions, contract parameters |
| Glasswater Caves | Flooded-lane state + reflected/ambiguous survey presentation | water placement, reflection patterns, objective parameters |
| Rootvault | Root growth across unused connections | growth seeds, root density, contract parameters |
| Ashworks | Heat/pressure vent cycle | vent placement, pressure timing class, objective parameters |

Decision: four biomes is the correct release floor. Fewer would undersell the long-term promise; more should wait until the four existing rule families are polished.

### 5.2 Threats

Release floor: **5 base archetypes plus biome variants**.

Unique behavior algorithms:
1. Crawler pursuit;
2. Scree Mite resource consumption;
3. Echo previous-direction mimic;
4. Burrower telegraphed edge-ignore movement;
5. Warden stationary zone control.

Biome variants should modify one or two parameters/constraints—movement cadence, traversable hazard type, protected objective class, or forecast interaction—rather than creating a new AI algorithm for each skin.

Budget: 5 behavior algorithms + approximately 8–12 data variants across the four biomes. Add a sixth algorithm only if playtesting exposes a missing tactical pressure, not to hit a marketing count.

### 5.3 Tools

Release floor: **6 families / 12 modules**.

Each tool family contributes one new tactical capability. Each family ships with at least two mutually exclusive modules that alter how the capability is used rather than simply adding a percent bonus.

| Tool | Core mechanic | Module axis examples |
| --- | --- | --- |
| Resonator | reveal/forecast | wider reveal vs deeper future forecast |
| Jack Brace | geometry locking | longer lock vs recoverable/mobile pin |
| Pulse Line | remote connected interaction | range vs multi-hop condition |
| Arc Lamp | charge-for-control | stun duration vs area control |
| Survey Drone | remote route scouting | branch depth vs reusable/return behavior |
| Cutter | open sealed edge/shortcut | precision/reuse vs stronger one-shot cut |

Decision: 6/12 is sufficient. More tools before the core six are differentiated would dilute loadout identity.

### 5.4 Workshop

Release floor: **7 stations / 28–35 meaningful tiers total**.

The previous minimum of 24 nodes/tiers remains a hard floor, but the recommended authored target is **28** at launch: four meaningful tiers per station. A fifth or sixth tier is allowed only where it introduces a new decision or tradeoff.

No station should be padded with consecutive tiny percentage upgrades solely to increase count.

### 5.5 Primary contracts

Do **not** author 30 separate gameplay systems. Use six reusable objective archetypes:

1. recovery/relic extraction;
2. anchor stabilization;
3. rescue-and-return;
4. mapping/survey coverage;
5. material quota with routing pressure;
6. instability-cycle survival/extraction.

Each archetype receives biome-specific parameters and rule hooks. Four biomes × six archetypes produces 24 meaningful base combinations. Add at least 6 authored special combinations (for example multi-anchor, named relic, Warden-protected rescue, deep-survey or chained-depth objectives) to exceed the 30-combination release floor without inventing 30 engines.

Recommended release target: **30–36 primary contract combinations** backed by only 6 core objective evaluators plus small composable modifiers.

### 5.6 Optional objectives

Use six reusable optional-objective families across four biomes:

1. preserve a resource class;
2. avoid triggering a specified instability event;
3. extract above a carried-value threshold;
4. survey a side region;
5. trap/bypass a threat in a stated way;
6. finish with a resource reserve (lamp/integrity/tool charge).

Four biome parameterizations × six families = **24** release-floor variants without 24 code paths.

### 5.7 Field Guide and relics

Recommended initial Field Guide budget: **48+ entries**, including:

- 5 base threat entries;
- 8–12 threat/biome behavior notes unlocked by demonstrated encounters;
- 8 material entries;
- 8 tunnel/instability phenomena;
- 8 rare room/device entries;
- 16 named relics.

The Guide may cross-reference one entity into multiple knowledge notes, so entry count is not synonymous with 48 separate game mechanics.

Relics: retain **16 named relics**. Their primary implementation cost should be authored text/iconography plus a discovery rule; only a minority should carry bespoke run modifiers. If every relic adds custom engine behavior, cut the count rather than overbuild.

### 5.8 Challenge system

The PRD's “20+ challenge modifiers/combinations” should mean **combinations**, not 20 bespoke modifier mechanics.

Recommended v1 modifier primitives:
1. higher threat tier/cadence;
2. shorter instability forecast;
3. lower pack capacity;
4. no mid-depth refill;
5. additional optional-objective requirement;
6. unstable extraction route;
7. elite Warden condition;
8. reduced emergency recovery.

Eight primitives can generate many legal combinations. Define compatibility rules and cap simultaneous modifiers for readability. The release should expose at least 20 curated combinations/tier presets while owning only these ~8 modifier mechanics.

## 6. Content-budget conclusion

Retain the authoritative PRD's release floor, with these implementation interpretations:

- 4 biome rule families;
- 5 threat algorithms + data variants;
- 6 tool mechanics + 12+ module specializations;
- 7 workshop stations, recommended 28 meaningful tiers;
- 6 primary-objective evaluators producing 30–36 authored parameterized combinations;
- 6 optional-objective evaluators producing 24+ biome variants;
- 48+ Field Guide knowledge entries, including 16 named relics;
- 8 challenge-modifier primitives producing 20+ curated combinations;
- one Apex composition layer reusing the systems above rather than introducing a second game.

This keeps the release genuinely full-length while limiting bespoke gameplay rule families to a tractable set. Any proposed new mechanic must answer: **what new player decision does this create that the existing systems cannot?** If it cannot answer that, prefer a data variant or omit it.

## 7. Phase-0 decisions resolved by this research

### Economy decision
Use cumulative opening rank thresholds 120 / 360 / 720 / 1,200 XP for Ranks 2–5, the transparent reward primitives above, a 20 Common-Material first upgrade and 35 Common-Material first additional tool-family baseline. Treat these as the starting balance model; prototype/playtest may tune values, but any replacement must preserve the timing and anti-grind invariants.

### Content-budget decision
Retain the PRD's full-release scope, but implement it through the mechanics/data split above. The game needs breadth in decisions and progression, not one custom subsystem per content item.

## 8. Remaining prototype-dependent questions

Still unresolved intentionally:

- whether the 7×7 shifting-tunnel loop is intrinsically fun and readable in a 3–5 minute prototype;
- exact lamp drain;
- whether pack capacity is slots or weight;
- final emergency-recovery percentage (40% remains proposed);
- advanced-biome lane-wrap semantics;
- rendered board/HUD density across the required viewport matrix.

Those remain on the Wayfinder prototype frontier and must not be silently guessed during implementation.
