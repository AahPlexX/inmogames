# Cloudline visual production direction

Cloudline uses an illustrated sky-courier language: warm brass, cream canvas, cool atmospheric blues, deep navigation ink, hand-built industrial landmarks, and high-contrast hazard weather. The shipped visual family must read as one world rather than a collection of generic icons.

## Motion hierarchy

- Ambient: no perpetual courier bobbing or sustained oscillation. Future ambient cloud/weather motion must stay low-amplitude, nonessential and reduced-motion safe.
- Turn anticipation: the selected boost and roll result establish the pending flight without delaying input unnecessarily.
- Travel: the courier advances stop-by-stop around the actual introductory perimeter path; Windgates visibly include their two-stop carry. Travel is finite and can be skipped.
- Arrival/event: the destination stop becomes the active state and the board uses a short event-specific impact treatment; routine delivery, workshop, beacon, storm, windgate and cargo outcomes do not share one generic effect.
- Reward/resource: only the resource affected by the outcome receives a brief pulse, while the text status states the exact consequence.
- Cargo: pod selection receives a bounded selection response before the deterministic reward commits; unselected pods de-emphasize without becoming inaccessible.
- Upgrade: the upgraded landmark receives a stronger bounded transformation cue than a routine landing. District/region milestones remain the highest celebration tier and are still open scope.
- Reduced motion: interaction results and consequence text remain immediate; route travel and nonessential scaling/translation are suppressed under `prefers-reduced-motion`.

## Performance and accessibility rules

Cloudline motion uses bounded CSS transforms/opacity for the moving/feedback layers instead of animating layout geometry. No Cloudline animation may use `infinite` iteration or `transition: all`. Motion must never be the only carrier of gameplay state, and frequent motion must be cancelable or skippable.

Current sources rechecked 2026-10-22: Apple HIG Motion, MDN CSS/animation performance guidance, MDN `prefers-reduced-motion`, and W3C WCAG 2.2 SC 2.3.3/C39.

## Production rule

The current vector family plus the first finite interaction/VFX tranche is not final CLC-007 quality sign-off. CLC-007 remains open until rendered review confirms production quality across actual game scale and later campaign content supplies stateful regional/crew/weather/VFX assets. Emoji, crude primitive stand-ins, generic placeholder icons, sustained decorative motion and generic one-effect-for-every-event feedback are not acceptable release presentation.
