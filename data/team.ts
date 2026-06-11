// Poéthra team roster — single source of truth for /quill-council.
//
// `id` must be unique even when the same person appears in more than one
// section (Suman B R is currently both President and Founder).
// `category` controls which section of the page the card renders in.
// `current-leadership` entries rotate yearly; `founders` is permanent.

export type TeamCategory = 'current-leadership' | 'founders' | 'department';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  category: TeamCategory;
  imageUrl?: string;
  imageSizePercent?: number;
  imagePushDownPercent?: number;
}

export const TEAM: TeamMember[] = [
  // ── At the Top (rotates yearly) ─────────────────────────────
  {
    id: 'suman-president',
    name: 'Suman B R',
    role: 'President',
    description: 'Keeps the lantern lit and the council in motion.',
    category: 'current-leadership',
    imageUrl: '/suman-founder.png',
    imageSizePercent: 150,
    imagePushDownPercent: 34,
  },
  {
    id: 'swesthika',
    name: 'Swesthika',
    role: 'Vice President',
    description: 'Stands at the right hand of the chair.',
    category: 'current-leadership',
  },

  // ── The Founders (permanent) ────────────────────────────────
  {
    id: 'suman-founder',
    name: 'Suman B R',
    role: 'Founder',
    description: 'Lit the first lamp. The reason the council exists.',
    category: 'founders',
    imageUrl: '/suman-founder.png',
    imageSizePercent: 150,
    imagePushDownPercent: 34,
  },
  {
    id: 'herdev-anish-founder',
    name: 'S A Herdev Anish',
    role: 'Co-founder & Finance Head',
    description: 'Co-architect of the council, balancing vision with execution and guarding the treasury.',
    category: 'founders',
    imageUrl: '/herdev-anish-founder.png',
    imageSizePercent: 150,
    imagePushDownPercent: 30,
  },

  // ── The Departments ─────────────────────────────────────────
  {
    id: 'apoorva',
    name: 'Apoorva Ramesh',
    role: 'Marketing Head',
    description: 'Carries the word to the farthest rooms.',
    category: 'department',
  },
  {
    id: 'neha',
    name: 'Neha Rudra Murthy',
    role: 'Events Head',
    description: 'Sets the stage and lights the candles.',
    category: 'department',
  },
  {
    id: 'aditya',
    name: 'Aditya P Dixit',
    role: 'Literary Head',
    description: 'Tends the anthology and curates the canon.',
    category: 'department',
  },
  {
    id: 'likitha',
    name: 'Likitha Nanaiah',
    role: 'Design',
    description: 'Gives shape to the silence between the lines.',
    category: 'department',
  },
  {
    id: 'suisha',
    name: 'Suisha',
    role: 'Content Curator',
    description: 'Sifts the manuscripts for the finest ink.',
    category: 'department',
  },
  {
    id: 'tanmay',
    name: 'Tanmay',
    role: 'Performance Head',
    description: 'Lends voice to the poems that need to be heard.',
    category: 'department',
  },
  {
    id: 'sanjana',
    name: 'Sanjana Kulkarni',
    role: 'Logistics',
    description: 'Keeps the wheels turning behind the curtain.',
    category: 'department',
  },
];
