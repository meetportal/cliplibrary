import { defineControls } from '@/schemas/control-layout';
import type { EmeraldRoseContent } from './emerald-rose';

export const emeraldRoseControls = defineControls<EmeraldRoseContent>({
  sections: [
    {
      title: 'Couple',
      fields: [
        { path: 'couple.firstName', label: 'First name' },
        { path: 'couple.secondName', label: 'Second name' },
        { path: 'couple.monogram', label: 'Monogram', hint: 'Shown on the wax seal and footer.' },
        { path: 'couple.greeting', label: 'Greeting', hint: 'The small line above your names.' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The envelope, banners, buttons and the order of the day.',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'Wax seal, hearts and ribbons.',
        },
        {
          path: 'colors.accent',
          label: 'Accent color',
          hint: 'Gold rings, dividers and timeline dots.',
        },
        { path: 'colors.background', label: 'Background color', hint: 'The page and card paper.' },
        { path: 'colors.text', label: 'Text color', hint: 'Body copy and headings on paper.' },
      ],
    },
    {
      title: 'Date & venue',
      fields: [
        {
          path: 'event.startsAt',
          label: 'Date and time',
          hint: 'Drives the countdown and calendar.',
        },
        { path: 'event.venue', label: 'Venue' },
        { path: 'event.address', label: 'Address', hint: 'Used for the map and directions.' },
        { path: 'event.rsvpBy', label: 'RSVP by' },
      ],
      more: [
        { path: 'event.venueNote', label: 'About the venue' },
        { path: 'event.venueWebsite', label: 'Venue website' },
      ],
    },
    {
      title: 'Photos',
      fields: [
        { path: 'photos.hero', label: 'Save the date photo' },
        { path: 'photos.storyThen', label: 'Love story, then' },
        { path: 'photos.storyNow', label: 'Love story, now' },
        { path: 'photos.venue', label: 'Venue photo' },
      ],
      more: [
        { path: 'photos.schedule', label: 'Order of the day backdrop' },
        { path: 'photos.reception', label: 'Details banner' },
      ],
    },
    {
      title: 'Love story',
      fields: [
        { path: 'story.text', label: 'Story' },
        { path: 'story.thenLabel', label: 'First photo caption' },
        { path: 'story.nowLabel', label: 'Second photo caption' },
      ],
    },
    {
      title: 'Order of the day',
      fields: [
        { path: 'schedule', label: 'Moments', items: { time: 'Time', title: 'What happens' } },
      ],
    },
    {
      title: 'Good to know',
      fields: [
        {
          path: 'details',
          label: 'Details',
          hint: 'Ceremony, children, hotels, registry. Leave the link empty to hide the button.',
          items: {
            title: 'Title',
            text: 'Text',
            linkLabel: 'Button label',
            linkUrl: 'Button link',
          },
        },
        { path: 'dressCode.text', label: 'Dress code' },
        { path: 'dressCode.swatches', label: 'Dress code colors', items: { color: 'Color' } },
      ],
    },
    {
      title: 'FAQs',
      fields: [
        { path: 'faqs', label: 'Questions', items: { question: 'Question', answer: 'Answer' } },
      ],
    },
    {
      title: 'RSVP',
      fields: [
        { path: 'rsvp.message', label: 'Invitation to reply' },
        { path: 'rsvp.thanks', label: 'After replying' },
      ],
    },
    {
      title: 'Envelope',
      fields: [
        { path: 'intro.show', label: 'Open with an envelope' },
        { path: 'intro.prompt', label: 'Envelope prompt' },
      ],
    },
  ],
});
