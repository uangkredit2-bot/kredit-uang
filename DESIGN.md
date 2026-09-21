# Design Brief

## Direction

Quiet Ledger — a near-black charcoal payment surface where a single vivid mint accent carries every moment of meaning.

## Tone

Luxury/refined minimalism executed with conviction: one accent color, generous negative space, and material depth instead of decoration.

## Differentiation

The mint is rationed like currency — it appears only on the headline accent word, the confirmation badge, and the primary CTA, so the eye always knows exactly where the money is.

## Color Palette

| Token      | OKLCH         | Role                                                    |
| ---------- | ------------- | ------------------------------------------------------- |
| background | 0.155 0.008 165 | App canvas — near-black charcoal, faint green cast    |
| foreground | 0.955 0.006 160 | Primary text — soft warm-white, never pure #fff       |
| card       | 0.198 0.011 162 | Bill card + raised surfaces, one step above canvas    |
| primary    | 0.838 0.196 160 | Mint — headline accent, badge, primary CTA fill       |
| accent     | 0.838 0.196 160 | Same mint, reserved for active/highlight states       |
| muted      | 0.245 0.012 162 | Inset rows, dividers, secondary chips                 |
| border     | 0.288 0.014 162 | Hairline edges, 1px, low contrast by design           |

## Typography

- Display: Space Grotesk — headline, bill amount, section titles; tight tracking, bold weights
- Body: DM Sans — paragraphs, labels, buttons, status rows
- Mono: Geist Mono — uppercase micro-labels and tabular numerals
- Scale: hero `text-[2.6rem] leading-[1.05] font-bold tracking-[-0.03em]`, h2 `text-2xl font-bold tracking-tight`, label `text-[0.68rem] font-semibold tracking-brand uppercase font-mono`, body `text-base leading-relaxed`

## Elevation & Depth

Three stacked layers — canvas, glass card, inset row — with a soft inset highlight plus a deep 40px drop shadow so cards read as physical slabs rather than flat rectangles.

## Structural Zones

| Zone    | Background              | Border     | Notes                                                        |
| ------- | ----------------------- | ---------- | ------------------------------------------------------------ |
| Header  | transparent on canvas   | none       | Mint shield icon right, `LIMIT PINJAMAN` label, thin circles  |
| Hero    | `bg-atmosphere` radial  | —          | Dark-green radial wash, 3-line headline, mint final word      |
| Content | `surface-glass` card    | `border`   | Bill card: badge row, amount, divider, status row             |
| CTA     | mint gradient, full-w   | none       | Large rounded mint button, dark bold label, arrow in dark disc|
| Footer  | transparent on canvas   | none       | Faint `Kredit Uang` wordmark, wide spacing                    |

## Spacing & Rhythm

Page gutter 20px on mobile (24px ≥400px), 32–40px between major zones, 16–20px inside cards, 12px micro-gaps; content column capped at 480px and centered on desktop.

## Component Patterns

- Buttons: full-width mint pill (`rounded-[1.5rem]`), `bg-gradient-primary`, dark bold label, 56px tall, `shadow-cta`, press scale 0.985
- Cards: `rounded-[1.75rem]`, `surface-glass`, 1px `border`, `shadow-elevated`
- Badges: mint pill, `bg-primary/12`, 1px mint border, mono uppercase text with a 6px dot
- Circles: absolute-positioned `.ring-circle` / `.ring-circle-soft` at 180–340px diameter, 8–14% opacity

## Motion

- Entrance: `animate-fade-up` staggered 0–240ms across header, headline, card, CTA
- Hover: `transition-smooth` on all interactive surfaces; CTA brightens via `brightness-105`
- Decorative: `animate-ring-drift` on background circles (14s), `animate-pulse-soft` on the status dot
- Confirmation: `animate-check-pop` for the success mark after confirming

## Constraints

- Dark-mode only — dark tokens live on `:root`; `.dark` mirrors them so no class toggle can break rendering
- No raw hex/rgb in components; semantic tokens only (`bg-card`, `text-primary`, `border-border`)
- No `DEMO` / `SIMULASI` copy anywhere; payment flow is UI-only, non-transactional
- Mobile-first 360–430px; nothing may clip or overflow at 360px width
- No payment history or payment-method selection surfaces — out of scope for this build

## Signature Detail

The rationed-mint economy: a single accent hue controls hierarchy across badge, headline, and CTA, while thin translucent circles drift behind the hero — a geometric, quiet-luxury signature.
