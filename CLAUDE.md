# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Poéthra Weekly Leaderboard** - A public-facing React SPA that tracks rankings for the Poéthra (RV University) poetry competition. Pulls data from Firebase Firestore. Live at https://poethra-leaderboard.web.app/

There is a separate admin project used for data entry; this repo is read-only for participants.

## Commands

```bash
npm install            # install dependencies
npm run dev            # Vite dev server (port 3000, see vite.config.ts)
npm run build          # production build → dist/
npm run preview        # preview production build locally
firebase deploy        # deploy dist/ to Firebase Hosting
```

There is **no test framework and no linter configured** - neither `npm test` nor any lint script exists. Don't add tests/linting without checking first.

## Architecture

Two layered layouts coexist in this repo, which is unusual:

- **Top-level** holds the app entry & most code: `App.tsx`, `index.tsx`, `components/`, `pages/`, `services/`, `contexts/`, `types.ts`, `constants.ts`.
- **`src/`** holds the Firebase init (`src/firebase.ts`) and Vite env types (`src/vite-env.d.ts`) only.

`services/leaderboardService.ts` imports from `../src/firebase` - preserve this cross-folder import; do not move files around unless you also update the import path.

**Routing** (`App.tsx`): `HashRouter` (Firebase Hosting rewrites everything to `/index.html`, so hash routing avoids 404s on direct URL hits).
- `/` → `pages/HomePage.tsx` (hero, info, animated footer quote)
- `/leaderboard` → `pages/LeaderboardPage.tsx` (rankings + Hall of Fame)
- `/winners` → `pages/WinnersPage.tsx` (3D book archive, week-by-week)
- `/quill-council` → `pages/QuillCouncilPage.tsx` (team roster - data lives in `data/team.ts`)

**Theming** (`contexts/ThemeContext.tsx`): light/dark via `class` strategy. Theme is persisted to `localStorage` under key `theme`. Tailwind's `dark` class is toggled on `<html>` by the provider - components use `dark:` variants.

**Styling**: Tailwind CSS is loaded via CDN at runtime (`index.html` has `<script src="https://cdn.tailwindcss.com">` and the inline `tailwind.config`). It is NOT a project dependency. Custom theme tokens defined inline in `index.html`:
- `parchment` (#F5ECD7) / `parchment-dark` - warm cream surfaces
- `ink` (#1B2A4A) / `ink-light` - dark-mode background (navy, never gray)
- `oxblood` (#6B1C2A) / `oxblood-light` / `oxblood-bright` - accent (streaks, badges, focus rings)
- `lamplight` (#F2E8C9) / `lamplight-glow` - warm gold for dark-mode accents
- Fonts: Petrona (display) + Literata (body), loaded from Google Fonts
- `.bg-parchment-texture` is an inline SVG data-URI noise pattern used as a background overlay

The `vite.config.ts` alias `@` → repo root is set but currently unused.

## Firestore Schema

Four collection pairs (each has a `_production` and `_test` variant):

| Collection                  | Doc ID format     | Key fields                                                                |
|-----------------------------|-------------------|---------------------------------------------------------------------------|
| `participants_*`            | auto              | `name` (master roster - display names only)                               |
| `semesters_*`               | auto              | `isActive: boolean`, `name` - exactly one doc should have `isActive=true` |
| `semester_stats_*`          | auto              | `participantId`, `semesterId`, `totalScore`, `currentStreak`               |
| `weekly_results_*`          | `YYYY_Sem_Week`   | `year`, `semester` (`H1`\|`H2`), `weekNumber`, `participantIds: string[]`, `winners.{first,second,third}: {name,participantId?,id?,title?,content?}` |

**Environment toggle** (`services/leaderboardService.ts:6`): `IS_PRODUCTION = false` selects the `_test` collections; flip to `true` for production. `fetchLeaderboard()` joins the active semester's `semester_stats` with the master `participants` roster to enrich with display names. `fetchWeeklyResults()` orders by `year` desc, `weekNumber` desc.

**Points** (`constants.ts`): 1st=30, 2nd=25, 3rd=20, participation=5. Computed in the admin project, not here.

## Key Type Contracts (`types.ts`)

- `Participant` - `participationHistory` and `bestRank` are **deprecated** in the new schema (left optional for backward compat). When reading fresh data they will be `[]` and `null`.
- `WeeklyWinnerInfo` - has both `participantId` (new) and `id` (legacy) for backward compat.
- `WeeklyResult` - uses `participantIds: string[]` (replaced the old `weeklyParticipants` string-name array).

## Data Flow

`LeaderboardPage` and `WinnersPage` each fetch once on mount via `useEffect`, store in `useState`, then derive display via `useMemo`. There is no real-time listener (Firestore `onSnapshot` is not used). Search filtering, sorting, and Hall-of-Fame aggregation happen client-side.

## Aesthetic Constraints (from PRODUCT.md)

The design is intentionally a "warm indie bookstore" - not a SaaS dashboard. Avoid:
- Bright primary colors or modern-flat UI patterns
- Aggressive gaming-style ranking visuals
- Pure gray neutrals (use parchment/ink/oxblood instead)

Aim for: serif-dominant typography, parchment textures, soft shadows, generous spacing, "yearbook/archive" framing rather than "spreadsheet". Honors `prefers-reduced-motion` (see `HomePage.tsx`'s `HandwrittenQuote` and global CSS).

## Firebase Config

Local dev expects `.env.local` with `VITE_FIREBASE_*` keys (committed template in README; actual values are in this repo's `.env.local`). The web SDK is initialized in `src/firebase.ts`. Hosting project ID: `poethra-leaderboard` (see `.firebaserc`).

## Skills / Impeccable

`.impeccable-live/` holds annotation artifacts; `.agents/skills/` is a locked copy of the `pbakaus/impeccable` skill set (`skills-lock.json` pins exact hashes - do not edit). Both are in `.gitignore`.
