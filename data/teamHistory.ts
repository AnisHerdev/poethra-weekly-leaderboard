// teamHistory.ts — Maps each year to the people who held each role.
//
// HOW TO ADD A NEW YEAR:
//   1. Add any new people to data/people.ts first.
//   2. Add a new { year, roles } object to TEAM_HISTORY.
//   3. In `roles`, list roleIds as keys and arrays of HistoryEntry as values.
//   4. If two people shared the same role in the same year (e.g. one left
//      mid-year), add two entries in the array with a `termLabel` each
//      e.g. { personId: 'alice', termLabel: 'First Half' }
//
// HOW TO ADD A MID-YEAR REPLACEMENT:
//   roles: {
//     'marketing-head': [
//       { personId: 'alice', termLabel: 'First Half' },
//       { personId: 'bob',   termLabel: 'Second Half' },
//     ],
//   }
//   — If there is only ONE entry for a role, termLabel is omitted from the card.

import { PEOPLE, type Person } from './people';
import { ROLES, type TeamCategory } from './roles';

// ── Types ────────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  personId: string;   // Must match a key in PEOPLE
  termLabel?: string; // e.g. 'First Half', 'Second Half'
}

export interface YearData {
  year: number;
  roles: Record<string, HistoryEntry[]>; // key = roleId from ROLES
}

// The flat TeamMember shape that components consume (mirrors old team.ts shape)
export interface TeamMember {
  id: string;      // "{personId}_{roleId}_{termLabel?}" — unique per card
  name: string;
  role: string;    // Full label, e.g. "Marketing Head • First Half"
  description: string;
  category: TeamCategory;
  imageUrl?: string;
  imageSizePercent?: number;
  imagePushDownPercent?: number;
}

// ── Founders (permanent, never change) ───────────────────────────────────────

export const FOUNDERS_MAP: Array<{ roleId: string; personId: string }> = [
  { roleId: 'founder', personId: 'suman-br' },
  { roleId: 'co-founder', personId: 'herdev-anish' },
];

// ── Team History ─────────────────────────────────────────────────────────────

export const TEAM_HISTORY: YearData[] = [
  {
    year: 2026,
    roles: {
      'president': [{ personId: 'suman-br', termLabel: 'First Half' }],
      'vice-president': [{ personId: 'swesthika' }],
      'financial-head': [{ personId: 'herdev-anish', termLabel: 'First Half' }],
      'marketing-head': [{ personId: 'apoorva-ramesh', termLabel: 'First Half' }],
      'events-head': [{ personId: 'neha-rudra-murthy' }],
      'literary-head': [{ personId: 'aditya-p-dixit' }],
      'design': [{ personId: 'likitha-nanaiah' }],
      'content-curator': [{ personId: 'suisha' }],
      'performance-head': [{ personId: 'tanmay', termLabel: 'First Half' }],
      'logistics': [{ personId: 'sanjana-kulkarni', termLabel: 'First Half' }],
      'pr-and-outreach': [{ personId: 'grahathya-dharani-dhar' }],
      'faculty-coordinator': [{ personId: 'sri-lakshmi', termLabel: 'First Half' }],
      'student-advisor': [{ personId: 'meenakshi-prabhu' }],
    },
  },
  {
    year: 2025,
    roles: {
      'president': [{ personId: 'suman-br' }],
      'vice-president': [{ personId: 'swesthika' }],
      'financial-head': [{ personId: 'herdev-anish' }],
      'marketing-head': [{ personId: 'apoorva-ramesh' }],
      'events-head': [{ personId: 'neha-rudra-murthy' }],
      'literary-head': [{ personId: 'aditya-p-dixit' }],
      'design': [{ personId: 'likitha-nanaiah' }],
      'content-curator': [{ personId: 'suisha' }],
      'performance-head': [{ personId: 'tanmay' }],
      'logistics': [{ personId: 'sanjana-kulkarni' }],
      'pr-and-outreach': [{ personId: 'grahathya-dharani-dhar' }],
      'faculty-coordinator': [{ personId: 'sri-lakshmi' }],
      'student-advisor': [{ personId: 'meenakshi-prabhu' }],
    },
  },
  // ── Add past years below as needed ───────────────────────────────────────
  // {
  //   year: 2025,
  //   roles: {
  //     'president':       [{ personId: 'some-person' }],
  //     'marketing-head':  [
  //       { personId: 'first-person', termLabel: 'First Half' },
  //       { personId: 'second-person', termLabel: 'Second Half' },
  //     ],
  //     ...
  //   },
  // },
];

// ── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Resolves a Person by their exact UID, or falls back to matching by readable id.
 * Throws an error if the readable id is ambiguous (multiple people have the same id).
 */
export function resolvePerson(identifier: string): Person | null {
  // 1. Direct UID match
  if (PEOPLE[identifier]) {
    return PEOPLE[identifier];
  }

  // 2. Fallback to matching by readable `id`
  const matches = Object.values(PEOPLE).filter((p) => p.id === identifier);

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    throw new Error(`Multiple people found with id '${identifier}'. Please use their exact UID instead to disambiguate.`);
  }

  console.warn(`teamHistory: unknown person identifier "${identifier}" — add them to people.ts`);
  return null;
}

/** Returns all available years, newest first. */
export function getAvailableYears(): number[] {
  return [...TEAM_HISTORY].sort((a, b) => b.year - a.year).map((y) => y.year);
}

/** Returns all permanent founders as TeamMember objects. */
export function getFounders(): TeamMember[] {
  return FOUNDERS_MAP.map(({ roleId, personId }) => {
    const person = resolvePerson(personId);
    const role = ROLES[roleId];
    if (!person || !role) {
      if (!role) console.warn(`teamHistory: missing role "${roleId}" in founders`);
      return null;
    }
    return {
      id: `${personId}_${roleId}`,
      name: person.name,
      role: role.title,
      description: role.description,
      category: role.category,
      imageUrl: person.imageUrl,
      imageSizePercent: person.imageSizePercent,
      imagePushDownPercent: person.imagePushDownPercent,
    } satisfies TeamMember;
  }).filter(Boolean) as TeamMember[];
}

/**
 * Returns leadership + department members for the given year as TeamMember objects.
 * Returns an empty array if the year has no data.
 */
export function getTeamForYear(year: number): TeamMember[] {
  const yearData = TEAM_HISTORY.find((y) => y.year === year);
  if (!yearData) return [];

  const members: TeamMember[] = [];

  for (const [roleId, entries] of Object.entries(yearData.roles)) {
    const role = ROLES[roleId];
    if (!role) {
      console.warn(`teamHistory: unknown roleId "${roleId}" — add it to roles.ts`);
      continue;
    }

    const hasMultiple = entries.length > 1;

    for (const entry of entries) {
      const person = resolvePerson(entry.personId);
      if (!person) {
        continue;
      }

      // Append term label only when there are multiple holders of the same role
      const roleLabel =
        hasMultiple && entry.termLabel
          ? `${role.title} • ${entry.termLabel}`
          : role.title;

      members.push({
        id: `${entry.personId}_${roleId}${entry.termLabel ? '_' + entry.termLabel.replace(/\s+/g, '-').toLowerCase() : ''}`,
        name: person.name,
        role: roleLabel,
        description: role.description,
        category: role.category,
        imageUrl: person.imageUrl,
        imageSizePercent: person.imageSizePercent,
        imagePushDownPercent: person.imagePushDownPercent,
      });
    }
  }

  return members;
}
