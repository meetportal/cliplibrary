import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { ElevatorNewspaperProps } from './elevator-newspaper';

const LINES_HINT = 'Each line is a row';
const FRAME_HINT = 'Frame number; the doors are fully open from about frame 36 to 128';

export const elevatorNewspaperControls = defineControls<ElevatorNewspaperProps>({
  sections: [
    {
      title: 'Headlines',
      fields: [
        {
          path: 'cover.headline',
          label: 'Cover headline',
          hint: `Big type over the photo on the left page. ${LINES_HINT}`,
        },
        {
          path: 'story.headline',
          label: 'Story headline',
          hint: `Big type under the masthead on the right page. ${LINES_HINT}`,
        },
        { path: 'masthead.brand', label: 'Newspaper name', hint: 'Masthead on both pages' },
        {
          path: 'story.subhead',
          label: 'Subhead',
          hint: 'Spaced capitals under the story headline',
        },
      ],
      more: [
        {
          path: 'cover.headlineSize',
          label: 'Cover headline size',
          hint: 'Long lines shrink to fit',
        },
        {
          path: 'story.headlineSize',
          label: 'Story headline size',
          hint: 'Long lines shrink to fit',
        },
        {
          path: 'masthead.edition',
          label: 'Edition line',
          hint: 'Left end of the row under the masthead',
        },
        { path: 'masthead.date', label: 'Date', hint: 'Right end of the row under the masthead' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['ink.accent', 'ink.tint'],
          label: 'Primary color',
          hint: 'Subhead, teaser title, footer dots and the tint over the cover photo',
        },
        {
          link: ['ink.text', 'ink.rules'],
          label: 'Text color',
          hint: 'Masthead, headline, body copy, caption and every printed rule',
        },
        { path: 'ink.coverText', label: 'Secondary color', hint: 'Cover headline over the photo' },
      ],
      more: [
        { path: 'ink.accent', label: 'Accent ink', hint: 'Subhead, teaser title and footer dots' },
        { path: 'ink.tint', label: 'Cover photo tint', hint: 'Shade behind the cover headline' },
        { path: 'ink.text', label: 'Text ink' },
        { path: 'ink.rules', label: 'Rules and borders' },
        {
          path: 'ink.filler',
          label: 'Column filler',
          hint: 'The gray lines that stand in for body text',
        },
      ],
    },
    {
      title: 'Story page',
      fields: [
        { path: 'story.photo', label: 'Story photo', hint: 'Leave empty for a plain block' },
        {
          path: 'story.teaserTitle',
          label: 'Teaser title',
          hint: `Boxed title in the left column. ${LINES_HINT}`,
        },
      ],
      more: [
        {
          path: 'story.teaser',
          label: 'Teaser text',
          hint: `Under the teaser title. ${LINES_HINT}`,
        },
        {
          path: 'story.caption',
          label: 'Photo caption',
          hint: `Bold capitals under the photo. ${LINES_HINT}`,
        },
        {
          path: 'story.footer',
          label: 'Footer',
          hint: 'Repeated three times along the bottom band',
        },
      ],
    },
    {
      title: 'Cover page',
      fields: [
        {
          path: 'cover.photo',
          label: 'Cover photo',
          hint: 'Fills the left page; leave empty for a plain block',
        },
      ],
      more: [
        {
          path: 'cover.photoTint',
          label: 'Photo tint strength',
          hint: 'How strongly the tint darkens the middle of the photo; 0 turns it off',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [
        { path: 'camera.zoom', label: 'Push-in', hint: 'How close the camera gets; 1 stays wide' },
        { path: 'camera.pushStart', label: 'Push-in starts', hint: FRAME_HINT },
        { path: 'camera.pullStart', label: 'Pull-out starts', hint: FRAME_HINT },
      ],
      more: [
        { path: 'camera.pushFrames', label: 'Push-in length', hint: 'In frames' },
        { path: 'camera.pullFrames', label: 'Pull-out length', hint: 'In frames' },
        {
          path: 'camera.focusX',
          label: 'Focus across',
          hint: 'In pixels from the left of the footage; moves to the center as the camera pushes in',
        },
        {
          path: 'camera.focusY',
          label: 'Focus height',
          hint: 'In pixels from the top of the footage; moves to the center as the camera pushes in',
        },
      ],
    },
    {
      title: 'Print',
      fields: [],
      more: [
        {
          path: 'print.strength',
          label: 'Ink strength',
          hint: 'How solid the printing looks on the paper',
        },
        {
          path: 'print.shading',
          label: 'Follow the paper light',
          hint: 'Darkens the print where the filmed paper is in shade; 0 keeps it flat',
        },
        {
          path: 'print.softness',
          label: 'Print softness',
          hint: 'Blurs the print to match the footage; 0 is sharp',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [MOTION.enter, MOTION.enterFrames, MOTION.exit, MOTION.exitFrames],
    },
  ],
  hidden: ['motion.float', 'motion.speed'],
});
