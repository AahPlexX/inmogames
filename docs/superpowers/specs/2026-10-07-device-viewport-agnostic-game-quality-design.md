# Device- and Viewport-Agnostic Game Quality Design

**Status:** written specification awaiting product-owner review  
**Date:** 2026-10-07  
**Scope:** repository-wide; every current and future game route in the InMo Game Cabinet  
**Implementation state:** not started

## Purpose

Every InMo game must deliver equivalent gameplay quality, legibility, control access, information hierarchy and responsiveness regardless of screen size or input modality. A narrow phone, rotated phone, tablet, compact laptop, ordinary desktop and large monitor may use different compositions, but none may receive a materially inferior version of the game.

“Device agnostic” and “viewport agnostic” do **not** mean pixel-identical layouts. They mean the same game remains complete, understandable, operable and polished as available space changes. Responsive recomposition is preferred over shrinking a desktop composition until it technically fits.

This is a repository-wide quality contract. It must apply automatically to games added later rather than depending on each game author remembering to copy a viewport checklist.

## Existing repository baseline

The repository already requires responsive Grid/Flexbox layouts, no horizontal overflow at 320 CSS px, keyboard/touch operation, reduced motion, 200% text reflow and rendered browser evidence. Existing browser suites verify meaningful parts of that contract for Threefold, Royal Palace Blackjack and Mergrove, while coverage depth is not yet uniform across every game. Cloudline Couriers, for example, has rendered checks at a phone-class viewport but does not yet have the same repository-wide viewport/reflow/target matrix.

The new contract therefore strengthens and centralizes existing rules; it does not replace game-specific design tests.

## Standards basis

Implementation must use current primary standards/documentation as the floor:

- **WCAG 2.2 SC 1.4.10 Reflow (AA):** vertically scrolling content must preserve information and functionality without two-dimensional scrolling at a width equivalent to 320 CSS pixels, except content whose meaning inherently requires two dimensions.
- **WCAG 2.2 SC 1.4.4 Resize Text (AA):** text must remain usable at 200% sizing without assistive technology.
- **WCAG 2.2 SC 2.5.8 Target Size (Minimum) (AA):** pointer targets have a 24 × 24 CSS-pixel minimum or qualifying spacing/exception. InMo intentionally keeps its existing stronger 44 × 44 CSS-pixel baseline for ordinary game action targets.
- **WCAG 2.2 SC 2.1.1 Keyboard, 2.4.7 Focus Visible, 2.5.7 Dragging Movements and 4.1.2 Name/Role/Value:** responsive changes may not create an input-method downgrade.
- **MDN CSS container-query guidance:** components may respond to their actual containing space when that is more robust than viewport-only breakpoints. Container queries are a progressive layout tool, not a mandatory abstraction.

No device-sniffing or user-agent-specific responsive fork is allowed. Layout behavior must be driven by available CSS space/capabilities and semantic HTML.

## Definition of equivalent quality

A game satisfies the device/viewport-agnostic contract only when all of the following remain true across the verification matrix:

1. **Complete gameplay remains available.** No rule, ordinary action, objective, status, score, queue, hand, board, inventory or required control disappears merely because the viewport is smaller, shorter, larger or rotated.
2. **Gameplay remains visually primary.** Product chrome, settings, account controls and destructive actions may reflow around the play surface but may not crowd the main game artifact out of the useful viewport.
3. **No document-level horizontal overflow.** `document.documentElement.scrollWidth <= window.innerWidth` within normal rounding tolerance. Game boards must responsively fit/recompose rather than require page-level sideways scrolling.
4. **No horizontally clipped action target.** Visible interactive controls must remain within the usable viewport after normal layout. A control may move to another row/column; it may not be partly off-screen.
5. **Vertical access is preserved.** Ordinary vertical page scrolling is allowed. Every visible/enabled interactive control must be reachable by scrolling; fixed-height/overflow containers may not trap later game controls outside the reachable region.
6. **Text remains readable and reflows.** At 200% root text sizing, essential labels, instructions, counters and controls remain available and do not cause document-level horizontal overflow.
7. **Game action targets remain touch-quality.** Ordinary primary/repeated game buttons and controls keep the repository 44 × 44 CSS-pixel baseline. Inline prose links and standards-defined exceptions are not silently promoted to gameplay controls; any intentional smaller game target requires explicit game-specific rationale and at minimum WCAG 2.5.8 compliance.
8. **Input parity remains intact.** Responsive layouts do not remove keyboard access, visible focus, pointer/touch access or the non-drag alternative to any drag interaction.
9. **State is not encoded by viewport-specific color/motion alone.** Selection, disabled, success, failure, objective and progress states retain textual/programmatic or structural cues.
10. **Reduced motion remains equivalent.** Removing decorative motion under `prefers-reduced-motion: reduce` never hides state or prevents an action.
11. **Large viewports are intentionally composed.** A 1920px-wide display must not simply stretch text, cards or a board to uncomfortable widths. Readable measures, sensible max-widths and spatial hierarchy remain intact.
12. **Orientation change does not create a second-class layout.** Short landscape viewports receive the same actions and information even when controls need to wrap, stack or move below the play surface.

## Mandatory viewport matrix

The shared rendered conformance gate will exercise every catalog game at these representative CSS-pixel viewports:

| Case | Viewport | Purpose |
| --- | ---: | --- |
| Narrow portrait | 320 × 568 | repository minimum-width/reflow boundary |
| Modern phone portrait | 390 × 844 | common touch composition |
| Short phone landscape | 844 × 390 | low-height/orientation stress |
| Tablet portrait | 768 × 1024 | medium-width vertical composition |
| Tablet/compact laptop landscape | 1024 × 768 | medium-wide composition |
| Desktop | 1440 × 900 | ordinary wide workspace |
| Large desktop | 1920 × 1080 | max-width/hierarchy/stretch stress |

These samples are not a claim that seven dimensions mathematically prove every possible viewport. They are boundary/representative probes combined with layout invariants that must hold continuously between them. Game CSS should therefore use fluid Grid/Flexbox, intrinsic sizing, `minmax()`, `clamp()`, wrapping and container queries where useful rather than styling only for these exact numbers.

## Secondary matrices

To control CI cost while still testing the important non-default modes:

- **200% text:** run against every game at 320 × 568 and 1024 × 768.
- **Reduced motion:** run against every game at 390 × 844 and 1440 × 900.
- **Keyboard focus/reachability:** run at 1024 × 768, while game-specific suites continue to verify deeper gameplay keyboard semantics.
- **Touch-target sizing:** enforce at 320 × 568 and 390 × 844 for visible ordinary game action controls.

Game-specific suites may add more cases where their mechanics demand them, such as card-action grids, dense boards, dialogs, inventories, campaign maps or split panes.

## Shared conformance harness

Implementation should add a rendered Playwright test dedicated to the cross-game viewport contract, tentatively `tests/browser/viewport-conformance.mjs`, with small focused helpers rather than duplicating assertions in each game suite.

### Game discovery

The harness must not maintain a hand-written list of slugs. It should start from the rendered catalog and discover the game entries/routes produced from the repository's canonical `src/catalog.ts` `games` array. A newly registered game must therefore enter the viewport matrix automatically.

The harness should fail clearly if the catalog contains no games or if a discovered game route cannot render.

### Generic checks per game/view

For each discovered game and applicable matrix case, the harness should:

- navigate to the game route and wait for the game workspace/main content to render;
- collect uncaught `pageerror` events and fail on any game-local uncaught error;
- assert document-level horizontal overflow is absent;
- identify visible interactive controls within the game/main region and report controls whose bounding boxes are horizontally clipped;
- prove visible/enabled interactive controls can be brought into the viewport by normal vertical scrolling rather than being trapped by clipping/fixed-height layout;
- verify required touch-target dimensions on phone cases;
- repeat overflow/reachability checks after 200% text sizing in the text matrix;
- run the reduced-motion mode without information/control loss;
- emit failures with the game slug, viewport label/dimensions and offending element metadata so fixes are actionable.

The generic suite must not attempt to understand each game's rules. Game-specific browser suites remain responsible for semantic flows such as betting, merging, scoring, campaign progression or route-specific dialog behavior.

## Responsive implementation guidance

The test contract describes outcomes rather than dictating one CSS architecture. Preferred implementation techniques are:

- CSS Grid/Flexbox with wrapping and intrinsic sizing;
- `min()`, `max()`, `minmax()`, `clamp()` and sensible maximum measures;
- relative units for typography/spacing where appropriate;
- game-local container queries when a component's allocated width is more important than the full viewport;
- `aspect-ratio` for boards/cards/art only when it does not force inaccessible clipping;
- `max-inline-size: 100%`, `min-width: 0` and equivalent overflow-safe patterns where intrinsic content could otherwise force width;
- vertically scrollable dialogs/panels constrained to the available block size rather than fixed pixel heights.

Prohibited strategies include user-agent sniffing, maintaining separate “mobile game” implementations, hiding required controls at a breakpoint, scale-transforms that make controls visually fit while shrinking their effective usability, and blanket `overflow-x: hidden` used to conceal an underlying layout defect.

## Relationship to game-local completion

This is a shared release invariant. Once implemented, a game cannot become or remain `verified` after a material game UI change unless the applicable shared viewport gate and its own required responsive evidence are green.

The shared harness itself remains repository-wide and should not duplicate every game's documentation. When the new matrix exposes an actual defect in a game, fixing that game's source is game-local work and must follow the existing governance contract: reopen the affected verified game before/with the fix and update its authoritative spec, tracker, PRD/todo and state evidence as required.

A generic shared-test change must not be used to bypass game-local documentation when the underlying repair changes a game.

## Parallel-agent coordination

Mergrove is currently being finished by another agent. This architectural work must not independently edit Mergrove game-local source while that ownership is active. The future shared conformance gate will apply to Mergrove exactly like every other catalog game. If it reveals a Mergrove-specific defect while another agent still owns that game, record the exact failing condition and reconcile ownership rather than overwriting concurrent work.

The same moving-`main` rule applies to all implementation work: reread the live `main` ref before each mutation and rebuild any planned commit on the new tip if another agent advanced the repository.

## Documentation changes required at implementation time

After this written spec is approved and an implementation plan is approved, the implementation integration must make the shared rule durable in the repository documentation:

- `DESIGN.md`: define device/viewport-agnostic quality and the representative matrix as a shared design invariant.
- `AGENTS.md`: require every current/future game to pass the shared viewport gate before verification.
- `GOVERNANCE.md`: strengthen the mandatory final game checklist from broad “mobile/tablet/laptop/desktop” wording to the shared conformance contract.
- `docs/DOCUMENTATION_STANDARD.md`: make the viewport matrix and equivalent-quality definition part of the minimum game definition of done.
- `README.md`: document the shared conformance command/gate once it exists.
- `.tasks/`: record implementation, discovered game defects and exact verification evidence without rewriting historical evidence.

Per-game documents change only when that game's implementation/state/evidence actually changes.

## CI integration design

The shared viewport conformance test belongs in `pnpm test:design-browser`, and therefore in `pnpm validate` and the Pages validation workflow. It must fail CI on a contract violation; it is not an informational screenshot audit.

Existing game-specific rendered suites remain in place. The new harness centralizes cross-game layout invariants, while per-game suites retain detailed semantic assertions. This prevents both duplication and the false confidence of testing only one developer-selected viewport.

No new runtime dependency is required. The repository already uses Playwright for rendered browser verification.

## Failure handling and diagnostics

A failure should report enough evidence to repair the layout without reproducing by guesswork. At minimum include:

- game slug/route;
- matrix case and exact viewport dimensions;
- check type (document overflow, clipped target, unreachable target, target size, 200% text, reduced motion, page error);
- selector/role/text excerpt where available;
- measured bounding box and viewport width/height for geometry failures;
- a short list of overflow offenders rather than only the document scroll width.

The harness must not auto-whitelist a game because it is difficult to make responsive. Any exception to a shared invariant requires an explicit repository design decision with standards rationale and an equivalent-quality alternative.

## Verification and completion criteria

This repository-wide work is complete only when all of the following are true on one exact integrated `main` revision:

- [ ] Shared conformance harness dynamically discovers every catalog game.
- [ ] Every catalog game passes all seven base viewport cases.
- [ ] Every catalog game passes the 320 × 568 and 1024 × 768 200%-text checks.
- [ ] Every catalog game passes phone and desktop reduced-motion checks.
- [ ] Every catalog game passes phone-class action-target sizing and horizontal-clipping checks.
- [ ] Every catalog game preserves keyboard focus/reachability in the shared matrix, with game-specific suites still covering semantic keyboard play.
- [ ] Any defects uncovered in verified games were fixed through their normal reopen/spec/tracker/PRD/todo workflow rather than hidden in the generic test.
- [ ] DESIGN.md, AGENTS.md, GOVERNANCE.md, DOCUMENTATION_STANDARD.md, README and `.tasks/` are synchronized with the implemented contract.
- [ ] `pnpm test:design-browser` and full `pnpm validate` pass on the exact integrated revision.
- [ ] GitHub Pages deployment for the exact revision succeeds and deployed routes receive a production smoke check where application behavior changed.

## Explicit non-goals

- Pixel-identical layouts across devices.
- Device/user-agent sniffing.
- Screenshot-golden testing of every pixel.
- Replacing game-specific semantic browser tests.
- Creating separate mobile and desktop game implementations.
- Guaranteeing every hypothetical browser dimension solely by enumerating test viewports; continuous fluid-layout invariants remain the implementation requirement.

## Sources used for the design

Primary/current sources only:

- W3C WCAG 2.2 and Understanding SC 1.4.10 Reflow.
- W3C Understanding SC 2.5.5 Target Size (Enhanced) / SC 2.5.8 Target Size (Minimum) context for the repository's stronger 44px target policy.
- MDN CSS container-query and containment guidance.

The implementation plan must re-check current official documentation if standards/browser behavior materially changes before implementation.
