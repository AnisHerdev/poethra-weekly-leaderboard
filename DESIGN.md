---
name: Poéthra Leaderboard
description: A literary leaderboard for the RV University Poéthra club.
colors:
  parchment: "#F5ECD7"
  parchment-dark: "#E8DDBE"
  polaroid-paper: "#FBF7EE"
  chronicle-cream: "#FAF6EC"
  ink: "#1B2A4A"
  ink-light: "#2A3B5A"
  ink-card: "#1E2738"
  ink-card-deep: "#1C2638"
  oxblood: "#6B1C2A"
  oxblood-light: "#8B2C3A"
  oxblood-bright: "#C4506A"
  lamplight: "#F2E8C9"
  lamplight-glow: "#FAF3E0"
typography:
  display:
    fontFamily: "Petrona, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Petrona, Georgia, serif"
    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Petrona, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  xs: "2px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.parchment}"
    textColor: "{colors.oxblood}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    typography: "{typography.label}"
  card-polaroid:
    backgroundColor: "{colors.polaroid-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
    padding: "16px 16px 20px"
  input-search:
    backgroundColor: "{colors.parchment-dark}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
---

# Design System: Poéthra Leaderboard

## 1. Overview

**Creative North Star: "The Indie Bookstore Archive"**

Intimate, grounded, and tactile — a warm digital home that feels shelved, stamped, and handled, not rendered. Every surface carries paper weight: vellum backgrounds, a fine SVG grain overlay, taped Polaroids, pinned chronicles, cloth-bound winner books. Depth comes from lamplight, never from steel.

This system explicitly rejects cold SaaS dashboards, neon gaming UIs, generic corporate tech templates, and harsh high-contrast black/white. Rankings are framed as yearbook entries and ledger lines, never as aggressive metric displays. Motion is quiet and ink-like — a word settling onto paper, a card lifting off a desk — and every animation collapses to an instant state under `prefers-reduced-motion`.

**Key Characteristics:**
- Warm, tactile, and nostalgic — paper first, pixels second
- Handmade and curated — tape, pins, stamps, deckled informality
- Intentionally timeless — serif-dominant, no trend-chasing chrome
- Archive-framed — ledger, chronicle, and yearbook metaphors over dashboards

## 2. Colors

Warm, intimate, and grounded in physical writing materials — vellum, midnight ink, burgundy leather, lamplight.

### Primary
- **Soft Cream Paper** (#F5ECD7): The light-mode body ground. Aged vellum; every light surface sits on it or steps from it.
- **Deep Midnight Ink** (#1B2A4A): The dark-mode body ground and all primary text. A rich ink-navy, never sterile gray or pure black.
- **Rich Burgundy Leather** (#6B1C2A): The single accent. CTAs, active nav underlines, streaks, date stamps, focus rings. Its rarity is the point.

### Secondary
- **Oxblood Light** (#8B2C3A): Hover and border companion to the accent — button hover depth, stamp borders.
- **Oxblood Bright** (#C4506A): Small-scale signal only — push-pins, dark-mode kickers, rank flourishes. Never a surface fill.
- **Warm Lamplight** (#FAF3E0): Soft highlight and glow. Dark-mode text accents, ambient shadow wash, hover lifts.

### Tertiary
- **Lamplight Gold** (#F2E8C9): Warm mid-glow for dark-mode chips, monograms, and active states against ink grounds.
- **Manuscript Amber / Quill Stone / Worn Bronze** (Tailwind amber-50, stone-100, orange-50 washes): Podium-only washes for 1st/2nd/3rd leaderboard rows. Editorial, muted, and confined to the leaderboard — never reused as brand fills.

### Neutral
- **Parchment Dark** (#E8DDBE): Tonal step for borders, wells, and secondary panels on light grounds.
- **Polaroid Paper** (#FBF7EE): Physical photo-card stock for Polaroids and modals on light grounds.
- **Chronicle Cream** (#FAF6EC): Chronicle entry card ground — one half-step lighter than Polaroid for timeline rhythm.
- **Ink Light** (#2A3B5A): Secondary ink for muted panels, wells, and dark-mode borders.
- **Ink Card** (#1E2738) / **Ink Card Deep** (#1C2638): Dark-mode card grounds for Polaroids and chronicles. Warm-shifted navy, never gray-black.
- **Ink Light Wash** (ink-light at 30–70% opacity): Dark-mode input wells and spotlight panels.

### Named Rules
**The Ink Rule.** Deep Midnight Ink carries all structure — text, borders, dividers. Gray and pure black are forbidden everywhere, both modes.
**The One Leather Rule.** Oxblood covers ≤10% of any screen. If the page looks burgundy from across the room, remove accents until only stamps, underlines, and one CTA remain.
**The Dark-Is-Lamplight Rule.** Dark mode is ink rooms lit by lamplight: parchment text, lamplight accents, never inverted gray or neon.

## 3. Typography

**Display Font:** Petrona (with Georgia, serif)
**Body Font:** Literata (with Georgia, serif)

**Character:** A 1920s-magazine-meets-indie-journal pairing — eloquent, inked, and timeless. Petrona carries voice (hero, names, titles, always with intent); Literata carries reading (body, labels, captions). Both are serif; contrast comes from weight, size, italic, and tracking — not from family switching.

### Hierarchy
- **Display** (900 italic, clamp(2.25rem, 5vw, 4.25rem), 1.1, -0.02em): Hero statements only ("Words find their wings"). Uppercase, tight, italic. One per viewport.
- **Headline** (700, clamp(1.5rem, 3.5vw, 2.25rem), 1.2): Section titles and event names. Sentence case, balanced.
- **Title** (700, 1.25rem, 1.3): Card titles, winner names, modal headings. Italic permitted for handwritten captions.
- **Body** (400, 1rem–1.125rem, 1.6): All reading text, often italic for quotes. Cap line length at 65–75ch. Light-on-dark body adds breathing room (1.6–1.7).
- **Label** (700–800, 0.625–0.75rem, 1.4, 0.2–0.4em tracking, uppercase): Kickers, stamps, nav links, buttons, date tags. The archive's rubber-stamp voice. Used sparingly — one kicker per section maximum.

### Named Rules
**The Poetic Restraint Rule.** Serif always leads. Never set a headline, name, or quote in a geometric sans; weight and italic do the shouting.
**The Balance Rule.** Display and headlines use `text-wrap: balance`; long prose uses `pretty`. No headline overflows its container at any breakpoint — shrink the clamp before wrapping breaks words.

## 4. Elevation

A hybrid system: tonal layering does the everyday work (parchment steps, ink washes, hairline oxblood borders), and soft warm shadows do the emphasis. Shadows never feel industrial — they emulate lamplight pooling over paper, warm-tinted and widely diffused.

### Shadow Vocabulary
- **Paper Rest** (`0 10px 25px -5px rgba(27,42,74,0.18)`): Default Polaroid / chronicle lift on light grounds.
- **Leather Hover** (`0 22px 45px -10px rgba(107,28,42,0.28)`): Card hover — lifts and warms toward oxblood simultaneously.
- **Hero Lift** (`0 25px 50px -12px rgba(27,42,74,0.25)`, plus `shadow-2xl shadow-ink/20` on imagery): Large spotlights and heroes.
- **Modal Depth** (`0 25px 60px -15px rgba(0,0,0,0.5)`): Event and winner modals over dimmed ink scrims (`bg-ink/80` + `backdrop-blur`).
- **Stamp Press** (`1px 2px 4px rgba(0,0,0,0.3)`): Tiny elements only — pins, date tags, rank dots.

### Named Rules
**The Soft Lamplight Rule.** Blur is always large, opacity always low, tint always warm. If a shadow looks like a 2014 app — dark, tight, gray — the blur is too small and the color is wrong.
**The Flat-By-Default Rule.** Rows, wells, and nav rest flat on tonal steps. Shadows appear only as a response to state (hover, lift, modal).

## 5. Components

Tactile and handmade. Every component should look pick-up-able: paper has edges, tape has weave, books have spines.

### Buttons
- **Shape:** Gently curved (8px, `{rounded.sm}`); pills (`{rounded.full}`) reserved for filter chips and week selectors.
- **Primary:** Rich Burgundy Leather fill with Soft Cream Paper text (`12–16px 24–32px` padding, uppercase label tracking). In dark mode the fill inverts to parchment with ink text. Hover deepens toward black/white with a `-translate-y-1` lift and leather shadow.
- **Focus:** Always a visible 2px oxblood ring (lamplight at 50% in dark mode) with parchment/ink offset. Never remove outlines without replacing them.
- **Secondary / Ghost:** Transparent with a 1px oxblood (parchment in dark) stroke; fills to oxblood/10 on hover. No filled-gray secondary buttons anywhere.

### Polaroid Card (signature)
- **Stock:** Polaroid Paper (`#FBF7EE`) light / Ink Card (`#1E2738`) dark, near-square corners (2px), hairline warm border, Paper-Rest shadow → Leather-Hover on lift (`-translate-y-2`, `scale(1.02)`, tilt straightens to 0deg).
- **Dressing:** Washi-tape strip (amber-100/70, dashed inner border) centered on the top edge; oxblood push-pin dot top-right; photo in a 4:3 inset frame with a vintage warmth gradient overlay; oxblood date stamp bottom-right; italic Petrona caption below.
- **Behavior:** Entire card is a button (keyboard-operable, `aria-label` names the entry). Photos desaturate 15% at rest, full color on hover.

### Winner Book (signature)
- **Form:** 3D cloth-bound volume (`w-40 h-56 / sm:w-48 sm:h-64`, right-rounded cover) with a rotated spine strip, page-edge block, and parchment-texture overlay. Rank determines cloth: oxblood gradient (1st), stone (2nd), amber-bronze (3rd).
- **Behavior:** Hover/focus tilts the volume (`rotateY(-25deg) rotateX(5deg) scale(1.05)`, 700ms). Cover shows medal + winner name + winning-entry title; spine carries the name vertically. Opens the WinnerModal. Mobile cover promotes the entry title as the hero element.

### Cards / Containers
- **Corner Style:** Polaroids and books stay near-square (2px); editorial panels use 12–16px; spotlights up to 24px.
- **Background:** Stepped paper (parchment → parchment-dark/30–50 → polaroid/chronicle) light; stepped ink (ink → ink-light/30–70 → ink-card) dark. Never flat white or flat black.
- **Shadow Strategy:** Paper Rest at rest, Leather Hover on interaction, per Elevation.
- **Border:** Hairline ink-stroke borders always — `border-oxblood/10–20` light, `border-parchment/10–20` dark. Borders define edges; shadows define light.
- **Texture:** `.bg-parchment-texture` (fine SVG grain, 8% ink warmth) overlays heroes, headers, modals, and books. The grain is the brand's fingerprint — keep it on large surfaces.

### Inputs / Fields
- **Style:** Parchment-dark/50 well (ink-light/70 in dark), 12px radius, hairline oxblood/10 border, italic Petrona placeholder at 1.125rem.
- **Focus:** 2px oxblood/20 ring (lamplight/30 in dark); no layout shift on focus.
- **Search (leaderboard):** Full-width, centered italic placeholder ("Search the ledger…"), generous 16–24px padding. Empty states sit in dashed-border wells, never bare text.

### Navigation
- **Bar:** Sticky top (`z-50`), parchment/80 over ink/80 with `backdrop-blur-md`, hairline bottom border, grain overlay. Blur here is functional (legibility over scrolling content), not decoration.
- **Links:** Uppercase Literata micro-labels (10–12px, 0.2em tracking); stone/parchment at rest, oxblood/lamplight on hover, bold with a 1px underline when active. 2px focus-visible rings with offset.
- **Mobile:** CSS-driven dropdown (`max-height 200ms / opacity 150ms`), full-width centered links, active link gets an oxblood/5 wash. Theme toggle stays visible beside the menu button.
- **Theme toggle:** Sun/moon swap persisted to `localStorage` under key `theme`; `dark` class on `<html>` drives all `dark:` variants.

### Modals
- **Scrim:** Ink at 80% with `backdrop-blur` (`md/xl`), centered panel, `fade-in-up 0.8s` entrance.
- **Panel:** Polaroid stock, 16px radius, hairline border, Modal-Depth shadow, grain overlay. Event modals pair a taped photo with a tinted reading well; winner modals stage the book against blurred oxblood/parchment ambience.

## 6. Do's and Don'ts

### Do:
- **Do** prioritize a handmade, physical feel — paper textures, tape, pins, soft lamplight shadows — on every surface.
- **Do** use Deep Midnight Ink instead of gray for all depth, text, and structure, in both modes.
- **Do** frame rankings as yearbook/archive entries — ledger rows, chronicle cards, cloth-bound books — with generous spacing and serif voice.
- **Do** keep motion ink-quiet (fades, lifts, blurs) and honor `prefers-reduced-motion` with instant states everywhere.
- **Do** give every interactive element a visible oxblood/lamplight focus ring.

### Don't:
- **Don't** build cold SaaS dashboards — no flat white cards, blue-gray chrome, or metric-tile grids.
- **Don't** use neon gaming UIs — no glowing ranks, XP bars, or competitive gaming clichés.
- **Don't** fall back to generic corporate tech templates — no hero-metric stats, no identical icon-card grids.
- **Don't** ship harsh high-contrast black/white — pure black and pure white surfaces are forbidden; use ink and parchment.
- **Don't** add noisy animations — no bounce, no elastic, no staggered-everything entrances; one ink-settle per region maximum.
- **Don't** use side-stripe borders — `border-left/right` over 1px as a colored accent is never intentional; use full hairlines, tints, or stamps.
- **Don't** use gradient text (`background-clip: text`) or glassmorphism as decoration — blur is reserved for the sticky nav and modal scrims.
- **Don't** repeat tiny uppercase tracked kickers as section grammar — one deliberate stamp per section; more is scaffolding.
