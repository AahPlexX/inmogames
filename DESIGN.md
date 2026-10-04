---
version: alpha
name: InMo Game Cabinet
description: A tactile game-shelf system with shared product chrome and materially distinct game surfaces.
colors:
  primary: "#204F7C"
  canvas: "#E9EEF2"
  surface: "#FBFCFD"
  surface-soft: "#DFE6EC"
  ink: "#14263D"
  muted: "#52657A"
  line: "#B7C3CF"
  brand: "#204F7C"
  brand-strong: "#163B5F"
  on-brand: "#FFFFFF"
  accent: "#B84833"
  focus: "#0A66C2"
  success: "#276749"
  danger: "#A33A2B"
  gold: "#D8A53F"
  dark-canvas: "#0E1724"
  dark-surface: "#142238"
  dark-ink: "#F4F7FA"
  dark-muted: "#B8C5D2"
typography:
  display:
    fontFamily: "ui-rounded, SF Pro Rounded, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: "850"
    lineHeight: "0.98"
    letterSpacing: "-0.04em"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: "400"
    lineHeight: "1.55"
  data:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: "750"
    lineHeight: "1.2"
rounded:
  sm: "0.5rem"
  md: "0.85rem"
  lg: "1.25rem"
spacing:
  xs: "0.375rem"
  sm: "0.625rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.25rem"
components:
  page-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.line}"
    mutedTextColor: "{colors.muted}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-brand}"
    hoverColor: "{colors.brand-strong}"
    rounded: "{rounded.sm}"
    padding: "0.6rem 0.9rem"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    borderColor: "{colors.line}"
    rounded: "{rounded.sm}"
  site-brand:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    accentColor: "{colors.accent}"
  focus-ring:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.sm}"
    padding: "3px"
  status-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-brand}"
  status-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-brand}"
  game-highlight:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
  catalog-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0px"
  account-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.72rem 0.78rem"
  dark-shell:
    backgroundColor: "{colors.dark-canvas}"
    surfaceColor: "{colors.dark-surface}"
    textColor: "{colors.dark-ink}"
    mutedTextColor: "{colors.dark-muted}"
---

## Overview

InMo Games should feel like opening a well-kept cabinet of physical games rather than entering a generic app marketplace. Shared product chrome is calm and dependable; games are allowed to feel materially different. The memorable signature is the **game shelf card**: each catalog entry has an illustrated box face paired with a quieter information panel, like selecting a game from a cabinet.

The product register is product-first with restrained brand expression. Global UI should never compete with gameplay.

The runtime token source is `src/styles.css` (Model B). This file mirrors accepted shared values and explains their use. Game-specific palettes remain scoped to their game stylesheets. `primary` mirrors the runtime `--brand` role so the machine-readable design contract and runtime semantic naming remain interoperable.

`pnpm design:check` validates this file. `pnpm test:design-browser` is the rendered contract for responsive composition, 200% text reflow, keyboard focus/selection, minimum game touch targets and reduced-motion behavior.

## Colors

The global palette is blue-enamel, ivory-paper, brick-red and brass. Blue carries navigation and primary product actions; brick red is expressive rather than ubiquitous; brass is reserved for utility emphasis and game detail.

- Body text uses `ink` on `canvas` or `surface`.
- `muted` is for explanatory copy and metadata, not disabled controls.
- `focus` is a dedicated high-contrast keyboard ring.
- Semantic success/danger colors must be paired with text or structure, never hue alone.
- Dark mode remaps global semantic roles while preserving hierarchy.
- Individual games may use local palettes when they improve the game metaphor, but account/save/product chrome stays global.

## Typography

System fonts only: no runtime font request is permitted.

Display text uses the rounded system stack to evoke game-box titling without sacrificing UI clarity. Body copy stays on the platform system stack. Scores, counters and compact metadata use the monospace/data stack for stable numeric alignment.

Large headings use tight tracking and short measures. Body copy should normally stay below 70 characters per line. Game statistics use tabular numerals where supported.

## Layout

The global shell is a centered fluid container capped around 76rem; game routes may expand to about 88rem when the play surface benefits from it. The catalog is two-column at wide widths, one-column on small screens, and each game card recomposes rather than merely shrinking.

Spacing follows the xs/sm/md/lg/xl rhythm above. The primary game artifact appears before secondary settings or destructive controls. Every catalog and game route exposes a keyboard-visible skip control that transfers focus to `#main-content`.

## Elevation & Depth

Global surfaces are lightly elevated only when containment or interactivity benefits from it. Catalog cards and account surfaces receive restrained shadow; ordinary text sections do not.

Game-local depth may be more tactile. Threefold tiles intentionally use a small physical-piece shadow. Royal Palace cards, felt and console may use deeper shadows because the casino-table metaphor depends on layered materials.

## Shapes

Global controls use compact rounded rectangles. Large product containers use a larger but not pill-like radius. Pills are reserved for genuinely compact metadata or back-navigation affordances.

Game shapes may follow their physical metaphor: Threefold uses squared tiles and a circular target; Royal Palace uses playing-card proportions and a curved felt/table treatment.

## Components

**Site brand:** small game-piece mark plus two-line InMo/Games wordmark. It stays quieter than the route title.

**Catalog card:** illustrated game face plus information panel plus one clear play affordance. The entire card is the link.

**Account bar:** compact product utility strip, never a hero. Sign-in is optional and visually secondary to choosing or playing a game.

**Save status:** narrow inline status surface with a redundant status dot plus readable text; errors retain their recovery action.

**Skip control:** visually suppressed until keyboard focus, then clearly visible. Activation moves programmatic focus to the main catalog/game region without changing gameplay state.

**Threefold:** tactile tile board, large central target, compact three-value score rail, visible current round value and selected-equation strip. Selection uses fill, movement, `aria-pressed` and a checkmark so color is not the only cue. Completion includes per-round earned points.

**Royal Palace:** private practice table with felt as the dominant work surface. Bank and actions stay close to the table; preferences remain visibly lower priority. The console names the current phase/action context, and a collapsed **Table rules & help** disclosure keeps the fixed S17/3:2/DAS rules available without crowding the play surface.

## Do's and Don'ts

- Do let each game express its own material world inside shared product chrome.
- Do keep the first useful viewport focused on choosing or playing a game.
- Do use semantic tokens for product UI and scope game-specific literals to game stylesheets.
- Do preserve visible keyboard focus, 44px+ important targets, reduced motion, 320px reflow and 200% text reflow.
- Do use the rendered design-browser gate for material UI changes instead of relying on source inspection alone.
- Don't turn the catalog into a generic equal-card feature grid; the game art face carries identity.
- Don't use glass blur as a general style, neon gradients, excessive pills, floating blobs or decorative KPI cards.
- Don't make account creation look required.
- Don't load third-party fonts or visual assets at runtime.
