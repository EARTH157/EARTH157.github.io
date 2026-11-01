# Design system

How the portfolio at `site/` looks and moves. Tokens live in `site/src/styles/global.css`; this file explains them. When you change the design, change the tokens first and keep this file in step.

## Direction

An engineer's drawing desk: warm paper, near-black ink, one clay accent, blueprint grids. Calm and precise, not techy-neon. Ink sections (hero, render panels, footer) alternate with paper sections (work, about, toolkit).

## Colour

Never write a hex value in a component. Use a token, or add one here and in `global.css`.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#161412` | Dark surfaces, headings on paper |
| `--paper` | `#F4F0EA` | Page background |
| `--paper-card` | `#FBF9F6` | Cards |
| `--paper-deep` | `#EDE7DF` | Recessed paper sections (toolkit) |
| `--text` / `--text-soft` / `--muted` | `#2B2724` / `#4A433E` / `#5E5650` | Body text on paper, strongest to weakest |
| `--line` / `--line-strong` | ink at 12% / 20% | Borders on paper |
| `--clay` | `#A4553A` | Accent text and links on paper (4.7:1) |
| `--clay-hover` | `#7E3F2A` | Link hover on paper |
| `--clay-deep` | `#93472E` | Accent text on `--paper-deep` (4.5:1) |
| `--clay-bright` | `#D27D60` | Primary buttons, focus ring, decoration; never body text on paper |
| `--clay-light` | `#E8957A` | Accent text on ink, blueprint grid lines |
| `--on-ink-strong` / `--on-ink` / `--on-ink-soft` / `--on-ink-muted` | `#F7F2EC` / `#EFE9E2` / `#CFC7BE` / `#B9B0A6` | Text on ink, strongest to weakest; `--on-ink-soft` is the nav and chip colour |
| `--on-ink-line` | on-ink at 16% | Borders on ink |
| `--stone` | `#9C938A` | Legal line on ink, baseline bars in work-card metrics |
| `--status-ok` | `#3FB950` | The "available" status dot only |

Translucent overlays (scrims, glows, grid lines) are written as `rgba()` of the ink, on-ink or clay values above. That is fine; just don't invent new base colours.

Contrast rule: body text must reach 4.5:1 against its background. The clay variants exist because one clay cannot do that on every surface.

## Type

| Role | Font | Notes |
|---|---|---|
| Display (h1–h4) | Space Grotesk Variable | `line-height: 1.15`, weights 600–700 |
| Body | Inter Variable | 16px, `line-height: 1.6` |
| Labels, specs, tags, eyebrows | JetBrains Mono Variable | 11–13px; eyebrows 12px uppercase, `letter-spacing: 0.1em` |

Headings scale with `clamp()`: section titles `clamp(28px, 4vw, 48px)`, the hero name up to 124px. Small mono labels are the floor; don't go below 11px for anything a visitor needs to read (some 3D viewer callouts are 10px today).

## Shape and space

- Container `1280px`, gutter `clamp(20px, 4vw, 32px)`.
- Radius: `--radius` (20px) for cards and panels, `999px` for buttons and chips, `50%` for icon buttons, 6px for tags. Inner elements use smaller radii (12–16px).
- Touch targets are at least 44px (links) or 48px (buttons, icon buttons).
- Breakpoints in use: 560, 640, 760, 860px (max-width) and 1040px (min-width).

## Components

Shared classes in `global.css`: `.btn` with `.btn-primary`, `.btn-ghost-ink`, `.btn-dark`, `.btn-outline`; `.icon-btn` (`--paper` variant); `.text-link`; `.tag-list`; `.card`; `.eyebrow`; `.section-title`; `.blueprint` (40px clay grid on ink); `.paper-grid` (24px ink grid on paper); `.on-ink` (switches text colours inside ink sections). Reuse these before writing component CSS.

## Motion

- One easing everywhere: `--ease` = `cubic-bezier(0.2, 0.7, 0.2, 1)`.
- Hover lifts by 2px; press scales to 0.96 in 0.08s.
- Scroll reveal: `[data-reveal]` rises 24px and fades in over 0.8s, only when JS runs. `data-reveal="n"` delays it by n × 110ms for staggered rows. Put it on a horizontal scroller as a whole, never on its items (the offset makes the scroller overflow vertically).
- Things that animate once their revealed parent is visible: work-card metric bars fill from zero, timeline dots pop in down the line, the current job's dot pings three times.
- A 2px clay reading-progress line runs along the top edge (CSS scroll-driven animation; absent where unsupported).
- The hero intro is a choreographed sequence (typing, rise, mask-up, line draw, scan) between 0.15s and about 1.6s; the status dot pings forever.
- Page transitions use cross-document View Transitions: the old page lifts away, the new one settles in, the "JC." logo (`.vt-logo`) stays put, and a case study cover grows out of its card.
- `prefers-reduced-motion: reduce` turns off all animation, transitions, view transitions and smooth scrolling. Keep it that way for anything new.

## Accessibility baseline

Skip link, visible `:focus-visible` ring in `--clay-bright`, `.sr-only` for hidden labels, and the contrast and target-size rules above.
