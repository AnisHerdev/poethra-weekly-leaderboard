---
name: Poéthra Leaderboard
description: A literary leaderboard for the RV University Poéthra club.
colors:
  parchment: "#F5ECD7"
  parchment-dark: "#E8DDBE"
  ink: "#1B2A4A"
  ink-light: "#2A3B5A"
  oxblood: "#6B1C2A"
  oxblood-light: "#8B2C3A"
  oxblood-bright: "#C4506A"
  lamplight: "#F2E8C9"
  lamplight-glow: "#FAF3E0"
typography:
  display:
    fontFamily: "Petrona, serif"
  body:
    fontFamily: "Literata, serif"
rounded:
  sm: "4px"
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card-base:
    backgroundColor: "{colors.parchment}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
---

# Design System: Poéthra Leaderboard

## 1. Overview

**Creative North Star: "The Indie Bookstore Archive"**

Intimate, grounded, and tactile, evoking a sense of history and warmth. It explicitly rejects the coldness of SaaS and the loudness of gaming dashboards. The design feels like a safe, curated space-an indie bookstore or a literary magazine. It prioritizes feeling, nostalgia, and a handmade physical feel over aggressive metric displays.

**Key Characteristics:**
- Warm, tactile, and nostalgic
- Handmade and curated
- Intentionally timeless
- Rejects modern SaaS coldness

## 2. Colors

The palette is warm, intimate, and deeply grounded in physical writing materials.

### Primary
- **Soft Cream Paper** (#F5ECD7): The primary background. It feels like aged vellum or the pages of a beloved paperback.
- **Deep Midnight Ink** (#1B2A4A): The primary text and depth color. A rich, dark ink instead of sterile gray or harsh black.

### Secondary
- **Rich Burgundy Leather** (#6B1C2A): Used for accents, badges, streaks, and highlights. It provides a grounded, organic pop of color.

### Tertiary
- **Warm Lamplight** (#FAF3E0): Used for soft highlights and glows.

### Neutral
- **Parchment Dark** (#E8DDBE): Used for subtle tonal shifts and borders.
- **Ink Light** (#2A3B5A): Used for secondary text.

### Named Rules
**The Ink Rule.** Deep Midnight Ink is used instead of gray or pure black for all structural borders and text to maintain the warmth of a printed page.

## 3. Typography

**Display Font:** Petrona (with serif)
**Body Font:** Literata (with serif)

**Character:** A pairing that could belong to a 1920s magazine or a modern indie journal. It is serif-dominant, eloquent, and timeless.

### Hierarchy
- **Display** (300, clamp(2.5rem, 7vw, 4.5rem), 1): Hero headlines and grand titles.
- **Headline** (400, 2rem, 1.2): Section titles.
- **Title** (500, 1.5rem, 1.3): Card titles and names.
- **Body** (400, 1rem, 1.6): All reading text, prioritizing legibility and warmth. (Cap line length at 65–75ch).
- **Label** (500, 0.875rem, 0.05em): Badges and metadata.

## 4. Elevation

Soft, ambient shadows like lamplight over paper.

### Shadow Vocabulary
- **Ambient Glow** (`0 4px 24px rgba(250, 243, 224, 0.4)`): Used to softly lift cards and interactive elements.

### Named Rules
**The Soft Lamplight Rule.** Shadows should never feel harsh or industrial; they should emulate the soft, warm glow of lamplight over paper.

## 5. Components

Tactile and handmade.

### Buttons
- **Shape:** Softly curved (8px radius)
- **Primary:** Rich Burgundy Leather background with Soft Cream Paper text.
- **Hover / Focus:** A gentle lift with a soft lamplight shadow.

### Cards / Containers
- **Corner Style:** Softly curved (8px radius)
- **Background:** Soft Cream Paper or Deep Midnight Ink depending on the mode.
- **Shadow Strategy:** Soft ambient glow.
- **Border:** Occasional subtle ink-stroke borders.

## 6. Do's and Don'ts

### Do:
- **Do** prioritize a "handmade" or "physical" feel (paper textures, soft shadows).
- **Do** use Deep Midnight Ink instead of gray for depth and text.
- **Do** make the interface feel like entries in a yearbook or an archive.

### Don't:
- **Don't** use cold, pixel-perfect industrial clean-lines.
- **Don't** design aggressive metric displays or harsh competitive rankings.
- **Don't** fall back to modern SaaS aesthetics.
