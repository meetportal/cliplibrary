import { defineControls } from '../../control-layout';
import type { ArcBurstWordmarkProps } from './arc-burst-wordmark';

export const arcBurstWordmarkControls = defineControls<ArcBurstWordmarkProps>({
  sections: [
    {
      title: 'Wordmark',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Built from spinning pieces in the middle; long names shrink to fit or break onto two lines',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; it pivots together above the name from slanted slices, or swings up whole on its plate',
        },
        { path: 'name.font', label: 'Font' },
        {
          path: 'name.letterCase',
          label: 'Letter case',
          hint: 'Lowercase gives the soft wordmark look; As typed keeps your capitals',
        },
      ],
      more: [
        {
          path: 'name.size',
          label: 'Largest size',
          hint: 'In pixels; long names shrink below it',
        },
        { path: 'name.tracking', label: 'Letter spacing', hint: 'Share of the letter size' },
        {
          path: 'name.maxWidth',
          label: 'Widest the name may be',
          hint: 'Percent of the frame width',
        },
        {
          path: 'name.wrap',
          label: 'Two lines for long names',
          hint: 'Breaks a long name at the most balanced space instead of shrinking it on one line',
        },
        {
          path: 'name.offsetY',
          label: 'Move up or down',
          hint: 'In pixels; negative moves the name and logo up',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The burst, the swirling arcs, the pieces as they fly in and the accent arc',
        },
        { path: 'colors.text', label: 'Text color', hint: 'The finished name' },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'The stage the burst opens onto, behind the name',
        },
        {
          path: 'colors.field',
          label: 'Surface color',
          hint: 'The dark field the arcs and comets swirl over before the burst',
        },
      ],
      more: [
        {
          path: 'colors.plate',
          label: 'Logo plate color',
          hint: 'The rounded plate behind the logo; shows when Logo plate is on',
        },
        {
          path: 'colors.comet',
          label: 'Comet color',
          hint: 'The comet heads and tails and the sparkles in the burst',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the reveal over another clip; the burst shapes still show',
        },
      ],
    },
    {
      title: 'Logo',
      fields: [
        {
          path: 'mark.show',
          label: 'Show logo',
          hint: 'Turn off for the name alone; an empty logo hides it too',
        },
        {
          path: 'mark.plate',
          label: 'Logo plate',
          hint: 'A rounded plate behind the logo, so a dark logo reads on a dark stage',
        },
      ],
      more: [
        {
          path: 'mark.height',
          label: 'Logo height',
          hint: 'Tallest the logo may be, in pixels, plate included; it keeps its shape',
        },
        {
          path: 'mark.width',
          label: 'Logo width',
          hint: 'Widest the logo may be, in pixels, plate included; wide logos stop here',
        },
        { path: 'mark.gap', label: 'Space above the name', hint: 'In pixels, under the logo' },
        { path: 'mark.padding', label: 'Plate padding', hint: 'In pixels around the logo' },
        {
          path: 'mark.roundness',
          label: 'Plate roundness',
          hint: 'Percent of the plate height; 50 makes a pill',
        },
      ],
    },
    {
      title: 'Swirl and burst',
      fields: [
        {
          path: 'burst.style',
          label: 'Burst style',
          hint: 'Iris rings out from the centre; Split closes two big discs over the frame and parts them',
        },
        { path: 'swirl.arcs', label: 'Arcs', hint: 'Dotted and dashed arcs before the burst' },
      ],
      more: [
        {
          path: 'burst.at',
          label: 'Burst frame',
          hint: 'Frame number the comets meet in the middle and the burst starts',
        },
        { path: 'burst.length', label: 'Burst length', hint: 'In frames' },
        { path: 'swirl.comets', label: 'Comets', hint: 'Comets that streak into the middle' },
        { path: 'swirl.spin', label: 'Arc spin speed', hint: '0 holds the arcs still' },
      ],
    },
    {
      title: 'Letters',
      fields: [
        {
          path: 'build.style',
          label: 'How letters arrive',
          hint: 'Slices pivot three pieces of each letter together; Swing hinges whole letters up',
        },
        {
          path: 'accent.show',
          label: 'Accent arc',
          hint: 'A Primary color arc that draws out under the finished name and stays',
        },
      ],
      more: [
        {
          path: 'build.flight',
          label: 'Letter flight',
          hint: 'In frames, from first sight to landing',
        },
        {
          path: 'build.delay',
          label: 'Wait after the burst',
          hint: 'In frames before the first letter starts',
        },
        {
          path: 'build.spread',
          label: 'Left to right spread',
          hint: 'In frames between the first and the last letter starting, whatever the length',
        },
        {
          path: 'build.swing',
          label: 'Swing angle',
          hint: 'In degrees, how far each piece turns',
        },
        {
          path: 'build.orbits',
          label: 'Orbit arcs',
          hint: 'Arcs that spin around the letters and pull away; 0 turns them off',
        },
        { path: 'accent.thickness', label: 'Arc thickness', hint: 'In pixels' },
        {
          path: 'accent.gap',
          label: 'Space under the name',
          hint: 'In pixels below the letters',
        },
      ],
    },
  ],
});
