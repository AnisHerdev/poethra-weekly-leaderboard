// roles.ts - Defines every role/position that exists or has existed in
// Poéthra. The `description` here is the canonical description for the
// *role itself* - it remains consistent regardless of who holds it.
//
// `id`       - Stable slug used to reference this role in teamHistory.ts.
// `category` - Controls which section of the Quill Council page the card
//              renders in.

export type TeamCategory = 'current-leadership' | 'founders' | 'department';

export interface Role {
  id: string;
  title: string;
  description: string;
  category: TeamCategory;
}

export const ROLES: Record<string, Role> = {
  // ── Leadership ──────────────────────────────────────────────
  'president': {
    id: 'president',
    title: 'President',
    description: 'Keeps the lantern lit and the council in motion.',
    category: 'current-leadership',
  },
  'vice-president': {
    id: 'vice-president',
    title: 'Vice President',
    description: 'Stands at the right hand of the chair.',
    category: 'current-leadership',
  },

  // ── Founders ────────────────────────────────────────────────
  'founder': {
    id: 'founder',
    title: 'Founder',
    description: 'Lit the first lamp. The reason the council exists.',
    category: 'founders',
  },
  'co-founder': {
    id: 'co-founder',
    title: 'Co-founder',
    description: 'Co-architect of the council, balancing vision with execution.',
    category: 'founders',
  },

  // ── Departments ─────────────────────────────────────────────
  'financial-head': {
    id: 'financial-head',
    title: 'Financial Head',
    description: 'Guards the treasury so the words may flow freely.',
    category: 'department',
  },
  'marketing-head': {
    id: 'marketing-head',
    title: 'Marketing Head',
    description: 'Carries the word to the farthest rooms.',
    category: 'department',
  },
  'events-head': {
    id: 'events-head',
    title: 'Events Head',
    description: 'Sets the stage and lights the candles.',
    category: 'department',
  },
  'literary-head': {
    id: 'literary-head',
    title: 'Literary Head',
    description: 'Tends the anthology and curates the canon.',
    category: 'department',
  },
  'design': {
    id: 'design',
    title: 'Design',
    description: 'Gives shape to the silence between the lines.',
    category: 'department',
  },
  'content-curator': {
    id: 'content-curator',
    title: 'Content Curator',
    description: 'Sifts the manuscripts for the finest ink.',
    category: 'department',
  },
  'performance-head': {
    id: 'performance-head',
    title: 'Performance Head',
    description: 'Lends voice to the poems that need to be heard.',
    category: 'department',
  },
  'logistics': {
    id: 'logistics',
    title: 'Logistics',
    description: 'Keeps the wheels turning behind the curtain.',
    category: 'department',
  },
};
