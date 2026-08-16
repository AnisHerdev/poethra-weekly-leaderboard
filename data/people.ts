// people.ts - Single source of truth for every individual who has ever been
// part of Poéthra. Define each person ONCE here.
//
// `id`   - Human-readable slug, e.g. 'suman-br'. Used to reference this
//           person in teamHistory.ts. Try to keep it stable forever.
// `uid`  - Opaque unique identifier. Guarantees uniqueness even if two
//           people share the same name in the future. Generate new UIDs
//           with: python scripts/generate_uids.py
//
// Image config fields (optional) are stored here because they describe
// how a specific person's photo looks, not their role.

export interface Person {
  id: string;
  uid: string;
  name: string;
  imageUrl?: string;
  imageSizePercent?: number;
  imagePushDownPercent?: number;
}

export const PEOPLE: Record<string, Person> = {
  'f3a2b1c0': {
    id: 'suman-br',
    uid: 'f3a2b1c0',
    name: 'Suman B R',
    imageUrl: '/suman-founder.png',
    imageSizePercent: 150,
    imagePushDownPercent: 34,
  },
  'e9d8c7b6': {
    id: 'herdev-anish',
    uid: 'e9d8c7b6',
    name: 'S A Herdev Anish',
    imageUrl: '/herdev-anish-founder.png',
    imageSizePercent: 150,
    imagePushDownPercent: 30,
  },
  'a5b4c3d2': {
    id: 'swesthika',
    uid: 'a5b4c3d2',
    name: 'Swesthika D',
  },
  '1f2e3d4c': {
    id: 'apoorva-ramesh',
    uid: '1f2e3d4c',
    name: 'Apoorva Ramesh',
  },
  '9a8b7c6d': {
    id: 'neha-rudra-murthy',
    uid: '9a8b7c6d',
    name: 'Neha Rudra Murthy',
  },
  '5e6f7a8b': {
    id: 'aditya-p-dixit',
    uid: '5e6f7a8b',
    name: 'Aditya P Dixit',
    imageUrl: '/aditya-p-dixit.png',
    imageSizePercent: 145,
    imagePushDownPercent: 35,
  },
  '2c3d4e5f': {
    id: 'likitha-nanaiah',
    uid: '2c3d4e5f',
    name: 'Likitha Nanaiah',
  },
  'b1c2d3e4': {
    id: 'suisha',
    uid: 'b1c2d3e4',
    name: 'Suisha',
  },
  '6f7a8b9c': {
    id: 'tanmay',
    uid: '6f7a8b9c',
    name: 'Tanmay',
  },
  '3d4e5f6a': {
    id: 'sanjana-kulkarni',
    uid: '3d4e5f6a',
    name: 'Sanjana Kulkarni',
    imageUrl: '/3d4e5f6a.png',
    imageSizePercent: 130,
    imagePushDownPercent: 35,
  },
  'a1b2c3d4': {
    id: 'sri-lakshmi',
    uid: 'a1b2c3d4',
    name: 'Sri Lakshmi',
  },
  'f7e8d9c0': {
    id: 'meenakshi-prabhu',
    uid: 'f7e8d9c0',
    name: 'Meenakshi Prabhu',
  },
  'ca0a8b64': {
    id: 'grahathya-dharani-dhar',
    uid: 'ca0a8b64',
    name: 'Grahathya Dharani Dhar',
    imageUrl: '/grahathya-dharani-dhar.png',
    imageSizePercent: 145,
    imagePushDownPercent: 32,
  },
};
