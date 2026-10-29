import { z } from 'zod';
import { zColor, zDateTime, zImage, zMultiline } from '@/schemas/control';
import type { SiteMeta } from '../../types';

const photo = (file: string): string => `/site-assets/emerald-rose/${file}.jpg`;

export const emeraldRoseSchema = z.object({
  couple: z.object({
    firstName: z.string().max(40),
    secondName: z.string().max(40),
    monogram: z.string().max(8),
    greeting: z.string().max(80),
  }),
  intro: z.object({
    show: z.boolean(),
    prompt: z.string().max(40),
  }),
  event: z.object({
    startsAt: zDateTime(),
    venue: z.string().max(80),
    address: z.string().max(160),
    venueNote: zMultiline(),
    venueWebsite: z.string(),
    rsvpBy: z.string().max(60),
  }),
  photos: z.object({
    hero: zImage(),
    storyThen: zImage(),
    storyNow: zImage(),
    venue: zImage(),
    schedule: zImage(),
    reception: zImage(),
  }),
  story: z.object({
    thenLabel: z.string().max(20),
    nowLabel: z.string().max(20),
    text: zMultiline(),
  }),
  schedule: z
    .array(z.object({ time: z.string().max(12), title: z.string().max(40) }))
    .min(1)
    .max(8),
  details: z
    .array(
      z.object({
        title: z.string().max(40),
        text: zMultiline(),
        linkLabel: z.string().max(30),
        linkUrl: z.string(),
      }),
    )
    .max(6),
  dressCode: z.object({
    text: zMultiline(),
    swatches: z.array(z.object({ color: zColor() })).max(6),
  }),
  faqs: z.array(z.object({ question: z.string().max(80), answer: zMultiline() })).max(8),
  rsvp: z.object({
    message: zMultiline(),
    buttonLabel: z.string().max(30),
    link: z.string(),
  }),
  colors: z.object({
    primary: zColor(),
    secondary: zColor(),
    accent: zColor(),
    background: zColor(),
    text: zColor(),
  }),
});

export type EmeraldRoseContent = z.infer<typeof emeraldRoseSchema>;

export const emeraldRoseDefaults: EmeraldRoseContent = {
  couple: {
    firstName: 'Rachelle',
    secondName: 'Thomas',
    monogram: 'R & T',
    greeting: 'A special invitation from',
  },
  intro: { show: true, prompt: 'Tap to open' },
  event: {
    startsAt: '2028-08-15T15:00',
    venue: 'Oheka Castle',
    address: '135 West Gate Drive, Huntington, NY',
    venueNote:
      'Surrounded by beautiful gardens and timeless elegance, this is where our forever begins.',
    venueWebsite: 'https://www.oheka.com',
    rsvpBy: 'January 15th, 2028',
  },
  photos: {
    hero: photo('couple-terrace'),
    storyThen: photo('story-then'),
    storyNow: photo('story-now'),
    venue: photo('venue-manor'),
    schedule: photo('couple-embrace'),
    reception: photo('reception-library'),
  },
  story: {
    thenLabel: '2015',
    nowLabel: 'Today',
    text: 'It started with a borrowed umbrella and a coffee neither of us finished.\n\nFrom that very first conversation to years filled with laughter, travel and growing up side by side, every step of our journey led us here.\n\nToday we are not just celebrating where it all began, but everything we have built together and the beautiful forever still ahead.',
  },
  schedule: [
    { time: '2:30 pm', title: 'Guest arrival' },
    { time: '3:00 pm', title: 'Wedding ceremony' },
    { time: '4:30 pm', title: 'Cocktail hour' },
    { time: '6:00 pm', title: 'Dinner & celebration' },
    { time: '8:30 pm', title: 'Dancing & party' },
  ],
  details: [
    {
      title: 'Ceremony',
      text: 'The ceremony takes place in the rose garden. Please be seated by 2:50 pm.',
      linkLabel: '',
      linkUrl: '',
    },
    {
      title: 'Children',
      text: 'While we adore your little ones, this will be an adults-only celebration.',
      linkLabel: '',
      linkUrl: '',
    },
    {
      title: 'Accommodation',
      text: 'For guests travelling from afar, a hotel block is reserved five minutes from the venue.',
      linkLabel: 'Book here',
      linkUrl: 'https://www.marriott.com',
    },
    {
      title: 'Registry',
      text: 'Your presence is the greatest gift of all. Should you wish to honour us with a gift, our honeymoon fund is linked below.',
      linkLabel: 'Registry',
      linkUrl: 'https://www.zola.com',
    },
  ],
  dressCode: {
    text: 'Formal attire. We kindly invite you to wear deep burgundy, emerald, champagne, ivory or soft sage.',
    swatches: [
      { color: '#8a3b4a' },
      { color: '#5a1626' },
      { color: '#1f3a2d' },
      { color: '#d9c7a7' },
      { color: '#9aa596' },
    ],
  },
  faqs: [
    {
      question: 'What time should I arrive?',
      answer: 'Guest arrival begins at 2:30 pm. Please arrive 15 to 30 minutes early to settle in.',
    },
    {
      question: 'What if I have dietary restrictions?',
      answer: 'Let us know in your RSVP and we will make sure the kitchen takes care of you.',
    },
    {
      question: 'Is parking available at the venue?',
      answer: 'Yes, complimentary valet parking is available for all guests.',
    },
    {
      question: 'When is the RSVP deadline?',
      answer: 'Kindly reply by January 15th, 2028 so we can plan every detail.',
    },
  ],
  rsvp: {
    message:
      'It would mean the world to us to celebrate this day surrounded by you. Please let us know if you can make it.',
    buttonLabel: 'Reply now',
    link: 'https://docs.google.com/forms',
  },
  colors: {
    primary: '#1f3a2d',
    secondary: '#6b1d2a',
    accent: '#b08d57',
    background: '#faf6ee',
    text: '#2b2723',
  },
};

export const emeraldRoseMeta: SiteMeta = {
  id: 'emerald-rose',
  title: 'Emerald Rose Wedding Website',
  description:
    'An envelope that opens into a romantic wedding website with your story, schedule, venue map, countdown, FAQs and RSVP.',
  category: 'weddings',
  tags: ['website', 'invitation', 'rsvp', 'countdown', 'wedding', 'floral', 'elegant'],
  theme: 'light',
  updatedAt: '2026-10-28T16:30:00.000Z',
};
