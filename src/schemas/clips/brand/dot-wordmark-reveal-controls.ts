import { defineControls } from '../../control-layout';
import type { DotWordmarkRevealProps } from './dot-wordmark-reveal';

export const dotWordmarkRevealControls = defineControls<DotWordmarkRevealProps>({
  sections: [
    {
      title: 'Logo and name',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; sits on the light plate inside the tile',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Written out letter by letter by a small dot; long names shrink to one line',
        },
      ],
      more: [
        { path: 'name.font', label: 'Name font' },
        {
          path: 'name.size',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        { path: 'name.tracking', label: 'Name letter spacing', hint: 'Share of the name size' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The hopping dot, the colour flips, the full colour field and the logo tile; a pale Primary gets a Text colour outline',
        },
        {
          path: 'colors.accent',
          label: 'Accent color',
          hint: 'The dot on the corner of the logo tile and the ring that pulses from it; it shifts its hue when it is too close to the Primary colour',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The tagline and the name on the background; on the Primary colour the text turns light or dark to stay readable',
        },
        { path: 'colors.background', label: 'Background color' },
        { path: 'colors.surface', label: 'Surface color', hint: 'The plate behind the logo' },
      ],
      more: [
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the clip over another one; the colour flips turn off too',
        },
      ],
    },
    {
      title: 'Tagline',
      fields: [
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Lands one word per hop of the dot; wraps to two lines',
        },
        {
          path: 'line.flips',
          label: 'Colour flips',
          hint: 'The stage flips between the background and Primary colour as words land, at most three times a second',
        },
      ],
      more: [
        { path: 'line.font', label: 'Tagline font' },
        {
          path: 'line.size',
          label: 'Tagline size',
          hint: 'Largest size in pixels; long taglines shrink to fit two lines',
        },
      ],
    },
    {
      title: 'Logo tile',
      fields: [
        {
          path: 'tile.logoSize',
          label: 'Logo size',
          hint: 'In pixels; wide logos are shorter and wider',
        },
        {
          path: 'tile.border',
          label: 'Tile border',
          hint: 'Primary colour edge around the plate, in pixels',
        },
      ],
      more: [
        { path: 'tile.padding', label: 'Plate padding', hint: 'Space around the logo in pixels' },
        {
          path: 'tile.roundness',
          label: 'Corner roundness',
          hint: '100 makes a pill or circle, 0 sharp corners',
        },
        { path: 'layout.gap', label: 'Space above the name', hint: 'In pixels, under the tile' },
        {
          path: 'layout.offsetY',
          label: 'Move up or down',
          hint: 'In pixels; negative moves the tagline and the lockup up',
        },
      ],
    },
    {
      title: 'Dot and timing',
      fields: [
        { path: 'dot.size', label: 'Dot size', hint: 'Width of the hopping dot in pixels' },
        {
          path: 'timing.hop',
          label: 'Frames per word',
          hint: 'Longest hop per word; long taglines hop faster, a one-word tagline gets extra hops around the word',
        },
      ],
      more: [
        { path: 'dot.accentSize', label: 'Accent dot size', hint: 'In pixels' },
        {
          path: 'dot.pulse',
          label: 'End pulse',
          hint: 'How much the accent dot breathes and the accent ring pulses out of the tile while the logo holds; 0 turns both off',
        },
        {
          path: 'timing.write',
          label: 'Name write length',
          hint: 'Shortest name write in frames; short taglines leave more time and the name writes slower, up to 48',
        },
      ],
    },
  ],
});
