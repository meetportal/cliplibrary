import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { NewspaperCityCutsProps } from './newspaper-city-cuts';

const PHOTO_HINT = 'Leave empty, or use a link that fails to load, for a plain block';
const FIT_HINT = 'Long text is squeezed narrower to fit its line';
const DELAY_HINT = 'In frames after the cut to the end card';

export const newspaperCityCutsControls = defineControls<NewspaperCityCutsProps>({
  sections: [
    {
      title: 'Story page',
      fields: [
        {
          path: 'story.headline',
          label: 'Headline',
          hint: 'Big bold type under the masthead on the right page; it wraps and shrinks to fit',
        },
        {
          path: 'story.booth',
          label: 'Booth line',
          hint: `Bold line under the small photo. ${FIT_HINT}`,
        },
        {
          path: 'story.dates',
          label: 'Dates',
          hint: 'Italic line under the booth, in the accent color',
        },
      ],
      more: [
        {
          path: 'story.headlineSize',
          label: 'Headline size',
          hint: 'Largest size; long headlines still shrink to fit',
        },
        {
          path: 'story.body',
          label: 'Story text',
          hint: 'Small paragraph in the left column; it wraps and is cut at the bottom of the column',
        },
        { path: 'story.photo', label: 'Story photo', hint: PHOTO_HINT },
        {
          path: 'story.band',
          label: 'Band name',
          hint: 'Spaced capitals in the dark pill at the foot of the right page',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['ink.text', 'ink.band', 'endCard.wordmarkColor'],
          label: 'Primary color',
          hint: 'Newspaper ink, the dark pill and the end card wordmark',
        },
        {
          link: ['ink.accent', 'endCard.markColor'],
          label: 'Accent color',
          hint: 'Gem marks, the rule under the headline, the dates and the end card logo',
        },
        { path: 'ink.paper', label: 'Surface color', hint: 'Tint printed over the paper' },
        { path: 'endCard.background', label: 'Background color', hint: 'The end card' },
      ],
      more: [
        {
          path: 'ink.text',
          label: 'Newspaper ink',
          hint: 'Masthead, rules, headline, copy and booth line',
        },
        {
          path: 'ink.band',
          label: 'Pill color',
          hint: 'The dark pill at the foot of the right page',
        },
        { path: 'ink.bandText', label: 'Pill text' },
        { path: 'ink.accent', label: 'Newspaper accent' },
        { path: 'endCard.wordmarkColor', label: 'Wordmark color' },
        { path: 'endCard.markColor', label: 'Logo mark color' },
        { path: 'endCard.taglineColor', label: 'Tagline color' },
      ],
    },
    {
      title: 'Cover page',
      fields: [
        {
          path: 'cover.strip',
          label: 'Top strip',
          hint: `Italic line between the rules above the photo on the left page. ${FIT_HINT}`,
        },
        { path: 'cover.photo', label: 'Cover photo', hint: PHOTO_HINT },
      ],
      more: [
        {
          path: 'cover.photoFocus',
          label: 'Photo position',
          hint: 'Which part of the photo shows when it is taller than its box or zoomed: 0 shows the top, 1 the bottom',
        },
        {
          path: 'cover.photoZoom',
          label: 'Photo zoom',
          hint: '1 just fills the box; higher crops in around the center',
        },
      ],
    },
    {
      title: 'Masthead',
      fields: [
        {
          path: 'masthead.title',
          label: 'Newspaper name',
          hint: `Blackletter title at the top of the right page. ${FIT_HINT}`,
        },
        {
          path: 'masthead.dateline',
          label: 'Dateline',
          hint: 'Small spaced capitals between the rules under the name',
        },
      ],
    },
    {
      title: 'End card',
      fields: [
        {
          link: ['endCard.brand', 'story.band'],
          label: 'Brand name',
          hint: 'The end card wordmark and the name in the newspaper pill',
        },
        { path: 'endCard.tagline', label: 'Tagline', hint: 'Italic line under the wordmark' },
      ],
      more: [
        {
          path: 'endCard.brand',
          label: 'Wordmark',
          hint: 'Spaced capitals in the middle of the end card',
        },
        {
          path: 'endCard.showMark',
          label: 'Show logo mark',
          hint: 'The gem outline above the wordmark',
        },
        {
          path: 'endCard.cutFrame',
          label: 'Cut to end card',
          hint: 'Frame number of the hard cut from the street footage; the footage ends at frame 100',
        },
        { path: 'endCard.wordmarkDelay', label: 'Wordmark delay', hint: DELAY_HINT },
        { path: 'endCard.taglineDelay', label: 'Tagline delay', hint: DELAY_HINT },
        { path: 'endCard.markSize', label: 'Logo mark size' },
        { path: 'endCard.wordmarkSize', label: 'Wordmark size' },
        { path: 'endCard.taglineSize', label: 'Tagline size' },
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
          hint: 'Shades the print with the filmed paper so creases and shadows show through; 0 keeps it flat',
        },
        {
          path: 'print.paperTint',
          label: 'Paper tint strength',
          hint: 'How strongly the surface color tints the paper',
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
