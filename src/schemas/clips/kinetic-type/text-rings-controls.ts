import { defineControls } from '../../control-layout';
import type { TextRingsProps } from './text-rings';

type RingGroup = 'nameRings' | 'taglineRings';

const ringTypeMore = (group: RingGroup, who: string) =>
  [
    {
      path: `${group}.caps`,
      label: `${who} in capitals`,
      hint: 'Shows the words in capital letters; the text you typed is kept',
    },
    {
      path: `${group}.tracking`,
      label: `${who} letter spacing`,
      hint: 'Share of the text size; repeats still close evenly around each ring',
    },
    {
      path: `${group}.opacity`,
      label: `${who} opacity`,
      hint: 'Below 1 dims these rings for a layered look',
    },
    {
      path: `${group}.usePrimary`,
      label: `${who} in Primary color`,
      hint: 'Paints these rings with Primary color, darkened or lightened just enough to stay readable',
    },
  ] as const;

export const textRingsControls = defineControls<TextRingsProps>({
  sections: [
    {
      title: 'Logo and words',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Sits in the circle at the centre; wide, square and round logos all fit',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Repeated around every other ring; long names repeat fewer times per ring',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Repeated around the rings between the name rings. Leave empty to use the name on every ring',
        },
      ],
      more: [
        {
          path: 'rings.separator',
          label: 'Separator',
          hint: 'Sits halfway between repeats, in Primary color. Leave empty for plain gaps',
        },
        {
          path: 'rings.separatorGap',
          label: 'Gap around separator',
          hint: 'In em, on each side. Larger gaps fit fewer repeats per ring',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The drawn circle, the separators and any rings set to use it',
        },
        { path: 'colors.text', label: 'Text color', hint: 'The ring words' },
        { path: 'colors.background', label: 'Background color' },
        {
          path: 'colors.plate',
          label: 'Surface color',
          hint: 'The disc behind the logo; Logo disc must be on',
        },
      ],
      more: [
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the rings over another clip',
        },
      ],
    },
    {
      title: 'Rings',
      fields: [
        {
          path: 'rings.textSize',
          label: 'Text size',
          hint: 'Share of each ring radius, so outer rings carry bigger words',
        },
        {
          path: 'rings.entrance',
          label: 'Ring entrance',
          hint: 'Fade brings each new ring in at once; Write on writes its words in clockwise',
        },
      ],
      more: [
        {
          path: 'rings.spacing',
          label: 'Ring spacing',
          hint: 'How many times wider each ring is than the one inside it; never tighter than the text allows',
        },
        {
          path: 'rings.count',
          label: 'Number of rings',
          hint: 'Rings born in total; the oldest ones grow past the frame edges',
        },
        {
          path: 'rings.gap',
          label: 'Gap outside the circle',
          hint: 'Pixels between the circle and the words of a new ring',
        },
        { path: 'rings.entranceFrames', label: 'Ring entrance length', hint: 'In frames' },
      ],
    },
    {
      title: 'Ring type',
      fields: [
        { path: 'nameRings.font', label: 'Name font' },
        { path: 'taglineRings.font', label: 'Tagline font' },
      ],
      more: [...ringTypeMore('nameRings', 'Name'), ...ringTypeMore('taglineRings', 'Tagline')],
    },
    {
      title: 'Spin',
      fields: [
        {
          path: 'spin.speed',
          label: 'Spin speed',
          hint: 'Pixels per frame along each ring, so small rings turn faster. 0 stops the spin',
        },
      ],
      more: [
        {
          path: 'spin.alternate',
          label: 'Alternate directions',
          hint: 'Neighbouring rings turn opposite ways',
        },
        {
          path: 'spin.clockwise',
          label: 'First ring clockwise',
          hint: 'Off turns the first ring counterclockwise',
        },
        {
          path: 'spin.offset',
          label: 'Ring turn offset',
          hint: 'In degrees, how far each ring starts turned from the one before',
        },
      ],
    },
    {
      title: 'Center mark',
      fields: [
        {
          path: 'mark.entrance',
          label: 'Logo entrance',
          hint: 'Bloom grows the logo and its disc into place; Iris closes the disc in from the circle edge around the logo',
        },
      ],
      more: [
        { path: 'mark.size', label: 'Circle size', hint: 'Diameter in pixels for a square logo' },
        {
          path: 'mark.wideGrow',
          label: 'Grow for wide logos',
          hint: 'Extra circle size for a wide logo, as a share; 0 keeps every logo in the same circle',
        },
        { path: 'mark.stroke', label: 'Circle line width', hint: 'In pixels' },
        {
          path: 'mark.logoFill',
          label: 'Logo size',
          hint: 'Share of the circle the logo may reach',
        },
        {
          path: 'mark.plate',
          label: 'Logo disc',
          hint: 'A Surface color disc behind the logo so it reads on any background',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.settleAt',
          label: 'Settle at',
          hint: 'Frame number where the rings start slowing to a stop',
        },
      ],
      more: [
        { path: 'timing.drawFrames', label: 'Circle draw length', hint: 'In frames, from frame 0' },
        {
          path: 'timing.logoAt',
          label: 'Logo in by',
          hint: 'Frame number the logo is fully in; 0 shows it from the first frame',
        },
        { path: 'timing.firstRing', label: 'First ring at', hint: 'Frame number' },
        {
          path: 'timing.settleFrames',
          label: 'Settle length',
          hint: 'In frames, while the rings slow to a stop; they keep spinning after',
        },
      ],
    },
  ],
});
