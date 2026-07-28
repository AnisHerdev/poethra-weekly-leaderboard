import { ClubEvent } from '../types';

export const CLUB_EVENTS: ClubEvent[] = [
  {
    id: 'rvu-santhe',
    title: 'RVU Santhe',
    subtitle: 'Club Launch & Stall Event - RV University',
    date: 'September 2025',
    description: 'RVU Santhe was our very first public-facing event as a new club - an annual event organised by RV University where clubs set up stalls to recruit new members from across schools and colleges.',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop', // Placeholder image - replace with actual photo
    imageCaption: 'Stall installations & decorative art setup',
    youtubeUrl: '', // Optional YouTube embed link, e.g. 'https://www.youtube.com/watch?v=EXAMPLE'
    tiltAngle: -2.5,
  },
  {
    id: 'icebreaker-session',
    title: 'Icebreaker Session',
    subtitle: 'First Internal Club Event for Members',
    date: 'October 2025',
    description: 'Following the formal opening of college, Poéthra hosted its first internal event - an icebreaker session designed to help new and existing members get comfortable with one another in a relaxed, fun setting.',
    imageUrl: '/events/icebreaker-session.jpg', // Placeholder image - replace with actual photo
    imageCaption: 'Interactive Emoji Quiz & Member Introductions',
    youtubeUrl: '',
    tiltAngle: 1.8,
  },
  {
    id: 'library-book-fair',
    title: 'Library Book Fair',
    subtitle: 'Brigade Foundation Collaboration',
    date: 'November 2025',
    description: 'Poéthra partnered with the RV University Library and the Brigade Foundation to co-host a Book Fair that brought several publication houses to campus, featuring structured publication stalls and custom design elements.',
    imageUrl: '/events/library-book-fair.jpg', // Placeholder image - replace with actual photo
    imageCaption: 'Campus Book Fair & World Map Stall Layout',
    youtubeUrl: '',
    tiltAngle: -1.2,
  },
  {
    id: 'chithra-kavya',
    title: 'Chithra Kavya',
    subtitle: 'Poetry & Art Fusion Event',
    date: 'December 2025',
    description: 'Chithra Kavya was a unique collaborative event where pairs of participants worked together - one writing a poem, and the other creating a visual artwork that interpreted and depicted that poem.',
    imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800&auto=format&fit=crop', // Placeholder image - replace with actual photo
    imageCaption: 'Poetry & Visual Art Collaboration',
    youtubeUrl: '',
    tiltAngle: 2.2,
  },
  {
    id: 'dead-poets-society-screening',
    title: 'Dead Poets Society',
    subtitle: 'Club Movie Screening Night',
    date: 'March 2026',
    description: 'Poéthra organised a screening of the iconic film Dead Poets Society for our members - an event that aligned closely with the club\'s literary identity and values.',
    imageUrl: '/events/dead-poets-society-screening.jpg', // Placeholder image - replace with actual photo
    imageCaption: 'Movie Night & Member Gathering',
    youtubeUrl: '',
    tiltAngle: -2.0,
  },
];

/** Returns all club events sorted chronologically (newest first). */
export function getEventsSortedNewest(): ClubEvent[] {
  return [...CLUB_EVENTS].reverse();
}

/** Returns the latest single event. */
export function getLatestEvent(): ClubEvent {
  return CLUB_EVENTS[CLUB_EVENTS.length - 1];
}
